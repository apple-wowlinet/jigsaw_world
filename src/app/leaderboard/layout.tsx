import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'All-Time Jigsaw Puzzle Leaderboard',
  'See JigsawWorld’s all-time top puzzle solvers, ranked by pieces completed. Compare completed puzzles and total solving time across all recorded results.',
  '/leaderboard'
)

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
