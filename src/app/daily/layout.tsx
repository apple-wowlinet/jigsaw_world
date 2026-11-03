import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'Daily Jigsaw Puzzle – Today’s Free Challenge',
  'Play today’s free daily jigsaw puzzle on JigsawWorld. Complete the challenge, track your streak, and revisit previous puzzles for more daily fun.',
  '/daily'
)

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return children
}
