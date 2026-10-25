import { supabase } from '@/lib/supabase'
import type { LeaderboardEntry, LeaderboardPeriod, LeaderboardResult } from '@/lib/types'

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

function isEntry(value: unknown): value is LeaderboardEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return isCount(entry.rank) && entry.rank > 0
    && typeof entry.userId === 'string'
    && typeof entry.username === 'string'
    && (entry.avatarUrl === null || typeof entry.avatarUrl === 'string')
    && isCount(entry.totalPieces)
    && isCount(entry.completedPuzzles)
    && isCount(entry.totalTimeSeconds)
}

export async function fetchLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardResult> {
  const { data, error } = await supabase.rpc('get_global_leaderboard', {
    p_period: period,
    p_limit: 50,
  })
  if (error) throw error

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid leaderboard response.')
  }
  const result = data as Record<string, unknown>
  const isDate = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value))
  if (result.period !== period
    || !isCount(result.totalPlayers)
    || !Array.isArray(result.entries)
    || !result.entries.every(isEntry)
    || (period === 'all'
      ? result.periodStart !== null || result.periodEnd !== null
      : !isDate(result.periodStart) || !isDate(result.periodEnd)
        || Date.parse(result.periodStart as string) >= Date.parse(result.periodEnd as string))) {
    throw new Error('Invalid leaderboard response.')
  }
  return data as unknown as LeaderboardResult
}
