'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Puzzle, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SafeImage } from '@/components/ui/SafeImage'
import { fetchDailyHistory, type DailyPuzzle } from '@/lib/data/public'

function parseChallengeDate(value: string) {
  return new Date(`${value}T12:00:00Z`)
}

function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date)
}

function formatCardDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parseChallengeDate(value))
}

export default function ArchivePage() {
  const [archive, setArchive] = useState<DailyPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchDailyHistory(60).then((items) => {
      if (cancelled) return
      setArchive(items)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [])

  // 按月份分组，月份倒序（最近在前）
  const grouped = useMemo(() => {
    const filtered = archive.filter((p) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    })
    const map = new Map<string, DailyPuzzle[]>()
    for (const p of filtered) {
      const key = formatMonth(parseChallengeDate(p.challenge_date))
      const arr = map.get(key) || []
      arr.push(p)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [archive, query])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_30%_8%,rgba(255,255,255,0.95),rgba(255,250,247,0.65)_45%,transparent_75%)] dark:opacity-10"
      />

      <main className="relative mx-auto max-w-[1380px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/daily"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground transition hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Today
        </Link>

        <section className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="hero-rise">
            <div className="label-caps inline-flex h-7 items-center gap-2 rounded-full border border-accent/30 bg-accent-subtle px-3.5 text-[10px] text-accent sm:text-[11px]">
              <CalendarDays className="h-3.5 w-3.5" />
              Daily Archive
            </div>
            <h1 className="font-display mt-4 text-[34px] font-semibold leading-[1.06] tracking-[-0.01em] text-foreground sm:text-[40px] lg:text-[46px]">
              Puzzle Archive
            </h1>
            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
              Browse every daily challenge we&apos;ve featured. Missed a day? Catch up anytime.
            </p>
          </div>

          <div className="w-full shrink-0 sm:w-80">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search archive..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 rounded-lg border-input bg-card pl-11 pr-10 text-foreground placeholder:text-muted-foreground"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          {loading ? (
            <div className="space-y-12">
              {[0, 1].map((group) => (
                <div key={group}>
                  <div className="h-4 w-40 rounded skeleton" />
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="h-64 rounded-lg skeleton" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className="py-24 text-center animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-panel text-muted-foreground">
                <Search className="h-7 w-7" />
              </div>
              <h2 className="font-display mt-5 text-2xl font-semibold text-foreground">
                No puzzles found
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We couldn&apos;t find any puzzles matching &quot;{query}&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {grouped.map(([month, items], groupIndex) => (
                <div key={month} className="animate-fade-in" style={{ animationDelay: `${groupIndex * 60}ms` }}>
                  <div className="mb-6 flex items-center gap-5">
                    <h2 className="label-caps shrink-0 text-foreground">{month}</h2>
                    <span className="h-px flex-1 bg-[#ddd2ba] dark:bg-[#3b3327]" />
                    <span className="shrink-0 text-[13px] font-semibold text-muted-foreground">
                      {items.length} {items.length === 1 ? 'puzzle' : 'puzzles'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((puzzle) => (
                      <Link
                        key={puzzle.id}
                        href={`/play/${puzzle.slug}`}
                        className="group block border border-[#e7decb] bg-card p-2.5 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
                      >
                        <div className="relative aspect-[1.55/1] overflow-hidden">
                          <SafeImage
                            src={puzzle.image_url}
                            alt={puzzle.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="px-1.5 pb-1.5 pt-3">
                          <h3 className="font-display truncate text-[19px] font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
                            {puzzle.title}
                          </h3>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            {formatCardDate(puzzle.challenge_date)}
                            <span className="text-[#c9bfa8] dark:text-[#4a4234]">•</span>
                            <Puzzle className="h-3.5 w-3.5 text-primary" />
                            {puzzle.piece_count} pieces
                            <span className="text-[#c9bfa8] dark:text-[#4a4234]">•</span>
                            {puzzle.difficulty}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
