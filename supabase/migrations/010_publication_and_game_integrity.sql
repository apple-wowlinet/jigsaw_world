-- Publication boundary and trusted game-session writes.
-- Existing active rows with no publish_at were already publicly visible, so
-- preserve that state once before NULL starts meaning "draft".

BEGIN;

UPDATE public.puzzles
SET publish_at = COALESCE(created_at, now())
WHERE is_active = true
  AND publish_at IS NULL;

-- Public catalogue rows must be active and published according to database
-- time. Drop the legacy bootstrap policy as well in case it was applied.
DROP POLICY IF EXISTS "public_read_puzzles" ON public.puzzles;
DROP POLICY IF EXISTS "Allow read access to everyone" ON public.puzzles;
CREATE POLICY "public_read_puzzles"
  ON public.puzzles FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND publish_at IS NOT NULL
    AND publish_at <= now()
  );

DROP POLICY IF EXISTS "public_read_daily" ON public.daily_challenges;
CREATE POLICY "public_read_daily"
  ON public.daily_challenges FOR SELECT
  TO anon, authenticated
  USING (
    challenge_date <= current_date
    AND EXISTS (
      SELECT 1
      FROM public.puzzles AS puzzle
      WHERE puzzle.id = daily_challenges.puzzle_id
        AND puzzle.is_active = true
        AND puzzle.publish_at IS NOT NULL
        AND puzzle.publish_at <= now()
    )
  );

DROP POLICY IF EXISTS "public_read_puzzle_themes" ON public.puzzle_themes;
CREATE POLICY "public_read_puzzle_themes"
  ON public.puzzle_themes FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.puzzles AS puzzle
      WHERE puzzle.id = puzzle_themes.puzzle_id
        AND puzzle.is_active = true
        AND puzzle.publish_at IS NOT NULL
        AND puzzle.publish_at <= now()
    )
    AND EXISTS (
      SELECT 1
      FROM public.themes AS theme
      WHERE theme.id = puzzle_themes.theme_id
        AND theme.is_active = true
    )
  );

DROP POLICY IF EXISTS "public_read_event_puzzles" ON public.event_puzzles;
CREATE POLICY "public_read_event_puzzles"
  ON public.event_puzzles FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.puzzles AS puzzle
      WHERE puzzle.id = event_puzzles.puzzle_id
        AND puzzle.is_active = true
        AND puzzle.publish_at IS NOT NULL
        AND puzzle.publish_at <= now()
    )
    AND EXISTS (
      SELECT 1
      FROM public.events AS event
      WHERE event.id = event_puzzles.event_id
        AND event.is_active = true
    )
  );

-- Store the rule dimensions needed by the first trusted game flow.
ALTER TABLE public.game_sessions
  ADD COLUMN IF NOT EXISTS daily_challenge_id uuid
    REFERENCES public.daily_challenges(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rotation_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS progress_percent smallint NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_gs_daily_challenge
  ON public.game_sessions (daily_challenge_id, completed_at DESC)
  WHERE daily_challenge_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_puzzles_publication
  ON public.puzzles (publish_at DESC)
  WHERE is_active = true AND publish_at IS NOT NULL;

-- Columns added above default to zero on historic rows. Normalize the two
-- obvious completion markers before the stronger state constraints are added.
UPDATE public.game_sessions
SET progress_percent = 100
WHERE status = 'completed' AND progress_percent <> 100;

UPDATE public.daily_challenge_participations
SET progress_percent = 100
WHERE is_completed = true AND progress_percent <> 100;

ALTER TABLE public.user_best_records
  ADD COLUMN IF NOT EXISTS best_time_session_id uuid
    REFERENCES public.game_sessions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS best_moves_session_id uuid
    REFERENCES public.game_sessions(id) ON DELETE SET NULL;

UPDATE public.user_best_records
SET best_time_session_id = CASE
      WHEN best_time_session_id IS NULL AND best_time IS NOT NULL THEN session_id
      ELSE best_time_session_id
    END,
    best_moves_session_id = CASE
      WHEN best_moves_session_id IS NULL AND best_moves IS NOT NULL THEN session_id
      ELSE best_moves_session_id
    END
WHERE session_id IS NOT NULL;

ALTER TABLE public.user_best_records
  DROP COLUMN IF EXISTS session_id;

-- Keep the intentionally public per-puzzle leaderboards inside the same
-- publication boundary. They remain aggregate views rather than direct table
-- access and expose no draft/inactive puzzle results.
CREATE OR REPLACE VIEW public.v_leaderboard_time
WITH (security_barrier = true) AS
SELECT
  record.puzzle_id,
  record.piece_count,
  account.id AS user_id,
  account.raw_user_meta_data->>'username' AS username,
  record.best_time AS score_value,
  record.updated_at,
  RANK() OVER (
    PARTITION BY record.puzzle_id, record.piece_count
    ORDER BY record.best_time ASC
  ) AS rank
FROM public.user_best_records AS record
JOIN auth.users AS account ON account.id = record.user_id
JOIN public.puzzles AS puzzle ON puzzle.id = record.puzzle_id
WHERE record.best_time IS NOT NULL
  AND puzzle.is_active = true
  AND puzzle.publish_at IS NOT NULL
  AND puzzle.publish_at <= now();

CREATE OR REPLACE VIEW public.v_leaderboard_moves
WITH (security_barrier = true) AS
SELECT
  record.puzzle_id,
  record.piece_count,
  account.id AS user_id,
  account.raw_user_meta_data->>'username' AS username,
  record.best_moves AS score_value,
  record.updated_at,
  RANK() OVER (
    PARTITION BY record.puzzle_id, record.piece_count
    ORDER BY record.best_moves ASC
  ) AS rank
FROM public.user_best_records AS record
JOIN auth.users AS account ON account.id = record.user_id
JOIN public.puzzles AS puzzle ON puzzle.id = record.puzzle_id
WHERE record.best_moves IS NOT NULL
  AND puzzle.is_active = true
  AND puzzle.publish_at IS NOT NULL
  AND puzzle.publish_at <= now();

REVOKE ALL ON public.v_leaderboard_time FROM PUBLIC;
REVOKE ALL ON public.v_leaderboard_moves FROM PUBLIC;
GRANT SELECT ON public.v_leaderboard_time TO anon, authenticated;
GRANT SELECT ON public.v_leaderboard_moves TO anon, authenticated;

-- Reject invalid authoritative values even when writes originate from a
-- privileged server path.
ALTER TABLE public.game_sessions
  DROP CONSTRAINT IF EXISTS game_sessions_piece_count_check,
  DROP CONSTRAINT IF EXISTS game_sessions_completion_time_check,
  DROP CONSTRAINT IF EXISTS game_sessions_moves_check,
  DROP CONSTRAINT IF EXISTS game_sessions_score_check,
  DROP CONSTRAINT IF EXISTS game_sessions_stars_check,
  DROP CONSTRAINT IF EXISTS game_sessions_progress_percent_check,
  DROP CONSTRAINT IF EXISTS game_sessions_completion_state_check,
  ADD CONSTRAINT game_sessions_piece_count_check
    CHECK (piece_count IN (24, 48, 80, 100, 120, 150, 200, 300, 500)) NOT VALID,
  ADD CONSTRAINT game_sessions_completion_time_check
    CHECK (completion_time IS NULL OR completion_time >= 0) NOT VALID,
  ADD CONSTRAINT game_sessions_moves_check
    CHECK (moves IS NULL OR moves >= 0) NOT VALID,
  ADD CONSTRAINT game_sessions_score_check
    CHECK (score IS NULL OR score >= 0) NOT VALID,
  ADD CONSTRAINT game_sessions_stars_check
    CHECK (stars IS NULL OR stars BETWEEN 1 AND 3) NOT VALID,
  ADD CONSTRAINT game_sessions_progress_percent_check
    CHECK (progress_percent BETWEEN 0 AND 100) NOT VALID,
  ADD CONSTRAINT game_sessions_completion_state_check
    CHECK (
      status <> 'completed'
      OR (
        completed_at IS NOT NULL
        AND completion_time IS NOT NULL
        AND moves IS NOT NULL
        AND stars IS NOT NULL
        AND progress_percent = 100
        AND completed_at >= started_at
      )
    ) NOT VALID;

ALTER TABLE public.user_best_records
  DROP CONSTRAINT IF EXISTS user_best_records_piece_count_check,
  DROP CONSTRAINT IF EXISTS user_best_records_best_time_check,
  DROP CONSTRAINT IF EXISTS user_best_records_best_moves_check,
  DROP CONSTRAINT IF EXISTS user_best_records_best_score_check,
  DROP CONSTRAINT IF EXISTS user_best_records_best_stars_check,
  DROP CONSTRAINT IF EXISTS user_best_records_attempts_check,
  ADD CONSTRAINT user_best_records_piece_count_check
    CHECK (piece_count IN (24, 48, 80, 100, 120, 150, 200, 300, 500)) NOT VALID,
  ADD CONSTRAINT user_best_records_best_time_check
    CHECK (best_time IS NULL OR best_time >= 0) NOT VALID,
  ADD CONSTRAINT user_best_records_best_moves_check
    CHECK (best_moves IS NULL OR best_moves >= 0) NOT VALID,
  ADD CONSTRAINT user_best_records_best_score_check
    CHECK (best_score IS NULL OR best_score >= 0) NOT VALID,
  ADD CONSTRAINT user_best_records_best_stars_check
    CHECK (best_stars IS NULL OR best_stars BETWEEN 1 AND 3) NOT VALID,
  ADD CONSTRAINT user_best_records_attempts_check
    CHECK (attempts >= 0) NOT VALID;

ALTER TABLE public.daily_challenge_participations
  DROP CONSTRAINT IF EXISTS daily_challenge_participations_completion_time_check,
  DROP CONSTRAINT IF EXISTS daily_challenge_participations_moves_check,
  DROP CONSTRAINT IF EXISTS daily_challenge_participations_stars_check,
  DROP CONSTRAINT IF EXISTS daily_challenge_participations_completion_state_check,
  ADD CONSTRAINT daily_challenge_participations_completion_time_check
    CHECK (completion_time IS NULL OR completion_time >= 0) NOT VALID,
  ADD CONSTRAINT daily_challenge_participations_moves_check
    CHECK (moves IS NULL OR moves >= 0) NOT VALID,
  ADD CONSTRAINT daily_challenge_participations_stars_check
    CHECK (stars IS NULL OR stars BETWEEN 1 AND 3) NOT VALID,
  ADD CONSTRAINT daily_challenge_participations_completion_state_check
    CHECK (
      is_completed = false
      OR (
        completed_at IS NOT NULL
        AND completion_time IS NOT NULL
        AND moves IS NOT NULL
        AND stars IS NOT NULL
        AND progress_percent = 100
      )
    ) NOT VALID;

ALTER TABLE public.user_stats
  DROP CONSTRAINT IF EXISTS user_stats_nonnegative_check,
  ADD CONSTRAINT user_stats_nonnegative_check CHECK (
    total_completions >= 0
    AND total_games_started >= 0
    AND total_abandoned >= 0
    AND perfect_games >= 0
    AND total_time_seconds >= 0
    AND total_moves >= 0
    AND total_xp >= 0
    AND level >= 1
    AND xp >= 0
    AND daily_current_streak >= 0
    AND daily_max_streak >= 0
    AND daily_participations >= 0
  ) NOT VALID;

ALTER TABLE public.user_difficulty_stats
  DROP CONSTRAINT IF EXISTS user_difficulty_stats_completions_check,
  ADD CONSTRAINT user_difficulty_stats_completions_check CHECK (completions >= 0) NOT VALID;

ALTER TABLE public.user_category_stats
  DROP CONSTRAINT IF EXISTS user_category_stats_completions_check,
  ADD CONSTRAINT user_category_stats_completions_check CHECK (completions >= 0) NOT VALID;

ALTER TABLE public.user_achievements
  DROP CONSTRAINT IF EXISTS user_achievements_progress_check,
  ADD CONSTRAINT user_achievements_progress_check CHECK (progress >= 0) NOT VALID;

-- Authoritative tables are readable by their owner, but never directly
-- writable from the browser. Favorites and preferences remain user-owned.
DROP POLICY IF EXISTS "owner_all_game_sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "owner_all_ubr" ON public.user_best_records;
DROP POLICY IF EXISTS "owner_all_dcp" ON public.daily_challenge_participations;
DROP POLICY IF EXISTS "owner_all_user_stats" ON public.user_stats;
DROP POLICY IF EXISTS "owner_all_difficulty_stats" ON public.user_difficulty_stats;
DROP POLICY IF EXISTS "owner_all_category_stats" ON public.user_category_stats;
DROP POLICY IF EXISTS "owner_all_user_achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "owner_all_activity_logs" ON public.activity_logs;
DROP POLICY IF EXISTS "owner_all_favorites" ON public.favorites;

DROP POLICY IF EXISTS "owner_select_game_sessions" ON public.game_sessions;
CREATE POLICY "owner_select_game_sessions" ON public.game_sessions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_select_ubr" ON public.user_best_records;
CREATE POLICY "owner_select_ubr" ON public.user_best_records
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_select_dcp" ON public.daily_challenge_participations;
CREATE POLICY "owner_select_dcp" ON public.daily_challenge_participations
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_select_user_stats" ON public.user_stats;
CREATE POLICY "owner_select_user_stats" ON public.user_stats
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_select_difficulty_stats" ON public.user_difficulty_stats;
CREATE POLICY "owner_select_difficulty_stats" ON public.user_difficulty_stats
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_select_category_stats" ON public.user_category_stats;
CREATE POLICY "owner_select_category_stats" ON public.user_category_stats
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_select_user_achievements" ON public.user_achievements;
CREATE POLICY "owner_select_user_achievements" ON public.user_achievements
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_select_activity_logs" ON public.activity_logs;
CREATE POLICY "owner_select_activity_logs" ON public.activity_logs
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Recreate the intentionally narrow favorites policies for installations that
-- did not apply migration 008 independently.
DROP POLICY IF EXISTS "favorites_select_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON public.favorites;
CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE TO authenticated USING (user_id = auth.uid());

REVOKE INSERT, UPDATE, DELETE ON public.game_sessions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_best_records FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.daily_challenge_participations FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_stats FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_difficulty_stats FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_category_stats FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_achievements FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.activity_logs FROM anon, authenticated;

GRANT SELECT ON public.game_sessions TO authenticated;
GRANT SELECT ON public.user_best_records TO authenticated;
GRANT SELECT ON public.daily_challenge_participations TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;
GRANT SELECT ON public.user_difficulty_stats TO authenticated;
GRANT SELECT ON public.user_category_stats TO authenticated;
GRANT SELECT ON public.user_achievements TO authenticated;
GRANT SELECT ON public.activity_logs TO authenticated;

CREATE OR REPLACE FUNCTION public.calculate_game_stars(
  completion_seconds integer,
  move_count integer,
  puzzle_piece_count integer
)
RETURNS smallint
LANGUAGE sql
IMMUTABLE
STRICT
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN puzzle_piece_count <= 9
      AND completion_seconds::numeric / puzzle_piece_count < 20
      AND move_count::numeric / puzzle_piece_count < 3 THEN 3
    WHEN puzzle_piece_count <= 9
      AND completion_seconds::numeric / puzzle_piece_count < 30
      AND move_count::numeric / puzzle_piece_count < 5 THEN 2
    WHEN puzzle_piece_count <= 16
      AND completion_seconds::numeric / puzzle_piece_count < 15
      AND move_count::numeric / puzzle_piece_count < 4 THEN 3
    WHEN puzzle_piece_count <= 16
      AND completion_seconds::numeric / puzzle_piece_count < 25
      AND move_count::numeric / puzzle_piece_count < 6 THEN 2
    WHEN puzzle_piece_count > 16
      AND completion_seconds::numeric / puzzle_piece_count < 12
      AND move_count::numeric / puzzle_piece_count < 5 THEN 3
    WHEN puzzle_piece_count > 16
      AND completion_seconds::numeric / puzzle_piece_count < 20
      AND move_count::numeric / puzzle_piece_count < 8 THEN 2
    ELSE 1
  END::smallint;
$$;

CREATE OR REPLACE FUNCTION public.start_game_session(
  p_puzzle_id uuid,
  p_piece_count integer,
  p_rotation_enabled boolean DEFAULT false,
  p_daily_challenge_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_puzzle public.puzzles%ROWTYPE;
  v_session_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '42501';
  END IF;

  IF p_piece_count NOT IN (24, 48, 80, 100, 120, 150, 200, 300, 500) THEN
    RAISE EXCEPTION 'Unsupported piece count.' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_puzzle
  FROM public.puzzles
  WHERE id = p_puzzle_id
    AND is_active = true
    AND publish_at IS NOT NULL
    AND publish_at <= now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Puzzle is not published.' USING ERRCODE = '22023';
  END IF;

  IF p_daily_challenge_id IS NOT NULL THEN
    IF p_rotation_enabled THEN
      RAISE EXCEPTION 'Daily challenges do not allow rotation.' USING ERRCODE = '22023';
    END IF;

    IF p_piece_count <> v_puzzle.piece_count THEN
      RAISE EXCEPTION 'Daily challenges use the standard piece count.' USING ERRCODE = '22023';
    END IF;

    PERFORM 1
    FROM public.daily_challenges
    WHERE id = p_daily_challenge_id
      AND puzzle_id = p_puzzle_id
      AND challenge_date <= current_date;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Daily challenge does not match this puzzle.' USING ERRCODE = '22023';
    END IF;
  END IF;

  INSERT INTO public.game_sessions (
    user_id,
    puzzle_id,
    piece_count,
    difficulty,
    status,
    daily_challenge_id,
    rotation_enabled,
    progress_percent
  ) VALUES (
    v_user_id,
    p_puzzle_id,
    p_piece_count,
    v_puzzle.difficulty,
    'started',
    p_daily_challenge_id,
    p_rotation_enabled,
    0
  )
  RETURNING id INTO v_session_id;

  INSERT INTO public.user_stats (user_id, total_games_started)
  VALUES (v_user_id, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET total_games_started = public.user_stats.total_games_started + 1;

  IF p_daily_challenge_id IS NOT NULL THEN
    INSERT INTO public.daily_challenge_participations (
      user_id,
      daily_challenge_id,
      progress_percent
    ) VALUES (
      v_user_id,
      p_daily_challenge_id,
      0
    )
    ON CONFLICT (user_id, daily_challenge_id) DO NOTHING;
  END IF;

  RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.checkpoint_game_session(
  p_session_id uuid,
  p_progress_percent smallint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_daily_challenge_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '42501';
  END IF;

  IF p_progress_percent < 0 OR p_progress_percent > 99 THEN
    RAISE EXCEPTION 'Progress must be between 0 and 99.' USING ERRCODE = '22023';
  END IF;

  UPDATE public.game_sessions
  SET progress_percent = GREATEST(progress_percent, p_progress_percent)
  WHERE id = p_session_id
    AND user_id = v_user_id
    AND status = 'started'
  RETURNING daily_challenge_id INTO v_daily_challenge_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active game session was not found.' USING ERRCODE = '22023';
  END IF;

  IF v_daily_challenge_id IS NOT NULL THEN
    UPDATE public.daily_challenge_participations
    SET progress_percent = GREATEST(progress_percent, p_progress_percent)
    WHERE user_id = v_user_id
      AND daily_challenge_id = v_daily_challenge_id
      AND is_completed = false;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_game_session(
  p_session_id uuid,
  p_moves integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_session public.game_sessions%ROWTYPE;
  v_category_id uuid;
  v_completion_time integer;
  v_stars smallint;
  v_ranked boolean;
  v_daily_was_completed boolean := false;
  v_current_streak integer := 0;
  v_max_streak integer := 0;
  v_latest_daily_date date;
  v_cursor_date date;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '42501';
  END IF;

  IF p_moves IS NULL OR p_moves < 0 THEN
    RAISE EXCEPTION 'Moves must be a non-negative integer.' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_session
  FROM public.game_sessions
  WHERE id = p_session_id
    AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game session was not found.' USING ERRCODE = '22023';
  END IF;

  IF v_session.status = 'completed' THEN
    RETURN jsonb_build_object(
      'session_id', v_session.id,
      'completion_time', v_session.completion_time,
      'moves', v_session.moves,
      'stars', v_session.stars,
      'ranked', NOT v_session.rotation_enabled,
      'daily_completed', v_session.daily_challenge_id IS NOT NULL
    );
  END IF;

  IF v_session.status <> 'started' THEN
    RAISE EXCEPTION 'Only an active game session can be completed.' USING ERRCODE = '22023';
  END IF;

  v_completion_time := GREATEST(
    1,
    floor(extract(epoch FROM (clock_timestamp() - v_session.started_at)))::integer
  );
  v_stars := public.calculate_game_stars(
    v_completion_time,
    p_moves,
    v_session.piece_count
  );
  v_ranked := NOT v_session.rotation_enabled;

  SELECT category_id INTO v_category_id
  FROM public.puzzles
  WHERE id = v_session.puzzle_id;

  UPDATE public.game_sessions
  SET status = 'completed',
      completion_time = v_completion_time,
      moves = p_moves,
      stars = v_stars,
      progress_percent = 100,
      completed_at = now()
  WHERE id = v_session.id;

  UPDATE public.puzzles
  SET completions_count = completions_count + 1
  WHERE id = v_session.puzzle_id;

  INSERT INTO public.user_stats (
    user_id,
    total_completions,
    perfect_games,
    total_time_seconds,
    total_moves
  ) VALUES (
    v_user_id,
    1,
    CASE WHEN v_stars = 3 THEN 1 ELSE 0 END,
    v_completion_time,
    p_moves
  )
  ON CONFLICT (user_id) DO UPDATE
  SET total_completions = public.user_stats.total_completions + 1,
      perfect_games = public.user_stats.perfect_games
        + CASE WHEN v_stars = 3 THEN 1 ELSE 0 END,
      total_time_seconds = public.user_stats.total_time_seconds + v_completion_time,
      total_moves = public.user_stats.total_moves + p_moves;

  INSERT INTO public.user_difficulty_stats (user_id, difficulty, completions)
  VALUES (v_user_id, v_session.difficulty, 1)
  ON CONFLICT (user_id, difficulty) DO UPDATE
  SET completions = public.user_difficulty_stats.completions + 1;

  IF v_category_id IS NOT NULL THEN
    INSERT INTO public.user_category_stats (user_id, category_id, completions)
    VALUES (v_user_id, v_category_id, 1)
    ON CONFLICT (user_id, category_id) DO UPDATE
    SET completions = public.user_category_stats.completions + 1;
  END IF;

  IF v_ranked THEN
    INSERT INTO public.user_best_records (
      user_id,
      puzzle_id,
      piece_count,
      best_time,
      best_moves,
      best_stars,
      attempts,
      best_time_session_id,
      best_moves_session_id
    ) VALUES (
      v_user_id,
      v_session.puzzle_id,
      v_session.piece_count,
      v_completion_time,
      p_moves,
      v_stars,
      1,
      v_session.id,
      v_session.id
    )
    ON CONFLICT (user_id, puzzle_id, piece_count) DO UPDATE
    SET best_time_session_id = CASE
          WHEN public.user_best_records.best_time IS NULL
            OR EXCLUDED.best_time < public.user_best_records.best_time
          THEN EXCLUDED.best_time_session_id
          ELSE public.user_best_records.best_time_session_id
        END,
        best_moves_session_id = CASE
          WHEN public.user_best_records.best_moves IS NULL
            OR EXCLUDED.best_moves < public.user_best_records.best_moves
          THEN EXCLUDED.best_moves_session_id
          ELSE public.user_best_records.best_moves_session_id
        END,
        best_time = LEAST(public.user_best_records.best_time, EXCLUDED.best_time),
        best_moves = LEAST(public.user_best_records.best_moves, EXCLUDED.best_moves),
        best_stars = GREATEST(public.user_best_records.best_stars, EXCLUDED.best_stars),
        attempts = public.user_best_records.attempts + 1;
  END IF;

  IF v_session.daily_challenge_id IS NOT NULL THEN
    SELECT is_completed INTO v_daily_was_completed
    FROM public.daily_challenge_participations
    WHERE user_id = v_user_id
      AND daily_challenge_id = v_session.daily_challenge_id
    FOR UPDATE;

    UPDATE public.daily_challenge_participations
    SET completion_time = CASE
          WHEN completion_time IS NULL OR v_completion_time < completion_time
          THEN v_completion_time ELSE completion_time END,
        moves = CASE
          WHEN moves IS NULL OR p_moves < moves THEN p_moves ELSE moves END,
        stars = GREATEST(COALESCE(stars, 0), v_stars),
        is_completed = true,
        progress_percent = 100,
        completed_at = COALESCE(completed_at, now())
    WHERE user_id = v_user_id
      AND daily_challenge_id = v_session.daily_challenge_id;

    IF NOT COALESCE(v_daily_was_completed, false) THEN
      SELECT max(challenge.challenge_date) INTO v_latest_daily_date
      FROM public.daily_challenges AS challenge
      JOIN public.puzzles AS puzzle ON puzzle.id = challenge.puzzle_id
      WHERE challenge.challenge_date <= current_date
        AND puzzle.is_active = true
        AND puzzle.publish_at IS NOT NULL
        AND puzzle.publish_at <= now();

      v_cursor_date := v_latest_daily_date;
      WHILE v_cursor_date IS NOT NULL AND EXISTS (
        SELECT 1
        FROM public.daily_challenge_participations AS participation
        JOIN public.daily_challenges AS challenge
          ON challenge.id = participation.daily_challenge_id
        JOIN public.puzzles AS puzzle ON puzzle.id = challenge.puzzle_id
        WHERE participation.user_id = v_user_id
          AND participation.is_completed = true
          AND challenge.challenge_date = v_cursor_date
          AND challenge.challenge_date <= current_date
          AND puzzle.is_active = true
          AND puzzle.publish_at IS NOT NULL
          AND puzzle.publish_at <= now()
      ) LOOP
        v_current_streak := v_current_streak + 1;
        v_cursor_date := v_cursor_date - 1;
      END LOOP;

      SELECT COALESCE(max(streak_length), 0)::integer INTO v_max_streak
      FROM (
        SELECT count(*) AS streak_length
        FROM (
          SELECT
            completed_date,
            completed_date
              - row_number() OVER (ORDER BY completed_date)::integer AS streak_group
          FROM (
            SELECT DISTINCT challenge.challenge_date AS completed_date
            FROM public.daily_challenge_participations AS participation
            JOIN public.daily_challenges AS challenge
              ON challenge.id = participation.daily_challenge_id
            JOIN public.puzzles AS puzzle ON puzzle.id = challenge.puzzle_id
            WHERE participation.user_id = v_user_id
              AND participation.is_completed = true
              AND challenge.challenge_date <= current_date
              AND puzzle.is_active = true
              AND puzzle.publish_at IS NOT NULL
              AND puzzle.publish_at <= now()
          ) AS completed_days
        ) AS grouped_days
        GROUP BY streak_group
      ) AS streaks;

      UPDATE public.user_stats
      SET daily_participations = daily_participations + 1,
          daily_current_streak = v_current_streak,
          daily_max_streak = GREATEST(daily_max_streak, v_max_streak),
          daily_last_date = GREATEST(
            COALESCE(daily_last_date, '-infinity'::date),
            (SELECT challenge_date
             FROM public.daily_challenges
             WHERE id = v_session.daily_challenge_id)
          )
      WHERE user_id = v_user_id;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'session_id', v_session.id,
    'completion_time', v_completion_time,
    'moves', p_moves,
    'stars', v_stars,
    'ranked', v_ranked,
    'daily_completed', v_session.daily_challenge_id IS NOT NULL
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.abandon_game_session(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_updated integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '42501';
  END IF;

  UPDATE public.game_sessions
  SET status = 'abandoned'
  WHERE id = p_session_id
    AND user_id = v_user_id
    AND status = 'started';

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated > 0 THEN
    UPDATE public.user_stats
    SET total_abandoned = total_abandoned + 1
    WHERE user_id = v_user_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.calculate_game_stars(integer, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.start_game_session(uuid, integer, boolean, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.checkpoint_game_session(uuid, smallint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_game_session(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.abandon_game_session(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.start_game_session(uuid, integer, boolean, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.checkpoint_game_session(uuid, smallint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_game_session(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.abandon_game_session(uuid) TO authenticated;

COMMIT;
