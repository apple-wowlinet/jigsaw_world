-- Persist each authenticated user's puzzle favorites.
-- This migration is intentionally self-contained so installations that did
-- not apply the original full-schema migration can add favorites safely.

BEGIN;

CREATE TABLE IF NOT EXISTS public.favorites (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puzzle_id   uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, puzzle_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_puzzle_created
  ON public.favorites (puzzle_id, created_at DESC);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "favorites_select_own"
    ON public.favorites FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "favorites_insert_own"
    ON public.favorites FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "favorites_delete_own"
    ON public.favorites FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

REVOKE ALL ON public.favorites FROM anon;
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;

COMMENT ON TABLE public.favorites IS
  'Puzzles saved to an authenticated user''s favorites.';

COMMIT;
