-- ============================================================
-- Explore weekly ranking support
-- weekly_plays_count is a 7-day cache. game_sessions is the source of truth.
-- ============================================================

ALTER TABLE public.puzzles
  ADD COLUMN IF NOT EXISTS weekly_plays_count bigint NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_puzzles_weekly_plays
  ON public.puzzles (weekly_plays_count DESC)
  WHERE is_active = true;

-- Instant bump when a play session starts.
CREATE OR REPLACE FUNCTION public.bump_puzzle_play_counts()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.puzzles
  SET
    plays_count = plays_count + 1,
    weekly_plays_count = weekly_plays_count + 1
  WHERE id = NEW.puzzle_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_game_sessions_bump_plays ON public.game_sessions;
CREATE TRIGGER trg_game_sessions_bump_plays
  AFTER INSERT ON public.game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.bump_puzzle_play_counts();

-- Rolling 7-day recount. Call daily from pg_cron or an external scheduler:
--   SELECT public.refresh_weekly_plays_count();
CREATE OR REPLACE FUNCTION public.refresh_weekly_plays_count()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.puzzles p
  SET weekly_plays_count = COALESCE(s.cnt, 0)
  FROM (
    SELECT p2.id, stats.cnt
    FROM public.puzzles p2
    LEFT JOIN (
      SELECT puzzle_id, count(*)::bigint AS cnt
      FROM public.game_sessions
      WHERE started_at >= now() - interval '7 days'
      GROUP BY puzzle_id
    ) stats ON stats.puzzle_id = p2.id
  ) s
  WHERE p.id = s.id;
END;
$$;
