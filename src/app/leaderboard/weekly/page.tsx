import { LeaderboardView } from '../page'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'Weekly Jigsaw Puzzle Leaderboard',
  'Follow this week’s leading jigsaw puzzle players on JigsawWorld. View weekly rankings by pieces completed, with puzzle totals and solving times.',
  '/leaderboard/weekly'
)

export default function WeeklyLeaderboardPage() {
  return <LeaderboardView period="weekly" />
}
