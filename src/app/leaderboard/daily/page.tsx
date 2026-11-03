import { LeaderboardView } from '../page'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'Daily Jigsaw Puzzle Leaderboard',
  'See today’s top jigsaw puzzle solvers on JigsawWorld. Compare pieces completed, puzzles finished, and total solving time in the daily player rankings.',
  '/leaderboard/daily'
)

export default function DailyLeaderboardPage() {
  return <LeaderboardView period="daily" />
}
