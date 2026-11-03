import { ExplorePage } from '@/components/explore/ExplorePage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'Trending Jigsaw Puzzles – Discover Your Next Challenge',
  'Find trending jigsaw puzzles and editor picks on JigsawWorld. Explore scenes across popular categories and choose a free puzzle for your next challenge.',
  '/explore/trending'
)

export default function TrendingExplorePage() {
  return <ExplorePage mode="trending" />
}
