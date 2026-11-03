import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'Daily Jigsaw Puzzle Archive – Past Challenges',
  'Browse past daily jigsaw puzzles in the JigsawWorld archive. Search previous challenges, explore puzzles by month, and pick a favorite to play again.',
  '/daily/archive'
)

export default function DailyArchiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
