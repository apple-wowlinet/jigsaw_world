'use client'

import { useState, useEffect, Suspense } from 'react'
import { Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'
import { fetchLeaderboard } from '@/lib/leaderboard'

const PERIODS: { value: LeaderboardPeriod; label: string; description: string }[] = [
  { value: 'all', label: 'All-Time', description: 'All-time total score' },
  { value: 'monthly', label: 'Monthly', description: "This month's score" },
  { value: 'weekly', label: 'Weekly', description: "This week's score" },
]

// Medal colors reused from puzzle/[slug]/page.tsx getRankStyle convention.
function getRankStyle(rank: number) {
  switch (rank) {
    case 1: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
    case 2: return 'bg-gray-400/20 text-gray-300 border-gray-400/40'
    case 3: return 'bg-orange-600/20 text-orange-400 border-orange-600/40'
    default: return 'bg-secondary text-secondary-foreground border-border'
  }
}

function LeaderboardContent() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('all')
  const [loaded, setLoaded] = useState<{ period: LeaderboardPeriod; data: LeaderboardEntry[] } | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchLeaderboard(period).then((data) => {
      if (!cancelled) setLoaded({ period, data })
    })
    return () => { cancelled = true }
  }, [period])

  const loading = loaded?.period !== period
  const entries = loaded?.data ?? []

  const periodMeta = PERIODS.find((p) => p.value === period)!

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Title skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-secondary dark:bg-secondary/40 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-secondary dark:bg-secondary/40 rounded w-80 mx-auto animate-pulse" />
          </div>
          {/* Podium skeleton */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[2, 1, 3].map((slot) => (
              <Card key={slot} className={cn('animate-pulse border-0 dark:border dark:border-white/10 dark:bg-card', slot === 1 && 'mt-0', slot !== 1 && 'mt-8')}>
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-secondary dark:bg-secondary/40 mb-3" />
                  <div className="h-4 bg-secondary dark:bg-secondary/40 rounded w-24 mb-2" />
                  <div className="h-3 bg-secondary dark:bg-secondary/40 rounded w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* List skeleton */}
          <div className="max-w-3xl mx-auto space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary dark:bg-secondary/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <section className="pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4 border border-primary/20 animate-fade-in">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 dark:from-white dark:to-white/70 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Top Players
            </h1>
            <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '150ms' }}>
              {periodMeta.description} — ranked by score.
            </p>
          </div>
        </section>

        {/* Period Tabs */}
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-card/50 dark:bg-white/5 backdrop-blur-sm border border-border/50 dark:border-white/10 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
              {PERIODS.map((p) => (
                <Button
                  key={p.value}
                  variant={period === p.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPeriod(p.value)}
                  className={cn(
                    'min-w-[100px] transition-all',
                    period === p.value
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                      : 'hover:bg-secondary dark:hover:bg-white/10'
                  )}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Medal Podium (top 3) */}
        {top3.length > 0 && (
          <section className="pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 gap-3 md:gap-6 items-end">
                {/* Rank 2 (left) */}
                {top3[1] && <PodiumBlock entry={top3[1]} place={2} />}
                {/* Rank 1 (center, tallest) */}
                {top3[0] && <PodiumBlock entry={top3[0]} place={1} />}
                {/* Rank 3 (right) */}
                {top3[2] && <PodiumBlock entry={top3[2]} place={3} />}
              </div>
            </div>
          </section>
        )}

        {/* Ranked List (rank 4+) */}
        {rest.length > 0 && (
          <section className="pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-2">
                {rest.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className="leaderboard-item flex items-center gap-4 p-4 rounded-xl bg-card dark:bg-card border border-border/50 dark:border-white/5 transition-colors hover:bg-accent/5 animate-fade-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="w-10 text-center text-sm font-bold text-muted-foreground dark:text-gray-400 shrink-0">
                      #{entry.rank}
                    </div>
                    <div className="text-2xl shrink-0">{entry.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-foreground dark:text-white truncate block">
                        {entry.username}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-primary">
                        {entry.score.toLocaleString()}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground dark:text-gray-500">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// Single podium column. `place` is 1/2/3 for medal styling and height.
function PodiumBlock({ entry, place }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) {
  const heightClass = place === 1 ? 'md:py-10' : 'md:py-7'
  const avatarSize = place === 1 ? 'text-5xl' : 'text-4xl'
  return (
    <div className={cn('animate-fade-in', place !== 1 && 'mt-6 md:mt-10')} style={{ animationDelay: `${place * 60}ms` }}>
      <Card className={cn(
        'border text-center bg-card dark:bg-card/60 backdrop-blur-sm shadow-lg',
        getRankStyle(place).split(' ').filter(c => c.startsWith('border-')).join(' ')
      )}>
        <CardContent className={cn('p-4 md:p-6 flex flex-col items-center', heightClass)}>
          <div className={cn('mb-2', avatarSize)}>{entry.avatar}</div>
          {place === 1 && <div className="text-2xl mb-1">👑</div>}
          <div className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm font-bold mb-2',
            getRankStyle(place)
          )}>
            {place}
          </div>
          <span className="font-semibold text-foreground dark:text-white text-sm md:text-base truncate max-w-full">
            {entry.username}
          </span>
          <span className="font-bold text-primary text-sm md:text-lg mt-1">
            {entry.score.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground dark:text-gray-500">pts</span>
        </CardContent>
      </Card>
    </div>
  )
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
