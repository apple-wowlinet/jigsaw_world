import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'

/**
 * Fetches leaderboard entries for a given period.
 *
 * Currently returns mock data with an 800ms delay (matches the site-wide
 * mock-data convention). The function signature is async and shaped for a
 * future swap to a Supabase query against user_stats.total_xp — only this
 * file changes when real data is wired in.
 *
 * Future real query (NOT implemented now):
 *   const { data } = await supabase
 *     .from('user_stats')
 *     .select('user_id, total_xp, ...')
 *     .order('total_xp', { ascending: false })
 *     .limit(50)
 */
export async function fetchLeaderboard(
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  const data = mockLeaderboards[period]
  await delay(800)
  return data
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockLeaderboards: Record<LeaderboardPeriod, LeaderboardEntry[]> = {
  daily: [
    { rank: 1, userId: 'u5', username: 'PieceWizard', avatar: '🧙', score: 4380 },
    { rank: 2, userId: 'u9', username: 'PuzzleQueen', avatar: '👑', score: 4120 },
    { rank: 3, userId: 'u1', username: 'PuzzleMaster', avatar: '🏆', score: 3980 },
    { rank: 4, userId: 'u11', username: 'EdgeWizard', avatar: '🪄', score: 3560 },
    { rank: 5, userId: 'u3', username: 'PixelNinja', avatar: '💎', score: 3320 },
    { rank: 6, userId: 'u8', username: 'SnapDragon', avatar: '🐉', score: 3090 },
    { rank: 7, userId: 'u7', username: 'TileTamer', avatar: '🎨', score: 2860 },
    { rank: 8, userId: 'u6', username: 'MosaicMind', avatar: '🌟', score: 2510 },
    { rank: 9, userId: 'u2', username: 'SpeedSolver', avatar: '⚡', score: 2240 },
    { rank: 10, userId: 'u10', username: 'FrameFinder', avatar: '🔍', score: 1980 },
    { rank: 11, userId: 'u12', username: 'CornerKing', avatar: '🏰', score: 1760 },
    { rank: 12, userId: 'u4', username: 'JigsawPro', avatar: '🧩', score: 1540 },
  ],
  all: [
    { rank: 1, userId: 'u1', username: 'PuzzleMaster', avatar: '🏆', score: 48200 },
    { rank: 2, userId: 'u2', username: 'SpeedSolver', avatar: '🥈', score: 41500 },
    { rank: 3, userId: 'u3', username: 'PixelNinja', avatar: '🥉', score: 38900 },
    { rank: 4, userId: 'u4', username: 'JigsawPro', avatar: '🧩', score: 34200 },
    { rank: 5, userId: 'u5', username: 'PieceHunter', avatar: '🎯', score: 31800 },
    { rank: 6, userId: 'u6', username: 'MosaicMind', avatar: '🌟', score: 29500 },
    { rank: 7, userId: 'u7', username: 'TileTamer', avatar: '🎨', score: 27100 },
    { rank: 8, userId: 'u8', username: 'SnapDragon', avatar: '⚡', score: 25400 },
    { rank: 9, userId: 'u9', username: 'QuiltQueen', avatar: '💎', score: 23800 },
    { rank: 10, userId: 'u10', username: 'FrameFinder', avatar: '🔍', score: 22100 },
    { rank: 11, userId: 'u11', username: 'EdgeWizard', avatar: '🪄', score: 20500 },
    { rank: 12, userId: 'u12', username: 'CornerKing', avatar: '🏰', score: 18900 },
  ],
  monthly: [
    { rank: 1, userId: 'u3', username: 'PixelNinja', avatar: '🏆', score: 12400 },
    { rank: 2, userId: 'u7', username: 'TileTamer', avatar: '🥈', score: 10800 },
    { rank: 3, userId: 'u1', username: 'PuzzleMaster', avatar: '🥉', score: 9600 },
    { rank: 4, userId: 'u9', username: 'QuiltQueen', avatar: '💎', score: 8200 },
    { rank: 5, userId: 'u5', username: 'PieceHunter', avatar: '🎯', score: 7500 },
    { rank: 6, userId: 'u11', username: 'EdgeWizard', avatar: '🪄', score: 6900 },
    { rank: 7, userId: 'u2', username: 'SpeedSolver', avatar: '⚡', score: 6400 },
    { rank: 8, userId: 'u8', username: 'SnapDragon', avatar: '🐉', score: 5800 },
    { rank: 9, userId: 'u4', username: 'JigsawPro', avatar: '🧩', score: 5200 },
    { rank: 10, userId: 'u12', username: 'CornerKing', avatar: '🏰', score: 4700 },
    { rank: 11, userId: 'u6', username: 'MosaicMind', avatar: '🌟', score: 4300 },
    { rank: 12, userId: 'u10', username: 'FrameFinder', avatar: '🔍', score: 3900 },
  ],
  weekly: [
    { rank: 1, userId: 'u9', username: 'QuiltQueen', avatar: '🏆', score: 3200 },
    { rank: 2, userId: 'u11', username: 'EdgeWizard', avatar: '🥈', score: 2900 },
    { rank: 3, userId: 'u5', username: 'PieceHunter', avatar: '🥉', score: 2600 },
    { rank: 4, userId: 'u7', username: 'TileTamer', avatar: '🎨', score: 2300 },
    { rank: 5, userId: 'u3', username: 'PixelNinja', avatar: '💎', score: 2100 },
    { rank: 6, userId: 'u8', username: 'SnapDragon', avatar: '🐉', score: 1900 },
    { rank: 7, userId: 'u12', username: 'CornerKing', avatar: '🏰', score: 1700 },
    { rank: 8, userId: 'u1', username: 'PuzzleMaster', avatar: '🧩', score: 1500 },
    { rank: 9, userId: 'u6', username: 'MosaicMind', avatar: '🌟', score: 1300 },
    { rank: 10, userId: 'u2', username: 'SpeedSolver', avatar: '⚡', score: 1100 },
    { rank: 11, userId: 'u10', username: 'FrameFinder', avatar: '🔍', score: 950 },
    { rank: 12, userId: 'u4', username: 'JigsawPro', avatar: '🪄', score: 800 },
  ],
}
