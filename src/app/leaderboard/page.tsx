'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Sparkles, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'
import { fetchLeaderboard } from '@/lib/leaderboard'

const PERIODS: { value: LeaderboardPeriod; label: string; description: string; href: string }[] = [
  { value: 'all', label: 'All Time', description: 'All-time total score', href: '/leaderboard' },
  { value: 'daily', label: 'Daily', description: "Today's score", href: '/leaderboard/daily' },
  { value: 'weekly', label: 'Weekly', description: "This week's score", href: '/leaderboard/weekly' },
  { value: 'monthly', label: 'Monthly', description: "This month's score", href: '/leaderboard/monthly' },
]

const CURRENT_USER_ID: string | null = null

/* Demo standings used while the live user_stats table has no rows —
   mirrors the fallback pattern used on the home and daily pages. */
const FALLBACK_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', username: 'Elke Fogg', avatar: '🏆', score: 18460 },
  { rank: 2, userId: 'u2', username: 'Marta Whitlock', avatar: '🥈', score: 17210 },
  { rank: 3, userId: 'u3', username: 'Soren Vale', avatar: '🥉', score: 15980 },
  { rank: 4, userId: 'u4', username: 'Priya Ashworth', avatar: '🧩', score: 14875 },
  { rank: 5, userId: 'u5', username: 'Tomas Riddle', avatar: '⚡', score: 13940 },
  { rank: 6, userId: 'u6', username: 'Greta Milne', avatar: '🌟', score: 12760 },
  { rank: 7, userId: 'u7', username: 'Alba Ferrand', avatar: '🎯', score: 11845 },
  { rank: 8, userId: 'u8', username: 'Nils Pemberton', avatar: '💎', score: 10930 },
  { rank: 9, userId: 'u9', username: 'Yuki Calder', avatar: '🔍', score: 9820 },
  { rank: 10, userId: 'u10', username: 'Otto Grimaldi', avatar: '🪄', score: 8790 },
  { rank: 11, userId: 'u11', username: 'Freya Lindqvist', avatar: '🧩', score: 7645 },
  { rank: 12, userId: 'u12', username: 'Dario Bexley', avatar: '⚡', score: 6510 },
]

type EnrichedEntry = LeaderboardEntry & {
  avgTime: string
  change: number
  country: string
  flag: string
  games: number
  level: number
  starAvg: number
}

const PLAYER_META: Record<string, Pick<EnrichedEntry, 'country' | 'flag'>> = {
  u1: { country: 'Germany', flag: '🇩🇪' },
  u2: { country: 'United Kingdom', flag: '🇬🇧' },
  u3: { country: 'United States', flag: '🇺🇸' },
  u4: { country: 'France', flag: '🇫🇷' },
  u5: { country: 'Japan', flag: '🇯🇵' },
  u6: { country: 'Australia', flag: '🇦🇺' },
  u7: { country: 'Spain', flag: '🇪🇸' },
  u8: { country: 'Brazil', flag: '🇧🇷' },
  u9: { country: 'United States', flag: '🇺🇸' },
  u10: { country: 'Canada', flag: '🇨🇦' },
  u11: { country: 'Italy', flag: '🇮🇹' },
  u12: { country: 'Netherlands', flag: '🇳🇱' },
}

function enrichEntry(entry: LeaderboardEntry): EnrichedEntry {
  const meta = PLAYER_META[entry.userId] ?? { country: 'Global', flag: '🌍' }
  const level = Math.max(12, 54 - entry.rank + (entry.userId.charCodeAt(1) % 4))
  const games = Math.max(18, 146 - entry.rank * 7 + (entry.userId.charCodeAt(1) % 8))
  const minutes = 10 + (entry.rank % 7)
  const seconds = String((entry.rank * 17) % 60).padStart(2, '0')
  const change = [4, 2, -1, 3, -2, 1, 0, 5, -3, 2, 1, -1][entry.rank - 1] ?? 0
  const starAvg = 2 + ((entry.userId.charCodeAt(1) * 7 + entry.rank * 3) % 15) / 10

  return {
    ...entry,
    ...meta,
    avgTime: `${minutes}:${seconds}`,
    change,
    games,
    level,
    starAvg,
  }
}

function LeaderboardContent({ period }: { period: LeaderboardPeriod }) {
  const [loaded, setLoaded] = useState<{ period: LeaderboardPeriod; data: LeaderboardEntry[] } | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchLeaderboard(period).then((data) => {
      if (!cancelled) setLoaded({ period, data: data.length ? data : FALLBACK_ENTRIES })
    })
    return () => { cancelled = true }
  }, [period])

  const loading = loaded?.period !== period
  const entries = (loaded?.data ?? []).map(enrichEntry)
  const filteredEntries = entries

  const periodMeta = PERIODS.find((p) => p.value === period)!

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="h-12 w-72 rounded-lg skeleton" />
              <div className="h-5 w-96 max-w-full rounded-full skeleton" />
            </div>
            <div className="flex gap-3">
              <div className="h-14 w-40 rounded-lg skeleton" />
              <div className="h-14 w-44 rounded-lg skeleton" />
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 rounded-lg skeleton" />
            ))}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="h-96 rounded-lg skeleton" />
            <div className="h-80 rounded-lg skeleton" />
          </div>
        </div>
      </div>
    )
  }

  const top3 = filteredEntries.slice(0, 3)
  const rest = filteredEntries.slice(3)
  const currentUser = CURRENT_USER_ID
    ? entries.find((entry) => entry.userId === CURRENT_USER_ID)
    : null
  const nextPlayer = currentUser
    ? entries.find((entry) => entry.rank === currentUser.rank - 1)
    : null
  const pointsToNextRank = currentUser && nextPlayer
    ? Math.max(0, nextPlayer.score - currentUser.score + 1)
    : 0
  const progressToNextRank = currentUser && nextPlayer
    ? Math.min(100, Math.round((currentUser.score / nextPlayer.score) * 100))
    : 100

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-primary-subtle/80 blur-3xl dark:bg-[#24312a]/50" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-accent-subtle/70 blur-3xl dark:bg-[#3a2517]/40" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-in">
            <div className="label-caps mb-4 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent-subtle px-4 py-2 text-[11px] text-accent">
              <Trophy className="h-5 w-5 fill-accent" />
              Season leaderboard
            </div>
            <h1 className="font-display text-[36px] font-semibold leading-tight tracking-[-0.01em] text-foreground md:text-[44px]">
              Leaderboard
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Compete with puzzle masters around the world. {periodMeta.description} ranked by score.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
            {PERIODS.map((p) => (
              <Link
                key={p.value}
                href={p.href}
                aria-current={period === p.value ? 'page' : undefined}
                className={cn(
                  'inline-flex h-10 min-w-[86px] items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]',
                  period === p.value && 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground'
                )}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </section>

        {top3.length > 0 && (
          <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.1fr_1fr] lg:gap-6">
            {top3.map((entry) => (
              <PodiumCard key={entry.userId} entry={entry} />
            ))}
          </section>
        )}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <LeaderboardTable entries={rest} />
          {currentUser && (
            <YourRankingCard
              currentUser={currentUser}
              pointsToNextRank={pointsToNextRank}
              progressToNextRank={progressToNextRank}
            />
          )}
        </section>
      </main>
    </div>
  )
}

/* public/golden_900.png is a 900x425 strip of three medal images
   (silver "2" / gold "1" / bronze "3", 300px per slice) with hollow centers.
   Hole center and diameter below are measured from the sprite: d=192px = 64% of a slice. */
const MEDAL_SPRITE: Record<number, { pos: string; cx: number; cy: number }> = {
  1: { pos: '50% 0%', cx: 50.2, cy: 63.2 },
  2: { pos: '0% 0%', cx: 51, cy: 63.6 },
  3: { pos: '100% 0%', cx: 50.7, cy: 63.8 },
}

const PODIUM_STYLE: Record<number, { card: string; games: string; star: string }> = {
  1: {
    card: 'border-[#e7d6a8] bg-[linear-gradient(150deg,#f9efd2_0%,#fdfaf3_48%,#f3e3bb_100%)] dark:border-[#8a6d2f]/60 dark:bg-[linear-gradient(150deg,rgba(216,178,94,0.22),rgba(255,255,255,0.06))]',
    games: 'bg-[#f7edd2] text-[#8a681f] dark:bg-[#f7edd2]/15 dark:text-[#e8cf9a]',
    star: 'bg-[#fdfaf3] text-[#6e7263] dark:bg-white/10 dark:text-zinc-100',
  },
  2: {
    card: 'border-[#ddd8c8] bg-[linear-gradient(155deg,#f2efe4_0%,#faf7ee_45%,#e6e1d0_100%)] dark:border-[#565f74]/60 dark:bg-[linear-gradient(155deg,rgba(168,164,148,0.22),rgba(255,255,255,0.06))]',
    games: 'bg-[#efece0] text-[#6f6b58] dark:bg-white/10 dark:text-zinc-100',
    star: 'bg-[#fdfaf3] text-[#6e7263] dark:bg-white/10 dark:text-zinc-100',
  },
  3: {
    card: 'border-[#e3b494] bg-[linear-gradient(150deg,#f9e8da_0%,#fdf6ee_45%,#f3ddc4_100%)] dark:border-[#a06b3a]/60 dark:bg-[linear-gradient(150deg,rgba(205,140,90,0.22),rgba(255,255,255,0.06))]',
    games: 'bg-[#f9e8da] text-[#a04d26] dark:bg-[#f9e8da]/15 dark:text-[#e0a184]',
    star: 'bg-[#fdfaf3] text-[#6e7263] dark:bg-white/10 dark:text-zinc-100',
  },
}

function PodiumCard({ entry }: { entry: EnrichedEntry }) {
  const style = PODIUM_STYLE[entry.rank] ?? PODIUM_STYLE[3]
  const sprite = MEDAL_SPRITE[entry.rank] ?? MEDAL_SPRITE[3]

  return (
    <Card
      className={cn(
        'relative rounded-lg border shadow-[0_18px_45px_-28px_rgba(80,60,25,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-26px_rgba(80,60,25,0.5)]',
        style.card,
        entry.rank === 1 && 'lg:order-2',
        entry.rank === 2 && 'lg:order-1',
        entry.rank === 3 && 'lg:order-3',
      )}
    >
      <CardContent className="flex min-h-[300px] items-stretch p-0 sm:min-h-[350px]">
        <div className="ml-[4.5%] w-[52%] shrink-0 self-start pb-4">
          <div
            className="relative aspect-[300/425] w-full bg-no-repeat"
            style={{
              backgroundImage: 'url(/golden_900.png)',
              backgroundSize: '300% 100%',
              backgroundPosition: sprite.pos,
            }}
          >
            <div
              className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
              style={{ left: `${sprite.cx}%`, top: `${sprite.cy}%`, width: '64%' }}
            >
              {entry.avatar.startsWith('http') || entry.avatar.startsWith('/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.avatar} alt={entry.username} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,#f3e2d6_0%,#e8cf9a_60%,#d8b25e_100%)] text-[36px] sm:text-[44px]">
                  <span>{entry.avatar}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start justify-center py-10 pl-[3%] pr-[4.5%]">
          <h2 className="font-display w-full truncate text-[20px] font-semibold leading-[1.25] tracking-[-0.01em] text-foreground sm:text-[22px]">
            {entry.username}
          </h2>
          <div className="mt-3 font-display text-[24px] font-semibold tracking-tight text-accent sm:mt-4 sm:text-[28px]">
            {entry.score.toLocaleString()}
          </div>
          <div className="mt-1 text-base font-medium text-muted-foreground">Points</div>
          <div className="mt-6 flex flex-col items-start gap-3 sm:mt-8 sm:gap-3">
            <span className={cn('rounded-md px-3.5 py-2 text-[13px] font-bold sm:text-sm', style.games)}>
              {entry.games} Games
            </span>
            <span className={cn('rounded-md px-3.5 py-2 text-[13px] font-bold sm:text-sm', style.star)}>
              Star Avg {entry.starAvg.toFixed(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LeaderboardTable({ entries }: { entries: EnrichedEntry[] }) {
  return (
    <Card className="overflow-hidden rounded-lg border-[#e7decb] bg-card shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] dark:border-[#3b3327]">
      <CardContent className="p-0">
        <div className="label-caps grid grid-cols-[72px_1.8fr_90px_100px_110px_110px_90px] items-center gap-4 border-b border-border px-5 py-5 text-[10px] text-muted-foreground max-lg:hidden lg:px-7">
          <span>Rank</span>
          <span>Player</span>
          <span>Level</span>
          <span>Games</span>
          <span>Avg. Time</span>
          <span>Points</span>
          <span>Change</span>
        </div>
        <div className="divide-y divide-border">
          {entries.length > 0 ? entries.map((entry, index) => (
            <div
              key={entry.userId}
              className="grid gap-4 px-5 py-4 transition-colors hover:bg-secondary/60 lg:grid-cols-[72px_1.8fr_90px_100px_110px_110px_90px] lg:items-center lg:px-7 animate-fade-in"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="font-display text-lg font-semibold text-foreground">{entry.rank}</div>
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-subtle to-secondary text-2xl ring-1 border border-[#e7decb]">
                  {entry.avatar}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-bold text-foreground">{entry.username}</div>
                  <div className="truncate text-xs text-muted-foreground">{entry.flag} {entry.country}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-accent">
                <Sparkles className="h-4 w-4 fill-accent" /> {entry.level}
              </div>
              <div className="text-sm font-semibold text-muted-foreground">{entry.games}</div>
              <div className="text-sm font-semibold text-muted-foreground">{entry.avgTime}</div>
              <div className="font-display text-[17px] font-semibold text-accent">{entry.score.toLocaleString()}</div>
              <RankChange value={entry.change} />
            </div>
          )) : (
            <div className="px-7 py-16 text-center text-sm font-semibold text-muted-foreground">
              No players match your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function YourRankingCard({
  currentUser,
  pointsToNextRank,
  progressToNextRank,
}: {
  currentUser: EnrichedEntry
  pointsToNextRank: number
  progressToNextRank: number
}) {
  return (
    <Card className="sticky top-6 rounded-lg border-[#e7decb] bg-card shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] dark:border-[#3b3327]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Your Ranking</h3>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-primary-subtle text-2xl">
            {currentUser.avatar}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm font-bold text-accent">#</div>
          <div className="font-display text-[56px] font-semibold leading-none tracking-tight text-accent">
            {currentUser.rank}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold">
            <RankChange value={currentUser.change} />
            <span className="text-muted-foreground">from last week</span>
          </div>
        </div>

        <div className="mt-7 text-center">
          <div className="font-display text-xl font-semibold text-foreground">{currentUser.score.toLocaleString()} Points</div>
          <div className="mt-2 text-sm text-muted-foreground">Level {currentUser.level} · {currentUser.games} games</div>
        </div>

        <div className="mt-7 rounded-lg bg-secondary p-4">
          <div className="mb-3 text-center text-sm font-semibold text-muted-foreground">
            {pointsToNextRank > 0
              ? `Need ${pointsToNextRank.toLocaleString()} points to reach #${currentUser.rank - 1}`
              : 'You are holding the top rank'}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e5dcc6] dark:bg-[#332c20]">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressToNextRank}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RankChange({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-sm font-bold text-sand-dark">-</span>
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-sm font-bold',
      value > 0 ? 'text-[#4a7259]' : 'text-destructive'
    )}>
      <span>{value > 0 ? '▲' : '▼'}</span>
      {Math.abs(value)}
    </span>
  )
}

export function LeaderboardView({ period }: { period: LeaderboardPeriod }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-[#08080c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <LeaderboardContent period={period} />
    </Suspense>
  )
}

export default function LeaderboardPage() {
  return <LeaderboardView period="all" />
}
