import { supabase } from '@/lib/supabase'
import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'

interface UserStatsRow {
  user_id: string
  total_xp: number | null
  total_completions: number | null
}

const avatarPool = ['🏆', '🥈', '🥉', '🧩', '⚡', '🌟', '🎯', '💎', '🔍', '🪄']

export async function fetchLeaderboard(
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  const limit = period === 'all' ? 50 : 20
  const { data, error } = await supabase
    .from('user_stats')
    .select('user_id, total_xp, total_completions')
    .order('total_xp', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch leaderboard:', error.message)
    return []
  }

  return ((data ?? []) as UserStatsRow[]).map((entry, index) => ({
    rank: index + 1,
    userId: entry.user_id,
    username: `Player ${entry.user_id.slice(0, 8)}`,
    avatar: avatarPool[index] ?? '🧩',
    score: period === 'all'
      ? entry.total_xp ?? 0
      : Math.max(entry.total_xp ?? 0, (entry.total_completions ?? 0) * 100),
  }))
}
