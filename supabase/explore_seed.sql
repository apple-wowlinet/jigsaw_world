-- ============================================================
-- Explore list seed
-- Requires supabase/migrations/006_explore_weekly_plays.sql.
-- Run after supabase/mock_data.sql if the puzzles table is empty.
-- Safe to re-run: uses ON CONFLICT (slug).
-- ============================================================

BEGIN;

-- Architecture is shown on Explore chips but missing from mock_data.sql.
INSERT INTO public.categories (
  name, slug, description, image_url, icon, color, dark_color,
  puzzle_count, sort_order, is_active, seo_title, seo_description
) VALUES (
  'Architecture',
  'architecture',
  'Remarkable buildings from around the world.',
  'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1200&h=900&fit=crop',
  'landmark',
  '#475569',
  '#1e293b',
  0,
  90,
  true,
  'Architecture Jigsaw Puzzles',
  'Play architecture and landmark jigsaw puzzles online.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  dark_color = EXCLUDED.dark_color,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = now();

INSERT INTO public.puzzles (
  title, slug, image_url, description, piece_count, category_id, difficulty,
  plays_count, weekly_plays_count, completions_count, rating, rating_sum, rating_count,
  is_featured, is_active, sort_order, publish_at, editor_score
) VALUES
  (
    'Grand Arcade',
    'grand-arcade',
    'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1200&h=900&fit=crop',
    'A grand arcade with repeating arches and warm stone.',
    200,
    (SELECT id FROM public.categories WHERE slug = 'architecture'),
    'medium',
    1330, 410, 620, 4.5, 450.0, 100,
    false, true, 510, now() - interval '20 days', 82
  ),
  (
    'Cathedral Spires',
    'cathedral-spires',
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1200&h=900&fit=crop',
    'Gothic cathedral spires against a clear sky.',
    500,
    (SELECT id FROM public.categories WHERE slug = 'architecture'),
    'hard',
    820, 260, 310, 4.8, 384.0, 80,
    false, true, 520, now() - interval '19 days', 88
  ),
  (
    'Stone Courtyard',
    'stone-courtyard',
    'https://images.unsplash.com/photo-1479839672679-a46483c0e07c?w=1200&h=900&fit=crop',
    'A quiet stone courtyard with patterned paving.',
    150,
    (SELECT id FROM public.categories WHERE slug = 'architecture'),
    'easy',
    350, 190, 180, 4.3, 215.0, 50,
    false, true, 530, now() - interval '18 days', 74
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  piece_count = EXCLUDED.piece_count,
  category_id = EXCLUDED.category_id,
  difficulty = EXCLUDED.difficulty,
  plays_count = EXCLUDED.plays_count,
  weekly_plays_count = EXCLUDED.weekly_plays_count,
  completions_count = EXCLUDED.completions_count,
  rating = EXCLUDED.rating,
  rating_sum = EXCLUDED.rating_sum,
  rating_count = EXCLUDED.rating_count,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  publish_at = EXCLUDED.publish_at,
  editor_score = EXCLUDED.editor_score,
  updated_at = now();

-- Keep weekly ranks different from all-time plays so This Week / All Time diverge.
UPDATE public.puzzles
SET weekly_plays_count = GREATEST(
  24,
  LEAST(
    plays_count,
    (plays_count * 28 / 100)::bigint + (abs(hashtext(slug)) % 90)
  )
)
WHERE is_active = true
  AND weekly_plays_count = 0;

UPDATE public.categories c
SET puzzle_count = (
  SELECT count(*) FROM public.puzzles p
  WHERE p.category_id = c.id AND p.is_active = true
)
WHERE slug = 'architecture';

COMMIT;
