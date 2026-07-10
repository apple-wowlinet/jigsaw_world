-- Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create puzzles table if it does not exist
CREATE TABLE IF NOT EXISTS public.puzzles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS and allow read access to everyone
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'puzzles' AND policyname = 'Allow read access to everyone'
  ) THEN
    CREATE POLICY "Allow read access to everyone"
      ON public.puzzles FOR SELECT
      USING (true);
  END IF;
END $$;
