import type { Metadata } from 'next'
import { ThemesBrowser } from '@/components/themes/ThemesBrowser'
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Browse Jigsaw Puzzle Themes',
  description:
    'Browse curated jigsaw puzzle themes, from flowers and cats to sunsets, castles, and seasonal collections.',
  alternates: { canonical: '/themes' },
  openGraph: {
    title: 'Browse Jigsaw Puzzle Themes | JigsawWorld',
    description:
      'Browse curated jigsaw puzzle themes, from flowers and cats to sunsets, castles, and seasonal collections.',
    url: '/themes',
    type: 'website',
    images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Jigsaw Puzzle Themes | JigsawWorld',
    description:
      'Browse curated jigsaw puzzle themes, from flowers and cats to sunsets, castles, and seasonal collections.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function ThemesPage() {
  return <ThemesBrowser />
}
