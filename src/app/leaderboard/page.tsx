'use client'

import { useState, useEffect, Suspense } from 'react'
import { ChevronDown, Crown, Globe2, Search, Sparkles, Star, Trophy, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'
import { fetchLeaderboard } from '@/lib/leaderboard'

const PERIODS: { value: LeaderboardPeriod; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: "Today's score" },
  { value: 'weekly', label: 'Weekly', description: "This week's score" },
  { value: 'monthly', label: 'Monthly', description: "This month's score" },
  { value: 'all', label: 'All Time', description: 'All-time total score' },
]

const CURRENT_USER_ID: string | null = null

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

function LeaderboardContent() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly')
  const [query, setQuery] = useState('')
  const [loaded, setLoaded] = useState<{ period: LeaderboardPeriod; data: LeaderboardEntry[] } | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchLeaderboard(period).then((data) => {
      if (!cancelled) setLoaded({ period, data })
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
      <div className="min-h-screen bg-[#f5f8ff] dark:bg-[#08080c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="h-12 w-72 rounded-2xl bg-white/80 dark:bg-white/10 animate-pulse" />
              <div className="h-5 w-96 max-w-full rounded-full bg-white/80 dark:bg-white/10 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-14 w-40 rounded-2xl bg-white/80 dark:bg-white/10 animate-pulse" />
              <div className="h-14 w-44 rounded-2xl bg-white/80 dark:bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 rounded-3xl bg-white/80 dark:bg-white/10 animate-pulse" />
            ))}
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="h-96 rounded-3xl bg-white/80 dark:bg-white/10 animate-pulse" />
            <div className="h-80 rounded-3xl bg-white/80 dark:bg-white/10 animate-pulse" />
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
    <div className="min-h-screen overflow-hidden bg-[#f5f8ff] text-slate-950 dark:bg-[#08080c] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-amber-100/80 blur-3xl dark:bg-amber-500/10" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 dark:bg-white/10 dark:text-blue-200 dark:ring-white/10">
              <Trophy className="h-5 w-5 fill-amber-400 text-amber-400" />
              Season leaderboard
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl dark:text-white">
              Leaderboard
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              Compete with puzzle masters around the world. {periodMeta.description} ranked by score.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[440px] animate-fade-in" style={{ animationDelay: '80ms' }}>
            <MetricCard icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />} title="Season 12" value="12 Days Left" />
            <MetricCard icon={<Users className="h-5 w-5 text-blue-600" />} title="32,841" value="Active Players" />
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-2xl bg-white/70 p-1 shadow-sm ring-1 ring-slate-200/70 backdrop-blur dark:bg-white/5 dark:ring-white/10">
            {PERIODS.map((p) => (
              <Button
                key={p.value}
                variant="ghost"
                onClick={() => setPeriod(p.value)}
                className={cn(
                  'min-w-[86px] rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-white/10',
                  period === p.value && 'bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-200'
                )}
              >
                {p.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 justify-between gap-3 rounded-2xl border-slate-200 bg-white/80 px-4 text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <Globe2 className="h-4 w-4 text-blue-600" />
              All Players
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search player..."
                className="h-11 rounded-2xl border-slate-200 bg-white/80 pl-11 shadow-sm dark:border-white/10 dark:bg-white/5"
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
    <Card className="rounded-3xl border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(30,64,175,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-white/10">
          {icon}
        </div>
        <div>
          <div className="font-black text-slate-900 dark:text-white">{title}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{value}</div>
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
      'group relative overflow-hidden rounded-3xl border-0 shadow-[0_22px_50px_rgba(30,64,175,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(30,64,175,0.16)] dark:border dark:border-white/10',
      medalStyle.card
    )}>
      <CardContent className="relative min-h-[292px] p-6 sm:p-8">
        <div className="absolute right-6 top-5 rounded-full bg-white/55 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-white/60 dark:bg-black/20 dark:text-white dark:ring-white/10">
          #{entry.rank}
        </div>
        <div className="absolute -left-14 -top-20 h-52 w-52 rounded-full bg-white/45 blur-2xl dark:bg-white/10" />

        <div className="flex h-full items-center gap-5">
          <div className="relative shrink-0">
            {isChampion && <Crown className="absolute -top-8 left-1/2 h-8 w-8 -translate-x-1/2 fill-amber-400 text-amber-500 drop-shadow" />}
            <div className={cn('relative flex h-32 w-32 items-center justify-center rounded-full p-2 shadow-2xl sm:h-40 sm:w-40', medalStyle.ring)}>
              <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white/80 bg-white text-6xl shadow-inner dark:border-white/20 dark:bg-slate-950">
                {entry.avatar}
              </div>
              <div className="absolute -top-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-b from-white to-slate-100 text-xl font-black text-slate-700 shadow-lg dark:border-slate-950 dark:from-slate-800 dark:to-slate-900 dark:text-white">
                {entry.rank}
              </div>
            </div>
          </div>

          <div className="min-w-0 pt-8">
            <h2 className="truncate text-xl font-black text-slate-950 dark:text-white">{entry.username}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
              <span>{entry.flag}</span>
              <span>{entry.country}</span>
            </div>
            <div className="mt-7 text-3xl font-black tracking-tight text-blue-600 dark:text-blue-300">
              {entry.score.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Points</div>
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-200">
                <Sparkles className="h-3.5 w-3.5 fill-violet-500 text-violet-500" /> Level {entry.level}
              </span>
              {isChampion && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 shadow-sm dark:bg-amber-500/15 dark:text-amber-200">
                  <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Legend
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
    <Card className="overflow-hidden rounded-3xl border-white/70 bg-white/85 shadow-[0_22px_50px_rgba(15,23,42,0.07)] backdrop-blur dark:border-white/10 dark:bg-white/5">
      <CardContent className="p-0">
        <div className="grid grid-cols-[72px_1.8fr_90px_100px_110px_110px_90px] items-center border-b border-slate-200/80 px-7 py-5 text-xs font-black uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400 max-lg:hidden">
          <span>Rank</span>
          <span>Player</span>
          <span>Level</span>
          <span>Games</span>
          <span>Avg. Time</span>
          <span>Points</span>
          <span>Change</span>
        </div>
        <div className="divide-y divide-slate-200/80 dark:divide-white/10">
          {entries.length > 0 ? entries.map((entry, index) => (
            <div
              key={entry.userId}
              className="grid gap-4 px-5 py-4 transition-colors hover:bg-blue-50/50 dark:hover:bg-white/5 lg:grid-cols-[72px_1.8fr_90px_100px_110px_110px_90px] lg:items-center lg:px-7 animate-fade-in"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="text-lg font-black text-slate-900 dark:text-white">{entry.rank}</div>
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-slate-100 text-2xl ring-1 ring-white dark:from-white/10 dark:to-white/5 dark:ring-white/10">
                  {entry.avatar}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-black text-slate-950 dark:text-white">{entry.username}</div>
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">{entry.flag} {entry.country}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-black text-violet-600 dark:text-violet-300">
                <Sparkles className="h-4 w-4 fill-violet-500 text-violet-500" /> {entry.level}
              </div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{entry.games}</div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{entry.avgTime}</div>
              <div className="text-base font-black text-blue-600 dark:text-blue-300">{entry.score.toLocaleString()}</div>
              <RankChange value={entry.change} />
            </div>
          )) : (
            <div className="px-7 py-16 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
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
    <Card className="sticky top-6 rounded-3xl border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-white/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-950 dark:text-white">Your Ranking</h3>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-2xl dark:bg-white/10">
            {currentUser.avatar}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm font-black text-blue-600 dark:text-blue-300">#</div>
          <div className="text-6xl font-black tracking-tight text-blue-600 dark:text-blue-300">
            {currentUser.rank}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold">
            <RankChange value={currentUser.change} />
            <span className="text-slate-500 dark:text-slate-400">from last week</span>
          </div>
        </div>

        <div className="mt-7 text-center">
          <div className="text-xl font-black text-slate-950 dark:text-white">{currentUser.score.toLocaleString()} Points</div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Level {currentUser.level} · {currentUser.games} games</div>
        </div>

        <div className="mt-7 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
          <div className="mb-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            {pointsToNextRank > 0
              ? `Need ${pointsToNextRank.toLocaleString()} points to reach #${currentUser.rank - 1}`
              : 'You are holding the top rank'}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-400"
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
    return <span className="text-sm font-black text-slate-400">-</span>
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-sm font-black',
      value > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
    )}>
      <span>{value > 0 ? '▲' : '▼'}</span>
      {Math.abs(value)}
    </span>
  )
}

function getMedalStyle(rank: number) {
  if (rank === 1) {
    return {
      card: 'bg-[linear-gradient(135deg,#fff8dd_0%,#ffffff_48%,#ffe2a3_100%)] dark:bg-[linear-gradient(135deg,rgba(251,191,36,0.22),rgba(255,255,255,0.06))]',
      ring: 'bg-[linear-gradient(135deg,#f59e0b,#fde68a,#b45309)]',
    }
  }

  if (rank === 2) {
    return {
      card: 'bg-[linear-gradient(135deg,#eef4ff_0%,#ffffff_50%,#dce8ff_100%)] dark:bg-[linear-gradient(135deg,rgba(148,163,184,0.22),rgba(255,255,255,0.06))]',
      ring: 'bg-[linear-gradient(135deg,#94a3b8,#f8fafc,#64748b)]',
    }
  }

  return {
    card: 'bg-[linear-gradient(135deg,#fff0e7_0%,#ffffff_50%,#ffd7c2_100%)] dark:bg-[linear-gradient(135deg,rgba(249,115,22,0.22),rgba(255,255,255,0.06))]',
    ring: 'bg-[linear-gradient(135deg,#c2410c,#fed7aa,#92400e)]',
  }
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-[#08080c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  )
}
