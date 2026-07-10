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
  rank: number       // 1-based
  userId: string
  username: string
  avatar: string     // emoji (matches existing puzzle-detail convention)
  score: number      // points / 积分
}
