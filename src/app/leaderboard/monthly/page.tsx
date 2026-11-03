import { LeaderboardView } from '../page'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'Monthly Jigsaw Puzzle Leaderboard',
  'Explore this month’s top jigsaw puzzle solvers on JigsawWorld. Compare monthly piece totals, completed puzzles, and solving times to see who leads.',
  '/leaderboard/monthly'
)

export default function MonthlyLeaderboardPage() {
  return <LeaderboardView period="monthly" />
}
