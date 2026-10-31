import { createHmac } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { parseContactInput } from '@/lib/contact'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin) {
    let sameHost = false
    try {
      const source = new URL(origin)
      sameHost = ['http:', 'https:'].includes(source.protocol) && source.host === request.headers.get('host')
    } catch { /* Invalid origins are rejected below. */ }
    if (!sameHost) {
      return NextResponse.json({ error: 'Please submit from our contact page.' }, { status: 403 })
    }
  }
  let input
  try {
    // Bound the actual body size, including requests without Content-Length.
    const reader = request.body?.getReader()
    if (!reader) throw new Error('Empty request')
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.length
      if (size > 40000) {
        await reader.cancel()
        return NextResponse.json({ error: 'Message is too large.' }, { status: 413 })
      }
      chunks.push(value)
    }
    input = parseContactInput(JSON.parse(Buffer.concat(chunks).toString('utf8')))
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? 'Invalid request.' : error instanceof Error ? error.message : 'Invalid request.' }, { status: 400 })
  }

  try {
    const db = createSupabaseAdminClient()
    // Vercel sets x-vercel-forwarded-for; locally use a shared conservative bucket.
    const ip = process.env.VERCEL
      ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      : 'local'
    const senderHash = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!).update(ip).digest('hex')
    const { data, error } = await db.rpc('submit_contact_message', {
      p_id: input.id, p_name: input.name, p_email: input.email,
      p_message: input.message, p_sender_hash: senderHash,
    })
    if (error) throw error
    if (data === 'rate_limited') {
      return NextResponse.json({ error: 'Too many messages. Please try again in 10 minutes.' }, { status: 429, headers: { 'Retry-After': '600' } })
    }
    if (data === 'conflict') {
      return NextResponse.json({ error: 'Please refresh the page before sending a different message.' }, { status: 409 })
    }
    if (data !== 'accepted') throw new Error('Unexpected contact submission result')
    return NextResponse.json({ id: input.id }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    console.error('Contact submission could not be saved')
    return NextResponse.json({ error: 'We could not save your message. Please try again, or email support@jigsawworld.co.' }, { status: 503 })
  }
}
