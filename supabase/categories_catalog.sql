-- JigsawWorld 分类浏览页目录数据
-- 可在 Supabase SQL Editor 中独立执行；不修改现有表结构。

BEGIN;

INSERT INTO public.categories (
  name, slug, description, image_url, icon, puzzle_count, sort_order, is_active
) VALUES
  ('Nature', 'nature', 'Forests, mountains, flowers, and peaceful landscapes.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=900&fit=crop', 'trees', 128, 10, true),
  ('Animals', 'animals', 'Wildlife, pets, birds, and beautiful animal portraits.', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&h=900&fit=crop', 'paw-print', 96, 20, true),
  ('Travel', 'travel', 'Scenic destinations and unforgettable journeys.', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=900&fit=crop', 'plane', 86, 30, true),
  ('Food', 'food', 'Colorful desserts, fruits, drinks, and cozy meals.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=900&fit=crop', 'utensils', 74, 40, true),
  ('Cities', 'cities', 'Skylines, streets, landmarks, and city lights.', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=900&fit=crop', 'building-2', 64, 50, true),
  ('Ocean', 'ocean', 'Rolling waves, blue water, and underwater worlds.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop', 'waves', 58, 60, true),
  ('Fantasy', 'fantasy', 'Dreamlike castles, magic, and imaginative worlds.', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=900&fit=crop', 'sparkles', 52, 70, true),
  ('Art', 'art', 'Paintings, patterns, colors, and creative expression.', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=900&fit=crop', 'palette', 48, 80, true),
  ('Flowers', 'flowers', 'Colorful blooms and peaceful gardens.', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=900&fit=crop', 'flower-2', 42, 100, true),
  ('Mountains', 'mountains', 'Majestic peaks, valleys, and alpine lakes.', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop', 'mountain', 38, 110, true),
  ('Birds', 'birds', 'Bright feathers and birds in the wild.', 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=1200&h=900&fit=crop', 'bird', 36, 120, true),
  ('Beaches', 'beaches', 'Sunny shores, palm trees, and clear water.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop', 'palmtree', 34, 130, true),
  ('Cats', 'cats', 'Playful kittens and charming cat portraits.', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1200&h=900&fit=crop', 'cat', 32, 140, true),
  ('Dogs', 'dogs', 'Friendly dogs of every shape and size.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=900&fit=crop', 'dog', 31, 150, true),
  ('Wildlife', 'wildlife', 'Animals in their beautiful natural habitats.', 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1200&h=900&fit=crop', 'binoculars', 30, 160, true),
  ('Architecture', 'architecture', 'Remarkable buildings from around the world.', 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1200&h=900&fit=crop', 'landmark', 28, 170, true),
  ('Landmarks', 'landmarks', 'Iconic places and monuments to discover.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=900&fit=crop', 'map-pin', 27, 180, true),
  ('Europe', 'europe', 'Historic towns and scenic European coasts.', 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1200&h=900&fit=crop', 'globe-2', 26, 190, true),
  ('Space', 'space', 'Planets, galaxies, and the wonders beyond.', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=900&fit=crop', 'orbit', 25, 200, true),
  ('Trains', 'trains', 'Classic railways and powerful locomotives.', 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=1200&h=900&fit=crop', 'train-front', 24, 210, true),
  ('Cars', 'cars', 'Vintage icons and modern road machines.', 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&h=900&fit=crop', 'car-front', 23, 220, true),
  ('Anime', 'anime', 'Dreamy illustrations and animated worlds.', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=900&fit=crop', 'sparkles', 22, 230, true),
  ('Christmas', 'christmas', 'Warm lights, snow, and festive scenes.', 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1200&h=900&fit=crop', 'snowflake', 21, 240, true),
  ('Gardens', 'gardens', 'Peaceful paths through beautiful gardens.', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=900&fit=crop', 'flower-2', 20, 250, true),
  ('Deserts', 'deserts', 'Golden dunes and dramatic desert skies.', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=900&fit=crop', 'sun', 19, 260, true),
  ('Paintings', 'paintings', 'Timeless art and expressive brushwork.', 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&h=900&fit=crop', 'palette', 18, 270, true),
  ('Winter', 'winter', 'Snowy forests and quiet winter evenings.', 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&h=900&fit=crop', 'snowflake', 17, 280, true),
  ('Motorcycles', 'motorcycles', 'Classic bikes and open-road adventures.', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=900&fit=crop', 'bike', 16, 290, true),
  ('Desserts', 'desserts', 'Cakes, pastries, and colorful sweet treats.', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=900&fit=crop', 'cake-slice', 15, 300, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  icon = EXCLUDED.icon,
  puzzle_count = EXCLUDED.puzzle_count,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = now();

COMMIT;
