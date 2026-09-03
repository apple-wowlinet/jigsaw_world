-- JigsawWorld themes: curated collections independent from the category tree.
-- A puzzle can belong to many themes through public.puzzle_themes.

BEGIN;

CREATE TABLE IF NOT EXISTS public.themes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  emoji         text NOT NULL DEFAULT '🧩',
  image_url     text,
  sort_order    integer NOT NULL DEFAULT 0,
  is_featured   boolean NOT NULL DEFAULT false,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.puzzle_themes (
  puzzle_id   uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  theme_id    uuid NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (puzzle_id, theme_id)
);

DROP TRIGGER IF EXISTS trg_themes_updated ON public.themes;
CREATE TRIGGER trg_themes_updated
  BEFORE UPDATE ON public.themes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_themes_active_order
  ON public.themes (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_puzzle_themes_theme
  ON public.puzzle_themes (theme_id, sort_order, puzzle_id);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_themes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public_read_themes"
    ON public.themes FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_puzzle_themes"
    ON public.puzzle_themes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

GRANT SELECT ON public.themes TO anon, authenticated;
GRANT SELECT ON public.puzzle_themes TO anon, authenticated;

INSERT INTO public.themes (
  name, slug, description, emoji, image_url, sort_order, is_featured, is_active
) VALUES
  ('Flowers', 'flowers', 'Colorful blooms, botanical details, and peaceful gardens.', '🌸', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&h=700&fit=crop', 10, true, true),
  ('Cats', 'cats', 'Playful kittens, cozy companions, and curious cat portraits.', '🐱', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900&h=700&fit=crop', 20, true, true),
  ('Castles', 'castles', 'Storybook towers, ancient fortresses, and magical kingdoms.', '🏰', 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=900&h=700&fit=crop', 30, true, true),
  ('Sunset', 'sunset', 'Golden horizons and glowing skies at the close of day.', '🌅', 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&h=700&fit=crop', 40, true, true),
  ('Christmas', 'christmas', 'Festive lights, snowy evenings, and warm holiday scenes.', '🎄', 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=900&h=700&fit=crop', 50, true, true),
  ('Autumn', 'autumn', 'Copper leaves, misty paths, and the warmth of fall.', '🍂', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&h=700&fit=crop', 60, true, true),
  ('Trains', 'trains', 'Classic railways, scenic journeys, and powerful locomotives.', '🚂', 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900&h=700&fit=crop', 70, true, true),
  ('Beaches', 'beaches', 'Sunlit shores, turquoise water, and quiet island escapes.', '🏖️', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=700&fit=crop', 80, true, true),
  ('Gardens', 'gardens', 'Hidden paths, tranquil ponds, and carefully tended greenery.', '🌿', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&h=700&fit=crop', 90, false, true),
  ('Wildlife', 'wildlife', 'Remarkable animals photographed in their natural habitats.', '🦊', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=900&h=700&fit=crop', 100, false, true),
  ('City Lights', 'city-lights', 'Glowing skylines, lively streets, and cities after dark.', '🌃', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=700&fit=crop', 110, false, true),
  ('Space', 'space', 'Distant galaxies, starry skies, and cosmic wonders.', '🪐', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&h=700&fit=crop', 120, false, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  emoji = EXCLUDED.emoji,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Seed obvious relationships from the current catalogue. Content editors can
-- add or remove rows later without changing puzzle categories.
INSERT INTO public.puzzle_themes (puzzle_id, theme_id, sort_order)
SELECT
  p.id,
  t.id,
  p.sort_order
FROM public.puzzles p
JOIN public.categories c ON c.id = p.category_id
CROSS JOIN public.themes t
WHERE p.is_active = true
  AND (
    (t.slug = 'flowers' AND (
      c.slug IN ('flowers', 'gardens')
      OR concat_ws(' ', p.title, p.description) ILIKE '%flower%'
    ))
    OR (t.slug = 'cats' AND (
      c.slug = 'cats'
      OR concat_ws(' ', p.title, p.description) ILIKE '%cat%'
    ))
    OR (t.slug = 'castles' AND
      concat_ws(' ', p.title, p.description) ILIKE '%castle%')
    OR (t.slug = 'sunset' AND
      concat_ws(' ', p.title, p.description) ILIKE '%sunset%')
    OR (t.slug = 'christmas' AND (
      c.slug = 'christmas'
      OR concat_ws(' ', p.title, p.description) ILIKE '%christmas%'
    ))
    OR (t.slug = 'autumn' AND
      concat_ws(' ', p.title, p.description) ILIKE '%autumn%')
    OR (t.slug = 'trains' AND (
      c.slug = 'trains'
      OR concat_ws(' ', p.title, p.description) ILIKE '%train%'
    ))
    OR (t.slug = 'beaches' AND (
      c.slug = 'beaches'
      OR concat_ws(' ', p.title, p.description) ILIKE ANY (
        ARRAY['%beach%', '%island%', '%coast%']
      )
    ))
    OR (t.slug = 'gardens' AND (
      c.slug = 'gardens'
      OR concat_ws(' ', p.title, p.description) ILIKE '%garden%'
    ))
    OR (t.slug = 'wildlife' AND c.slug IN ('wildlife', 'animals'))
    OR (t.slug = 'city-lights' AND c.slug = 'cities')
    OR (t.slug = 'space' AND (
      c.slug = 'space'
      OR concat_ws(' ', p.title, p.description) ILIKE ANY (
        ARRAY['%space%', '%star%', '%galaxy%']
      )
    ))
  )
ON CONFLICT (puzzle_id, theme_id) DO NOTHING;

COMMIT;
