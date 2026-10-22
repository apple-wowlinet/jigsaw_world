-- Daily challenges allow the same piece-count choices as ordinary puzzles.
-- Keep challenge membership, publication, rotation and supported-count checks.

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

REVOKE ALL ON FUNCTION public.start_game_session(uuid, integer, boolean, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_game_session(uuid, integer, boolean, uuid) TO authenticated;
