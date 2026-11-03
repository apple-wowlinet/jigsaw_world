import { ExplorePage } from '@/components/explore/ExplorePage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'This Week’s Most Popular Jigsaw Puzzles',
  'Discover the most-played jigsaw puzzles from the last 7 days on JigsawWorld. Filter by category, difficulty, or piece count and play your next puzzle free.',
  '/explore/weekly'
)

export default function WeeklyExplorePage() {
  return <ExplorePage mode="weekly" />
}
