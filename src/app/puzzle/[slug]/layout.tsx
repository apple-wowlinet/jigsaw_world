import type { Metadata } from 'next'
import { fetchPuzzleBySlug } from '@/lib/data/public'
import { puzzleDescription } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const puzzle = await fetchPuzzleBySlug(slug)

  if (!puzzle) {
    return {
      title: 'Puzzle Not Found',
      robots: { index: false, follow: false },
    }
  }

  const canonical = `/puzzle/${encodeURIComponent(puzzle.slug)}`
  const title = `${puzzle.title} Jigsaw Puzzle`
  const description = puzzleDescription({
    title: puzzle.title,
    description: puzzle.description,
    pieceCount: puzzle.piece_count,
    difficulty: puzzle.difficulty,
  })

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | JigsawWorld`,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: puzzle.image_url, alt: `${puzzle.title} jigsaw puzzle` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | JigsawWorld`,
      description,
      images: [puzzle.image_url],
    },
  }
}

export default function PuzzleLayout({ children }: { children: React.ReactNode }) {
  return children
}
