'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Fraunces } from 'next/font/google'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Play,
  Puzzle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchDailyPuzzle, type DailyPuzzle } from '@/lib/data/public'

const display = Fraunces({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '600'],
})

const FALLBACK_DAILY: DailyPuzzle = {
  id: 'rainbow-glass-texture',
  uuid: 'rainbow-glass-texture',
  title: 'Rainbow Glass Texture',
  slug: 'rainbow-glass-texture',
  image_url: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=1200&h=900&fit=crop',
  description: 'A rainbow glass texture with reflections and gradients.',
  piece_count: 100,
  difficulty: 'Medium',
  plays_count: 3800,
  weekly_plays_count: 980,
  completions_count: 2100,
  rating: 4.9,
  created_at: '2026-08-20T00:00:00.000Z',
  category: 'Art',
  category_slug: 'art',
  challenge_id: 'daily-rainbow-glass',
  challenge_date: '2026-08-20',
  challenge_title: 'Rainbow Glass Texture',
}

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
]

const features = [
  {
    icon: ShieldCheck,
    title: 'No signup',
    detail: 'Just play',
    tint: 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  },
  {
    icon: CalendarDays,
    title: 'New puzzles',
    detail: 'Added daily',
    tint: 'border-violet-100 bg-violet-50 text-violet-600 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300',
  },
  {
    icon: Puzzle,
    title: '20 – 1000 pieces',
    detail: 'All levels',
    tint: 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300',
  },
]

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function HeroSection() {
  const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzle>(FALLBACK_DAILY)
  const [countdown, setCountdown] = useState('--:--:--')
  const [dayNumber, setDayNumber] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchDailyPuzzle().then((puzzle) => {
      if (!cancelled && puzzle) setDailyPuzzle(puzzle)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      const diff = nextMidnight.getTime() - now.getTime()
      setCountdown(
        `${pad(Math.floor(diff / 3_600_000))}:${pad(Math.floor((diff % 3_600_000) / 60_000))}:${pad(Math.floor((diff % 60_000) / 1_000))}`
      )
      setDayNumber(
        Math.max(
          1,
          Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000)
        )
      )
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const displayDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  const difficultyClass =
    dailyPuzzle.difficulty === 'Easy'
      ? 'difficulty-easy'
      : dailyPuzzle.difficulty === 'Hard'
        ? 'difficulty-hard'
        : 'difficulty-medium'

  return (
    <section className="relative overflow-hidden px-4 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute -left-32 -top-44 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-sky-200/70 to-indigo-100/40 blur-3xl dark:bg-sky-900/20" />
        <div className="absolute left-[36%] -top-24 h-[440px] w-[440px] rounded-full bg-gradient-to-br from-pink-200/60 to-amber-100/30 blur-3xl dark:bg-fuchsia-900/15" />
        <div className="absolute -right-20 top-10 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-violet-200/60 to-blue-100/30 blur-3xl dark:bg-violet-900/15" />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
          <div className="max-w-[680px]">
            <div className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-white/80 bg-white/80 py-1.5 pl-2 pr-4 text-[13px] font-semibold text-slate-700 shadow-[0_8px_30px_rgba(79,70,229,.10)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
              </span>
              Thousands of beautiful puzzles
            </div>

            <h1 className="mt-6 text-[2.75rem] font-black leading-[1.03] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.85rem] dark:text-white">
              <span className="hero-rise hero-d-1 block">
                <span className={cn(display.className, 'font-semibold italic tracking-normal')}>
                  Beautiful
                </span>{' '}
                Jigsaw
              </span>
              <span className="hero-rise hero-d-2 block">Puzzles,</span>
              <span className="hero-rise hero-d-3 relative inline-block">
                <span className="animate-gradient-pan bg-gradient-to-r from-fuchsia-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Ready to Play
                </span>
                <svg
                  className="absolute -bottom-[0.14em] left-0 h-[0.22em] w-full"
                  viewBox="0 0 220 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10 C 35 2 70 12 108 7 C 140 3 190 11 217 6"
                    stroke="url(#hero-squiggle)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="squiggle-path"
                  />
                  <defs>
                    <linearGradient id="hero-squiggle" x1="0" y1="7" x2="220" y2="7" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f59e0b" />
                      <stop offset="0.5" stopColor="#ec4899" />
                      <stop offset="1" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="hero-rise hero-d-4 mt-7 max-w-[560px] text-lg leading-8 text-slate-600 dark:text-slate-300">
              Play thousands of free online jigsaw puzzles.
              <br className="hidden sm:block" />
              Choose your picture, difficulty, and start puzzling instantly.
            </p>

            <div className="hero-rise hero-d-5 mt-7 grid max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, detail, tint }) => (
                <div key={title} className="flex items-center gap-3">
                  <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl border shadow-sm', tint)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <strong className="block whitespace-nowrap text-sm text-slate-900 dark:text-white">{title}</strong>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{detail}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="hero-rise hero-d-6 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/play/${dailyPuzzle.slug}`}
                className="btn-shine inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-[15px] font-bold text-white shadow-[0_14px_30px_rgba(59,82,246,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(59,82,246,.45)]"
              >
                <Play className="h-4 w-4 fill-current" />
                Play Today&apos;s Puzzle
              </Link>
              <Link
                href="/categories"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-8 text-[15px] font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                Browse Puzzles
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
              </Link>
            </div>

            <div className="hero-rise hero-d-6 mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
              <div className="flex -space-x-3">
                {AVATARS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-[3px] border-white object-cover shadow-sm dark:border-slate-900"
                  />
                ))}
              </div>
              <div className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-100">Join 250K+ puzzlers worldwide</span>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-sm tracking-widest text-amber-400">★★★★★</span>
                  <span className="font-medium">4.8 average rating</span>
                </div>
              </div>
            </div>
          </div>

          <article className="hero-rise hero-d-3 relative mx-auto w-full max-w-[620px]">
            <div
              className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-amber-200/40 via-rose-200/30 to-indigo-200/40 blur-2xl dark:from-amber-500/10 dark:via-rose-500/10 dark:to-indigo-500/10"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-white/90 p-5 shadow-[0_30px_80px_-24px_rgba(30,41,59,.28)] backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-slate-900/90">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500" aria-hidden="true" />

              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                  Today&apos;s Challenge
                </p>
                <div className="text-right">
                  <span
                    suppressHydrationWarning
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-white/10 dark:text-slate-300"
                  >
                    <CalendarDays className="h-3 w-3" />
                    {displayDate}
                  </span>
                  <p className="mt-1 text-[11px] font-medium tabular-nums text-slate-400 dark:text-slate-500">
                    Resets in {countdown}
                  </p>
                </div>
              </div>

              <div className="group/img relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5 dark:ring-white/10">
                <Image
                  src={dailyPuzzle.image_url}
                  alt={dailyPuzzle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover transition duration-700 group-hover/img:scale-[1.04]"
                />
                <div className="puzzle-grid absolute inset-0 opacity-20" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/5" aria-hidden="true" />
                {dayNumber !== null && (
                  <span className="absolute left-3 top-3 rounded-full bg-slate-950/55 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    Daily № {dayNumber}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 inline-flex translate-y-1 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-800 opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover/img:translate-y-0 group-hover/img:opacity-100">
                  <Play className="h-3 w-3 fill-indigo-600 text-indigo-600" />
                  Start now
                </span>
                <span
                  className="absolute right-3 top-3 h-14 w-14 rotate-12 overflow-hidden rounded-[22%] border-[3px] border-white shadow-lg dark:border-white/70"
                  aria-hidden="true"
                >
                  <Image src={dailyPuzzle.image_url} alt="" fill sizes="56px" className="object-cover" />
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {dailyPuzzle.title}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
                  <Puzzle className="h-3.5 w-3.5" />
                  {dailyPuzzle.piece_count} pieces
                </span>
                <span className={cn('inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold', difficultyClass)}>
                  {dailyPuzzle.difficulty}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <Clock3 className="h-3.5 w-3.5" />
                  ~{Math.max(10, Math.round(dailyPuzzle.piece_count / 10))} min
                </span>
              </div>

              <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center dark:border-white/10">
                <div>
                  <div className="flex -space-x-2">
                    {AVATARS.map((src) => (
                      <Image key={src} src={src} alt="" width={30} height={30} className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-900" />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {Math.max(3800, dailyPuzzle.plays_count).toLocaleString()}
                    </span>{' '}
                    players today
                  </p>
                </div>
                <Link
                  href={`/play/${dailyPuzzle.slug}`}
                  className="btn-shine group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 sm:w-auto"
                >
                  Play Daily Puzzle
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-12 grid items-center gap-5 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-5 py-4 shadow-sm sm:grid-cols-[220px_1fr_auto] sm:px-7 dark:border-emerald-400/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/30">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-white/10 dark:text-emerald-300"><Puzzle className="h-6 w-6 fill-current" /></span>
            <strong className="text-lg leading-5 text-slate-900 dark:text-white">Continue<br />Your Puzzle</strong>
          </div>
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-[72px] w-32 shrink-0 overflow-hidden rounded-xl">
              <Image src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=300&fit=crop" alt="Mountain Lake Escape" fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm text-slate-900 dark:text-white">Mountain Lake Escape</strong>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950"><div className="h-full w-[78%] rounded-full bg-emerald-500" /></div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">78%</span>
              </div>
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">82 / 100 pieces</span>
            </div>
          </div>
          <Link href="/play/alpine-lake-reflection" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
            Continue Puzzle
          </Link>
        </div>

      </div>
    </section>
  )
}
