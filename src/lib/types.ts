export interface Puzzle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  description: string | null;
  seo_description: string | null;
  piece_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all'

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatarUrl: string | null
  totalPieces: number
  completedPuzzles: number
  totalTimeSeconds: number
}

export interface LeaderboardResult {
  period: LeaderboardPeriod
  periodStart: string | null
  periodEnd: string | null
  totalPlayers: number
  entries: LeaderboardEntry[]
}
