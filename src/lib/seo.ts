export const SITE_NAME = 'JigsawWorld'

export const HOME_TITLE = 'Free Online Jigsaw Puzzles | JigsawWorld'
export const HOME_DESCRIPTION =
  'Play free online jigsaw puzzles featuring beautiful art, nature, animals, travel, and more. Discover daily challenges and puzzles for every skill level.'

export const DEFAULT_SOCIAL_IMAGE =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop'

function normalizeSiteUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`
  return withProtocol.replace(/\/+$/, '')
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL

  return normalizeSiteUrl(configuredUrl || 'http://localhost:3000')
}

export function absoluteUrl(path = '/') {
  return new URL(path, `${getSiteUrl()}/`).toString()
}

export function toMetaDescription(value: string, fallback: string) {
  const normalized = (value || fallback).replace(/\s+/g, ' ').trim()
  if (normalized.length <= 160) return normalized

  const shortened = normalized.slice(0, 157)
  const lastSpace = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, lastSpace > 120 ? lastSpace : 157).trimEnd()}…`
}

export function categoryDescription(name: string, description: string) {
  return toMetaDescription(
    `Play ${name.toLowerCase()} jigsaw puzzles online for free. ${description} Choose a puzzle and start assembling on any device.`,
    `Play free ${name.toLowerCase()} jigsaw puzzles online on JigsawWorld.`
  )
}

export function themeDescription(name: string, description: string) {
  return toMetaDescription(
    `Explore ${name.toLowerCase()} jigsaw puzzles online. ${description} Pick a free puzzle and play at your own pace.`,
    `Explore free ${name.toLowerCase()} jigsaw puzzles online on JigsawWorld.`
  )
}

export function puzzleDescription({
  title,
  description,
  pieceCount,
  difficulty,
}: {
  title: string
  description: string
  pieceCount: number
  difficulty: string
}) {
  const summary = description.trim() || `Assemble the ${title} jigsaw puzzle online.`
  return toMetaDescription(
    `${summary} Play this ${pieceCount}-piece ${difficulty.toLowerCase()} jigsaw puzzle online for free.`,
    `Play the ${title} jigsaw puzzle online for free on JigsawWorld.`
  )
}
