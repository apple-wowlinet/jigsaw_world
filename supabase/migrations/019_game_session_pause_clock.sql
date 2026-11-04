-- Apply before deploying the client that synchronizes pause/resume events.
BEGIN;

ALTER TABLE public.game_sessions
  ADD COLUMN paused_at timestamptz,
  ADD COLUMN paused_duration interval NOT NULL DEFAULT interval '0 seconds'
    CHECK (paused_duration >= interval '0 seconds');

CREATE OR REPLACE FUNCTION public.set_game_session_paused(
  p_session_id uuid,
  p_paused boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_session public.game_sessions%ROWTYPE;
  v_now timestamptz;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '42501';
  END IF;
  IF p_paused IS NULL THEN
    RAISE EXCEPTION 'Pause state is required.' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_session
  FROM public.game_sessions
  WHERE id = p_session_id AND user_id = v_user_id AND status = 'started'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active game session was not found.' USING ERRCODE = '22023';
  END IF;

  v_now := clock_timestamp();
  IF p_paused AND v_session.paused_at IS NULL THEN
    UPDATE public.game_sessions SET paused_at = v_now WHERE id = p_session_id;
  ELSIF NOT p_paused AND v_session.paused_at IS NOT NULL THEN
    UPDATE public.game_sessions
    SET paused_duration = paused_duration + (v_now - paused_at), paused_at = NULL
    WHERE id = p_session_id;
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
  v_finished_at timestamptz;
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

  -- Freeze at the final pause, excluding both completed pauses and any
  -- current pause. All timestamps and durations are measured by the server.
  v_finished_at := clock_timestamp();
  v_completion_time := GREATEST(
    1,
    round(extract(epoch FROM (
      COALESCE(v_session.paused_at, v_finished_at)
      - v_session.started_at - v_session.paused_duration
    )))::integer
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

REVOKE ALL ON FUNCTION public.set_game_session_paused(uuid, boolean),
  public.complete_game_session(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_game_session_paused(uuid, boolean),
  public.complete_game_session(uuid, integer) TO authenticated;

COMMIT;
