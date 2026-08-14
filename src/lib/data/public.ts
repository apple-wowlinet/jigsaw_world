import { supabase } from '@/lib/supabase'

export type DisplayDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface PublicCategory {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  icon: string
  color: string
  dark_color: string
  puzzle_count: number
  parent_id?: string | null
  parent_slug?: string | null
}

export interface PublicPuzzle {
  id: string
  uuid: string
  title: string
  slug: string
  image_url: string
  description: string
  piece_count: number
  difficulty: DisplayDifficulty
  plays_count: number
  completions_count: number
  rating: number
  created_at: string
  category: string
  category_slug: string
}

export interface PublicPuzzleLeaderboardEntry {
  rank: number
  userId: string
  username: string
  timeSeconds: number
}

export interface DailyPuzzle extends PublicPuzzle {
  challenge_id: string
  challenge_date: string
  challenge_title: string
}

export interface DailyChallengeParticipation {
  challengeId: string
  challengeDate: string
  isCompleted: boolean
  progressPercent: number
  completionTime: number | null
}

export interface DailyChallengeProgress {
  currentStreak: number
  maxStreak: number
  completedThisMonth: number
  participations: Record<string, DailyChallengeParticipation>
}

interface CategoryRelation {
  name?: string | null
  slug?: string | null
}

interface PublicCategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  icon: string | null
  color: string | null
  dark_color: string | null
  puzzle_count: number | null
  parent_id?: string | null
}

interface PuzzleRow {
  id: string
  title: string
  slug: string
  image_url: string
  description: string | null
  piece_count: number | null
  difficulty: string | null
  plays_count: number | null
  completions_count: number | null
  rating: number | string | null
  created_at: string | null
  categories?: CategoryRelation | CategoryRelation[] | null
}

interface DailyChallengeRow {
  id: string
  challenge_date: string
  title: string | null
  description: string | null
  puzzles?: PuzzleRow | PuzzleRow[] | null
}

interface DailyParticipationRow {
  daily_challenge_id: string
  completion_time: number | null
  is_completed: boolean
  progress_percent?: number | null
  daily_challenges?: {
    challenge_date?: string | null
  } | Array<{
    challenge_date?: string | null
  }> | null
}

interface PuzzleLeaderboardRow {
  rank: number | string
  user_id: string
  username: string | null
  score_value: number | string
}

const PUZZLE_SELECT = `
  id,
  title,
  slug,
  image_url,
  description,
  piece_count,
  difficulty,
  plays_count,
  completions_count,
  rating,
  created_at,
  categories(name, slug)
`

function getFirst<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export function toDisplayDifficulty(value: string | null | undefined): DisplayDifficulty {
  if (value === 'easy') return 'Easy'
  if (value === 'medium') return 'Medium'
  return 'Hard'
}

export function mapPuzzle(row: PuzzleRow): PublicPuzzle {
  const category = getFirst(row.categories)

  return {
    id: row.slug,
    uuid: row.id,
    title: row.title,
    slug: row.slug,
    image_url: row.image_url,
    description: row.description ?? '',
    piece_count: row.piece_count ?? 100,
    difficulty: toDisplayDifficulty(row.difficulty),
    plays_count: row.plays_count ?? 0,
    completions_count: row.completions_count ?? 0,
    rating: Number(row.rating ?? 0),
    created_at: row.created_at ?? new Date(0).toISOString(),
    category: category?.name ?? 'Uncategorized',
    category_slug: category?.slug ?? 'uncategorized',
  }
}

export async function fetchCategories(limit?: number): Promise<PublicCategory[]> {
  const selectCategories = (includeParent: boolean) => {
    let query = supabase
      .from('categories')
      .select(`id, name, slug, description, image_url, icon, color, dark_color, puzzle_count${includeParent ? ', parent_id' : ''}`)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    return query
  }

  let { data, error } = await selectCategories(true)

  // Keep the frontend compatible with databases that have not applied the
  // optional category-hierarchy migration yet.
  if (error?.message.toLowerCase().includes('parent_id')) {
    const fallback = await selectCategories(false)
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('Failed to fetch categories:', error.message)
    return []
  }

  const rows = (data ?? []) as unknown as PublicCategoryRow[]
  const slugById = new Map(rows.map((category) => [category.id, category.slug]))

  return rows.map((category) => {
    const parentId = 'parent_id' in category
      ? (category.parent_id as string | null)
      : null

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      image_url: category.image_url ?? '',
      icon: category.icon ?? 'grid',
      color: category.color ?? '#3b82f6',
      dark_color: category.dark_color ?? category.color ?? '#60a5fa',
      puzzle_count: category.puzzle_count ?? 0,
      parent_id: parentId,
      parent_slug: parentId ? slugById.get(parentId) ?? null : null,
    }
  })
}

export async function fetchPuzzles(options: {
  limit?: number
  categorySlug?: string
  categorySlugs?: string[]
  search?: string
  orderBy?: 'featured' | 'plays' | 'rating' | 'recent' | 'editor'
} = {}): Promise<PublicPuzzle[]> {
  let query = supabase
    .from('puzzles')
    .select(PUZZLE_SELECT)
    .eq('is_active', true)

  const requestedCategorySlugs = options.categorySlugs?.length
    ? [...new Set(options.categorySlugs)]
    : options.categorySlug
      ? [options.categorySlug]
      : []

  if (requestedCategorySlugs.length) {
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .in('slug', requestedCategorySlugs)

    if (categoryError || !categories?.length) {
      if (categoryError) console.error('Failed to fetch category:', categoryError.message)
      return []
    }

    query = query.in('category_id', categories.map((category) => category.id))
  }

  const search = options.search?.trim()
  if (search) {
    const safeSearch = search.replaceAll('%', '\\%').replaceAll('_', '\\_')
    query = query.or(`title.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`)
  }

  switch (options.orderBy) {
    case 'featured':
      query = query.order('is_featured', { ascending: false }).order('editor_score', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false }).order('plays_count', { ascending: false })
      break
    case 'recent':
      query = query.order('publish_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false })
      break
    case 'editor':
      query = query.order('editor_score', { ascending: false }).order('rating', { ascending: false })
      break
    case 'plays':
    default:
      query = query.order('plays_count', { ascending: false }).order('rating', { ascending: false })
      break
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch puzzles:', error.message)
    return []
  }

  return ((data ?? []) as PuzzleRow[]).map(mapPuzzle)
}

export async function fetchPuzzleBySlug(slug: string): Promise<PublicPuzzle | null> {
  const { data, error } = await supabase
    .from('puzzles')
    .select(PUZZLE_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch puzzle:', error.message)
    return null
  }

  return data ? mapPuzzle(data as PuzzleRow) : null
}

export async function fetchPuzzleLeaderboard(
  puzzleId: string,
  pieceCount: number,
  limit = 5
): Promise<PublicPuzzleLeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('v_leaderboard_time')
    .select('rank, user_id, username, score_value')
    .eq('puzzle_id', puzzleId)
    .eq('piece_count', pieceCount)
    .order('rank', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch puzzle leaderboard:', error.message)
    return []
  }

  return ((data ?? []) as PuzzleLeaderboardRow[]).map((entry) => ({
    rank: Number(entry.rank),
    userId: entry.user_id,
    username: entry.username?.trim() || `Player ${entry.user_id.slice(0, 8)}`,
    timeSeconds: Number(entry.score_value),
  }))
}

export async function fetchDailyPuzzle(): Promise<DailyPuzzle | null> {
  const today = new Date().toISOString().slice(0, 10)
  let { data, error } = await supabase
    .from('daily_challenges')
    .select(`id, challenge_date, title, description, puzzles(${PUZZLE_SELECT})`)
    .lte('challenge_date', today)
    .order('challenge_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data && !error) {
    const fallback = await supabase
      .from('daily_challenges')
      .select(`id, challenge_date, title, description, puzzles(${PUZZLE_SELECT})`)
      .order('challenge_date', { ascending: false })
      .limit(1)
      .maybeSingle()
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('Failed to fetch daily puzzle:', error.message)
    return null
  }

  const row = data as DailyChallengeRow | null
  const puzzle = getFirst(row?.puzzles)
  if (!row || !puzzle) return null

  return {
    ...mapPuzzle(puzzle),
    challenge_id: row.id,
    challenge_date: row.challenge_date,
    challenge_title: row.title ?? puzzle.title,
    description: row.description ?? puzzle.description ?? '',
  }
}

export async function fetchDailyHistory(limit = 12): Promise<DailyPuzzle[]> {
  const { data, error } = await supabase
    .from('daily_challenges')
    .select(`id, challenge_date, title, description, puzzles(${PUZZLE_SELECT})`)
    .order('challenge_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch daily history:', error.message)
    return []
  }

  return ((data ?? []) as DailyChallengeRow[])
    .map((row) => {
      const puzzle = getFirst(row.puzzles)
      if (!puzzle) return null

      return {
        ...mapPuzzle(puzzle),
        challenge_id: row.id,
        challenge_date: row.challenge_date,
        challenge_title: row.title ?? puzzle.title,
        description: row.description ?? puzzle.description ?? '',
        created_at: row.challenge_date,
      }
    })
    .filter((puzzle): puzzle is DailyPuzzle => puzzle !== null)
}

export async function fetchDailyChallengeProgress(
  userId: string,
  monthStart: string
): Promise<DailyChallengeProgress> {
  const emptyProgress: DailyChallengeProgress = {
    currentStreak: 0,
    maxStreak: 0,
    completedThisMonth: 0,
    participations: {},
  }

  const selectParticipations = (includeProgress: boolean) =>
    supabase
      .from('daily_challenge_participations')
      .select(`
        daily_challenge_id,
        completion_time,
        is_completed,
        ${includeProgress ? 'progress_percent,' : ''}
        daily_challenges!inner(challenge_date)
      `)
      .eq('user_id', userId)
      .gte('daily_challenges.challenge_date', monthStart)
      .order('participated_at', { ascending: false })

  const [statsResult, initialParticipationsResult] = await Promise.all([
    supabase
      .from('user_stats')
      .select('daily_current_streak, daily_max_streak')
      .eq('user_id', userId)
      .maybeSingle(),
    selectParticipations(true),
  ])

  let participationsData = initialParticipationsResult.data
  let participationsError = initialParticipationsResult.error

  if (participationsError?.message.toLowerCase().includes('progress_percent')) {
    const fallback = await selectParticipations(false)
    participationsData = fallback.data
    participationsError = fallback.error
  }

  if (participationsError) {
    console.error(
      'Failed to fetch daily challenge progress:',
      participationsError.message
    )
    return emptyProgress
  }

  if (statsResult.error) {
    console.error('Failed to fetch daily streak:', statsResult.error.message)
  }

  const participations = (
    (participationsData ?? []) as unknown as DailyParticipationRow[]
  ).reduce<Record<string, DailyChallengeParticipation>>((result, row) => {
    const challenge = getFirst(row.daily_challenges)
    const challengeDate = challenge?.challenge_date ?? ''
    const progressPercent = row.is_completed
      ? 100
      : Math.min(99, Math.max(0, row.progress_percent ?? 0))

    result[row.daily_challenge_id] = {
      challengeId: row.daily_challenge_id,
      challengeDate,
      isCompleted: row.is_completed,
      progressPercent,
      completionTime: row.completion_time,
    }
    return result
  }, {})

  return {
    currentStreak: statsResult.data?.daily_current_streak ?? 0,
    maxStreak: statsResult.data?.daily_max_streak ?? 0,
    completedThisMonth: Object.values(participations).filter(
      (participation) => participation.isCompleted
    ).length,
    participations,
  }
}
