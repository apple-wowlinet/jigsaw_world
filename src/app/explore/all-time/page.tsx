import { ExplorePage } from '@/components/explore/ExplorePage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'All-Time Most Popular Jigsaw Puzzles',
  'Explore JigsawWorld’s most-played jigsaw puzzles of all time. Browse enduring favorites by category, choose your difficulty, and start solving for free.',
  '/explore/all-time'
)

export default function AllTimeExplorePage() {
  return <ExplorePage mode="all-time" />
}
