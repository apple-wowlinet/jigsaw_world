import { NextRequest, NextResponse } from 'next/server'
import { fetchAdminEventsData } from '@/lib/admin-events'
import { isAdminTokenValid } from '@/lib/admin-auth'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

interface EventInput {
  id?: string
  name?: string
  slug?: string
  description?: string
  banner_url?: string
  starts_at?: string | null
  ends_at?: string | null
  is_active?: boolean
}

function unauthorized() {
  return NextResponse.json(
    { error: 'Invalid or missing admin_token.' },
    { status: 401, headers: { 'Cache-Control': 'no-store' } }
  )
}

function validateRequest(request: NextRequest) {
  return isAdminTokenValid(request.nextUrl.searchParams.get('admin_token'))
}

function parseDate(value: unknown, field: string) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') throw new Error(`${field} must be a valid date.`)

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw new Error(`${field} must be a valid date.`)
  return date.toISOString()
}

function parseEventInput(input: EventInput) {
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const slug = typeof input.slug === 'string' ? input.slug.trim().toLowerCase() : ''
  const description = typeof input.description === 'string' ? input.description.trim() : ''
  const bannerUrl = typeof input.banner_url === 'string' ? input.banner_url.trim() : ''
  const startsAt = parseDate(input.starts_at, 'Start date')
  const endsAt = parseDate(input.ends_at, 'End date')

  if (!name) throw new Error('Event name is required.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Slug must contain lowercase letters, numbers, and single hyphens only.')
  }
  if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) {
    throw new Error('End date must be after the start date.')
  }
  if (bannerUrl) {
    let parsedUrl: URL
    try {
      parsedUrl = new URL(bannerUrl)
    } catch {
      throw new Error('Banner URL must be a valid http(s) URL.')
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Banner URL must be a valid http(s) URL.')
    }
  }

  return {
    name,
    slug,
    description: description || null,
    banner_url: bannerUrl || null,
    starts_at: startsAt,
    ends_at: endsAt,
    is_active: input.is_active !== false,
  }
}

function errorResponse(error: unknown, fallback: string) {
  const record = typeof error === 'object' && error !== null
    ? error as { message?: unknown; code?: unknown }
    : null
  const message = error instanceof Error
    ? error.message
    : typeof record?.message === 'string'
      ? record.message
      : fallback
  const status = record?.code === '23505' || message.includes('duplicate key') ? 409 : 400
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  if (!validateRequest(request)) return unauthorized()

  try {
    const data = await fetchAdminEventsData()
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Failed to load event administration data:', error)
    return NextResponse.json({ error: 'Could not load events.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateRequest(request)) return unauthorized()

  try {
    const payload = parseEventInput(await request.json() as EventInput)
    const { data, error } = await createSupabaseAdminClient()
      .from('events')
      .insert(payload)
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return errorResponse(error, 'Could not create event.')
  }
}

export async function PATCH(request: NextRequest) {
  if (!validateRequest(request)) return unauthorized()

  try {
    const input = await request.json() as EventInput
    if (!input.id) throw new Error('Event id is required.')

    const payload = parseEventInput(input)
    const { error } = await createSupabaseAdminClient()
      .from('events')
      .update(payload)
      .eq('id', input.id)

    if (error) throw error
    return NextResponse.json({ id: input.id })
  } catch (error) {
    console.error('Failed to update event:', error)
    return errorResponse(error, 'Could not update event.')
  }
}

export async function DELETE(request: NextRequest) {
  if (!validateRequest(request)) return unauthorized()

  const eventId = request.nextUrl.searchParams.get('id')
  if (!eventId) return NextResponse.json({ error: 'Event id is required.' }, { status: 400 })

  try {
    const { error } = await createSupabaseAdminClient()
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) throw error
    return NextResponse.json({ id: eventId })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json({ error: 'Could not delete event.' }, { status: 500 })
  }
}
