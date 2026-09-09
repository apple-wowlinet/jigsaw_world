import type { Metadata } from 'next'
import { KeyRound, Settings2, ShieldAlert } from 'lucide-react'
import { EventManager } from '@/components/admin/EventManager'
import { isAdminTokenConfigured, isAdminTokenValid } from '@/lib/admin-auth'
import { fetchAdminEventsData } from '@/lib/admin-events'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Event Administration - JigsawWorld',
  robots: 'noindex, nofollow, noarchive',
}

interface PageProps {
  searchParams: Promise<{ admin_token?: string | string[] }>
}

function AccessMessage({ configured }: { configured: boolean }) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4 py-16">
      <div className="w-full rounded-xl border border-border bg-card p-8 text-center shadow-xl">
        {configured ? (
          <ShieldAlert className="mx-auto h-11 w-11 text-destructive" />
        ) : (
          <Settings2 className="mx-auto h-11 w-11 text-accent" />
        )}
        <h1 className="font-display mt-4 text-3xl font-semibold">
          {configured ? 'Access denied' : 'Admin access is not configured'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {configured
            ? 'Open this page with the correct admin_token query parameter.'
            : 'Set ADMIN_TOKEN and SUPABASE_SERVICE_ROLE_KEY in the server environment, then restart the application.'}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 font-mono text-xs text-foreground">
          <KeyRound className="h-3.5 w-3.5" />
          /admin/events?admin_token=YOUR_TOKEN
        </div>
      </div>
    </div>
  )
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tokenValue = Array.isArray(params.admin_token) ? params.admin_token[0] : params.admin_token
  const configured = isAdminTokenConfigured()

  if (!configured || !tokenValue || !isAdminTokenValid(tokenValue)) {
    return <AccessMessage configured={configured} />
  }

  let data
  try {
    data = await fetchAdminEventsData()
  } catch (error) {
    console.error('Failed to initialize event administration:', error)
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4 py-16">
        <div className="w-full rounded-xl border border-destructive/25 bg-card p-8 text-center shadow-xl">
          <Settings2 className="mx-auto h-11 w-11 text-destructive" />
          <h1 className="font-display mt-4 text-3xl font-semibold">Event manager is unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Confirm SUPABASE_SERVICE_ROLE_KEY is set and apply migration 009_event_puzzles.sql.
          </p>
        </div>
      </div>
    )
  }

  return <EventManager adminToken={tokenValue} initialData={data} />
}
