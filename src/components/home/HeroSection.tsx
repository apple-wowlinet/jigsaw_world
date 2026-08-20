'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CalendarDays,
  Clock3,
  Play,
  Puzzle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
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
  { icon: ShieldCheck, title: 'No signup', detail: 'Just play' },
  { icon: CalendarDays, title: 'New puzzles', detail: 'Added daily' },
  { icon: Puzzle, title: '20 – 1000 pieces', detail: 'All levels' },
]

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

  const displayDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <section className="relative overflow-hidden px-4 pt-7 sm:px-6 lg:px-8 lg:pt-11">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-44 h-[520px] w-[520px] rounded-full bg-sky-100/70 blur-3xl dark:bg-sky-900/20" />
        <div className="absolute left-[38%] top-0 h-[440px] w-[440px] rounded-full bg-pink-100/60 blur-3xl dark:bg-fuchsia-900/15" />
        <div className="absolute right-0 top-16 h-[420px] w-[420px] rounded-full bg-violet-100/50 blur-3xl dark:bg-violet-900/15" />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
          <div className="max-w-[660px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-[0_8px_30px_rgba(79,70,229,.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <Sparkles className="h-4 w-4 fill-amber-300 text-amber-500" />
              Thousands of beautiful puzzles
            </div>

            <h1 className="text-[2.7rem] font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.65rem] dark:text-white">
              Beautiful Jigsaw
              <br />
              Puzzles,
              <br />
              <span className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Ready to Play
              </span>
              <span className="ml-3 inline-flex align-top text-blue-600" aria-hidden="true">
                <span className="h-3 w-1 rotate-[-30deg] rounded-full bg-current" />
                <span className="ml-3 mt-4 h-1 w-3 rotate-[-12deg] rounded-full bg-current" />
              </span>
            </h1>

            <p className="mt-7 max-w-[580px] text-base leading-7 text-slate-600 dark:text-slate-300">
              Play thousands of free online jigsaw puzzles.
              <br className="hidden sm:block" />
              Choose your picture, difficulty, and start puzzling instantly.
            </p>

            <div className="mt-7 grid max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-sm dark:border-indigo-400/20 dark:bg-white/5 dark:text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <strong className="block whitespace-nowrap text-sm text-slate-900 dark:text-white">{title}</strong>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{detail}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/play/${dailyPuzzle.slug}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-sm font-bold text-white shadow-[0_12px_28px_rgba(59,82,246,.3)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(59,82,246,.38)]"
              >
                <Play className="h-4 w-4 fill-current" />
                Play Today&apos;s Puzzle
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white/90 px-9 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                Browse Puzzles
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex -space-x-3">
                {AVATARS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-white object-cover dark:border-slate-900"
                  />
                ))}
              </div>
              <div className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Join 250K+ puzzlers worldwide</span>
                <div className="flex items-center gap-2">
                  <span className="tracking-wider text-amber-400">★★★★★</span>
                  <span>4.8 average rating</span>
                </div>
              </div>
            </div>
          </div>

          <article className="relative mx-auto w-full max-w-[620px] rounded-[24px] border border-white/90 bg-white/90 p-6 shadow-[0_24px_70px_rgba(30,41,59,.16)] backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black tracking-wide text-slate-900 dark:text-white">
                <span className="text-2xl">🔥</span>
                DAILY PUZZLE
              </h2>
              <span className="text-sm font-black uppercase text-slate-700 dark:text-slate-300">{displayDate}</span>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={dailyPuzzle.image_url}
                alt={dailyPuzzle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover"
              />
              <div className="puzzle-grid absolute inset-0 opacity-35" aria-hidden="true" />
              <div className="absolute bottom-[17%] left-[17%] h-[25%] w-[20%] rounded-[18%] bg-white shadow-[0_0_0_2px_rgba(255,255,255,.9)] dark:bg-slate-900" aria-hidden="true" />
            </div>

            <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {dailyPuzzle.title}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2"><Puzzle className="h-4 w-4 fill-blue-600 text-blue-600" />{dailyPuzzle.piece_count} pieces</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />{dailyPuzzle.difficulty}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" />~{Math.max(10, Math.round(dailyPuzzle.piece_count / 10))} min</span>
            </div>

            <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {AVATARS.map((src) => (
                    <Image key={src} src={src} alt="" width={30} height={30} className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-900" />
                  ))}
                </div>
                <span className="ml-3 text-xs text-slate-500 dark:text-slate-400">
                  {Math.max(3800, dailyPuzzle.plays_count).toLocaleString()} players today
                </span>
              </div>
              <Link
                href={`/play/${dailyPuzzle.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                Play Daily Puzzle
              </Link>
            </div>

            <div className="absolute -bottom-5 -right-4 hidden h-20 w-20 rotate-12 overflow-hidden rounded-[22%] border-[6px] border-white shadow-xl sm:block dark:border-slate-900" aria-hidden="true">
              <Image src={dailyPuzzle.image_url} alt="" fill className="object-cover" />
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
