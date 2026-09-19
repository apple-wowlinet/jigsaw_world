-- Normalize puzzle classification around the database category tree.
-- `puzzles.category_id` remains the backwards-compatible primary category;
-- `puzzle_categories` is the source of truth for catalogue membership.

BEGIN;

-- Keep this migration deployable on databases that have not applied the
-- optional category-hierarchy migration yet.
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id uuid
  REFERENCES public.categories(id) ON DELETE SET NULL;

-- The category RPC returns this field. Keep the migration compatible with
-- databases that also skipped 006_explore_weekly_plays.sql.
ALTER TABLE public.puzzles
  ADD COLUMN IF NOT EXISTS weekly_plays_count bigint NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_categories_parent
  ON public.categories (parent_id, sort_order)
  WHERE is_active = true;

CREATE OR REPLACE FUNCTION public.prevent_category_cycle()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  has_cycle boolean;
BEGIN
  IF NEW.parent_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.parent_id = NEW.id THEN
    RAISE EXCEPTION 'A category cannot be its own parent';
  END IF;

  WITH RECURSIVE ancestors AS (
    SELECT category.id, category.parent_id
    FROM public.categories AS category
    WHERE category.id = NEW.parent_id

    UNION ALL

    SELECT category.id, category.parent_id
    FROM public.categories AS category
    JOIN ancestors ON category.id = ancestors.parent_id
  )
  SELECT EXISTS (
    SELECT 1 FROM ancestors WHERE id = NEW.id
  ) INTO has_cycle;

  IF has_cycle THEN
    RAISE EXCEPTION 'Category hierarchy cannot contain a cycle';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_categories_prevent_cycle ON public.categories;
CREATE TRIGGER trg_categories_prevent_cycle
  BEFORE INSERT OR UPDATE OF parent_id ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.prevent_category_cycle();

-- Materialize the nature subtree that used to exist only in frontend code.
INSERT INTO public.categories (
  name, slug, description, image_url, icon, color, dark_color,
  puzzle_count, sort_order, is_active
) VALUES
  ('Nature', 'nature', 'Forests, mountains, flowers, and peaceful landscapes.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=900&fit=crop', 'trees', '#16a34a', '#14532d', 0, 100, true),
  ('Forests', 'forests', 'Woodland trails, towering trees and green canopies.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=900&fit=crop', 'trees', '#16a34a', '#14532d', 0, 105, true),
  ('Mountains', 'mountains', 'Majestic peaks, valleys and sweeping alpine views.', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop', 'mountain', '#64748b', '#334155', 0, 110, true),
  ('Lakes', 'lakes', 'Calm water, reflections and beautiful lakeside scenery.', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop', 'waves', '#0284c7', '#0c4a6e', 0, 115, true),
  ('Waterfalls', 'waterfalls', 'Cascading water surrounded by lush natural scenery.', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=900&fit=crop', 'waves', '#0284c7', '#0c4a6e', 0, 125, true),
  ('Flowers', 'flowers', 'Colorful blooms and peaceful flower gardens.', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=900&fit=crop', 'flower-2', '#ec4899', '#831843', 0, 120, true),
  ('Beaches', 'beaches', 'Sunny shores, clear water and peaceful coastlines.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop', 'waves', '#0891b2', '#164e63', 0, 130, true),
  ('Countryside', 'countryside', 'Open fields, farms and quiet rural landscapes.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop', 'trees', '#65a30d', '#365314', 0, 135, true),
  ('Gardens', 'gardens', 'Peaceful paths through beautifully planted gardens.', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=900&fit=crop', 'flower-2', '#65a30d', '#365314', 0, 140, true),
  ('Deserts', 'deserts', 'Golden dunes and dramatic desert skies.', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=900&fit=crop', 'sun', '#d97706', '#78350f', 0, 145, true),
  ('Pine Forests', 'pine-forests', 'Evergreen trails and peaceful pine woodland.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=900&fit=crop', 'trees', '#16a34a', '#14532d', 0, 106, true),
  ('Rainforests', 'rainforests', 'Dense tropical greenery and misty jungle paths.', 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=900&fit=crop', 'trees', '#16a34a', '#14532d', 0, 107, true),
  ('Alpine Lakes', 'alpine-lakes', 'Mountain lakes with clear water and mirrored peaks.', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop', 'waves', '#0284c7', '#0c4a6e', 0, 116, true)
ON CONFLICT (slug) DO NOTHING;

-- The existing catalogue rows become real children of Nature.
UPDATE public.categories AS child
SET parent_id = parent.id,
    updated_at = now()
FROM public.categories AS parent
WHERE parent.slug = 'nature'
  AND child.slug IN (
    'forests', 'mountains', 'flowers', 'lakes', 'waterfalls',
    'beaches', 'countryside', 'gardens', 'deserts'
  )
  AND child.parent_id IS DISTINCT FROM parent.id;

UPDATE public.categories AS child
SET parent_id = parent.id,
    updated_at = now()
FROM public.categories AS parent
WHERE parent.slug = 'forests'
  AND child.slug IN ('pine-forests', 'rainforests')
  AND child.parent_id IS DISTINCT FROM parent.id;

UPDATE public.categories AS child
SET parent_id = parent.id,
    updated_at = now()
FROM public.categories AS parent
WHERE parent.slug = 'lakes'
  AND child.slug = 'alpine-lakes'
  AND child.parent_id IS DISTINCT FROM parent.id;

CREATE TABLE IF NOT EXISTS public.puzzle_categories (
  puzzle_id   uuid NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  is_primary  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (puzzle_id, category_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_puzzle_categories_one_primary
  ON public.puzzle_categories (puzzle_id)
  WHERE is_primary = true;

CREATE INDEX IF NOT EXISTS idx_puzzle_categories_category
  ON public.puzzle_categories (category_id, puzzle_id);

-- Preserve every existing legacy category assignment as the primary relation.
INSERT INTO public.puzzle_categories (puzzle_id, category_id, is_primary)
SELECT puzzle.id, puzzle.category_id, true
FROM public.puzzles AS puzzle
WHERE puzzle.category_id IS NOT NULL
ON CONFLICT (puzzle_id, category_id) DO UPDATE
SET is_primary = true;

-- One-time migration of the former frontend keyword rules. Editors can revise
-- these relations later; keywords are not used by the public page at runtime.
INSERT INTO public.puzzle_categories (puzzle_id, category_id, is_primary)
SELECT puzzle.id, category.id, false
FROM public.puzzles AS puzzle
CROSS JOIN public.categories AS category
WHERE category.slug IN (
    'forests', 'mountains', 'flowers', 'lakes', 'waterfalls',
    'beaches', 'countryside', 'gardens', 'deserts',
    'pine-forests', 'rainforests', 'alpine-lakes'
  )
  AND (
    (category.slug = 'forests' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%forest%', '%woodland%', '%tree%', '%path%']))
    OR (category.slug = 'mountains' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%mountain%', '%alpine%', '%peak%', '%valley%']))
    OR (category.slug = 'flowers' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%flower%', '%floral%', '%bloom%', '%garden%']))
    OR (category.slug = 'lakes' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%lake%', '%lagoon%', '%reflection%', '%water%']))
    OR (category.slug = 'waterfalls' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%waterfall%', '%cascade%']))
    OR (category.slug = 'beaches' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%beach%', '%coast%', '%shore%', '%ocean%']))
    OR (category.slug = 'countryside' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%countryside%', '%field%', '%farm%', '%rural%']))
    OR (category.slug = 'gardens' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%garden%', '%flower%']))
    OR (category.slug = 'deserts' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%desert%', '%dune%', '%canyon%']))
    OR (category.slug = 'pine-forests' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%pine%', '%evergreen%', '%forest%']))
    OR (category.slug = 'rainforests' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%rainforest%', '%tropical%', '%jungle%']))
    OR (category.slug = 'alpine-lakes' AND concat_ws(' ', puzzle.title, puzzle.description) ILIKE ANY (ARRAY['%alpine lake%', '%mountain lake%', '%reflection%']))
  )
ON CONFLICT (puzzle_id, category_id) DO NOTHING;

-- Keep the compatibility primary category synchronized for future puzzle
-- inserts and category changes performed by existing admin code.
CREATE OR REPLACE FUNCTION public.sync_puzzle_primary_category()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    DELETE FROM public.puzzle_categories
    WHERE puzzle_id = NEW.id AND is_primary = true;
  END IF;

  IF NEW.category_id IS NOT NULL THEN
    INSERT INTO public.puzzle_categories (puzzle_id, category_id, is_primary)
    VALUES (NEW.id, NEW.category_id, true)
    ON CONFLICT (puzzle_id, category_id) DO UPDATE
    SET is_primary = true;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_puzzles_sync_primary_category ON public.puzzles;
CREATE TRIGGER trg_puzzles_sync_primary_category
  AFTER INSERT OR UPDATE OF category_id ON public.puzzles
  FOR EACH ROW EXECUTE FUNCTION public.sync_puzzle_primary_category();

ALTER TABLE public.puzzle_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_puzzle_categories" ON public.puzzle_categories;
CREATE POLICY "public_read_puzzle_categories"
  ON public.puzzle_categories FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.puzzles AS puzzle
      WHERE puzzle.id = puzzle_categories.puzzle_id
        AND puzzle.is_active = true
        AND puzzle.publish_at IS NOT NULL
        AND puzzle.publish_at <= now()
    )
    AND EXISTS (
      SELECT 1
      FROM public.categories AS category
      WHERE category.id = puzzle_categories.category_id
        AND category.is_active = true
    )
  );

GRANT SELECT ON public.puzzle_categories TO anon, authenticated;

-- Return all active category counts using the exact public publication rules.
-- Parent counts include every descendant and de-duplicate multi-category rows.
CREATE OR REPLACE FUNCTION public.get_public_category_counts()
RETURNS TABLE (slug text, puzzle_count bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH RECURSIVE category_tree(root_id, category_id) AS (
    SELECT category.id, category.id
    FROM public.categories AS category
    WHERE category.is_active = true

    UNION ALL

    SELECT tree.root_id, child.id
    FROM category_tree AS tree
    JOIN public.categories AS child ON child.parent_id = tree.category_id
    WHERE child.is_active = true
  )
  SELECT
    root.slug,
    count(DISTINCT relation.puzzle_id) FILTER (
      WHERE puzzle.id IS NOT NULL
    )::bigint AS puzzle_count
  FROM public.categories AS root
  JOIN category_tree AS tree ON tree.root_id = root.id
  LEFT JOIN public.puzzle_categories AS relation
    ON relation.category_id = tree.category_id
  LEFT JOIN public.puzzles AS puzzle
    ON puzzle.id = relation.puzzle_id
   AND puzzle.is_active = true
   AND puzzle.publish_at IS NOT NULL
   AND puzzle.publish_at <= now()
  WHERE root.is_active = true
  GROUP BY root.id, root.slug;
$$;

-- Return total category membership and the count after UI filters.
CREATE OR REPLACE FUNCTION public.get_public_category_puzzle_counts(
  p_category_slug text,
  p_difficulty text DEFAULT NULL,
  p_min_pieces integer DEFAULT NULL,
  p_max_pieces integer DEFAULT NULL
)
RETURNS TABLE (category_total bigint, filtered_total bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH RECURSIVE category_tree(category_id) AS (
    SELECT category.id
    FROM public.categories AS category
    WHERE category.slug = p_category_slug
      AND category.is_active = true

    UNION ALL

    SELECT child.id
    FROM public.categories AS child
    JOIN category_tree AS tree ON child.parent_id = tree.category_id
    WHERE child.is_active = true
  ),
  matched_puzzles AS (
    SELECT DISTINCT relation.puzzle_id
    FROM public.puzzle_categories AS relation
    JOIN category_tree AS tree ON tree.category_id = relation.category_id
  ),
  visible_puzzles AS (
    SELECT puzzle.id, puzzle.difficulty::text AS difficulty, puzzle.piece_count
    FROM matched_puzzles AS matched
    JOIN public.puzzles AS puzzle ON puzzle.id = matched.puzzle_id
    WHERE puzzle.is_active = true
      AND puzzle.publish_at IS NOT NULL
      AND puzzle.publish_at <= now()
  )
  SELECT
    count(*)::bigint AS category_total,
    count(*) FILTER (
      WHERE (p_difficulty IS NULL OR visible.difficulty = lower(p_difficulty))
        AND (p_min_pieces IS NULL OR visible.piece_count >= p_min_pieces)
        AND (p_max_pieces IS NULL OR visible.piece_count <= p_max_pieces)
    )::bigint AS filtered_total
  FROM visible_puzzles AS visible;
$$;

-- Return one server-paginated page. Classification, visibility, filtering and
-- sorting now happen in PostgreSQL rather than over a 500-row browser subset.
CREATE OR REPLACE FUNCTION public.get_public_category_puzzles(
  p_category_slug text,
  p_difficulty text DEFAULT NULL,
  p_min_pieces integer DEFAULT NULL,
  p_max_pieces integer DEFAULT NULL,
  p_sort text DEFAULT 'popular',
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  image_url text,
  description text,
  piece_count integer,
  difficulty text,
  plays_count bigint,
  weekly_plays_count bigint,
  completions_count integer,
  rating numeric,
  created_at timestamptz,
  updated_at timestamptz,
  category_name text,
  category_slug text
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH RECURSIVE category_tree(category_id) AS (
    SELECT category.id
    FROM public.categories AS category
    WHERE category.slug = p_category_slug
      AND category.is_active = true

    UNION ALL

    SELECT child.id
    FROM public.categories AS child
    JOIN category_tree AS tree ON child.parent_id = tree.category_id
    WHERE child.is_active = true
  ),
  matched_puzzles AS (
    SELECT DISTINCT relation.puzzle_id
    FROM public.puzzle_categories AS relation
    JOIN category_tree AS tree ON tree.category_id = relation.category_id
  ),
  visible_puzzles AS (
    SELECT
      puzzle.id,
      puzzle.title,
      puzzle.slug,
      puzzle.image_url,
      puzzle.description,
      puzzle.piece_count,
      puzzle.difficulty::text AS difficulty,
      puzzle.plays_count,
      puzzle.weekly_plays_count,
      puzzle.completions_count,
      puzzle.rating,
      puzzle.created_at,
      puzzle.updated_at,
      primary_category.name AS category_name,
      primary_category.slug AS category_slug,
      puzzle.publish_at
    FROM matched_puzzles AS matched
    JOIN public.puzzles AS puzzle ON puzzle.id = matched.puzzle_id
    LEFT JOIN public.categories AS primary_category
      ON primary_category.id = puzzle.category_id
    WHERE puzzle.is_active = true
      AND puzzle.publish_at IS NOT NULL
      AND puzzle.publish_at <= now()
      AND (p_difficulty IS NULL OR puzzle.difficulty::text = lower(p_difficulty))
      AND (p_min_pieces IS NULL OR puzzle.piece_count >= p_min_pieces)
      AND (p_max_pieces IS NULL OR puzzle.piece_count <= p_max_pieces)
  )
  SELECT
    visible.id,
    visible.title,
    visible.slug,
    visible.image_url,
    visible.description,
    visible.piece_count,
    visible.difficulty,
    visible.plays_count,
    visible.weekly_plays_count,
    visible.completions_count,
    visible.rating,
    visible.created_at,
    visible.updated_at,
    visible.category_name,
    visible.category_slug
  FROM visible_puzzles AS visible
  ORDER BY
    CASE WHEN p_sort = 'rating' THEN visible.rating END DESC NULLS LAST,
    CASE WHEN p_sort = 'newest' THEN visible.publish_at END DESC NULLS LAST,
    CASE WHEN p_sort = 'pieces' THEN visible.piece_count END ASC NULLS LAST,
    CASE WHEN p_sort = 'popular' THEN visible.plays_count END DESC NULLS LAST,
    visible.rating DESC,
    visible.plays_count DESC,
    visible.created_at DESC,
    visible.id
  LIMIT LEAST(GREATEST(p_limit, 1), 100)
  OFFSET GREATEST(p_offset, 0);
$$;

REVOKE ALL ON FUNCTION public.get_public_category_counts() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_public_category_puzzle_counts(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_public_category_puzzles(text, text, integer, integer, text, integer, integer) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_public_category_counts() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_category_puzzle_counts(text, text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_category_puzzles(text, text, integer, integer, text, integer, integer) TO anon, authenticated;

COMMENT ON COLUMN public.categories.puzzle_count IS
  'Deprecated compatibility field. Public counts are derived from puzzle_categories and publication state.';

COMMIT;
