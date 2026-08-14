'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
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
    <div className="min-h-screen bg-[#fffaf7] dark:bg-[#08080c]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.82fr_1.25fr]">
          <div className="space-y-4 py-3">
            <div className="h-7 w-44 rounded-full skeleton" />
            <div className="h-10 w-80 max-w-full rounded-xl skeleton" />
            <div className="h-5 w-96 max-w-full rounded-lg skeleton" />
            <div className="h-6 w-72 max-w-full rounded-lg skeleton" />
            <div className="h-14 w-80 max-w-full rounded-xl skeleton" />
          </div>
          <div className="aspect-[1.82/1] rounded-2xl skeleton" />
        </div>
        <div className="mt-5 h-20 rounded-2xl skeleton" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-64 rounded-xl skeleton" />
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
  const [progress, setProgress] = useState(FALLBACK_PROGRESS)
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

    if (usingFallbackData) {
      setProgress(FALLBACK_PROGRESS)
      return
    }

    if (!user) {
      setProgress(EMPTY_PROGRESS)
      return
    }

    let cancelled = false
    const challengeDate = parseChallengeDate(dailyPuzzle.challenge_date)
    const monthStart = `${challengeDate.getUTCFullYear()}-${String(
      challengeDate.getUTCMonth() + 1
    ).padStart(2, '0')}-01`

    fetchDailyChallengeProgress(user.id, monthStart).then((nextProgress) => {
      if (!cancelled) setProgress(nextProgress)
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
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf7] text-[#151a2f] dark:bg-[#08080c] dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_30%_8%,rgba(255,255,255,0.95),rgba(255,250,247,0.65)_45%,transparent_75%)] dark:opacity-10"
      />

      <main className="relative mx-auto max-w-[1280px] px-4 pb-14 pt-5 sm:px-6 lg:px-8">
        <section className="grid items-center gap-7 lg:grid-cols-[0.82fr_1.25fr] lg:gap-12">
          <div className="min-w-0 py-1 lg:py-3">
            <div className="inline-flex h-7 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff643d] to-[#ff7d63] px-3.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-[0_6px_15px_-8px_rgba(255,91,61,0.75)] sm:text-[11px]">
              <CalendarDays className="h-3.5 w-3.5" />
              Today&apos;s Puzzle · {formatChallengeBadge(dailyPuzzle.challenge_date)}
            </div>

            <h1 className="mt-4 text-[31px] font-black leading-[1.08] tracking-[-0.035em] text-[#10172c] dark:text-white sm:text-[38px] lg:text-[42px]">
              {dailyPuzzle.title}
            </h1>
            <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              {dailyPuzzle.description ||
                'Piece together a beautiful daily challenge.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">
              <span className="inline-flex items-center gap-1.5 pr-4">
                <Puzzle className="h-[18px] w-[18px]" />
                {selectedPieces} Pieces
              </span>
              <span className="inline-flex items-center gap-1.5 border-l border-slate-200 px-4 dark:border-white/10">
                <BarChart3 className="h-[18px] w-[18px]" />
                {dailyPuzzle.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 border-l border-slate-200 pl-4 dark:border-white/10">
                <Clock3 className="h-[18px] w-[18px]" />
                About {Math.max(5, Math.round(selectedPieces / 10))} min
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/play/${dailyPuzzle.slug}?pieces=${selectedPieces}`}
                className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff5637] to-[#ff704f] px-6 text-sm font-extrabold text-white shadow-[0_10px_22px_-10px_rgba(255,85,53,0.8)] transition hover:-translate-y-0.5"
              >
                <Puzzle className="h-[18px] w-[18px]" />
                Start Today&apos;s Puzzle
              </Link>

              <div className="relative">
                <button
                  type="button"
                  aria-expanded={pieceMenuOpen}
                  onClick={() => setPieceMenuOpen((open) => !open)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold text-slate-600 transition hover:bg-white/80 hover:text-[#ff5b3d] dark:text-slate-300 dark:hover:bg-white/5"
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
                  <div className="absolute left-0 top-14 z-30 grid min-w-48 grid-cols-2 gap-1 rounded-xl border border-orange-100 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#17171e]">
                    {pieceChoices.map((pieceCount) => (
                      <button
                        key={pieceCount}
                        type="button"
                        onClick={() => {
                          setSelectedPieces(pieceCount)
                          setPieceMenuOpen(false)
                        }}
                        className={cn(
                          'rounded-lg px-3 py-2 text-xs font-bold transition',
                          selectedPieces === pieceCount
                            ? 'bg-[#ff623f] text-white'
                            : 'text-slate-600 hover:bg-orange-50 dark:text-slate-300 dark:hover:bg-white/5'
                        )}
                      >
                        {pieceCount} pcs
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-orange-100 bg-[#fff6ed] px-3 py-2 text-[11px] font-semibold text-slate-600 dark:border-orange-400/10 dark:bg-orange-400/5 dark:text-slate-300">
              <Flame className="h-4 w-4 fill-[#ff7041] text-[#ff7041]" />
              <strong className="text-[#ff6a3d]">
                {progress.currentStreak}-day streak
              </strong>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              Complete today to reach {progress.currentStreak + 1}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[1.82/1] overflow-hidden rounded-[18px] bg-slate-200 shadow-[0_18px_40px_-22px_rgba(78,39,34,0.5)]">
              <Image
                src={dailyPuzzle.image_url}
                alt={dailyPuzzle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5" />
              <div className="absolute right-3.5 top-3.5 inline-flex h-7 items-center gap-1.5 rounded-full bg-white/95 px-3 text-[11px] font-bold text-slate-600 shadow-lg backdrop-blur-md">
                <Puzzle className="h-3.5 w-3.5" />
                {selectedPieces} pcs
              </div>
              <Link
                href={`/play/${dailyPuzzle.slug}?pieces=${selectedPieces}`}
                aria-label={`Play ${dailyPuzzle.title}`}
                className="absolute inset-0 flex items-center justify-center opacity-0 transition hover:bg-black/10 hover:opacity-100"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#ff6040] shadow-xl">
                  <Play className="h-5 w-5 fill-current" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#f0e5df] bg-white/80 px-4 py-3.5 shadow-[0_8px_25px_-22px_rgba(78,39,34,0.4)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.035] md:flex-row md:items-center">
          <div className="flex shrink-0 items-center gap-3 md:min-w-[245px]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-[#f2faef] text-[#4a9a54] dark:border-emerald-400/10 dark:bg-emerald-400/10">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xs font-extrabold text-[#27304a] dark:text-white sm:text-sm">
                {monthName} Progress
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-[11px]">
                {progress.completedThisMonth} of {challengeDay} challenges completed
              </p>
            </div>
          </div>

          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[#55ad68] transition-[width] duration-700"
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
                      isToday && 'bg-[#ff6748] text-white shadow-sm',
                      !isToday &&
                        !isFuture &&
                        'bg-[#f4f6f1] text-slate-600 dark:bg-white/10 dark:text-slate-300',
                      isFuture &&
                        'bg-slate-50 text-slate-400 dark:bg-white/5 dark:text-slate-500'
                    )}
                  >
                    {day}
                  </span>
                  {isComplete ? (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#459b51] text-white">
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
              <h2 className="text-sm font-black text-[#222a42] dark:text-white sm:text-base">
                Previous Challenges
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-[11px]">
                Catch up on puzzles you missed.
              </p>
            </div>
            <Link
              href="/daily/archive"
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#ff9b82] px-3 text-[10px] font-bold text-[#ff6849] transition hover:bg-[#fff1eb] dark:hover:bg-white/5 sm:text-[11px]"
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
    <article className="group overflow-hidden rounded-xl border border-[#eee4df] bg-white shadow-[0_8px_24px_-20px_rgba(55,32,29,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-18px_rgba(55,32,29,0.45)] dark:border-white/10 dark:bg-[#14141a]">
      <Link
        href={`/play/${puzzle.slug}`}
        className="relative block aspect-[1.94/1] overflow-hidden bg-slate-100"
      >
        <Image
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {completed && (
          <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#4aa25b] text-white shadow-md">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
        {started && (
          <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/80 bg-slate-800/45 text-[8px] font-extrabold text-white shadow-md backdrop-blur">
            {progressPercent}%
          </span>
        )}
      </Link>

      <div className="px-3.5 pb-3 pt-3">
        <h3 className="truncate text-[13px] font-extrabold text-[#232b43] dark:text-white sm:text-sm">
          {puzzle.title}
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="truncate text-[9px] font-medium text-slate-500 dark:text-slate-400 sm:text-[10px]">
            {formatCardDate(puzzle.challenge_date)}
            <span className="mx-1 text-slate-300">•</span>
            {puzzle.piece_count} pieces
            <span className="mx-1 text-slate-300">•</span>
            {puzzle.difficulty}
          </p>
          {completed && participation?.completionTime ? (
            <span className="shrink-0 rounded-full bg-[#eff8ec] px-2 py-1 text-[8px] font-bold text-[#4a9953] dark:bg-emerald-400/10 sm:text-[9px]">
              Completed · {formatCompletionTime(participation.completionTime)}
            </span>
          ) : started ? (
            <span className="shrink-0 text-[8px] font-bold text-[#4a9953] sm:text-[9px]">
              {progressPercent}% complete
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-500 dark:bg-white/5 sm:text-[9px]">
              Not started
            </span>
          )}
        </div>

        {started && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[#55ad68]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <Link
          href={`/play/${puzzle.slug}`}
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold transition sm:text-[11px]',
            completed ? 'text-[#4a9953]' : 'text-[#ff6748]'
          )}
        >
          {actionLabel}
          <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
