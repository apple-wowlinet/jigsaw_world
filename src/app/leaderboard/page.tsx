'use client'

import Link from 'next/link'
import { BarChart3, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LeaderboardPeriod } from '@/lib/types'

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
          Only server-verified results will appear here.
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

        <section className="mt-8 flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-card/80 px-6 text-center shadow-sm">
          <div className="max-w-lg">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-accent">
              <BarChart3 className="h-7 w-7" />
            </span>
            <h2 className="font-display mt-5 text-2xl font-semibold">
              No verified {periodLabel.toLowerCase()} standings yet
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Rankings will open after the public aggregate views and period rules are implemented. We do not show sample players as real results.
            </p>
            <Link href="/categories" className="btn btn-primary btn-md mt-6">
              Play a published puzzle
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function LeaderboardPage() {
  return <LeaderboardView period="all" />
}
