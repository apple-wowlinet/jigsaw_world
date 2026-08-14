import type { PublicCategory } from '@/lib/data/public'

export type CategoryGroup =
  | 'Nature'
  | 'Animals'
  | 'Places'
  | 'Art'
  | 'Food'
  | 'Fantasy'
  | 'Seasonal'
  | 'Vehicles'

export interface CatalogueCategory extends PublicCategory {
  group: CategoryGroup
  popular: boolean
}

export const categoryGroups: CategoryGroup[] = [
  'Nature',
  'Animals',
  'Places',
  'Art',
  'Food',
  'Fantasy',
  'Seasonal',
  'Vehicles',
]

const catalogue: CatalogueCategory[] = [
  { id: 'nature', name: 'Nature', slug: 'nature', description: 'Forests, mountains, flowers, and peaceful landscapes.', image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=900&fit=crop', icon: 'trees', color: '#16a34a', dark_color: '#14532d', puzzle_count: 128, group: 'Nature', popular: true },
  { id: 'animals', name: 'Animals', slug: 'animals', description: 'Wildlife, pets, birds, and beautiful animal portraits.', image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&h=900&fit=crop', icon: 'paw-print', color: '#f97316', dark_color: '#7c2d12', puzzle_count: 96, group: 'Animals', popular: true },
  { id: 'travel', name: 'Travel', slug: 'travel', description: 'Scenic destinations and unforgettable journeys.', image_url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=900&fit=crop', icon: 'plane', color: '#14b8a6', dark_color: '#134e4a', puzzle_count: 86, group: 'Places', popular: true },
  { id: 'food', name: 'Food', slug: 'food', description: 'Colorful desserts, fruits, drinks, and cozy meals.', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=900&fit=crop', icon: 'utensils', color: '#eab308', dark_color: '#713f12', puzzle_count: 74, group: 'Food', popular: true },
  { id: 'cities', name: 'Cities', slug: 'cities', description: 'Skylines, streets, landmarks, and city lights.', image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=900&fit=crop', icon: 'building-2', color: '#6366f1', dark_color: '#312e81', puzzle_count: 64, group: 'Places', popular: true },
  { id: 'ocean', name: 'Ocean', slug: 'ocean', description: 'Rolling waves, blue water, and underwater worlds.', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop', icon: 'waves', color: '#0284c7', dark_color: '#0c4a6e', puzzle_count: 58, group: 'Nature', popular: true },
  { id: 'fantasy', name: 'Fantasy', slug: 'fantasy', description: 'Dreamlike castles, magic, and imaginative worlds.', image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=900&fit=crop', icon: 'sparkles', color: '#a855f7', dark_color: '#581c87', puzzle_count: 52, group: 'Fantasy', popular: true },
  { id: 'art', name: 'Art', slug: 'art', description: 'Paintings, patterns, colors, and creative expression.', image_url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=900&fit=crop', icon: 'palette', color: '#ec4899', dark_color: '#831843', puzzle_count: 48, group: 'Art', popular: true },

  { id: 'flowers', name: 'Flowers', slug: 'flowers', description: 'Colorful blooms and peaceful gardens.', image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=900&fit=crop', icon: 'flower-2', color: '#ec4899', dark_color: '#831843', puzzle_count: 42, group: 'Nature', popular: false },
  { id: 'mountains', name: 'Mountains', slug: 'mountains', description: 'Majestic peaks, valleys, and alpine lakes.', image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop', icon: 'mountain', color: '#64748b', dark_color: '#334155', puzzle_count: 38, group: 'Nature', popular: false },
  { id: 'birds', name: 'Birds', slug: 'birds', description: 'Bright feathers and birds in the wild.', image_url: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=1200&h=900&fit=crop', icon: 'bird', color: '#0f766e', dark_color: '#134e4a', puzzle_count: 36, group: 'Animals', popular: false },
  { id: 'beaches', name: 'Beaches', slug: 'beaches', description: 'Sunny shores, palm trees, and clear water.', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop', icon: 'palmtree', color: '#0891b2', dark_color: '#164e63', puzzle_count: 34, group: 'Places', popular: false },
  { id: 'cats', name: 'Cats', slug: 'cats', description: 'Playful kittens and charming cat portraits.', image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1200&h=900&fit=crop', icon: 'cat', color: '#d97706', dark_color: '#78350f', puzzle_count: 32, group: 'Animals', popular: false },
  { id: 'dogs', name: 'Dogs', slug: 'dogs', description: 'Friendly dogs of every shape and size.', image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=900&fit=crop', icon: 'dog', color: '#ca8a04', dark_color: '#713f12', puzzle_count: 31, group: 'Animals', popular: false },
  { id: 'wildlife', name: 'Wildlife', slug: 'wildlife', description: 'Animals in their beautiful natural habitats.', image_url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1200&h=900&fit=crop', icon: 'binoculars', color: '#78716c', dark_color: '#44403c', puzzle_count: 30, group: 'Animals', popular: false },
  { id: 'architecture', name: 'Architecture', slug: 'architecture', description: 'Remarkable buildings from around the world.', image_url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1200&h=900&fit=crop', icon: 'landmark', color: '#475569', dark_color: '#1e293b', puzzle_count: 28, group: 'Places', popular: false },
  { id: 'landmarks', name: 'Landmarks', slug: 'landmarks', description: 'Iconic places and monuments to discover.', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=900&fit=crop', icon: 'map-pin', color: '#be123c', dark_color: '#881337', puzzle_count: 27, group: 'Places', popular: false },
  { id: 'europe', name: 'Europe', slug: 'europe', description: 'Historic towns and scenic European coasts.', image_url: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1200&h=900&fit=crop', icon: 'globe-2', color: '#ea580c', dark_color: '#7c2d12', puzzle_count: 26, group: 'Places', popular: false },
  { id: 'space', name: 'Space', slug: 'space', description: 'Planets, galaxies, and the wonders beyond.', image_url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=900&fit=crop', icon: 'orbit', color: '#4338ca', dark_color: '#312e81', puzzle_count: 25, group: 'Fantasy', popular: false },
  { id: 'trains', name: 'Trains', slug: 'trains', description: 'Classic railways and powerful locomotives.', image_url: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=1200&h=900&fit=crop', icon: 'train-front', color: '#57534e', dark_color: '#292524', puzzle_count: 24, group: 'Vehicles', popular: false },
  { id: 'cars', name: 'Cars', slug: 'cars', description: 'Vintage icons and modern road machines.', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&h=900&fit=crop', icon: 'car-front', color: '#dc2626', dark_color: '#7f1d1d', puzzle_count: 23, group: 'Vehicles', popular: false },
  { id: 'anime', name: 'Anime', slug: 'anime', description: 'Dreamy illustrations and animated worlds.', image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=900&fit=crop', icon: 'sparkles', color: '#db2777', dark_color: '#831843', puzzle_count: 22, group: 'Art', popular: false },
  { id: 'christmas', name: 'Christmas', slug: 'christmas', description: 'Warm lights, snow, and festive scenes.', image_url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1200&h=900&fit=crop', icon: 'snowflake', color: '#b91c1c', dark_color: '#7f1d1d', puzzle_count: 21, group: 'Seasonal', popular: false },

  { id: 'gardens', name: 'Gardens', slug: 'gardens', description: 'Peaceful paths through beautiful gardens.', image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=900&fit=crop', icon: 'flower-2', color: '#65a30d', dark_color: '#365314', puzzle_count: 20, group: 'Nature', popular: false },
  { id: 'deserts', name: 'Deserts', slug: 'deserts', description: 'Golden dunes and dramatic desert skies.', image_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=900&fit=crop', icon: 'sun', color: '#d97706', dark_color: '#78350f', puzzle_count: 19, group: 'Nature', popular: false },
  { id: 'paintings', name: 'Paintings', slug: 'paintings', description: 'Timeless art and expressive brushwork.', image_url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&h=900&fit=crop', icon: 'palette', color: '#7c3aed', dark_color: '#4c1d95', puzzle_count: 18, group: 'Art', popular: false },
  { id: 'winter', name: 'Winter', slug: 'winter', description: 'Snowy forests and quiet winter evenings.', image_url: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&h=900&fit=crop', icon: 'snowflake', color: '#0284c7', dark_color: '#0c4a6e', puzzle_count: 17, group: 'Seasonal', popular: false },
  { id: 'motorcycles', name: 'Motorcycles', slug: 'motorcycles', description: 'Classic bikes and open-road adventures.', image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=900&fit=crop', icon: 'bike', color: '#334155', dark_color: '#0f172a', puzzle_count: 16, group: 'Vehicles', popular: false },
  { id: 'desserts', name: 'Desserts', slug: 'desserts', description: 'Cakes, pastries, and colorful sweet treats.', image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=900&fit=crop', icon: 'cake-slice', color: '#e11d48', dark_color: '#881337', puzzle_count: 15, group: 'Food', popular: false },
]

export function mergeCategoryCatalogue(remoteCategories: PublicCategory[]): CatalogueCategory[] {
  const remoteBySlug = new Map(remoteCategories.map((category) => [category.slug, category]))

  return catalogue.map((category) => {
    const remote = remoteBySlug.get(category.slug)
    return remote ? { ...category, ...remote, group: category.group, popular: category.popular } : category
  })
}
