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

-- Enable RLS. Public read access is defined by the publication-boundary
-- migration; this bootstrap migration must not create an unconditional policy.
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;
