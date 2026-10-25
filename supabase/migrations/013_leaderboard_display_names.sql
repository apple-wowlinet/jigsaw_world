-- OAuth accounts may have full_name/name without a username.
-- Resolve public names at read time so existing results update immediately.
-- Preserve the view columns, ranking rules, publication checks and grants.
BEGIN;

CREATE OR REPLACE VIEW public.v_leaderboard_time
WITH (security_barrier = true) AS
SELECT
  record.puzzle_id,
  record.piece_count,
  account.id AS user_id,
  COALESCE(
    NULLIF(btrim(account.raw_user_meta_data->>'username'), ''),
    NULLIF(btrim(account.raw_user_meta_data->>'full_name'), ''),
    NULLIF(btrim(account.raw_user_meta_data->>'name'), ''),
    NULLIF(btrim(account.raw_user_meta_data->>'display_name'), '')
  ) AS username,
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
  COALESCE(
    NULLIF(btrim(account.raw_user_meta_data->>'username'), ''),
    NULLIF(btrim(account.raw_user_meta_data->>'full_name'), ''),
    NULLIF(btrim(account.raw_user_meta_data->>'name'), ''),
    NULLIF(btrim(account.raw_user_meta_data->>'display_name'), '')
  ) AS username,
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

COMMIT;
