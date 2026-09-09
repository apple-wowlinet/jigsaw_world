import { NextRequest, NextResponse } from 'next/server'
import { isAdminTokenValid } from '@/lib/admin-auth'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

interface RouteContext {
  params: Promise<{ eventId: string }>
}

function isAuthorized(request: NextRequest) {
  return isAdminTokenValid(request.nextUrl.searchParams.get('admin_token'))
}

function unauthorized() {
  return NextResponse.json({ error: 'Invalid or missing admin_token.' }, { status: 401 })
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) return unauthorized()

  try {
    const { eventId } = await context.params
    const body = await request.json() as { puzzle_id?: string; sort_order?: number }
    if (!body.puzzle_id) {
      return NextResponse.json({ error: 'Puzzle id is required.' }, { status: 400 })
    }

    const sortOrder = Number.isInteger(body.sort_order) ? Math.max(0, body.sort_order as number) : 0
    const { error } = await createSupabaseAdminClient()
      .from('event_puzzles')
      .upsert(
        { event_id: eventId, puzzle_id: body.puzzle_id, sort_order: sortOrder },
        { onConflict: 'event_id,puzzle_id' }
      )

    if (error) throw error
    return NextResponse.json({ event_id: eventId, puzzle_id: body.puzzle_id }, { status: 201 })
  } catch (error) {
    console.error('Failed to add puzzle to event:', error)
    return NextResponse.json({ error: 'Could not add puzzle to event.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) return unauthorized()

  const puzzleId = request.nextUrl.searchParams.get('puzzle_id')
  if (!puzzleId) {
    return NextResponse.json({ error: 'Puzzle id is required.' }, { status: 400 })
  }

  try {
    const { eventId } = await context.params
    const { error } = await createSupabaseAdminClient()
      .from('event_puzzles')
      .delete()
      .eq('event_id', eventId)
      .eq('puzzle_id', puzzleId)

    if (error) throw error
    return NextResponse.json({ event_id: eventId, puzzle_id: puzzleId })
  } catch (error) {
    console.error('Failed to remove puzzle from event:', error)
    return NextResponse.json({ error: 'Could not remove puzzle from event.' }, { status: 500 })
  }
}
