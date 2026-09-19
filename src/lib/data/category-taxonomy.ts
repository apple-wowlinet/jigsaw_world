import type { PublicCategory } from '@/lib/data/public'

export interface CategoryTaxonomyNode {
  slug: string
  name: string
  parentSlug?: string
  description: string
  icon: string
  color: string
}

/**
 * Curated fallbacks keep category navigation useful before editors create the
 * same hierarchy in Supabase. Remote categories override these relationships.
 * The third-level entries intentionally exercise the same recursive helpers
 * used by second-level categories.
 */
const curatedTaxonomy: CategoryTaxonomyNode[] = [
  {
    slug: 'nature',
    name: 'Nature',
    description: 'Forests, mountains, flowers and peaceful landscapes.',
    icon: 'trees',
    color: '#4b925f',
  },
  {
    slug: 'forests',
    name: 'Forests',
    parentSlug: 'nature',
    description: 'Woodland trails, towering trees and green canopies.',
    icon: 'trees',
    color: '#4b925f',
  },
  {
    slug: 'mountains',
    name: 'Mountains',
    parentSlug: 'nature',
    description: 'Majestic peaks, valleys and sweeping alpine views.',
    icon: 'mountain',
    color: '#4b925f',
  },
  {
    slug: 'flowers',
    name: 'Flowers',
    parentSlug: 'nature',
    description: 'Colorful blooms and peaceful flower gardens.',
    icon: 'flower-2',
    color: '#4b925f',
  },
  {
    slug: 'lakes',
    name: 'Lakes',
    parentSlug: 'nature',
    description: 'Calm water, reflections and beautiful lakeside scenery.',
    icon: 'waves',
    color: '#4b925f',
  },
  {
    slug: 'waterfalls',
    name: 'Waterfalls',
    parentSlug: 'nature',
    description: 'Cascading water surrounded by lush natural scenery.',
    icon: 'waves',
    color: '#4b925f',
  },
  {
    slug: 'beaches',
    name: 'Beaches',
    parentSlug: 'nature',
    description: 'Sunny shores, clear water and peaceful coastlines.',
    icon: 'waves',
    color: '#4b925f',
  },
  {
    slug: 'countryside',
    name: 'Countryside',
    parentSlug: 'nature',
    description: 'Open fields, farms and quiet rural landscapes.',
    icon: 'trees',
    color: '#4b925f',
  },
  {
    slug: 'gardens',
    name: 'Gardens',
    parentSlug: 'nature',
    description: 'Peaceful paths through beautifully planted gardens.',
    icon: 'flower-2',
    color: '#4b925f',
  },
  {
    slug: 'deserts',
    name: 'Deserts',
    parentSlug: 'nature',
    description: 'Golden dunes and dramatic desert skies.',
    icon: 'sun',
    color: '#4b925f',
  },
  {
    slug: 'pine-forests',
    name: 'Pine Forests',
    parentSlug: 'forests',
    description: 'Evergreen trails and peaceful pine woodland.',
    icon: 'trees',
    color: '#4b925f',
  },
  {
    slug: 'rainforests',
    name: 'Rainforests',
    parentSlug: 'forests',
    description: 'Dense tropical greenery and misty jungle paths.',
    icon: 'trees',
    color: '#4b925f',
  },
  {
    slug: 'alpine-lakes',
    name: 'Alpine Lakes',
    parentSlug: 'lakes',
    description: 'Mountain lakes with clear water and mirrored peaks.',
    icon: 'waves',
    color: '#4b925f',
  },
]

function toTaxonomyNode(category: PublicCategory): CategoryTaxonomyNode {
  return {
    slug: category.slug,
    name: category.name,
    parentSlug: category.parent_slug ?? undefined,
    description: category.description,
    icon: category.icon,
    color: category.color,
  }
}

export function buildCategoryTaxonomy(categories: PublicCategory[]) {
  const nodes = new Map(curatedTaxonomy.map((node) => [node.slug, node]))

  categories.forEach((category) => {
    const curated = nodes.get(category.slug)
    const remote = toTaxonomyNode(category)
    nodes.set(category.slug, {
      ...curated,
      ...remote,
      parentSlug: remote.parentSlug ?? curated?.parentSlug,
    })
  })

  return [...nodes.values()]
}

export function getCategoryAncestors(
  category: CategoryTaxonomyNode,
  taxonomy: CategoryTaxonomyNode[]
) {
  const bySlug = new Map(taxonomy.map((node) => [node.slug, node]))
  const ancestors: CategoryTaxonomyNode[] = []
  const visited = new Set([category.slug])
  let parentSlug = category.parentSlug

  while (parentSlug && !visited.has(parentSlug)) {
    const parent = bySlug.get(parentSlug)
    if (!parent) break
    ancestors.unshift(parent)
    visited.add(parent.slug)
    parentSlug = parent.parentSlug
  }

  return ancestors
}

export function getCategoryChildren(
  slug: string,
  taxonomy: CategoryTaxonomyNode[]
) {
  return taxonomy.filter((node) => node.parentSlug === slug)
}

export function getCategoryDescendants(
  slug: string,
  taxonomy: CategoryTaxonomyNode[]
) {
  const descendants: CategoryTaxonomyNode[] = []
  const queue = [...getCategoryChildren(slug, taxonomy)]
  const visited = new Set([slug])

  while (queue.length) {
    const node = queue.shift()
    if (!node || visited.has(node.slug)) continue
    visited.add(node.slug)
    descendants.push(node)
    queue.push(...getCategoryChildren(node.slug, taxonomy))
  }

  return descendants
}
