'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import type { AdminEvent, AdminEventsData, AdminPuzzle } from '@/lib/admin-events'
import { cn } from '@/lib/utils'

interface EventManagerProps {
  adminToken: string
  initialData: AdminEventsData
}

interface EventFormState {
  name: string
  slug: string
  description: string
  banner_url: string
  starts_at: string
  ends_at: string
  is_active: boolean
}

const emptyForm: EventFormState = {
  name: '',
  slug: '',
  description: '',
  banner_url: '',
  starts_at: '',
  ends_at: '',
  is_active: true,
}

function toDateTimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function eventToForm(event: AdminEvent): EventFormState {
  return {
    name: event.name,
    slug: event.slug,
    description: event.description,
    banner_url: event.banner_url,
    starts_at: toDateTimeLocal(event.starts_at),
    ends_at: toDateTimeLocal(event.ends_at),
    is_active: event.is_active,
  }
}

function formatDateRange(event: AdminEvent) {
  if (!event.starts_at && !event.ends_at) return 'No date range'
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
  const start = event.starts_at ? formatter.format(new Date(event.starts_at)) : 'Any time'
  const end = event.ends_at ? formatter.format(new Date(event.ends_at)) : 'No end'
  return `${start} – ${end}`
}

async function readResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({})) as { error?: string }
  if (!response.ok) throw new Error(payload.error || 'The request failed.')
  return payload as T
}

export function EventManager({ adminToken, initialData }: EventManagerProps) {
  const firstEvent = initialData.events[0] ?? null
  const [data, setData] = useState(initialData)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(firstEvent?.id ?? null)
  const [form, setForm] = useState<EventFormState>(firstEvent ? eventToForm(firstEvent) : emptyForm)
  const [isCreating, setIsCreating] = useState(firstEvent === null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pendingPuzzleId, setPendingPuzzleId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const selectedEvent = data.events.find((event) => event.id === selectedEventId) ?? null
  const assignedPuzzleIds = useMemo(
    () => new Set(selectedEvent?.puzzles.map((puzzle) => puzzle.id) ?? []),
    [selectedEvent]
  )
  const availablePuzzles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return data.puzzles
      .filter((puzzle) => !assignedPuzzleIds.has(puzzle.id))
      .filter((puzzle) => !query || `${puzzle.title} ${puzzle.slug}`.toLowerCase().includes(query))
      .slice(0, 20)
  }, [assignedPuzzleIds, data.puzzles, search])

  const apiUrl = (path = '') =>
    `/api/admin/events${path}?admin_token=${encodeURIComponent(adminToken)}`

  const resetFeedback = () => {
    setError(null)
    setNotice(null)
  }

  const refreshData = async (preferredEventId?: string | null) => {
    const nextData = await readResponse<AdminEventsData>(await fetch(apiUrl(), { cache: 'no-store' }))
    setData(nextData)

    const targetId = preferredEventId ?? selectedEventId
    const nextEvent = nextData.events.find((event) => event.id === targetId) ?? nextData.events[0] ?? null
    setSelectedEventId(nextEvent?.id ?? null)
    setIsCreating(nextEvent === null)
    setForm(nextEvent ? eventToForm(nextEvent) : emptyForm)
  }

  const selectEvent = (event: AdminEvent) => {
    resetFeedback()
    setSelectedEventId(event.id)
    setForm(eventToForm(event))
    setIsCreating(false)
    setSearch('')
  }

  const startCreate = () => {
    resetFeedback()
    setSelectedEventId(null)
    setForm(emptyForm)
    setIsCreating(true)
    setSearch('')
  }

  const updateField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleNameChange = (name: string) => {
    setForm((current) => {
      const oldGeneratedSlug = current.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      const nextGeneratedSlug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      return {
        ...current,
        name,
        slug: isCreating && (!current.slug || current.slug === oldGeneratedSlug)
          ? nextGeneratedSlug
          : current.slug,
      }
    })
  }

  const saveEvent = async (event: React.FormEvent) => {
    event.preventDefault()
    resetFeedback()
    setSaving(true)

    try {
      const method = isCreating ? 'POST' : 'PATCH'
      const response = await fetch(apiUrl(), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          id: selectedEventId,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        }),
      })
      const result = await readResponse<{ id: string }>(response)
      await refreshData(result.id)
      setNotice(isCreating ? 'Event created.' : 'Event saved.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save event.')
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async () => {
    if (!selectedEvent || !window.confirm(`Delete “${selectedEvent.name}”? This cannot be undone.`)) return

    resetFeedback()
    setDeleting(true)
    try {
      const response = await fetch(`${apiUrl()}&id=${encodeURIComponent(selectedEvent.id)}`, {
        method: 'DELETE',
      })
      await readResponse(response)
      await refreshData(null)
      setNotice('Event deleted.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete event.')
    } finally {
      setDeleting(false)
    }
  }

  const addPuzzle = async (puzzle: AdminPuzzle) => {
    if (!selectedEvent) return
    resetFeedback()
    setPendingPuzzleId(puzzle.id)

    try {
      const response = await fetch(apiUrl(`/${encodeURIComponent(selectedEvent.id)}/puzzles`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle_id: puzzle.id,
          sort_order: selectedEvent.puzzles.reduce(
            (highest, item) => Math.max(highest, item.sort_order),
            -1
          ) + 1,
        }),
      })
      await readResponse(response)
      await refreshData(selectedEvent.id)
      setNotice(`Added “${puzzle.title}”.`)
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : 'Could not add puzzle.')
    } finally {
      setPendingPuzzleId(null)
    }
  }

  const removePuzzle = async (puzzle: AdminPuzzle) => {
    if (!selectedEvent) return
    resetFeedback()
    setPendingPuzzleId(puzzle.id)

    try {
      const response = await fetch(
        `${apiUrl(`/${encodeURIComponent(selectedEvent.id)}/puzzles`)}&puzzle_id=${encodeURIComponent(puzzle.id)}`,
        { method: 'DELETE' }
      )
      await readResponse(response)
      await refreshData(selectedEvent.id)
      setNotice(`Removed “${puzzle.title}”.`)
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Could not remove puzzle.')
    } finally {
      setPendingPuzzleId(null)
    }
  }

  const inputClass = 'mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20'

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="label-caps text-accent">Administration</p>
            <h1 className="font-display mt-1 text-4xl font-semibold">Event manager</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create events and curate the puzzles included in each one.</p>
          </div>
          <button type="button" onClick={startCreate} className="btn btn-primary btn-md">
            <Plus className="h-4 w-4" /> New event
          </button>
        </div>

        {(error || notice) && (
          <div
            role={error ? 'alert' : 'status'}
            className={cn(
              'mb-5 flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium',
              error
                ? 'border-destructive/30 bg-destructive/5 text-destructive'
                : 'border-primary/25 bg-primary/5 text-primary'
            )}
          >
            {error ? <X className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {error || notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-border bg-card p-3 shadow-sm xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
            <div className="flex items-center justify-between px-2 py-2">
              <h2 className="text-sm font-bold">Events</h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">{data.events.length}</span>
            </div>
            <div className="mt-1 space-y-1.5">
              {data.events.length === 0 && (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">No events yet.</p>
              )}
              {data.events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectEvent(event)}
                  className={cn(
                    'w-full rounded-lg border px-3 py-3 text-left transition',
                    selectedEventId === event.id && !isCreating
                      ? 'border-accent bg-accent-subtle'
                      : 'border-transparent hover:border-border hover:bg-secondary/60'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display font-semibold text-foreground">{event.name}</span>
                    <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', event.is_active ? 'bg-emerald-500' : 'bg-muted-foreground/40')} />
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{event.slug}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{event.puzzles.length} puzzles</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="label-caps text-muted-foreground">{isCreating ? 'Create' : 'Edit'}</p>
                  <h2 className="font-display mt-1 text-2xl font-semibold">{isCreating ? 'New event' : selectedEvent?.name}</h2>
                </div>
                {!isCreating && selectedEvent && (
                  <button
                    type="button"
                    onClick={deleteEvent}
                    disabled={deleting || saving}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-destructive/30 px-3 text-sm font-semibold text-destructive hover:bg-destructive/5 disabled:opacity-50"
                  >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                  </button>
                )}
              </div>

              <form onSubmit={saveEvent} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Name
                    <input required value={form.name} onChange={(event) => handleNameChange(event.target.value)} className={inputClass} placeholder="Summer Journey 2026" />
                  </label>
                  <label className="text-sm font-semibold">
                    Slug
                    <input required value={form.slug} onChange={(event) => updateField('slug', event.target.value.toLowerCase())} className={inputClass} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="summer-journey-2026" />
                  </label>
                </div>
                <label className="block text-sm font-semibold">
                  Description
                  <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} className="mt-1.5 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
                </label>
                <label className="block text-sm font-semibold">
                  Banner URL
                  <input type="url" value={form.banner_url} onChange={(event) => updateField('banner_url', event.target.value)} className={inputClass} placeholder="https://..." />
                </label>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Starts at
                    <input type="datetime-local" value={form.starts_at} onChange={(event) => updateField('starts_at', event.target.value)} className={inputClass} />
                  </label>
                  <label className="text-sm font-semibold">
                    Ends at
                    <input type="datetime-local" value={form.ends_at} onChange={(event) => updateField('ends_at', event.target.value)} className={inputClass} />
                  </label>
                </div>
                <div className="flex flex-col justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
                  <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold">
                    <input type="checkbox" checked={form.is_active} onChange={(event) => updateField('is_active', event.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
                    Active event
                  </label>
                  <button type="submit" disabled={saving || deleting} className="btn btn-terracotta btn-md sm:min-w-32">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isCreating ? 'Create event' : 'Save changes'}
                  </button>
                </div>
              </form>
            </section>

            {!isCreating && selectedEvent && (
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="label-caps text-muted-foreground">Puzzle curation</p>
                    <h2 className="font-display mt-1 text-2xl font-semibold">Puzzles in this event</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" /> {formatDateRange(selectedEvent)}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{selectedEvent.puzzles.length} included</span>
                </div>

                <div className="mt-5 grid gap-2 md:grid-cols-2">
                  {selectedEvent.puzzles.length === 0 && (
                    <p className="col-span-full rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">No puzzles have been added.</p>
                  )}
                  {selectedEvent.puzzles.map((puzzle) => (
                    <div key={puzzle.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold">{puzzle.sort_order + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{puzzle.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{puzzle.piece_count} pcs · {puzzle.difficulty}</p>
                      </div>
                      <Link href={`/puzzle/${puzzle.slug}`} target="_blank" aria-label={`Open ${puzzle.title}`} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button type="button" onClick={() => removePuzzle(puzzle)} disabled={pendingPuzzleId === puzzle.id} aria-label={`Remove ${puzzle.title}`} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">
                        {pendingPuzzleId === puzzle.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-7 border-t border-border pt-6">
                  <h3 className="text-sm font-bold">Add puzzles</h3>
                  <div className="relative mt-3">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="Search puzzle title or slug..." />
                  </div>
                  <div className="mt-3 max-h-80 space-y-1 overflow-y-auto pr-1">
                    {availablePuzzles.length === 0 && (
                      <p className="py-7 text-center text-sm text-muted-foreground">No available puzzles match your search.</p>
                    )}
                    {availablePuzzles.map((puzzle) => (
                      <div key={puzzle.id} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-secondary/60">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{puzzle.title}</p>
                          <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">{puzzle.slug} · {puzzle.piece_count} pcs{!puzzle.is_active ? ' · inactive' : ''}</p>
                        </div>
                        <button type="button" onClick={() => addPuzzle(puzzle)} disabled={pendingPuzzleId !== null} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-50">
                          {pendingPuzzleId === puzzle.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
