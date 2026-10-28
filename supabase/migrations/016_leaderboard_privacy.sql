-- Close auth.users view exposure and isolate the public leaderboard identity.
-- Apply after 015. Deploy this migration before the matching frontend change.
BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE private.leaderboard_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  avatar_url text
);
ALTER TABLE private.leaderboard_profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.leaderboard_profiles FROM PUBLIC, anon, authenticated;

-- Deliberately exclude email, full_name, name and all other OAuth metadata.
-- username/display_name are public aliases; no alias means a generated name.
CREATE OR REPLACE FUNCTION private.sync_leaderboard_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO private.leaderboard_profiles (user_id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data->>'username'), ''),
             NULLIF(btrim(NEW.raw_user_meta_data->>'display_name'), '')),
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data->>'avatar_url'), ''),
             NULLIF(btrim(NEW.raw_user_meta_data->>'picture'), ''))
  )
  ON CONFLICT (user_id) DO UPDATE
    SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.sync_leaderboard_profile() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER sync_leaderboard_profile
AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
FOR EACH ROW EXECUTE FUNCTION private.sync_leaderboard_profile();

INSERT INTO private.leaderboard_profiles (user_id, username, avatar_url)
SELECT id,
  COALESCE(NULLIF(btrim(raw_user_meta_data->>'username'), ''),
           NULLIF(btrim(raw_user_meta_data->>'display_name'), '')),
  COALESCE(NULLIF(btrim(raw_user_meta_data->>'avatar_url'), ''),
           NULLIF(btrim(raw_user_meta_data->>'picture'), ''))
FROM auth.users;

-- Keep the legacy view shape for server administration, remove every auth
-- dependency and fail closed for API callers (including inherited PUBLIC ACLs).
CREATE OR REPLACE VIEW public.v_leaderboard_time
WITH (security_barrier = true, security_invoker = true) AS
SELECT
  record.puzzle_id,
  record.piece_count,
  record.user_id AS user_id,
  account.username,
  record.best_time AS score_value,
  record.updated_at,
  RANK() OVER (
    PARTITION BY record.puzzle_id, record.piece_count
    ORDER BY record.best_time ASC
  ) AS rank,
  account.avatar_url
FROM public.user_best_records AS record
JOIN private.leaderboard_profiles AS account ON account.user_id = record.user_id
JOIN public.puzzles AS puzzle ON puzzle.id = record.puzzle_id
WHERE record.best_time IS NOT NULL
  AND puzzle.is_active = true
  AND puzzle.publish_at IS NOT NULL
  AND puzzle.publish_at <= now();

CREATE OR REPLACE VIEW public.v_leaderboard_moves
WITH (security_barrier = true, security_invoker = true) AS
SELECT
  record.puzzle_id,
  record.piece_count,
  record.user_id AS user_id,
  account.username,
  record.best_moves AS score_value,
  record.updated_at,
  RANK() OVER (
    PARTITION BY record.puzzle_id, record.piece_count
    ORDER BY record.best_moves ASC
  ) AS rank,
  account.avatar_url
FROM public.user_best_records AS record
JOIN private.leaderboard_profiles AS account ON account.user_id = record.user_id
JOIN public.puzzles AS puzzle ON puzzle.id = record.puzzle_id
WHERE record.best_moves IS NOT NULL
  AND puzzle.is_active = true
  AND puzzle.publish_at IS NOT NULL
  AND puzzle.publish_at <= now();

REVOKE ALL ON public.v_leaderboard_time, public.v_leaderboard_moves
  FROM PUBLIC, anon, authenticated;

-- The only cross-user per-puzzle read surface: fixed output, bounded results,
-- published puzzles only. Private records retain their owner-only RLS policies.
CREATE OR REPLACE FUNCTION public.get_puzzle_leaderboard(
  p_puzzle_id uuid,
  p_piece_count integer,
  p_limit integer DEFAULT 5
)
RETURNS TABLE (rank bigint, user_id uuid, username text, avatar_url text, score_value integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_puzzle_id IS NULL OR p_piece_count IS NULL
    OR p_piece_count NOT IN (24, 48, 80, 100, 120, 150, 200, 300, 500)
    OR p_limit IS NULL OR p_limit < 1 OR p_limit > 100 THEN
    RAISE EXCEPTION 'Invalid leaderboard parameters.' USING ERRCODE = '22023';
  END IF;
  RETURN QUERY
  SELECT board.rank, board.user_id,
    COALESCE(board.username, 'Player ' || left(board.user_id::text, 8)),
    board.avatar_url, board.score_value
  FROM public.v_leaderboard_time AS board
  WHERE board.puzzle_id = p_puzzle_id AND board.piece_count = p_piece_count
  ORDER BY board.rank, board.user_id
  LIMIT p_limit;
END;
$$;
REVOKE ALL ON FUNCTION public.get_puzzle_leaderboard(uuid, integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_puzzle_leaderboard(uuid, integer, integer)
  TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_global_leaderboard(
  p_period text DEFAULT 'all',
  p_limit integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
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
      COALESCE(account.username, 'Player ' || left(ranked.user_id::text, 8)) AS username,
      account.avatar_url
    FROM ranked
    JOIN private.leaderboard_profiles AS account ON account.user_id = ranked.user_id
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

REVOKE ALL ON FUNCTION public.get_global_leaderboard(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_global_leaderboard(text, integer) TO anon, authenticated;


-- Supabase can grant anon/authenticated EXECUTE directly via default ACLs.
-- Revoking only PUBLIC (as older migrations did) does not remove those grants.
REVOKE ALL ON FUNCTION public.start_game_session(uuid, integer, boolean, uuid),
  public.checkpoint_game_session(uuid, smallint),
  public.complete_game_session(uuid, integer), public.abandon_game_session(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_game_session(uuid, integer, boolean, uuid),
  public.checkpoint_game_session(uuid, smallint),
  public.complete_game_session(uuid, integer), public.abandon_game_session(uuid)
  TO authenticated;
REVOKE ALL ON FUNCTION public.refresh_weekly_plays_count(),
  public.calculate_game_stars(integer, integer, integer)
  FROM PUBLIC, anon, authenticated;

COMMIT;
