-- ============================================================
-- JigsawWorld 完整数据库 Schema v2
-- 基于 Supabase（PostgreSQL），用户认证复用 auth.users
-- Migration 002：在现有 puzzles 表基础上扩展 + 新建全部业务表
--
-- 设计要点（对应评审 12 条改进）：
--   1. game_sessions 仅做明细，排行榜查 user_best_records
--   2. user_stats 扩展 started/abandoned/perfect 等
--   3. puzzles 增加 publish_at/editor_score 等运营字段
--   4. achievements.conditions jsonb 抽象（支持 AND/OR 多条件）
--   5. daily_challenges 增加 event_id 支持 season
--   6. leaderboard 可扩展（board_type: time/moves/score）
--   7. puzzles SEO 复用 title/description，不单独存 SEO 字段
--   8. user_preferences 偏好
--   9. activity_logs 运营日志
--  10. user_stats 增加等级（level + xp 当前段）
--  11. levels 字典表（DB 驱动升级）
-- ============================================================

-- 0. 扩展与枚举 ----------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE difficulty_enum AS ENUM ('easy', 'medium', 'hard', 'expert');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE game_status_enum AS ENUM ('started', 'completed', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 排行榜分类
DO $$ BEGIN
  CREATE TYPE leaderboard_type_enum AS ENUM ('time', 'moves', 'score');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 活动日志类型
DO $$ BEGIN
  CREATE TYPE activity_type_enum AS ENUM (
    'achievement_unlock', 'xp_gain', 'level_up', 'reward_claim',
    'daily_completed', 'puzzle_completed', 'streak_milestone'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 统一 updated_at 自动更新函数（幂等）
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- auth.uid() 兜底（Supabase 已内置）
CREATE OR REPLACE FUNCTION public.auth_uid()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT coalesce(auth.uid(), NULL);
$$;

-- ============================================================
-- 1. categories —— 分类
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  image_url       text,
  icon            text,                       -- 图标标识，前端解析
  color           text,
  dark_color      text,
  puzzle_count    integer NOT NULL DEFAULT 0,
  sort_order      integer NOT NULL DEFAULT 0,
  is_active       boolean NOT NULL DEFAULT true,
  -- SEO
  seo_title          text,
  seo_description    text,
  og_image_url       text,
  meta_keywords      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_categories_updated ON public.categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. puzzles —— 关卡（扩展现有表）
--    先确保基础表存在，再做增量扩展，避免单独执行本迁移时报 relation does not exist。
-- ============================================================
CREATE TABLE IF NOT EXISTS public.puzzles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  image_url   text NOT NULL,
  description text,
  piece_count integer NOT NULL DEFAULT 100,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.puzzles
  DROP COLUMN IF EXISTS image_width,
  DROP COLUMN IF EXISTS image_height,
  DROP COLUMN IF EXISTS aspect_ratio,
  DROP COLUMN IF EXISTS image_source,
  DROP COLUMN IF EXISTS seo_title,
  DROP COLUMN IF EXISTS seo_description,
  DROP COLUMN IF EXISTS og_image_url,
  DROP COLUMN IF EXISTS meta_keywords;

DROP TYPE IF EXISTS image_source_enum;

ALTER TABLE public.puzzles
  -- 关系
  ADD COLUMN IF NOT EXISTS category_id          uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS piece_count          integer NOT NULL DEFAULT 100,
  -- 难度
  ADD COLUMN IF NOT EXISTS difficulty           difficulty_enum NOT NULL DEFAULT 'easy',
  -- 冗余计数（公共读，加速列表/排行）
  ADD COLUMN IF NOT EXISTS plays_count          bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completions_count    integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating               numeric(2,1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_sum           numeric(10,1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_count         integer NOT NULL DEFAULT 0,
  -- 运营字段
  ADD COLUMN IF NOT EXISTS is_featured          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active            boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order           integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS publish_at           timestamptz,            -- 预约上线
  ADD COLUMN IF NOT EXISTS editor_score         smallint NOT NULL DEFAULT 0;  -- 人工推荐分 0-100

DROP TRIGGER IF EXISTS trg_puzzles_updated ON public.puzzles;
CREATE TRIGGER trg_puzzles_updated BEFORE UPDATE ON public.puzzles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. game_sessions —— 用户参与关卡记录（明细，每次开局一条）
--    ★ 职责单一：仅记录历史明细。排行榜查 user_best_records，统计查 user_stats。
-- ============================================================
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puzzle_id       uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  piece_count     integer NOT NULL,
  difficulty      difficulty_enum NOT NULL,
  status          game_status_enum NOT NULL DEFAULT 'started',
  completion_time integer,
  moves           integer,
  score           integer,                       -- 预留：评分制模式
  stars           smallint,
  started_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gs_user          ON public.game_sessions (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_gs_puzzle_piece  ON public.game_sessions (puzzle_id, piece_count);

-- ============================================================
-- 4. user_best_records —— 个人最佳（每用户×关×档位一条）
--    ★ 排行榜数据源：玩家刷 1000 遍仍只一条，查询快
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_best_records (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puzzle_id   uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  piece_count integer NOT NULL,
  best_time   integer,            -- 最快完成（秒）
  best_moves  integer,            -- 最少步数
  best_score  integer,            -- 最高分（预留）
  best_stars  smallint,           -- 最佳星级
  attempts    integer NOT NULL DEFAULT 0,  -- 尝试次数
  session_id  uuid REFERENCES public.game_sessions(id) ON DELETE SET NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, puzzle_id, piece_count)
);

DROP TRIGGER IF EXISTS trg_ubr_updated ON public.user_best_records;
CREATE TRIGGER trg_ubr_updated BEFORE UPDATE ON public.user_best_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_ubr_board_time
  ON public.user_best_records (puzzle_id, piece_count, best_time ASC) WHERE best_time IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ubr_board_moves
  ON public.user_best_records (puzzle_id, piece_count, best_moves ASC) WHERE best_moves IS NOT NULL;

-- ============================================================
-- 5. daily_challenges —— 每日挑战
--    ★ 增加 event_id 支持 season（圣诞/万圣节/周年庆）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,         -- 如 'christmas-2026'
  name         text NOT NULL,
  description  text,
  banner_url   text,
  starts_at    timestamptz,
  ends_at      timestamptz,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date  date NOT NULL UNIQUE,
  puzzle_id       uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  title           text,
  description     text,
  event_id        uuid REFERENCES public.events(id) ON DELETE SET NULL,  -- 所属活动/赛季
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_event ON public.daily_challenges (event_id);

-- ============================================================
-- 6. daily_challenge_participations —— 用户参与每日挑战
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_challenge_participations (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_challenge_id   uuid NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completion_time      integer,
  moves                integer,
  stars                smallint,
  is_completed         boolean NOT NULL DEFAULT false,
  participated_at      timestamptz NOT NULL DEFAULT now(),
  completed_at         timestamptz,
  UNIQUE (user_id, daily_challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_dcp_user ON public.daily_challenge_participations (user_id, completed_at DESC);

-- ============================================================
-- 7. user_stats —— 用户聚合统计（扩展运营指标 + 等级段）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- 完成维度
  total_completions     integer NOT NULL DEFAULT 0,
  total_games_started   integer NOT NULL DEFAULT 0,   -- 开局数（算完成率）
  total_abandoned       integer NOT NULL DEFAULT 0,   -- 放弃数（判断难度是否过难）
  perfect_games         integer NOT NULL DEFAULT 0,   -- 三星次数（成就用）
  -- 累计
  total_time_seconds    integer NOT NULL DEFAULT 0,
  total_moves           integer NOT NULL DEFAULT 0,
  -- 等级（段）：避免每次算 当前段所需
  total_xp              integer NOT NULL DEFAULT 0,   -- 历史总 XP（永不回退）
  level                 integer NOT NULL DEFAULT 1,   -- 当前等级
  xp                    integer NOT NULL DEFAULT 0,   -- 当前段内 XP（进度条用）
  -- 每日挑战
  daily_current_streak  integer NOT NULL DEFAULT 0,
  daily_max_streak      integer NOT NULL DEFAULT 0,
  daily_participations  integer NOT NULL DEFAULT 0,
  daily_last_date       date,
  updated_at            timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_user_stats_updated ON public.user_stats;
CREATE TRIGGER trg_user_stats_updated BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 7a. user_difficulty_stats / user_category_stats —— 维度统计
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_difficulty_stats (
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty   difficulty_enum NOT NULL,
  completions  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, difficulty)
);

CREATE TABLE IF NOT EXISTS public.user_category_stats (
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id  uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  completions  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, category_id)
);

-- ============================================================
-- 8. levels —— 等级字典（DB 驱动升级，改等级不用改代码）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.levels (
  level         integer PRIMARY KEY,
  required_xp   integer NOT NULL,      -- 达到该级所需累计 XP
  title         text,                  -- 如 'Novice' 'Master'
  badge_url     text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. achievements —— 成就（conditions jsonb 抽象，支持 AND/OR 多条件）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  name          text NOT NULL,
  description   text NOT NULL,
  icon          text,
  tier          text NOT NULL DEFAULT 'bronze',
  xp_reward     integer NOT NULL DEFAULT 0,
  -- ★ 判定逻辑用 jsonb，替代旧 metric/threshold/difficulty/category
  conditions    jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- 便于后台筛选/展示（冗余标签）
  category_tag  text,                  -- 如 'puzzle' 'daily' 'streak'
  sort_order    integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN public.achievements.conditions IS
  '条件数组，支持 AND（同元素多字段）/嵌套。示例见 SCHEMA.md';

CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id  uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress        integer NOT NULL DEFAULT 0,
  unlocked_at     timestamptz,
  PRIMARY KEY (user_id, achievement_id)
);

-- ============================================================
-- 10. user_preferences —— 用户偏好（登录恢复设置）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  sound_enabled        boolean NOT NULL DEFAULT true,
  music_enabled        boolean NOT NULL DEFAULT true,
  preferred_difficulty difficulty_enum,   -- 偏好难度
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_preferences
  DROP COLUMN IF EXISTS preferred_theme;

DROP TRIGGER IF EXISTS trg_user_prefs_updated ON public.user_preferences;
CREATE TRIGGER trg_user_prefs_updated BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 11. activity_logs —— 运营日志（成就解锁/XP/升级/领奖等）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          activity_type_enum NOT NULL,
  -- 关联实体（通用，不强制 FK，支持多种来源）
  ref_type      text,                  -- 如 'puzzle' 'achievement' 'daily' 'event'
  ref_id        text,
  amount        integer,               -- XP 增量等
  metadata      jsonb,                 -- 附加信息
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_user_time ON public.activity_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_type_time ON public.activity_logs (type, created_at DESC);

-- ============================================================
-- 12. favorites —— 用户收藏（点赞拼图）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puzzle_id   uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, puzzle_id)
);

-- ============================================================
-- 13. 索引（高频查询）
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_puzzles_category    ON public.puzzles (category_id);
CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty  ON public.puzzles (difficulty);
CREATE INDEX IF NOT EXISTS idx_puzzles_featured    ON public.puzzles (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_puzzles_active      ON public.puzzles (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_puzzles_publish     ON public.puzzles (publish_at) WHERE publish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_puzzles_editor      ON public.puzzles (editor_score DESC) WHERE editor_score > 0;
CREATE INDEX IF NOT EXISTS idx_categories_active   ON public.categories (is_active, sort_order);

-- ============================================================
-- 14. 行级安全策略（RLS）
-- ============================================================

-- 公共读
ALTER TABLE public.categories                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzles                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels                     ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "public_read_categories"    ON public.categories            FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "public_read_puzzles"       ON public.puzzles               FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "public_read_daily"         ON public.daily_challenges      FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "public_read_events"        ON public.events                FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "public_read_achievements"  ON public.achievements          FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "public_read_levels"        ON public.levels                FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 仅本人（私有）
ALTER TABLE public.game_sessions                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_best_records                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_participations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_difficulty_stats             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_category_stats               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites                         ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "owner_all_game_sessions"    ON public.game_sessions
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_ubr"              ON public.user_best_records
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_dcp"              ON public.daily_challenge_participations
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_user_stats"       ON public.user_stats
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_difficulty_stats" ON public.user_difficulty_stats
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_category_stats"   ON public.user_category_stats
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_user_achievements" ON public.user_achievements
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_user_prefs"       ON public.user_preferences
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_activity_logs"    ON public.activity_logs
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "owner_all_favorites"        ON public.favorites
  FOR ALL USING (user_id = public.auth_uid()) WITH CHECK (user_id = public.auth_uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 写操作（puzzles/categories/achievements/levels/events 的增删改）通过
-- service_role key 在服务端执行，绕过 RLS。前端仅 SELECT。

-- ============================================================
-- 15. 视图：可扩展排行榜（board_type: time/moves/score）
-- ============================================================
CREATE OR REPLACE VIEW public.v_leaderboard_time AS
SELECT
  ubr.puzzle_id, ubr.piece_count,
  u.id AS user_id,
  u.raw_user_meta_data->>'username' AS username,
  ubr.best_time AS score_value,
  ubr.updated_at,
  RANK() OVER (PARTITION BY ubr.puzzle_id, ubr.piece_count ORDER BY ubr.best_time ASC) AS rank
FROM public.user_best_records ubr
JOIN auth.users u ON u.id = ubr.user_id
WHERE ubr.best_time IS NOT NULL;

CREATE OR REPLACE VIEW public.v_leaderboard_moves AS
SELECT
  ubr.puzzle_id, ubr.piece_count,
  u.id AS user_id,
  u.raw_user_meta_data->>'username' AS username,
  ubr.best_moves AS score_value,
  ubr.updated_at,
  RANK() OVER (PARTITION BY ubr.puzzle_id, ubr.piece_count ORDER BY ubr.best_moves ASC) AS rank
FROM public.user_best_records ubr
JOIN auth.users u ON u.id = ubr.user_id
WHERE ubr.best_moves IS NOT NULL;
