'use client'

import { useEffect, useMemo, useState } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Flame,
  Grid2X2,
  Play,
  Puzzle,
  Settings2,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import {
  fetchDailyChallengeProgress,
  fetchDailyHistory,
  fetchDailyPuzzle,
  type DailyChallengeParticipation,
  type DailyChallengeProgress,
  type DailyPuzzle,
} from '@/lib/data/public'
import { cn } from '@/lib/utils'

const FALLBACK_TODAY: DailyPuzzle = {
  id: 'rainbow-glass-texture',
  uuid: 'fallback-rainbow-glass',
  challenge_id: 'fallback-daily-aug-14',
  challenge_date: '2026-08-14',
  challenge_title: 'Rainbow Glass Texture',
  title: 'Rainbow Glass Texture',
  slug: 'rainbow-glass-texture',
  image_url:
    'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=1400&h=900&fit=crop',
  description: 'Piece together a brilliant mosaic of color and light.',
  piece_count: 120,
  difficulty: 'Medium',
  plays_count: 1160,
  weekly_plays_count: 320,
  completions_count: 610,
  rating: 4.7,
  created_at: '2026-08-14T00:00:00.000Z',
  category: 'Art',
  category_slug: 'art',
}

const FALLBACK_HISTORY: DailyPuzzle[] = [
  {
    id: 'watercolor-flowers',
    uuid: 'fallback-watercolor-flowers',
    challenge_id: 'fallback-daily-aug-13',
    challenge_date: '2026-08-13',
    challenge_title: 'Watercolor Flowers',
    title: 'Watercolor Flowers',
    slug: 'watercolor-flowers',
    image_url:
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1000&h=650&fit=crop',
    description: 'Soft watercolor flowers in gentle pastel shades.',
    piece_count: 120,
    difficulty: 'Easy',
    plays_count: 1010,
    weekly_plays_count: 280,
    completions_count: 590,
    rating: 4.6,
    created_at: '2026-08-13T00:00:00.000Z',
    category: 'Art',
    category_slug: 'art',
  },
  {
    id: 'venice-canal-ride',
    uuid: 'fallback-venice-canal',
    challenge_id: 'fallback-daily-aug-12',
    challenge_date: '2026-08-12',
    challenge_title: 'Venice Canal Ride',
    title: 'Venice Canal Ride',
    slug: 'venice-canal-ride',
    image_url:
      'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1000&h=650&fit=crop',
    description: 'A classic canal ride through a beautiful old city.',
    piece_count: 100,
    difficulty: 'Medium',
    plays_count: 1660,
    weekly_plays_count: 440,
    completions_count: 990,
    rating: 4.8,
    created_at: '2026-08-12T00:00:00.000Z',
    category: 'Travel',
    category_slug: 'travel',
  },
  {
    id: 'sushi-platter-detail',
    uuid: 'fallback-sushi-platter',
    challenge_id: 'fallback-daily-aug-11',
    challenge_date: '2026-08-11',
    challenge_title: 'Sushi Platter Detail',
    title: 'Sushi Platter Detail',
    slug: 'sushi-platter-detail',
    image_url:
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1000&h=650&fit=crop',
    description: 'A detailed sushi platter with clean colors and shapes.',
    piece_count: 200,
    difficulty: 'Hard',
    plays_count: 880,
    weekly_plays_count: 210,
    completions_count: 310,
    rating: 4.4,
    created_at: '2026-08-11T00:00:00.000Z',
    category: 'Food',
    category_slug: 'food',
  },
]

const EMPTY_PROGRESS: DailyChallengeProgress = {
  currentStreak: 0,
  maxStreak: 0,
  completedThisMonth: 0,
  participations: {},
}

const FALLBACK_PROGRESS: DailyChallengeProgress = {
  currentStreak: 6,
  maxStreak: 8,
  completedThisMonth: 10,
  participations: {
    'fallback-daily-aug-13': {
      challengeId: 'fallback-daily-aug-13',
      challengeDate: '2026-08-13',
      isCompleted: true,
      progressPercent: 100,
      completionTime: 522,
    },
    'fallback-daily-aug-12': {
      challengeId: 'fallback-daily-aug-12',
      challengeDate: '2026-08-12',
      isCompleted: false,
      progressPercent: 64,
      completionTime: null,
    },
  },
}

function parseChallengeDate(value: string) {
  return new Date(`${value}T12:00:00Z`)
}

function formatChallengeBadge(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
    .format(parseChallengeDate(value))
    .toUpperCase()
}

function formatCardDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parseChallengeDate(value))
}

function formatCompletionTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function DailyPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.82fr_1.25fr]">
          <div className="space-y-4 py-3">
            <div className="h-7 w-44 rounded-full skeleton" />
            <div className="h-10 w-80 max-w-full rounded-lg skeleton" />
            <div className="h-5 w-96 max-w-full rounded-lg skeleton" />
            <div className="h-6 w-72 max-w-full rounded-lg skeleton" />
            <div className="h-14 w-80 max-w-full rounded-lg skeleton" />
          </div>
          <div className="aspect-[1.82/1] rounded-lg skeleton" />
        </div>
        <div className="mt-5 h-20 rounded-lg skeleton" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-64 rounded-lg skeleton" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DailyPage() {
  const { user, loading: authLoading } = useAuth()
  const [dailyPuzzle, setDailyPuzzle] = useState(FALLBACK_TODAY)
  const [historyPuzzles, setHistoryPuzzles] = useState(FALLBACK_HISTORY)
  const [remoteProgress, setRemoteProgress] =
    useState<DailyChallengeProgress | null>(null)
  const [usingFallbackData, setUsingFallbackData] = useState(true)
  const [loading, setLoading] = useState(true)
  const [selectedPieces, setSelectedPieces] = useState(
    FALLBACK_TODAY.piece_count
  )
  const [pieceMenuOpen, setPieceMenuOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([fetchDailyPuzzle(), fetchDailyHistory(4)]).then(
      ([today, history]) => {
        if (cancelled) return

        if (today) {
          setDailyPuzzle(today)
          setSelectedPieces(today.piece_count)
          setHistoryPuzzles(
            history
              .filter((item) => item.challenge_id !== today.challenge_id)
              .slice(0, 3)
          )
          setUsingFallbackData(false)
        }
        setLoading(false)
      }
    )

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (authLoading || loading) return
    if (usingFallbackData || !user) return

    let cancelled = false
    const challengeDate = parseChallengeDate(dailyPuzzle.challenge_date)
    const monthStart = `${challengeDate.getUTCFullYear()}-${String(
      challengeDate.getUTCMonth() + 1
    ).padStart(2, '0')}-01`

    fetchDailyChallengeProgress(user.id, monthStart).then((nextProgress) => {
      if (!cancelled) setRemoteProgress(nextProgress)
    })

    return () => {
      cancelled = true
    }
  }, [
    authLoading,
    dailyPuzzle.challenge_date,
    loading,
    user,
    usingFallbackData,
  ])

  const progress = usingFallbackData
    ? FALLBACK_PROGRESS
    : remoteProgress ?? EMPTY_PROGRESS

  const calendarDays = useMemo(() => {
    const current = parseChallengeDate(dailyPuzzle.challenge_date)
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(current)
      date.setUTCDate(current.getUTCDate() + index - 4)
      return date
    })
  }, [dailyPuzzle.challenge_date])

  if (loading) return <DailyPageSkeleton />

  const challengeDate = parseChallengeDate(dailyPuzzle.challenge_date)
  const challengeDay = challengeDate.getUTCDate()
  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    timeZone: 'UTC',
  }).format(challengeDate)
  const completionRatio = Math.min(
    100,
    Math.round((progress.completedThisMonth / Math.max(challengeDay, 1)) * 100)
  )
  const pieceChoices = [...new Set([48, 80, 120, 200, dailyPuzzle.piece_count])]
    .sort((a, b) => a - b)

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_30%_8%,rgba(255,255,255,0.95),rgba(255,250,247,0.65)_45%,transparent_75%)] dark:opacity-10"
      />

      <main className="relative mx-auto max-w-[1380px] px-4 pb-14 pt-5 sm:px-6 lg:px-8">
        <section className="grid items-center gap-7 lg:grid-cols-[0.82fr_1.25fr] lg:gap-12">
          <div className="min-w-0 py-1 lg:py-3">
            <div className="label-caps inline-flex h-7 items-center gap-2 rounded-full border border-accent/30 bg-accent-subtle px-3.5 text-[10px] text-accent sm:text-[11px]">
              <CalendarDays className="h-3.5 w-3.5" />
              Today&apos;s Puzzle · {formatChallengeBadge(dailyPuzzle.challenge_date)}
            </div>

            <h1 className="font-display mt-4 text-[34px] font-semibold leading-[1.06] tracking-[-0.01em] text-foreground sm:text-[40px] lg:text-[46px]">
              {dailyPuzzle.title}
            </h1>
            <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-muted-foreground sm:text-base">
              {dailyPuzzle.description ||
                'Piece together a beautiful daily challenge.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-y-2 text-xs font-semibold text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5 pr-4">
                <Puzzle className="h-[18px] w-[18px] text-primary" />
                {selectedPieces} Pieces
              </span>
              <span className="inline-flex items-center gap-1.5 border-l border-border px-4">
                <BarChart3 className="h-[18px] w-[18px] text-primary" />
                {dailyPuzzle.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 border-l border-border pl-4">
                <Clock3 className="h-[18px] w-[18px] text-primary" />
                About {Math.max(5, Math.round(selectedPieces / 10))} min
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/play/${dailyPuzzle.slug}?pieces=${selectedPieces}`}
                className="btn btn-terracotta btn-lg btn-shine"
              >
                <Puzzle className="h-[18px] w-[18px]" />
                Start Today&apos;s Puzzle
              </Link>

              <div className="relative">
                <button
                  type="button"
                  aria-expanded={pieceMenuOpen}
                  onClick={() => setPieceMenuOpen((open) => !open)}
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-accent"
                >
                  <Settings2 className="h-[18px] w-[18px]" />
                  Choose Pieces
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition',
                      pieceMenuOpen && 'rotate-180'
                    )}
                  />
                </button>
                {pieceMenuOpen && (
                  <div className="absolute left-0 top-14 z-30 grid min-w-48 grid-cols-2 gap-1 rounded-lg border border-border bg-popover p-2 shadow-xl">
                    {pieceChoices.map((pieceCount) => (
                      <button
                        key={pieceCount}
                        type="button"
                        onClick={() => {
                          setSelectedPieces(pieceCount)
                          setPieceMenuOpen(false)
                        }}
                        className={cn(
                          'rounded-md px-3 py-2 text-xs font-bold transition',
                          selectedPieces === pieceCount
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-secondary'
                        )}
                      >
                        {pieceCount} pcs
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-accent/25 bg-accent-subtle px-3 py-2 text-[11px] font-semibold text-muted-foreground">
              <Flame className="h-4 w-4 fill-accent text-accent" />
              <strong className="text-accent">
                {progress.currentStreak}-day streak
              </strong>
              <span className="text-border">•</span>
              Complete today to reach {progress.currentStreak + 1}
            </div>
          </div>

          <div className="relative">
            <div className="frame-gold relative p-[10px]">
              <div className="frame-gold-inner p-[7px]">
                <div className="relative aspect-[1.82/1] overflow-hidden bg-muted">
                  <SafeImage
                    src={dailyPuzzle.image_url}
                    alt={dailyPuzzle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241d10]/15 via-transparent to-transparent" />
                  <div className="absolute right-3.5 top-3.5 inline-flex h-7 items-center gap-1.5 rounded-full bg-card/95 px-3 text-[11px] font-bold text-foreground shadow-lg backdrop-blur-md">
                    <Puzzle className="h-3.5 w-3.5" />
                    {selectedPieces} pcs
                  </div>
                  <Link
                    href={`/play/${dailyPuzzle.slug}?pieces=${selectedPieces}`}
                    aria-label={`Play ${dailyPuzzle.title}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition hover:bg-[#241d10]/15 hover:opacity-100"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card/95 text-accent shadow-xl">
                      <Play className="h-5 w-5 fill-current" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4 rounded-lg border border-[#e7decb] bg-card px-4 py-3.5 shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] dark:border-[#3b3327] md:flex-row md:items-center">
          <div className="flex shrink-0 items-center gap-3 md:min-w-[245px]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-primary-subtle text-primary">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xs font-extrabold text-foreground sm:text-sm">
                {monthName} Progress
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                {progress.completedThisMonth} of {challengeDay} challenges completed
              </p>
            </div>
          </div>

          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e5dcc6] dark:bg-[#332c20]">
            <div
              className="h-full rounded-full bg-[#4a7259] transition-[width] duration-700"
              style={{ width: `${completionRatio}%` }}
            />
          </div>

          <div className="flex items-start justify-between gap-2 md:shrink-0 md:justify-end">
            {calendarDays.map((date) => {
              const dateKey = date.toISOString().slice(0, 10)
              const day = date.getUTCDate()
              const isToday = day === challengeDay
              const isFuture = date > challengeDate
              const recordedComplete = Object.values(
                progress.participations
              ).some(
                (participation) =>
                  participation.challengeDate === dateKey &&
                  participation.isCompleted
              )
              const fallbackComplete =
                usingFallbackData && day >= challengeDay - 4 && day < challengeDay
              const isComplete = recordedComplete || fallbackComplete

              return (
                <div
                  key={dateKey}
                  className="flex w-8 flex-col items-center gap-1"
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold',
                      isToday && 'bg-accent text-accent-foreground shadow-sm',
                      !isToday &&
                        !isFuture &&
                        'bg-secondary text-muted-foreground',
                      isFuture &&
                        'bg-muted text-muted-foreground/60'
                    )}
                  >
                    {day}
                  </span>
                  {isComplete ? (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="h-3.5" />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="label-caps text-foreground">Previous Challenges</h2>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                Catch up on puzzles you missed.
              </p>
            </div>
            <Link
              href="/daily/archive"
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#ddd2ba] bg-card px-3 text-[10px] font-bold text-accent transition hover:border-accent/60 hover:text-accent/80 dark:border-[#3b3327] sm:text-[11px]"
            >
              <Grid2X2 className="h-3.5 w-3.5" />
              Explore All Daily Puzzles
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {historyPuzzles.map((puzzle) => (
              <PreviousChallengeCard
                key={puzzle.challenge_id}
                puzzle={puzzle}
                participation={progress.participations[puzzle.challenge_id]}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function PreviousChallengeCard({
  puzzle,
  participation,
}: {
  puzzle: DailyPuzzle
  participation?: DailyChallengeParticipation
}) {
  const completed = participation?.isCompleted ?? false
  const progressPercent = participation?.progressPercent ?? 0
  const started = !completed && progressPercent > 0
  const actionLabel = completed ? 'Play Again' : started ? 'Continue' : 'Play Puzzle'

  return (
    <article className="group overflow-hidden rounded-lg border border-[#e7decb] bg-card shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]">
      <Link
        href={`/play/${puzzle.slug}`}
        className="relative block aspect-[1.94/1] overflow-hidden bg-muted"
      >
        <SafeImage
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {completed && (
          <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
        {started && (
          <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-card/80 bg-[#2c322a]/55 text-[8px] font-extrabold text-foreground shadow-md backdrop-blur">
            {progressPercent}%
          </span>
        )}
      </Link>

      <div className="px-3.5 pb-3 pt-3">
        <h3 className="font-display truncate text-[17px] font-semibold text-foreground sm:text-[18px]">
          {puzzle.title}
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="truncate text-[9px] font-medium text-muted-foreground sm:text-[10px]">
            {formatCardDate(puzzle.challenge_date)}
            <span className="mx-1 text-sand-dark">•</span>
            {puzzle.piece_count} pieces
            <span className="mx-1 text-sand-dark">•</span>
            {puzzle.difficulty}
          </p>
          {completed && participation?.completionTime ? (
            <span className="shrink-0 rounded-full bg-success-subtle px-2 py-1 text-[8px] font-bold text-[#4a7259] sm:text-[9px]">
              Completed · {formatCompletionTime(participation.completionTime)}
            </span>
          ) : started ? (
            <span className="shrink-0 text-[8px] font-bold text-[#4a7259] sm:text-[9px]">
              {progressPercent}% complete
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[8px] font-semibold text-muted-foreground sm:text-[9px]">
              Not started
            </span>
          )}
        </div>

        {started && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e5dcc6] dark:bg-[#332c20]">
            <div
              className="h-full rounded-full bg-[#4a7259]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <Link
          href={`/play/${puzzle.slug}`}
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-[10px] font-bold transition sm:text-[11px]',
            completed ? 'text-[#4a7259]' : 'text-accent'
          )}
        >
          {actionLabel}
          <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
