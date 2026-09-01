'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock3, Play, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchDailyPuzzle, type DailyPuzzle } from '@/lib/data/public'

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

/* A single jigsaw tile of the daily image. Rendered as one cell of a 4×3
   grid; the inner image is 4× the cell so the slice lines up exactly with
   the picture underneath once the snap animation lands. */
function PuzzlePiece({
  src,
  col,
  row,
  delayClass,
}: {
  src: string
  col: number
  row: number
  delayClass: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'piece-snap absolute z-10 overflow-hidden rounded-[14%] border-[3px] border-white/95 shadow-[0_10px_24px_rgba(15,23,42,.28)]',
        delayClass
      )}
      style={{
        left: `${col * 25}%`,
        top: `${row * 33.3333}%`,
        width: '25%',
        height: '33.3333%',
      }}
    >
      <Image
        src={src}
        alt=""
        width={1200}
        height={900}
        sizes="(max-width: 1024px) 50vw, 310px"
        className="absolute max-w-none object-cover"
        style={{
          width: '400%',
          height: '300%',
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        }}
      />
    </span>
  )
}

export function HeroSection() {
  const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzle>(FALLBACK_DAILY)

  useEffect(() => {
    let cancelled = false

    fetchDailyPuzzle().then((puzzle) => {
      if (!cancelled && puzzle) setDailyPuzzle(puzzle)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const difficultyDot =
    dailyPuzzle.difficulty === 'Easy'
      ? 'bg-emerald-500'
      : dailyPuzzle.difficulty === 'Hard'
        ? 'bg-rose-500'
        : 'bg-amber-400'

  return (
    <section className="relative overflow-hidden px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute -left-32 -top-44 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-sky-200/70 to-teal-100/40 blur-3xl dark:bg-sky-900/20" />
        <div className="absolute left-[38%] -top-24 h-[420px] w-[420px] rounded-full bg-amber-100/40 blur-3xl dark:bg-amber-900/10" />
        <div className="absolute -right-20 top-10 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-teal-200/60 to-blue-100/30 blur-3xl dark:bg-teal-900/15" />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid items-center gap-12 lg:grid-cols-[.84fr_1.16fr] lg:gap-14">
          {/* Left — why play */}
          <div className="max-w-[560px]">
            <h1 className="text-[2.6rem] font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[4.4rem] dark:text-white">
              <span className="hero-rise hero-d-1 block">Free Online</span>
              <span className="hero-rise hero-d-2 relative inline-block">
                Jigsaw Puzzles
                <svg
                  className="absolute -bottom-[0.12em] left-0 h-[0.2em] w-full"
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
                      <stop stopColor="#2563eb" />
                      <stop offset="0.5" stopColor="#0ea5e9" />
                      <stop offset="1" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="hero-rise hero-d-3 mt-6 max-w-[520px] text-lg leading-8 text-slate-600 dark:text-slate-300">
              Pick a picture, choose your difficulty, and start puzzling instantly — no signup
              required.
            </p>

            <div className="hero-rise hero-d-4 mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link href={`/play/${dailyPuzzle.slug}`} className="btn btn-primary btn-lg btn-shine">
                <Play className="h-4 w-4 fill-current" />
                Play Today&apos;s Puzzle
              </Link>
              <Link
                href="/categories"
                className="group inline-flex items-center justify-center gap-1.5 text-sm font-bold text-slate-700 transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
              >
                Browse all puzzles
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="hero-rise hero-d-5 mt-9 flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex -space-x-3">
                {AVATARS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-[3px] border-white object-cover shadow-sm dark:border-slate-900"
                  />
                ))}
              </div>
              <p className="text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                Loved by{' '}
                <strong className="font-bold text-slate-800 dark:text-slate-100">250K+</strong>{' '}
                puzzlers
                <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
                <span className="text-sm tracking-wider text-amber-400">★</span>{' '}
                <strong className="font-bold text-slate-800 dark:text-slate-100">4.8</strong> rating
              </p>
            </div>
          </div>

          {/* Right — the product itself */}
          <article className="hero-rise hero-d-3 relative mx-auto w-full max-w-[680px]">
            <div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-white/90 p-4 shadow-[0_30px_80px_-24px_rgba(30,41,59,.28)] backdrop-blur-xl sm:p-5 dark:border-white/10 dark:bg-slate-900/90">
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                Today&apos;s Puzzle
              </p>

              <Link
                href={`/play/${dailyPuzzle.slug}`}
                aria-label={`Play ${dailyPuzzle.title}`}
                className="group/img relative mt-3 block aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5 dark:ring-white/10"
              >
                <Image
                  src={dailyPuzzle.image_url}
                  alt={dailyPuzzle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover transition duration-700 group-hover/img:scale-[1.03]"
                />
                <div
                  className="puzzle-grid absolute inset-0 opacity-30"
                  style={{ backgroundSize: '25% 33.3333%' }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <PuzzlePiece src={dailyPuzzle.image_url} col={1} row={0} delayClass="piece-snap-delay-1" />
                <PuzzlePiece src={dailyPuzzle.image_url} col={2} row={2} delayClass="piece-snap-delay-2" />
              </Link>

              <div className="mt-4 flex items-center justify-between gap-4">
                <h2 className="min-w-0 text-[1.65rem] font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                  {dailyPuzzle.title}
                </h2>
                <Link
                  href={`/play/${dailyPuzzle.slug}`}
                  className="btn btn-primary btn-md btn-shine group shrink-0"
                >
                  Play
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Puzzle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {dailyPuzzle.piece_count} pieces
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1.5">
                  <span className={cn('h-2 w-2 rounded-full', difficultyDot)} />
                  {dailyPuzzle.difficulty}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-slate-400" />~
                  {Math.max(10, Math.round(dailyPuzzle.piece_count / 10))} min
                </span>
              </p>
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
          <Link href="/play/alpine-lake-reflection" className="btn btn-outline btn-md">
            Continue Puzzle
          </Link>
        </div>

      </div>
    </section>
  )
}
