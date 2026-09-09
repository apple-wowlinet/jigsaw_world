-- Allow curated events to contain any number of puzzles independently from
-- the daily challenge calendar.

BEGIN;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_events_updated ON public.events;
CREATE TRIGGER trg_events_updated
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.event_puzzles (
  event_id    uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  puzzle_id   uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, puzzle_id)
);

CREATE INDEX IF NOT EXISTS idx_event_puzzles_event_order
  ON public.event_puzzles (event_id, sort_order, created_at);

CREATE INDEX IF NOT EXISTS idx_event_puzzles_puzzle
  ON public.event_puzzles (puzzle_id);

ALTER TABLE public.event_puzzles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public_read_event_puzzles"
    ON public.event_puzzles FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

GRANT SELECT ON public.event_puzzles TO anon, authenticated;

COMMENT ON TABLE public.event_puzzles IS
  'Ordered many-to-many relationship between curated events and puzzles.';

-- Preserve the event membership implied by existing daily challenges.
INSERT INTO public.event_puzzles (event_id, puzzle_id, sort_order)
SELECT
  event_id,
  puzzle_id,
  row_number() OVER (
    PARTITION BY event_id
    ORDER BY challenge_date, puzzle_id
  )::integer - 1
FROM public.daily_challenges
WHERE event_id IS NOT NULL
ON CONFLICT (event_id, puzzle_id) DO NOTHING;

COMMIT;
