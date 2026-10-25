-- Public, per-user standings computed from completed sessions at read time.
-- Each user/puzzle/piece-count contributes once per UTC calendar period,
-- using its fastest completion. No background counters or client-side writes.
BEGIN;

CREATE INDEX IF NOT EXISTS idx_gs_ranked_completed
  ON public.game_sessions (completed_at, user_id, puzzle_id, piece_count, completion_time)
  WHERE status = 'completed' AND rotation_enabled = false;

CREATE OR REPLACE FUNCTION public.get_global_leaderboard(
  p_period text DEFAULT 'all',
  p_limit integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now timestamptz := now();
  v_start timestamptz;
  v_end timestamptz;
  v_result jsonb;
BEGIN
  IF p_period IS NULL OR p_period NOT IN ('all', 'daily', 'weekly', 'monthly') THEN
    RAISE EXCEPTION 'Unsupported leaderboard period.' USING ERRCODE = '22023';
  END IF;
  IF p_limit IS NULL OR p_limit < 1 OR p_limit > 100 THEN
    RAISE EXCEPTION 'Leaderboard limit must be between 1 and 100.' USING ERRCODE = '22023';
  END IF;

  IF p_period <> 'all' THEN
    v_start := date_trunc(
      CASE p_period WHEN 'daily' THEN 'day' WHEN 'weekly' THEN 'week' ELSE 'month' END,
      v_now AT TIME ZONE 'UTC'
    ) AT TIME ZONE 'UTC';
    v_end := (
      (v_start AT TIME ZONE 'UTC') +
      CASE p_period WHEN 'daily' THEN interval '1 day'
                    WHEN 'weekly' THEN interval '1 week'
                    ELSE interval '1 month' END
    ) AT TIME ZONE 'UTC';
  END IF;

  WITH best_in_period AS (
    SELECT DISTINCT ON (session.user_id, session.puzzle_id, session.piece_count)
      session.user_id, session.puzzle_id, session.piece_count, session.completion_time
    FROM public.game_sessions AS session
    JOIN public.puzzles AS puzzle ON puzzle.id = session.puzzle_id
    WHERE session.status = 'completed'
      AND session.rotation_enabled = false
      AND session.progress_percent = 100
      AND session.piece_count IN (24, 48, 80, 100, 120, 150, 200, 300, 500)
      AND session.completion_time >= 0
      AND session.completed_at >= session.started_at
      AND session.completed_at <= v_now
      AND (v_start IS NULL OR session.completed_at >= v_start)
      AND (v_end IS NULL OR session.completed_at < v_end)
      AND puzzle.is_active = true
      AND puzzle.publish_at IS NOT NULL
      AND puzzle.publish_at <= v_now
    ORDER BY session.user_id, session.puzzle_id, session.piece_count,
      session.completion_time ASC, session.completed_at ASC, session.id ASC
  ), totals AS (
    SELECT user_id,
      sum(piece_count) AS total_pieces,
      count(*) AS completed_puzzles,
      sum(completion_time) AS total_time_seconds
    FROM best_in_period
    GROUP BY user_id
  ), ranked AS (
    SELECT totals.*,
      rank() OVER (ORDER BY total_pieces DESC, completed_puzzles DESC, total_time_seconds ASC) AS position
    FROM totals
  ), top_players AS (
    SELECT ranked.*,
      COALESCE(
        NULLIF(btrim(account.raw_user_meta_data->>'username'), ''),
        NULLIF(btrim(account.raw_user_meta_data->>'full_name'), ''),
        NULLIF(btrim(account.raw_user_meta_data->>'name'), ''),
        NULLIF(btrim(account.raw_user_meta_data->>'display_name'), ''),
        'Player ' || left(account.id::text, 8)
      ) AS username,
      COALESCE(
        NULLIF(btrim(account.raw_user_meta_data->>'avatar_url'), ''),
        NULLIF(btrim(account.raw_user_meta_data->>'picture'), '')
      ) AS avatar_url
    FROM ranked
    JOIN auth.users AS account ON account.id = ranked.user_id
    ORDER BY ranked.position, ranked.user_id
    LIMIT p_limit
  )
  SELECT jsonb_build_object(
    'period', p_period,
    'periodStart', v_start,
    'periodEnd', v_end,
    'totalPlayers', (SELECT count(*) FROM totals),
    'entries', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'rank', position,
        'userId', user_id,
        'username', username,
        'avatarUrl', avatar_url,
        'totalPieces', total_pieces,
        'completedPuzzles', completed_puzzles,
        'totalTimeSeconds', total_time_seconds
      ) ORDER BY position, user_id)
      FROM top_players
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_global_leaderboard(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_global_leaderboard(text, integer) TO anon, authenticated;

COMMIT;
