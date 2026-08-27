-- ============================================================
-- JigsawWorld Mock Data
-- 用途：本地/测试环境基础数据。可在 Supabase SQL Editor 中手动执行。
-- 说明：核心生成 50 条 puzzles，并补充分类、等级、成就、活动和每日挑战。
-- 注意：不直接写入 auth.users，因此不生成依赖真实用户的私有表数据。
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Categories ------------------------------------------------------------
INSERT INTO public.categories (
  name, slug, description, image_url, icon, color, dark_color,
  puzzle_count, sort_order, is_active, seo_title, seo_description, og_image_url, meta_keywords
) VALUES
  ('Nature', 'nature', 'Forests, mountains, flowers, and peaceful landscapes.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop', 'trees', '#16a34a', '#14532d', 0, 10, true, 'Nature Jigsaw Puzzles', 'Play relaxing nature jigsaw puzzles online.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop', 'nature,puzzles,forest,mountain'),
  ('Ocean', 'ocean', 'Beaches, waves, islands, boats, and underwater scenes.', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop', 'waves', '#0284c7', '#0c4a6e', 0, 20, true, 'Ocean Jigsaw Puzzles', 'Play ocean and beach jigsaw puzzles online.', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=630&fit=crop', 'ocean,puzzles,beach,waves'),
  ('Animals', 'animals', 'Wildlife, pets, birds, and cute animal portraits.', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&h=800&fit=crop', 'paw-print', '#f97316', '#7c2d12', 0, 30, true, 'Animal Jigsaw Puzzles', 'Play wildlife and pet jigsaw puzzles online.', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&h=630&fit=crop', 'animals,puzzles,wildlife,pets'),
  ('Cities', 'cities', 'Skylines, streets, landmarks, and night city views.', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop', 'building-2', '#6366f1', '#312e81', 0, 40, true, 'City Jigsaw Puzzles', 'Play city skyline and landmark jigsaw puzzles online.', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop', 'city,puzzles,skyline,landmarks'),
  ('Fantasy', 'fantasy', 'Dreamlike castles, magic scenes, and imaginative worlds.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop', 'sparkles', '#a855f7', '#581c87', 0, 50, true, 'Fantasy Jigsaw Puzzles', 'Play fantasy and magical jigsaw puzzles online.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=630&fit=crop', 'fantasy,puzzles,magic,castle'),
  ('Food', 'food', 'Colorful desserts, drinks, fruits, and cozy meals.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=800&fit=crop', 'utensils', '#eab308', '#713f12', 0, 60, true, 'Food Jigsaw Puzzles', 'Play food and dessert jigsaw puzzles online.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=630&fit=crop', 'food,puzzles,dessert,fruit'),
  ('Travel', 'travel', 'Scenic destinations, roads, temples, and vacation views.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop', 'map', '#14b8a6', '#134e4a', 0, 70, true, 'Travel Jigsaw Puzzles', 'Play travel destination jigsaw puzzles online.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=630&fit=crop', 'travel,puzzles,destination,landscape'),
  ('Art', 'art', 'Abstract colors, patterns, paintings, and creative textures.', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=800&fit=crop', 'palette', '#ec4899', '#831843', 0, 80, true, 'Art Jigsaw Puzzles', 'Play abstract art and pattern jigsaw puzzles online.', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=630&fit=crop', 'art,puzzles,abstract,pattern')
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
  og_image_url = EXCLUDED.og_image_url,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = now();

-- 2. Puzzles: 50 rows ------------------------------------------------------
INSERT INTO public.puzzles (
  title, slug, image_url, description, piece_count, category_id, difficulty,
  plays_count, completions_count, rating, rating_sum, rating_count,
  is_featured, is_active, sort_order, publish_at, editor_score
) VALUES
  ('Mountain Morning Glow', 'mountain-morning-glow', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900&fit=crop', 'A bright mountain sunrise with soft clouds and crisp air.', 100, (SELECT id FROM public.categories WHERE slug = 'nature'), 'easy', 2380, 1290, 4.8, 960.0, 200, true, true, 10, now() - interval '30 days', 96),
  ('Forest Path Mystery', 'forest-path-mystery', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=900&fit=crop', 'A quiet trail through an ancient green forest.', 120, (SELECT id FROM public.categories WHERE slug = 'nature'), 'medium', 1560, 830, 4.6, 690.0, 150, true, true, 20, now() - interval '29 days', 92),
  ('Alpine Lake Reflection', 'alpine-lake-reflection', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop', 'Snowy peaks reflected in a calm alpine lake.', 150, (SELECT id FROM public.categories WHERE slug = 'nature'), 'medium', 1420, 710, 4.7, 705.0, 150, false, true, 30, now() - interval '28 days', 88),
  ('Autumn Valley Colors', 'autumn-valley-colors', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=900&fit=crop', 'Golden trees and warm hills in autumn light.', 200, (SELECT id FROM public.categories WHERE slug = 'nature'), 'hard', 980, 390, 4.5, 450.0, 100, false, true, 40, now() - interval '27 days', 84),
  ('Desert Dunes at Dusk', 'desert-dunes-at-dusk', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=900&fit=crop', 'Layered desert dunes under a dramatic evening sky.', 300, (SELECT id FROM public.categories WHERE slug = 'nature'), 'expert', 760, 210, 4.4, 352.0, 80, false, true, 50, now() - interval '26 days', 80),
  ('Waterfall Garden', 'waterfall-garden', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=900&fit=crop', 'A refreshing waterfall surrounded by lush plants.', 80, (SELECT id FROM public.categories WHERE slug = 'nature'), 'easy', 1830, 1120, 4.7, 799.0, 170, false, true, 60, now() - interval '25 days', 86),

  ('Ocean Sunset Waves', 'ocean-sunset-waves', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=900&fit=crop', 'Orange sunset light rolling over blue ocean waves.', 150, (SELECT id FROM public.categories WHERE slug = 'ocean'), 'medium', 2210, 1190, 4.8, 1056.0, 220, true, true, 70, now() - interval '24 days', 97),
  ('Tropical Island Escape', 'tropical-island-escape', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop', 'White sand, clear water, and a peaceful tropical beach.', 100, (SELECT id FROM public.categories WHERE slug = 'ocean'), 'easy', 2460, 1530, 4.9, 1176.0, 240, true, true, 80, now() - interval '23 days', 95),
  ('Blue Lagoon Cliffs', 'blue-lagoon-cliffs', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=900&fit=crop', 'Blue coastal water framed by rugged stone cliffs.', 200, (SELECT id FROM public.categories WHERE slug = 'ocean'), 'hard', 870, 320, 4.3, 301.0, 70, false, true, 90, now() - interval '22 days', 78),
  ('Harbor Boats Morning', 'harbor-boats-morning', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=900&fit=crop', 'Small boats resting in a quiet morning harbor.', 120, (SELECT id FROM public.categories WHERE slug = 'ocean'), 'medium', 1120, 620, 4.4, 396.0, 90, false, true, 100, now() - interval '21 days', 76),
  ('Coral Reef Colors', 'coral-reef-colors', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=900&fit=crop', 'Bright underwater coral textures and reef life.', 300, (SELECT id FROM public.categories WHERE slug = 'ocean'), 'expert', 640, 190, 4.5, 315.0, 70, false, true, 110, now() - interval '20 days', 82),
  ('Stormy Sea Lighthouse', 'stormy-sea-lighthouse', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop', 'A lighthouse standing strong against moody sea clouds.', 200, (SELECT id FROM public.categories WHERE slug = 'ocean'), 'hard', 930, 410, 4.6, 414.0, 90, false, true, 120, now() - interval '19 days', 83),

  ('Curious Red Fox', 'curious-red-fox', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&h=900&fit=crop', 'A red fox watching quietly in soft natural light.', 100, (SELECT id FROM public.categories WHERE slug = 'animals'), 'easy', 2100, 1380, 4.8, 960.0, 200, true, true, 130, now() - interval '18 days', 94),
  ('Golden Retriever Smile', 'golden-retriever-smile', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=900&fit=crop', 'A happy golden retriever portrait for a relaxing puzzle.', 80, (SELECT id FROM public.categories WHERE slug = 'animals'), 'easy', 1890, 1300, 4.9, 931.0, 190, true, true, 140, now() - interval '17 days', 90),
  ('Majestic Elephant Walk', 'majestic-elephant-walk', 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1200&h=900&fit=crop', 'An elephant walking through warm grassland light.', 150, (SELECT id FROM public.categories WHERE slug = 'animals'), 'medium', 1320, 680, 4.6, 552.0, 120, false, true, 150, now() - interval '16 days', 84),
  ('Colorful Parrot Perch', 'colorful-parrot-perch', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=1200&h=900&fit=crop', 'A bright parrot sitting among vivid tropical leaves.', 200, (SELECT id FROM public.categories WHERE slug = 'animals'), 'hard', 900, 360, 4.5, 405.0, 90, false, true, 160, now() - interval '15 days', 81),
  ('Sleeping Cat Window', 'sleeping-cat-window', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&h=900&fit=crop', 'A cozy cat sleeping near a sunlit window.', 120, (SELECT id FROM public.categories WHERE slug = 'animals'), 'medium', 1780, 1040, 4.7, 799.0, 170, false, true, 170, now() - interval '14 days', 87),
  ('Wild Horses Run', 'wild-horses-run', 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&h=900&fit=crop', 'Wild horses running across an open field.', 300, (SELECT id FROM public.categories WHERE slug = 'animals'), 'expert', 740, 210, 4.3, 301.0, 70, false, true, 180, now() - interval '13 days', 79),

  ('Night City Skyline', 'night-city-skyline', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=900&fit=crop', 'A glowing city skyline full of night lights.', 150, (SELECT id FROM public.categories WHERE slug = 'cities'), 'medium', 1980, 1010, 4.7, 846.0, 180, true, true, 190, now() - interval '12 days', 91),
  ('Old Town Street', 'old-town-street', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&h=900&fit=crop', 'A narrow old town street with warm evening lights.', 120, (SELECT id FROM public.categories WHERE slug = 'cities'), 'medium', 1200, 650, 4.5, 450.0, 100, false, true, 200, now() - interval '11 days', 82),
  ('Modern Bridge Lights', 'modern-bridge-lights', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=900&fit=crop', 'A modern bridge shining across an urban river.', 200, (SELECT id FROM public.categories WHERE slug = 'cities'), 'hard', 860, 300, 4.4, 352.0, 80, false, true, 210, now() - interval '10 days', 77),
  ('Paris Cafe Corner', 'paris-cafe-corner', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=900&fit=crop', 'A charming cafe corner in a classic city scene.', 100, (SELECT id FROM public.categories WHERE slug = 'cities'), 'easy', 1690, 1080, 4.8, 864.0, 180, false, true, 220, now() - interval '9 days', 88),
  ('Tokyo Crossing Rush', 'tokyo-crossing-rush', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=900&fit=crop', 'A lively crossing filled with signs and city energy.', 300, (SELECT id FROM public.categories WHERE slug = 'cities'), 'expert', 720, 180, 4.3, 258.0, 60, false, true, 230, now() - interval '8 days', 80),
  ('Canal Houses Evening', 'canal-houses-evening', 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&h=900&fit=crop', 'Historic canal houses reflected in calm evening water.', 150, (SELECT id FROM public.categories WHERE slug = 'cities'), 'medium', 1110, 540, 4.6, 506.0, 110, false, true, 240, now() - interval '7 days', 83),

  ('Crystal Castle Dream', 'crystal-castle-dream', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=900&fit=crop', 'A dreamy fantasy castle surrounded by glowing mist.', 200, (SELECT id FROM public.categories WHERE slug = 'fantasy'), 'hard', 1450, 620, 4.8, 768.0, 160, true, true, 250, now() - interval '6 days', 93),
  ('Moonlit Magic Forest', 'moonlit-magic-forest', 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=900&fit=crop', 'A magical forest path glowing under moonlight.', 150, (SELECT id FROM public.categories WHERE slug = 'fantasy'), 'medium', 1270, 690, 4.7, 658.0, 140, false, true, 260, now() - interval '5 days', 87),
  ('Dragon Mountain Cave', 'dragon-mountain-cave', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop', 'A dramatic mountain cave inspired by dragon legends.', 300, (SELECT id FROM public.categories WHERE slug = 'fantasy'), 'expert', 620, 150, 4.2, 210.0, 50, false, true, 270, now() - interval '4 days', 78),
  ('Floating Lantern Lake', 'floating-lantern-lake', 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&h=900&fit=crop', 'Golden lanterns floating across a peaceful fantasy lake.', 120, (SELECT id FROM public.categories WHERE slug = 'fantasy'), 'medium', 1540, 880, 4.8, 864.0, 180, false, true, 280, now() - interval '3 days', 89),
  ('Starlight Portal', 'starlight-portal', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=900&fit=crop', 'A mysterious starlight portal in deep cosmic colors.', 200, (SELECT id FROM public.categories WHERE slug = 'fantasy'), 'hard', 970, 390, 4.6, 460.0, 100, false, true, 290, now() - interval '2 days', 85),
  ('Enchanted Library', 'enchanted-library', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=900&fit=crop', 'A warm library scene with a quiet enchanted atmosphere.', 100, (SELECT id FROM public.categories WHERE slug = 'fantasy'), 'easy', 1340, 870, 4.7, 705.0, 150, false, true, 300, now() - interval '1 day', 86),

  ('Berry Pancake Stack', 'berry-pancake-stack', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&h=900&fit=crop', 'Fluffy pancakes with berries and syrup.', 80, (SELECT id FROM public.categories WHERE slug = 'food'), 'easy', 1720, 1190, 4.8, 864.0, 180, true, true, 310, now() - interval '18 hours', 91),
  ('Colorful Fruit Market', 'colorful-fruit-market', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=900&fit=crop', 'A vivid market display full of fresh fruit colors.', 120, (SELECT id FROM public.categories WHERE slug = 'food'), 'medium', 1180, 640, 4.5, 405.0, 90, false, true, 320, now() - interval '17 hours', 80),
  ('Cupcake Party', 'cupcake-party', 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&h=900&fit=crop', 'Sweet cupcakes arranged for a cheerful party.', 100, (SELECT id FROM public.categories WHERE slug = 'food'), 'easy', 1600, 980, 4.7, 752.0, 160, false, true, 330, now() - interval '16 hours', 84),
  ('Sushi Platter Detail', 'sushi-platter-detail', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=900&fit=crop', 'A detailed sushi platter with clean colors and shapes.', 200, (SELECT id FROM public.categories WHERE slug = 'food'), 'hard', 880, 310, 4.4, 352.0, 80, false, true, 340, now() - interval '15 hours', 76),
  ('Coffee and Croissant', 'coffee-and-croissant', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=900&fit=crop', 'A cozy breakfast table with coffee and pastry.', 120, (SELECT id FROM public.categories WHERE slug = 'food'), 'medium', 1350, 780, 4.6, 598.0, 130, false, true, 350, now() - interval '14 hours', 83),
  ('Chocolate Dessert Plate', 'chocolate-dessert-plate', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=900&fit=crop', 'A rich chocolate dessert with elegant plating.', 150, (SELECT id FROM public.categories WHERE slug = 'food'), 'medium', 970, 500, 4.5, 405.0, 90, false, true, 360, now() - interval '13 hours', 79),

  ('Swiss Village View', 'swiss-village-view', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop', 'A scenic travel view of a quiet mountain village.', 150, (SELECT id FROM public.categories WHERE slug = 'travel'), 'medium', 1410, 780, 4.7, 705.0, 150, true, true, 370, now() - interval '12 hours', 92),
  ('Temple Sunrise Steps', 'temple-sunrise-steps', 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=900&fit=crop', 'A peaceful temple staircase under sunrise light.', 200, (SELECT id FROM public.categories WHERE slug = 'travel'), 'hard', 790, 260, 4.4, 308.0, 70, false, true, 380, now() - interval '11 hours', 81),
  ('Road Trip Canyon', 'road-trip-canyon', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=900&fit=crop', 'An open road cutting through a wide canyon landscape.', 120, (SELECT id FROM public.categories WHERE slug = 'travel'), 'medium', 1290, 720, 4.6, 552.0, 120, false, true, 390, now() - interval '10 hours', 85),
  ('Venice Canal Ride', 'venice-canal-ride', 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&h=900&fit=crop', 'A classic canal ride through a beautiful old city.', 100, (SELECT id FROM public.categories WHERE slug = 'travel'), 'easy', 1660, 990, 4.8, 816.0, 170, false, true, 400, now() - interval '9 hours', 88),
  ('Northern Lights Cabin', 'northern-lights-cabin', 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200&h=900&fit=crop', 'A winter cabin beneath colorful northern lights.', 300, (SELECT id FROM public.categories WHERE slug = 'travel'), 'expert', 710, 190, 4.5, 315.0, 70, false, true, 410, now() - interval '8 hours', 86),
  ('Coastal Train Journey', 'coastal-train-journey', 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=900&fit=crop', 'A scenic railway route along a peaceful coast.', 150, (SELECT id FROM public.categories WHERE slug = 'travel'), 'medium', 910, 460, 4.3, 301.0, 70, false, true, 420, now() - interval '7 hours', 75),

  ('Abstract Color Splash', 'abstract-color-splash', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=900&fit=crop', 'A bright abstract composition full of playful colors.', 100, (SELECT id FROM public.categories WHERE slug = 'art'), 'easy', 1520, 880, 4.7, 705.0, 150, true, true, 430, now() - interval '6 hours', 90),
  ('Geometric Pattern Tiles', 'geometric-pattern-tiles', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&h=900&fit=crop', 'Repeating geometric tiles that create a satisfying challenge.', 200, (SELECT id FROM public.categories WHERE slug = 'art'), 'hard', 840, 280, 4.4, 308.0, 70, false, true, 440, now() - interval '5 hours', 82),
  ('Watercolor Flowers', 'watercolor-flowers', 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&h=900&fit=crop', 'Soft watercolor flowers in gentle pastel shades.', 120, (SELECT id FROM public.categories WHERE slug = 'art'), 'medium', 1010, 590, 4.6, 460.0, 100, false, true, 450, now() - interval '4 hours', 83),
  ('Street Mural Wall', 'street-mural-wall', 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200&h=900&fit=crop', 'A colorful street mural with layered shapes and textures.', 150, (SELECT id FROM public.categories WHERE slug = 'art'), 'medium', 930, 510, 4.5, 405.0, 90, false, true, 460, now() - interval '3 hours', 78),
  ('Ceramic Mosaic Detail', 'ceramic-mosaic-detail', 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=1200&h=900&fit=crop', 'Detailed ceramic mosaic pieces in vivid colors.', 300, (SELECT id FROM public.categories WHERE slug = 'art'), 'expert', 620, 160, 4.2, 210.0, 50, false, true, 470, now() - interval '2 hours', 74),
  ('Minimal Poster Shapes', 'minimal-poster-shapes', 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=900&fit=crop', 'Minimal poster-like shapes with bold color blocks.', 80, (SELECT id FROM public.categories WHERE slug = 'art'), 'easy', 1260, 810, 4.6, 552.0, 120, false, true, 480, now() - interval '1 hour', 81),
  ('Rainbow Glass Texture', 'rainbow-glass-texture', 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=1200&h=900&fit=crop', 'A rainbow glass texture with reflections and gradients.', 150, (SELECT id FROM public.categories WHERE slug = 'art'), 'medium', 1160, 610, 4.7, 611.0, 130, false, true, 490, now() - interval '30 minutes', 84),
  ('Ink Wave Illustration', 'ink-wave-illustration', 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=1200&h=900&fit=crop', 'A dynamic ink wave illustration with smooth motion.', 200, (SELECT id FROM public.categories WHERE slug = 'art'), 'hard', 780, 250, 4.3, 258.0, 60, false, true, 500, now(), 77)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  piece_count = EXCLUDED.piece_count,
  category_id = EXCLUDED.category_id,
  difficulty = EXCLUDED.difficulty,
  plays_count = EXCLUDED.plays_count,
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

-- Distinct from all-time plays so weekly / all-time ranks can differ.
-- Requires migration 006_explore_weekly_plays.sql.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'puzzles'
      AND column_name = 'weekly_plays_count'
  ) THEN
    UPDATE public.puzzles
    SET weekly_plays_count = GREATEST(
      24,
      LEAST(
        plays_count,
        (plays_count * 28 / 100)::bigint + (abs(hashtext(slug)) % 90)
      )
    )
    WHERE is_active = true;
  END IF;
END $$;

-- 3. Events ----------------------------------------------------------------
INSERT INTO public.events (slug, name, description, banner_url, starts_at, ends_at, is_active)
VALUES
  ('summer-journey-2026', 'Summer Journey 2026', 'A seasonal event featuring ocean, travel, and sunny outdoor puzzles.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop', date '2026-07-01', date '2026-08-31', true),
  ('art-and-color-week', 'Art and Color Week', 'A short event for abstract, colorful, and creative puzzles.', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=400&fit=crop', date '2026-07-10', date '2026-07-17', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  banner_url = EXCLUDED.banner_url,
  starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at,
  is_active = EXCLUDED.is_active;

-- 4. Daily challenges ------------------------------------------------------
INSERT INTO public.daily_challenges (challenge_date, puzzle_id, title, description, event_id)
VALUES
  (date '2026-07-01', (SELECT id FROM public.puzzles WHERE slug = 'mountain-morning-glow'), 'Daily Mountain Glow', 'Start the month with a relaxing mountain puzzle.', NULL),
  (date '2026-07-02', (SELECT id FROM public.puzzles WHERE slug = 'ocean-sunset-waves'), 'Daily Ocean Sunset', 'A warm ocean sunset for the daily challenge.', (SELECT id FROM public.events WHERE slug = 'summer-journey-2026')),
  (date '2026-07-03', (SELECT id FROM public.puzzles WHERE slug = 'curious-red-fox'), 'Daily Curious Fox', 'A cute wildlife puzzle for animal lovers.', NULL),
  (date '2026-07-04', (SELECT id FROM public.puzzles WHERE slug = 'night-city-skyline'), 'Daily City Lights', 'Complete a glowing skyline puzzle.', NULL),
  (date '2026-07-05', (SELECT id FROM public.puzzles WHERE slug = 'crystal-castle-dream'), 'Daily Castle Dream', 'A fantasy challenge with magical scenery.', NULL),
  (date '2026-07-06', (SELECT id FROM public.puzzles WHERE slug = 'berry-pancake-stack'), 'Daily Pancake Stack', 'A sweet and cozy food puzzle.', NULL),
  (date '2026-07-07', (SELECT id FROM public.puzzles WHERE slug = 'swiss-village-view'), 'Daily Swiss Village', 'Travel through a peaceful village scene.', (SELECT id FROM public.events WHERE slug = 'summer-journey-2026')),
  (date '2026-07-08', (SELECT id FROM public.puzzles WHERE slug = 'abstract-color-splash'), 'Daily Color Splash', 'A bright abstract puzzle for creative players.', (SELECT id FROM public.events WHERE slug = 'art-and-color-week')),
  (date '2026-07-09', (SELECT id FROM public.puzzles WHERE slug = 'tropical-island-escape'), 'Daily Tropical Escape', 'Relax with a sunny beach challenge.', (SELECT id FROM public.events WHERE slug = 'summer-journey-2026')),
  (date '2026-07-10', (SELECT id FROM public.puzzles WHERE slug = 'floating-lantern-lake'), 'Daily Lantern Lake', 'A calm fantasy lake puzzle.', NULL),
  (date '2026-07-11', (SELECT id FROM public.puzzles WHERE slug = 'sushi-platter-detail'), 'Daily Sushi Detail', 'A detailed food puzzle with clean shapes.', NULL),
  (date '2026-07-12', (SELECT id FROM public.puzzles WHERE slug = 'venice-canal-ride'), 'Daily Venice Ride', 'A scenic canal travel challenge.', (SELECT id FROM public.events WHERE slug = 'summer-journey-2026')),
  (date '2026-07-13', (SELECT id FROM public.puzzles WHERE slug = 'watercolor-flowers'), 'Daily Watercolor Flowers', 'A gentle art puzzle in pastel colors.', (SELECT id FROM public.events WHERE slug = 'art-and-color-week')),
  (date '2026-07-14', (SELECT id FROM public.puzzles WHERE slug = 'rainbow-glass-texture'), 'Daily Rainbow Glass', 'A colorful glass texture challenge.', (SELECT id FROM public.events WHERE slug = 'art-and-color-week'))
ON CONFLICT (challenge_date) DO UPDATE SET
  puzzle_id = EXCLUDED.puzzle_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  event_id = EXCLUDED.event_id;

-- 5. Levels ----------------------------------------------------------------
INSERT INTO public.levels (level, required_xp, title, badge_url)
VALUES
  (1, 0, 'Newcomer', NULL),
  (2, 100, 'Piece Finder', NULL),
  (3, 250, 'Puzzle Starter', NULL),
  (4, 500, 'Pattern Spotter', NULL),
  (5, 900, 'Fast Solver', NULL),
  (6, 1400, 'Puzzle Expert', NULL),
  (7, 2100, 'Challenge Hunter', NULL),
  (8, 3000, 'Jigsaw Master', NULL),
  (9, 4200, 'Grand Solver', NULL),
  (10, 6000, 'Legendary Puzzler', NULL)
ON CONFLICT (level) DO UPDATE SET
  required_xp = EXCLUDED.required_xp,
  title = EXCLUDED.title,
  badge_url = EXCLUDED.badge_url;

-- 6. Achievements ----------------------------------------------------------
INSERT INTO public.achievements (slug, name, description, icon, tier, xp_reward, conditions, category_tag, sort_order, is_active)
VALUES
  ('first-piece', 'First Piece', 'Start your first puzzle.', 'play', 'bronze', 20, '[{"metric":"total_games_started","op":">=","value":1}]'::jsonb, 'puzzle', 10, true),
  ('first-completion', 'First Completion', 'Complete your first puzzle.', 'check-circle', 'bronze', 50, '[{"metric":"total_completions","op":">=","value":1}]'::jsonb, 'puzzle', 20, true),
  ('five-completions', 'Five Finishes', 'Complete five puzzles.', 'medal', 'bronze', 100, '[{"metric":"total_completions","op":">=","value":5}]'::jsonb, 'puzzle', 30, true),
  ('twenty-completions', 'Twenty Finishes', 'Complete twenty puzzles.', 'trophy', 'silver', 250, '[{"metric":"total_completions","op":">=","value":20}]'::jsonb, 'puzzle', 40, true),
  ('perfect-game', 'Perfect Game', 'Complete a puzzle with three stars.', 'star', 'bronze', 80, '[{"metric":"perfect_games","op":">=","value":1}]'::jsonb, 'puzzle', 50, true),
  ('perfect-ten', 'Perfect Ten', 'Complete ten perfect games.', 'stars', 'silver', 300, '[{"metric":"perfect_games","op":">=","value":10}]'::jsonb, 'puzzle', 60, true),
  ('daily-starter', 'Daily Starter', 'Join one daily challenge.', 'calendar', 'bronze', 50, '[{"metric":"daily_participations","op":">=","value":1}]'::jsonb, 'daily', 70, true),
  ('daily-week', 'Daily Week', 'Build a seven day daily challenge streak.', 'flame', 'silver', 300, '[{"metric":"daily_current_streak","op":">=","value":7}]'::jsonb, 'streak', 80, true),
  ('easy-specialist', 'Easy Specialist', 'Complete ten easy puzzles.', 'smile', 'bronze', 120, '[{"metric":"difficulty_completions","difficulty":"easy","op":">=","value":10}]'::jsonb, 'difficulty', 90, true),
  ('hard-specialist', 'Hard Specialist', 'Complete five hard puzzles.', 'zap', 'silver', 220, '[{"metric":"difficulty_completions","difficulty":"hard","op":">=","value":5}]'::jsonb, 'difficulty', 100, true),
  ('nature-lover', 'Nature Lover', 'Complete ten nature puzzles.', 'trees', 'bronze', 120, '[{"metric":"category_completions","category":"nature","op":">=","value":10}]'::jsonb, 'category', 110, true),
  ('ocean-explorer', 'Ocean Explorer', 'Complete ten ocean puzzles.', 'waves', 'bronze', 120, '[{"metric":"category_completions","category":"ocean","op":">=","value":10}]'::jsonb, 'category', 120, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  tier = EXCLUDED.tier,
  xp_reward = EXCLUDED.xp_reward,
  conditions = EXCLUDED.conditions,
  category_tag = EXCLUDED.category_tag,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- 7. Derived counters ------------------------------------------------------
UPDATE public.categories c
SET puzzle_count = p.total,
    updated_at = now()
FROM (
  SELECT category_id, count(*)::integer AS total
  FROM public.puzzles
  WHERE category_id IS NOT NULL AND is_active = true
  GROUP BY category_id
) p
WHERE c.id = p.category_id;

COMMIT;
