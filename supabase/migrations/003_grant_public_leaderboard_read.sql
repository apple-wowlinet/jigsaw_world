-- Puzzle detail pages expose only the fields projected by the leaderboard
-- views. The underlying user records remain protected by their existing RLS.
REVOKE ALL ON public.v_leaderboard_time FROM PUBLIC;
REVOKE ALL ON public.v_leaderboard_moves FROM PUBLIC;

GRANT SELECT ON public.v_leaderboard_time TO anon, authenticated;
GRANT SELECT ON public.v_leaderboard_moves TO anon, authenticated;
