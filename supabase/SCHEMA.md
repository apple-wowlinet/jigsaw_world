# JigsawWorld 数据库 Schema v2

基于 Supabase（PostgreSQL），用户认证复用 `auth.users`。Migration：`supabase/migrations/002_full_schema.sql`。

本版按架构评审 12 条改进重构。核心变化：**职责分离**（明细 vs 排行 vs 统计）、**运营字段补齐**、**jsonb 抽象成就**、**等级/活动系统**。

---

## ER 关系总览

```
auth.users (Supabase 内置)
   │
   ├─< game_sessions               游戏明细（每次开局一条，含 started/completed/abandoned）
   ├─< user_best_records           个人最佳（每用户×关×档位一条 → 排行榜源）
   ├─< daily_challenge_participations
   ├─< user_stats                  聚合统计 + 等级段（level/xp）
   ├─< user_difficulty_stats
   ├─< user_category_stats
   ├─< user_achievements
   ├─< user_preferences            偏好（登录恢复）
   ├─< activity_logs               运营日志
   └─< favorites                   收藏

categories ─< puzzles ─< daily_challenges ──> events（赛季/活动）

levels（等级字典）          achievements（conditions jsonb）
```

---

## ★ 核心改进：三种数据的职责分离

评审第一部分指出 `game_sessions` 职责过重。v2 拆成三层：

| 数据 | 表 | 粒度 | 用途 |
|------|-----|------|------|
| **明细** | `game_sessions` | 每次开局一条 | 用户历史、放弃率分析（不再扛排行） |
| **最佳** | `user_best_records` | 每用户×关×档位一条 | **排行榜**（刷 1000 遍仍一条，查询快几十倍） |
| **聚合** | `user_stats` | 每人一条 | 成就判定、运营指标（免聚合查询） |

**为什么这样分**：排行榜要的是「最好成绩」（不是全部记录），统计要的是「汇总数字」。各取所需，互不干扰。

```
用户A 开局→退出→开局→退出→开局→完成
game_sessions:  3 条记录（完整历史）
user_best_records: 1 条记录（最佳成绩）
user_stats.total_completions: +1
```

---

## 表清单（15 张 + 2 视图）

| 表 | 用途 | RLS |
|----|------|-----|
| `categories` | 分类 | 公共读 |
| `puzzles` | 关卡（扩展，含运营字段） | 公共读 |
| `events` | 活动/赛季（圣诞/周年庆） | 公共读 |
| `daily_challenges` | 每日挑战（关联 event） | 公共读 |
| `levels` | 等级字典 | 公共读 |
| `achievements` | 成就定义（conditions jsonb） | 公共读 |
| `game_sessions` | 游戏明细 | 仅本人 |
| `user_best_records` | 个人最佳（排行榜源） | 仅本人 |
| `daily_challenge_participations` | 每日挑战参与 | 仅本人 |
| `user_stats` | 聚合统计 + 等级段 | 仅本人 |
| `user_difficulty_stats` | 按难度统计 | 仅本人 |
| `user_category_stats` | 按分类统计 | 仅本人 |
| `user_achievements` | 成就解锁 | 仅本人 |
| `user_preferences` | 偏好 | 仅本人 |
| `activity_logs` | 运营日志 | 仅本人 |
| `favorites` | 收藏 | 仅本人 |

---

## 12 条改进对照

### ① game_sessions 职责分离
明细表只记录历史。排行榜改查 `user_best_records`。

### ② user_stats 扩展运营指标
新增字段：

| 字段 | 作用 |
|------|------|
| `total_games_started` | 开局数 → 完成率 = completions / started |
| `total_abandoned` | 放弃数 → 判断难度是否过难 |
| `perfect_games` | 三星次数 → 成就「100 Perfect Games」 |

### ③ puzzles 运营字段
新增：`publish_at`（预约上线）、`editor_score`（人工推荐分，首页 Recommended 不靠 plays_count）。

### ④ achievements 改 conditions jsonb
替代旧的 `metric/threshold/difficulty/category`，支持 AND/OR 多条件，运营改成就不用改库。见下方「成就 conditions 说明」。

### ⑤ daily_challenges 增加 event_id
关联 `events` 表，支持 season（圣诞/万圣节/周年庆），方便统计「2026 圣诞活动」。

### ⑥ 排行榜可扩展
不再写死时间排行。`user_best_records` 同时存 `best_time`/`best_moves`/`best_score`，配 `v_leaderboard_time` / `v_leaderboard_moves` 视图。以后加 score 模式只加视图。

### ⑦ puzzles SEO 简化
不单独存 `seo_title`/`seo_description` 等字段，SEO title 和 description 直接复用 `title` 与 `description`。

### ⑧ user_preferences
`favorite_category_id`/`sound_enabled`/`music_enabled`/`preferred_difficulty`，登录即恢复设置。主题不入库，网站按用户系统暗黑模式自动调整。

> 碎片数量选项由拼图程序按图片尺寸与当前画布自动生成，不在数据库保存为关卡配置字段。

### ⑨ activity_logs
统一记录：`achievement_unlock`/`xp_gain`/`level_up`/`reward_claim`/`daily_completed`/`puzzle_completed`/`streak_milestone`，运营后台「最近 24 小时」一览无余。

### ⑩ 等级系统（段内 XP）
`user_stats` 拆 `total_xp`（历史总量，永不回退）+ `level`（当前等级）+ `xp`（当前段内 XP，进度条用）。显示「Level 35 · 250/800」无需计算。

### ⑪ levels 字典表
`levels(level, required_xp, title, badge_url)`，DB 驱动升级，改等级阈值不用改代码。

### ⑫ favorites
用户收藏/点赞拼图（对应 UI 的 `isLiked`）。

---

## 成就 conditions（jsonb）说明

`achievements.conditions` 是 jsonb 数组，支持单条件、AND 多条件、嵌套。`category_tag` 供后台筛选展示。

### 单条件示例
```json
{ "metric": "total_completions", "threshold": 100 }
```

### AND 多条件示例
```json
[
  { "metric": "difficulty_completions", "difficulty": "expert", "threshold": 100 },
  { "metric": "avg_stars", "threshold": 3 }
]
```
含义：完成 100 个 Expert 关 **且** 平均 3 星。

### 评审提到的「连续 7 天每天完成 3 关」
```json
[
  { "metric": "daily_streak_qualified", "min_per_day": 3, "days": 7 }
]
```
> 注：`daily_streak_qualified` 这类复合 metric 需由判定服务从 `daily_challenge_participations` + `game_sessions` 聚合计算，DB 仅存条件定义。`metric` 取值是开放集合，新增 metric 类型只需扩展判定服务，不动表结构。

### metric 取值（开放集合，可扩展）
| metric | 数据源 | 示例成就 |
|--------|--------|----------|
| `total_completions` | user_stats | 完成 100 关 |
| `total_time_seconds` | user_stats | 游戏累计 10 小时 |
| `total_moves` | user_stats | 移动 1 万步 |
| `total_games_started` | user_stats | 开局 500 次 |
| `perfect_games` | user_stats | 100 次三星 |
| `difficulty_completions` | user_difficulty_stats | 困难大师（hard 50 关） |
| `category_completions` | user_category_stats | 自然探索者（nature 20 关） |
| `daily_current_streak` | user_stats | 连胜 7 天 |
| `daily_max_streak` | user_stats | 最长连胜 30 天 |
| `daily_participations` | user_stats | 参与 30 天 |
| `total_xp` | user_stats | XP 达 10000 |
| `level` | user_stats | 达到 20 级 |
| `avg_stars` | 计算 | 平均 3 星（需聚合） |
| `daily_streak_qualified` | 计算 | 连续 N 天每天 M 关（需聚合） |

---

## 关键表字段速查

### user_best_records（排行榜源）
```sql
PRIMARY KEY (user_id, puzzle_id, piece_count)
best_time, best_moves, best_score, best_stars
attempts          -- 尝试次数
session_id        -- 关联明细（追溯最佳成绩来自哪次）
```

### user_stats（聚合 + 等级段）
```sql
-- 完成维度
total_completions, total_games_started, total_abandoned, perfect_games
-- 累计
total_time_seconds, total_moves
-- 等级（段）
total_xp, level, xp
-- 每日
daily_current_streak, daily_max_streak, daily_participations, daily_last_date
```

### puzzles（运营）
```sql
-- 运营
publish_at, editor_score, is_featured, is_active, sort_order
```

### levels
```sql
level, required_xp, title, badge_url
```

### events
```sql
slug, name, description, banner_url, starts_at, ends_at, is_active
```

---

## RLS 策略

- **公共读**：categories / puzzles / events / daily_challenges / achievements / levels
- **仅本人**：其余所有用户表（`user_id = auth.uid()`）
- **写操作**：内容表增删改走 service_role（服务端，绕过 RLS）

---

## 视图

- **`v_leaderboard_time`** — 按 `best_time` 升序排行（每关×档位）
- **`v_leaderboard_moves`** — 按 `best_moves` 升序排行

均基于 `user_best_records`（非 game_sessions），查询性能高。

---

## 典型查询示例

### 排行榜（某关某档位 Top 10）
```sql
SELECT username, score_value AS best_time, rank
FROM v_leaderboard_time
WHERE puzzle_id = $1 AND piece_count = $2 AND rank <= 10;
```

### 完成率（运营）
```sql
SELECT
  total_completions,
  total_games_started,
  CASE WHEN total_games_started > 0
       THEN round(100.0 * total_completions / total_games_started, 1)
       ELSE 0 END AS completion_rate
FROM user_stats WHERE user_id = $1;
```

### 首页推荐（人工推荐分）
```sql
SELECT * FROM puzzles
WHERE is_active AND (publish_at IS NULL OR publish_at <= now())
ORDER BY editor_score DESC, rating DESC LIMIT 6;
```

### 活动期间的每日挑战
```sql
SELECT dc.* FROM daily_challenges dc
JOIN events e ON e.id = dc.event_id
WHERE e.slug = 'christmas-2026'
ORDER BY dc.challenge_date;
```

---

## 与现有代码对接注意

1. **难度大小写**：DB 存小写 `easy/medium/hard/expert`，显示层转 Title Case
2. **`plays` vs `plays_count`**：DB 统一 `plays_count`
3. **碎片数量选项**：前端根据图片尺寸与画布动态生成，不从 `puzzles` 或档位表读取
4. **初始化数据**：levels / achievements / events 字典表需种子数据（可用 seed migration）
