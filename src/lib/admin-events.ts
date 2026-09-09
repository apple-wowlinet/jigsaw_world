import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export interface AdminPuzzle {
  id: string
  title: string
  slug: string
  image_url: string
  piece_count: number
  difficulty: string
  is_active: boolean
}

export interface AdminEventPuzzle extends AdminPuzzle {
  sort_order: number
}

export interface AdminEvent {
  id: string
  slug: string
  name: string
  description: string
  banner_url: string
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  puzzles: AdminEventPuzzle[]
}

export interface AdminEventsData {
  events: AdminEvent[]
  puzzles: AdminPuzzle[]
}

interface EventRow {
  id: string
  slug: string
  name: string
  description: string | null
  banner_url: string | null
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface PuzzleRow {
  id: string
  title: string
  slug: string
  image_url: string
  piece_count: number | null
  difficulty: string | null
  is_active: boolean
}

interface EventPuzzleRow {
  event_id: string
  puzzle_id: string
  sort_order: number
}

export async function fetchAdminEventsData(): Promise<AdminEventsData> {
  const supabaseAdmin = createSupabaseAdminClient()
  const [eventsResult, puzzlesResult, relationsResult] = await Promise.all([
    supabaseAdmin
      .from('events')
      .select('id, slug, name, description, banner_url, starts_at, ends_at, is_active, created_at, updated_at')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('puzzles')
      .select('id, title, slug, image_url, piece_count, difficulty, is_active')
      .order('title', { ascending: true })
      .limit(5000),
    supabaseAdmin
      .from('event_puzzles')
      .select('event_id, puzzle_id, sort_order')
      .order('sort_order', { ascending: true }),
  ])

  if (eventsResult.error) throw eventsResult.error
  if (puzzlesResult.error) throw puzzlesResult.error
  if (relationsResult.error) throw relationsResult.error

  const puzzles = ((puzzlesResult.data ?? []) as PuzzleRow[]).map((puzzle) => ({
    ...puzzle,
    piece_count: puzzle.piece_count ?? 100,
    difficulty: puzzle.difficulty ?? 'medium',
  }))
  const puzzleById = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]))
  const puzzlesByEvent = new Map<string, AdminEventPuzzle[]>()

  for (const relation of (relationsResult.data ?? []) as EventPuzzleRow[]) {
    const puzzle = puzzleById.get(relation.puzzle_id)
    if (!puzzle) continue

    const eventPuzzles = puzzlesByEvent.get(relation.event_id) ?? []
    eventPuzzles.push({ ...puzzle, sort_order: relation.sort_order })
    puzzlesByEvent.set(relation.event_id, eventPuzzles)
  }

  const events = ((eventsResult.data ?? []) as EventRow[]).map((event) => ({
    ...event,
    description: event.description ?? '',
    banner_url: event.banner_url ?? '',
    puzzles: puzzlesByEvent.get(event.id) ?? [],
  }))

  return { events, puzzles }
}
