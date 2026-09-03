import type { Metadata } from 'next'
import { ThemesBrowser } from '@/components/themes/ThemesBrowser'

export const metadata: Metadata = {
  title: 'Puzzle Themes | JigsawWorld',
  description:
    'Browse curated jigsaw puzzle themes, from flowers and cats to sunsets, castles, and seasonal collections.',
}

export default function ThemesPage() {
  return <ThemesBrowser />
}
