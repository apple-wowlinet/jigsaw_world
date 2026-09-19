import type { MetadataRoute } from 'next'
import { fetchCategories, fetchPuzzles, fetchThemes } from '@/lib/data/public'
import { mergeCategoryCatalogue } from '@/lib/data/category-catalogue'
import { mergeThemeCatalogue } from '@/lib/data/theme-catalogue'
import { absoluteUrl } from '@/lib/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [remoteCategories, remoteThemes, puzzles] = await Promise.all([
    fetchCategories(),
    fetchThemes(),
    fetchPuzzles({ orderBy: 'recent' }),
  ])

  const staticPaths = [
    '/',
    '/categories',
    '/themes',
    '/daily',
    '/daily/archive',
    '/explore',
    '/explore/trending',
    '/explore/weekly',
    '/explore/all-time',
    '/leaderboard',
    '/leaderboard/daily',
    '/leaderboard/weekly',
    '/leaderboard/monthly',
    '/help',
    '/contact',
    '/privacy',
    '/terms',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
  }))

  const catalogueCategories = mergeCategoryCatalogue(remoteCategories)
  const catalogueSlugs = new Set(catalogueCategories.map((category) => category.slug))
  const categories = [
    ...catalogueCategories,
    ...remoteCategories.filter((category) => !catalogueSlugs.has(category.slug)),
  ]

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/category/${encodeURIComponent(category.slug)}`),
    lastModified: category.updated_at ? new Date(category.updated_at) : undefined,
  }))

  const themeEntries: MetadataRoute.Sitemap = mergeThemeCatalogue(remoteThemes).map(
    (theme) => ({
      url: absoluteUrl(`/theme/${encodeURIComponent(theme.slug)}`),
      lastModified: theme.updated_at ? new Date(theme.updated_at) : undefined,
    })
  )

  const puzzleEntries: MetadataRoute.Sitemap = puzzles.map((puzzle) => ({
    url: absoluteUrl(`/puzzle/${encodeURIComponent(puzzle.slug)}`),
    lastModified: new Date(puzzle.updated_at),
    images: [puzzle.image_url],
  }))

  return [...staticEntries, ...categoryEntries, ...themeEntries, ...puzzleEntries]
}
