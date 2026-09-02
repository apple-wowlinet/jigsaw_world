'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ChevronDown, Crown, Globe2, Search, Sparkles, Star, Trophy, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

  return {
    ...entry,
    ...meta,
    avgTime: `${minutes}:${seconds}`,
    change,
    games,
    level,
  }
}

function LeaderboardContent({ period }: { period: LeaderboardPeriod }) {
  const [query, setQuery] = useState('')
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
  const filteredEntries = entries.filter((entry) =>
    entry.username.toLowerCase().includes(query.trim().toLowerCase())
  )

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

          <div className="grid grid-cols-2 gap-3 sm:min-w-[440px] animate-fade-in" style={{ animationDelay: '80ms' }}>
            <MetricCard icon={<Star className="h-5 w-5 fill-gold text-gold" />} title="Season 12" value="12 Days Left" />
            <MetricCard icon={<Users className="h-5 w-5 text-primary" />} title="32,841" value="Active Players" />
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
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

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 justify-between gap-3 rounded-lg px-4">
              <Globe2 className="h-4 w-4 text-primary" />
              All Players
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search player..."
                className="h-11 rounded-lg border-input bg-card pl-11 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </section>

        {top3.length > 0 && (
          <section className="mt-5 grid gap-5 lg:grid-cols-3">
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

function MetricCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <Card className="rounded-lg border-[#e7decb] bg-card shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] dark:border-[#3b3327]">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-primary-subtle">
          {icon}
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-foreground">{title}</div>
          <div className="text-sm text-muted-foreground">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function PodiumCard({ entry }: { entry: EnrichedEntry }) {
  const isChampion = entry.rank === 1
  const medalStyle = getMedalStyle(entry.rank)

  return (
    <Card className={cn(
      'group relative overflow-hidden rounded-lg border-0 shadow-[0_18px_45px_-28px_rgba(80,60,25,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(80,60,25,0.5)] dark:border dark:border-[#3b3327]',
      medalStyle.card
    )}>
      <CardContent className="relative min-h-[292px] p-6 sm:p-8">
        <div className="absolute right-6 top-5 rounded-full bg-card/70 px-3 py-1 text-xs font-bold text-foreground ring-1 border border-[#ddd2ba] dark:bg-black/20 dark:text-white dark:ring-white/10">
          #{entry.rank}
        </div>
        <div className="absolute -left-14 -top-20 h-52 w-52 rounded-full bg-white/45 blur-2xl dark:bg-white/10" />

        <div className="flex h-full items-center gap-5">
          <div className="relative shrink-0">
            {isChampion && <Crown className="absolute -top-8 left-1/2 h-8 w-8 -translate-x-1/2 fill-[#d8b25e] text-[#b98a2f] drop-shadow" />}
            <div className={cn('relative flex h-32 w-32 items-center justify-center rounded-full p-2 shadow-2xl sm:h-40 sm:w-40', medalStyle.ring)}>
              <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#fdfaf3] bg-panel text-6xl shadow-inner dark:border-[#1c2016] dark:bg-[#14170f]">
                {entry.avatar}
              </div>
              <div className="absolute -top-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#fdfaf3] bg-parchment text-xl font-black text-foreground shadow-lg dark:border-[#14170f] dark:from-slate-800 dark:to-slate-900">
                {entry.rank}
              </div>
            </div>
          </div>

          <div className="min-w-0 pt-8">
            <h2 className="font-display truncate text-[22px] font-semibold text-foreground">{entry.username}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{entry.flag}</span>
              <span>{entry.country}</span>
            </div>
            <div className="mt-7 font-display text-[28px] font-semibold tracking-tight text-accent">
              {entry.score.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Points</div>
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent-subtle px-3 py-1 text-xs font-bold text-accent">
                <Sparkles className="h-3.5 w-3.5 fill-accent" /> Level {entry.level}
              </span>
              {isChampion && (
                <span className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-warning-subtle px-3 py-1 text-xs font-bold text-warning">
                  <Crown className="h-3.5 w-3.5 fill-gold text-gold" /> Legend
                </span>
              )}
            </div>
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
        <div className="label-caps grid grid-cols-[72px_1.8fr_90px_100px_110px_110px_90px] items-center border-b border-border px-7 py-5 text-[10px] text-muted-foreground max-lg:hidden">
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

function getMedalStyle(rank: number) {
  if (rank === 1) {
    return {
      card: 'bg-[linear-gradient(135deg,#f7edd2_0%,#fdfaf3_48%,#ecd9ac_100%)] dark:bg-[linear-gradient(135deg,rgba(216,178,94,0.22),rgba(255,255,255,0.06))]',
      ring: 'bg-[linear-gradient(135deg,#b98a2f,#eedca6,#8a681f)]',
    }
  }

  if (rank === 2) {
    return {
      card: 'bg-[linear-gradient(135deg,#efece0_0%,#fdfaf3_50%,#ddd8c8_100%)] dark:bg-[linear-gradient(135deg,rgba(168,164,148,0.25),rgba(255,255,255,0.06))]',
      ring: 'bg-[linear-gradient(135deg,#948f7d,#f4f1e6,#6f6b58)]',
    }
  }

  return {
    card: 'bg-[linear-gradient(135deg,#f6e3d7_0%,#fdfaf3_50%,#eccdb4_100%)] dark:bg-[linear-gradient(135deg,rgba(205,122,69,0.25),rgba(255,255,255,0.06))]',
    ring: 'bg-[linear-gradient(135deg,#a04d26,#e8c9a8,#7d3a1c)]',
  }
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
