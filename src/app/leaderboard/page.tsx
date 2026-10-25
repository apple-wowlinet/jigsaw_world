'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { BarChart3, RefreshCw, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LeaderboardPeriod, LeaderboardResult } from '@/lib/types'
import { fetchLeaderboard } from '@/lib/leaderboard'
import { UserAvatar } from '@/components/ui/UserAvatar'

const PERIODS: { value: LeaderboardPeriod; label: string; href: string }[] = [
  { value: 'all', label: 'All Time', href: '/leaderboard' },
  { value: 'daily', label: 'Daily', href: '/leaderboard/daily' },
  { value: 'weekly', label: 'Weekly', href: '/leaderboard/weekly' },
  { value: 'monthly', label: 'Monthly', href: '/leaderboard/monthly' },
]

export function LeaderboardView({ period }: { period: LeaderboardPeriod }) {
  const periodLabel = PERIODS.find((item) => item.value === period)?.label ?? 'Current'

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-primary-subtle/80 blur-3xl dark:bg-[#24312a]/50" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-accent-subtle/70 blur-3xl dark:bg-[#3a2517]/40" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="label-caps mb-4 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent-subtle px-4 py-2 text-[11px] text-accent">
          <Trophy className="h-5 w-5" />
          Verified leaderboard
        </div>
        <h1 className="font-display text-[36px] font-semibold leading-tight tracking-[-0.01em] md:text-[44px]">
          Leaderboard
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Ranked by total pieces completed, then puzzles completed, then shortest total time.
        </p>

        <nav className="mt-8 inline-flex rounded-lg border border-border bg-card p-1 shadow-sm" aria-label="Leaderboard period">
          {PERIODS.map((item) => (
            <Link
              key={item.value}
              href={item.href}
              aria-current={period === item.value ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 min-w-[86px] items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground',
                period === item.value &&
                  'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <LeaderboardResults key={period} period={period} periodLabel={periodLabel} />
      </main>
    </div>
  )
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const rest = seconds % 60
  return hours > 0
    ? `${hours}h ${minutes}m ${rest}s`
    : `${minutes}m ${rest}s`
}

function formatPeriod(result: LeaderboardResult) {
  if (!result.periodStart || !result.periodEnd) return 'All recorded completions'
  const start = new Date(result.periodStart).toISOString().slice(0, 10)
  // The end is exclusive; display the final included calendar date.
  const lastDay = new Date(Date.parse(result.periodEnd) - 1).toISOString().slice(0, 10)
  return start === lastDay ? `${start} (UTC)` : `${start} – ${lastDay} (UTC)`
}

function LeaderboardResults({ period, periodLabel }: { period: LeaderboardPeriod; periodLabel: string }) {
  const [result, setResult] = useState<LeaderboardResult | null>(null)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const requestRef = useRef(0)
  const reloadRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const request = ++requestRef.current
      setRefreshing(true)
      try {
        const nextResult = await fetchLeaderboard(period)
        if (cancelled || request !== requestRef.current) return
        setResult(nextResult)
        setError(false)
      } catch {
        if (cancelled || request !== requestRef.current) return
        setError(true)
      } finally {
        if (!cancelled && request === requestRef.current) setRefreshing(false)
      }
    }
    reloadRef.current = () => { void load() }
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load()
    }
    void load()
    // Requery on returning to this page, including crossing UTC midnight.
    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      reloadRef.current = null
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [period])

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm" aria-label={`${periodLabel} leaderboard`} aria-busy={refreshing}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
        <div>
          <h2 className="font-display text-xl font-semibold">{periodLabel} standings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {result ? `${formatPeriod(result)} · ${result.totalPlayers.toLocaleString()} players` : 'UTC calendar periods · Weeks start on Monday'}
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" disabled={refreshing} onClick={() => reloadRef.current?.()}>
          <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <div className="px-6 py-12 text-center" role="alert">
          <p>Could not load the leaderboard. Please try again.</p>
          <button type="button" className="btn btn-primary btn-sm mt-4" disabled={refreshing} onClick={() => reloadRef.current?.()}>Retry</button>
        </div>
      ) : !result ? (
        <div className="space-y-4 p-6" role="status" aria-label="Loading leaderboard">
          {[0, 1, 2, 3, 4].map((row) => <div key={row} className="h-14 animate-pulse rounded-lg bg-secondary" />)}
          <span className="sr-only">Loading leaderboard…</span>
        </div>
      ) : result.entries.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center px-6 py-10 text-center">
          <div className="max-w-lg">
            <BarChart3 className="mx-auto h-10 w-10 text-accent" />
            <h3 className="font-display mt-5 text-2xl font-semibold">No ranked completions {period === 'all' ? 'yet' : 'in this period'}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Finish a published puzzle while logged in with rotation off to join the standings.</p>
            <Link href="/categories" className="btn btn-primary btn-md mt-6">Play a puzzle</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{periodLabel} players ranked by pieces, completions and time</caption>
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-4 sm:px-7">Rank</th>
                  <th scope="col" className="px-3 py-4">Player</th>
                  <th scope="col" className="px-3 py-4 text-right">Pieces</th>
                  <th scope="col" className="px-3 py-4 text-right">Puzzles</th>
                  <th scope="col" className="whitespace-nowrap px-5 py-4 text-right sm:px-7">Total time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.entries.map((entry) => (
                  <tr key={entry.userId} className="leaderboard-item transition-colors hover:bg-secondary/50">
                    <td className="px-5 py-4 font-bold sm:px-7">
                      <span className={cn('inline-flex h-8 min-w-8 items-center justify-center rounded-full px-1', entry.rank <= 3 && 'bg-accent-subtle text-accent')}>{entry.rank}</span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={entry.username} avatarUrl={entry.avatarUrl} />
                        <span className="max-w-[120px] truncate font-semibold sm:max-w-[260px]" title={entry.username}>{entry.username}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right font-bold tabular-nums text-accent">{entry.totalPieces.toLocaleString()}</td>
                    <td className="px-3 py-4 text-right tabular-nums">{entry.completedPuzzles.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums text-muted-foreground sm:px-7">{formatDuration(entry.totalTimeSeconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground sm:px-7">Showing {result.entries.length} of {result.totalPlayers.toLocaleString()} players · Top 50</p>
        </>
      )}
      <p className="border-t border-border px-5 py-4 text-xs leading-6 text-muted-foreground sm:px-7">
        Each puzzle and piece count counts once per player in this period, using the fastest finish. Different piece counts count separately. More pieces ranks first, then more puzzles, then less total time. Equal totals share a rank. Only published puzzles completed with rotation off are eligible.
      </p>
    </section>
  )
}

export default function LeaderboardPage() {
  return <LeaderboardView period="all" />
}
