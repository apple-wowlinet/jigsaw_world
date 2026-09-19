import type { Metadata } from 'next'
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo'

const title = 'Browse Jigsaw Puzzle Categories'
const description =
  'Browse free online jigsaw puzzles by category, including nature, animals, travel, art, food, cities, fantasy, and seasonal collections.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/categories' },
  openGraph: {
    title: `${title} | JigsawWorld`,
    description,
    url: '/categories',
    type: 'website',
    images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | JigsawWorld`,
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children
}
