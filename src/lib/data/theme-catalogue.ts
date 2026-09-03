export interface PublicTheme {
  id: string
  name: string
  slug: string
  description: string
  emoji: string
  image_url: string
  puzzle_count: number
  sort_order: number
  is_featured: boolean
  fallback_category_slugs: string[]
  fallback_search: string
}

export const themeCatalogue: PublicTheme[] = [
  {
    id: 'flowers',
    name: 'Flowers',
    slug: 'flowers',
    description: 'Colorful blooms, botanical details, and peaceful gardens.',
    emoji: '🌸',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&h=700&fit=crop',
    puzzle_count: 42,
    sort_order: 10,
    is_featured: true,
    fallback_category_slugs: ['flowers', 'gardens'],
    fallback_search: 'flower',
  },
  {
    id: 'cats',
    name: 'Cats',
    slug: 'cats',
    description: 'Playful kittens, cozy companions, and curious cat portraits.',
    emoji: '🐱',
    image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900&h=700&fit=crop',
    puzzle_count: 32,
    sort_order: 20,
    is_featured: true,
    fallback_category_slugs: ['cats'],
    fallback_search: 'cat',
  },
  {
    id: 'castles',
    name: 'Castles',
    slug: 'castles',
    description: 'Storybook towers, ancient fortresses, and magical kingdoms.',
    emoji: '🏰',
    image_url: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=900&h=700&fit=crop',
    puzzle_count: 28,
    sort_order: 30,
    is_featured: true,
    fallback_category_slugs: ['fantasy', 'architecture'],
    fallback_search: 'castle',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    slug: 'sunset',
    description: 'Golden horizons and glowing skies at the close of day.',
    emoji: '🌅',
    image_url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&h=700&fit=crop',
    puzzle_count: 38,
    sort_order: 40,
    is_featured: true,
    fallback_category_slugs: ['nature', 'ocean'],
    fallback_search: 'sunset',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    slug: 'christmas',
    description: 'Festive lights, snowy evenings, and warm holiday scenes.',
    emoji: '🎄',
    image_url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=900&h=700&fit=crop',
    puzzle_count: 21,
    sort_order: 50,
    is_featured: true,
    fallback_category_slugs: ['christmas', 'winter'],
    fallback_search: 'christmas',
  },
  {
    id: 'autumn',
    name: 'Autumn',
    slug: 'autumn',
    description: 'Copper leaves, misty paths, and the warmth of fall.',
    emoji: '🍂',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&h=700&fit=crop',
    puzzle_count: 26,
    sort_order: 60,
    is_featured: true,
    fallback_category_slugs: ['nature'],
    fallback_search: 'autumn',
  },
  {
    id: 'trains',
    name: 'Trains',
    slug: 'trains',
    description: 'Classic railways, scenic journeys, and powerful locomotives.',
    emoji: '🚂',
    image_url: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900&h=700&fit=crop',
    puzzle_count: 24,
    sort_order: 70,
    is_featured: true,
    fallback_category_slugs: ['trains'],
    fallback_search: 'train',
  },
  {
    id: 'beaches',
    name: 'Beaches',
    slug: 'beaches',
    description: 'Sunlit shores, turquoise water, and quiet island escapes.',
    emoji: '🏖️',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=700&fit=crop',
    puzzle_count: 34,
    sort_order: 80,
    is_featured: true,
    fallback_category_slugs: ['beaches', 'ocean'],
    fallback_search: 'beach',
  },
  {
    id: 'gardens',
    name: 'Gardens',
    slug: 'gardens',
    description: 'Hidden paths, tranquil ponds, and carefully tended greenery.',
    emoji: '🌿',
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&h=700&fit=crop',
    puzzle_count: 20,
    sort_order: 90,
    is_featured: false,
    fallback_category_slugs: ['gardens', 'flowers'],
    fallback_search: 'garden',
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    slug: 'wildlife',
    description: 'Remarkable animals photographed in their natural habitats.',
    emoji: '🦊',
    image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=900&h=700&fit=crop',
    puzzle_count: 30,
    sort_order: 100,
    is_featured: false,
    fallback_category_slugs: ['wildlife', 'animals'],
    fallback_search: 'wild',
  },
  {
    id: 'city-lights',
    name: 'City Lights',
    slug: 'city-lights',
    description: 'Glowing skylines, lively streets, and cities after dark.',
    emoji: '🌃',
    image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=700&fit=crop',
    puzzle_count: 31,
    sort_order: 110,
    is_featured: false,
    fallback_category_slugs: ['cities'],
    fallback_search: 'city',
  },
  {
    id: 'space',
    name: 'Space',
    slug: 'space',
    description: 'Distant galaxies, starry skies, and cosmic wonders.',
    emoji: '🪐',
    image_url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&h=700&fit=crop',
    puzzle_count: 25,
    sort_order: 120,
    is_featured: false,
    fallback_category_slugs: ['space', 'fantasy'],
    fallback_search: 'star',
  },
]

export function mergeThemeCatalogue(remoteThemes: PublicTheme[]): PublicTheme[] {
  const remoteBySlug = new Map(remoteThemes.map((theme) => [theme.slug, theme]))
  const catalogueSlugs = new Set(themeCatalogue.map((theme) => theme.slug))

  return [
    ...themeCatalogue.map((theme) => {
      const remote = remoteBySlug.get(theme.slug)
      return remote
        ? {
            ...theme,
            ...remote,
            fallback_category_slugs: theme.fallback_category_slugs,
            fallback_search: theme.fallback_search,
          }
        : theme
    }),
    ...remoteThemes.filter((theme) => !catalogueSlugs.has(theme.slug)),
  ].sort((a, b) => a.sort_order - b.sort_order)
}
