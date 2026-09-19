import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Jigsaw Puzzles',
  description: 'Search the JigsawWorld catalogue for free online jigsaw puzzles.',
  robots: { index: false, follow: true },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
