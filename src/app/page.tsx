import { connection } from 'next/server'
import { getDailyPuzzle, getHomePuzzles, getCategories } from '@/lib/data/server'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { RecommendationsSection } from '@/components/home/RecommendationsSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { DEFAULT_SOCIAL_IMAGE, HOME_DESCRIPTION, HOME_TITLE } from '@/lib/seo'

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: 'A scenic nature jigsaw puzzle on JigsawWorld',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default async function HomePage() {
  // Read the UTC date per request, even across a cached catalogue's midnight.
  await connection()
  const [dailyPuzzle, puzzles, categories] = await Promise.all([
    getDailyPuzzle(new Date().toISOString().slice(0, 10)), getHomePuzzles(), getCategories(),
  ])
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <HeroSection dailyPuzzle={dailyPuzzle} />
      <RecommendationsSection puzzles={puzzles} />
      <CategoriesSection categories={categories.slice(0, 6)} />
    </div>
  )
}
