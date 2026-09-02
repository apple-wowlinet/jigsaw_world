'use client'

import { useEffect, useState } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import { ArrowRight, Clock3, Layers, Play, Puzzle, Star } from 'lucide-react'
import { fetchDailyPuzzle, type DailyPuzzle } from '@/lib/data/public'

const FALLBACK_DAILY: DailyPuzzle = {
  id: 'rainbow-glass-texture',
  uuid: 'rainbow-glass-texture',
  title: 'Rainbow Glass Texture',
  slug: 'rainbow-glass-texture',
  image_url: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=1200&h=900&fit=crop',
  description: 'A kaleidoscope of color and light—each piece reveals a brighter view.',
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

  return (
    <section className="relative overflow-hidden px-4 pt-6 sm:px-6 lg:px-8">
      {/* Gallery-wall backdrop: arched niche + soft vignette */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.75),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(240,233,220,0.06),transparent_60%)]" />
        <div className="absolute -left-8 top-4 hidden h-[560px] w-[240px] rounded-t-full border border-[#e3d9c4] bg-gradient-to-b from-[#efe8d8] via-[#f4efe3] to-transparent shadow-[inset_-14px_0_28px_-18px_rgba(120,100,60,0.25)] lg:block dark:border-[#3b3327] dark:from-[#221d15] dark:via-[#1c1812]">
          <div className="absolute inset-x-6 bottom-0 h-24 bg-gradient-to-t from-[#e7dfcc]/60 to-transparent dark:from-[#26211a]/60" />
        </div>
        <div className="absolute right-[-30px] top-24 hidden h-64 w-40 rotate-[15deg] opacity-[0.16] lg:block dark:opacity-[0.08]">
          <svg viewBox="0 0 100 160" fill="currentColor" className="h-full w-full text-[#5c6e51]">
            <path d="M50 160 C48 120 46 90 50 60 C40 70 28 66 24 56 C36 54 44 48 50 40 C50 30 52 20 56 12 C60 22 66 28 76 32 C68 40 58 44 52 56 C58 70 70 76 82 74 C76 86 62 90 52 84 C54 110 52 135 50 160 Z" />
          </svg>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          {/* Left — headline */}
          <div className="max-w-[600px] lg:pl-10">
            <p className="label-caps text-muted-foreground">Pieces of Wonder</p>

            <h1 className="font-display mt-5 text-[3.4rem] font-semibold leading-[1.02] tracking-[-0.01em] text-foreground sm:text-6xl lg:text-[4.3rem]">
              Art you <span className="italic text-accent">love.</span>
              <br />
              Puzzles you&rsquo;ll <span className="italic text-accent">crave.</span>
            </h1>

            <div className="mt-6 flex items-center gap-3" aria-hidden="true">
              <span className="h-px w-12 bg-border" />
              <Puzzle className="h-4 w-4 text-accent/80" />
              <span className="h-px w-12 bg-border" />
            </div>

            <p className="font-display mt-6 text-xl leading-8 text-[#5c5546] dark:text-[#b8ae9c] sm:text-[22px] sm:leading-9">
              Curated puzzles from around the world.
              <br />
              Beautiful images. Mindful moments.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href={`/play/${dailyPuzzle.slug}`} className="btn btn-primary btn-lg btn-shine">
                Start Today&rsquo;s Puzzle
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="group inline-flex items-center gap-2 px-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-accent"
              >
                Browse all puzzles
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex -space-x-3">
                {AVATARS.map((src) => (
                  <SafeImage
                    key={src}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-[#f6f1e8] object-cover dark:border-[#171310]"
                  />
                ))}
              </div>
              <p className="text-[13px] text-muted-foreground">
                Loved by{' '}
                <strong className="font-semibold text-foreground">250K+</strong> puzzlers
              </p>
              <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <strong className="font-semibold text-foreground">4.8</strong> rating
              </span>
            </div>
          </div>

          {/* Right — the daily puzzle, framed on the gallery ledge */}
          <div className="relative mt-4 lg:mt-0">
            <p className="label-caps mb-5 text-center text-muted-foreground lg:ml-[36%] lg:text-left">
              Today&rsquo;s Puzzle
            </p>

            <div className="relative pb-16">
              {/* Info panel, overlapping the frame's left edge */}
              <div className="relative z-10 mx-auto w-[86%] max-w-[340px] border border-[#e7decb] bg-panel p-6 shadow-[0_30px_60px_-30px_rgba(80,60,25,0.4)] sm:p-7 lg:absolute lg:left-0 lg:top-10 lg:mx-0 lg:w-[46%] dark:border-[#3b3327]">
                <h2 className="font-display text-[32px] font-semibold leading-[1.1] text-foreground">
                  {dailyPuzzle.title}
                </h2>
                <hr className="my-4 border-[#e0d6c0] dark:border-[#3b3327]" />
                <p className="text-[13px] leading-6 text-muted-foreground">
                  {dailyPuzzle.description ||
                    'A beautiful scene worth every piece. Set aside a quiet moment and enjoy.'}
                </p>

                <ul className="mt-5 space-y-2.5 text-[13px] font-medium text-foreground/85">
                  <li className="flex items-center gap-2.5">
                    <Puzzle className="h-4 w-4 text-primary" />
                    {dailyPuzzle.piece_count} pieces
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4 text-primary" />
                    {dailyPuzzle.difficulty}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock3 className="h-4 w-4 text-primary" />
                    ~{Math.max(10, Math.round(dailyPuzzle.piece_count / 10))} min
                  </li>
                </ul>

                <Link
                  href={`/play/${dailyPuzzle.slug}`}
                  className="btn btn-terracotta btn-md btn-shine mt-6"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Begin Puzzle
                </Link>
              </div>

              {/* Gilded frame */}
              <div className="frame-gold relative ml-auto aspect-[4/4.4] w-[88%] p-[10px] sm:w-[70%] lg:w-[64%]">
                <div className="frame-gold-inner h-full w-full p-[7px]">
                  <div className="relative h-full w-full overflow-hidden">
                    <SafeImage
                      src={dailyPuzzle.image_url}
                      alt={dailyPuzzle.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 460px"
                      className="object-cover"
                    />
                    <div className="puzzle-grid absolute inset-0 opacity-40" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Ledge + plaque */}
              <div className="relative ml-auto -mt-1 w-[96%] sm:w-[78%] lg:w-[72%]">
                <div className="h-[14px] rounded-[3px] bg-gradient-to-b from-[#fffdf6] to-[#e9e1cd] shadow-[0_10px_24px_-12px_rgba(80,60,25,0.45)] dark:from-[#332c22] dark:to-[#211c15]" />
                <div className="mx-auto flex h-[16px] w-[104%] -translate-x-[2%] items-start justify-center rounded-b-md bg-[#ddd3ba] dark:bg-[#2a241b]">
                  <span className="label-caps -translate-y-1/2 rounded-[3px] bg-[#8a5c39] px-3.5 py-1 text-[10px] text-[#f7efe2] shadow-md dark:bg-[#6f4a2d]">
                    Featured Today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Your Puzzle strip */}
        <div className="mt-10 flex flex-col items-start gap-5 border border-[#e7decb] bg-card px-6 py-5 shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] sm:px-8 lg:flex-row lg:items-center lg:gap-10 dark:border-[#3b3327]">
          <div className="flex items-center gap-4 lg:w-[250px]">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#d8cbb0] bg-panel dark:border-[#3b3327] dark:bg-[#241f17]">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
                <Puzzle className="h-5 w-5" />
              </div>
            </div>
            <p className="label-caps leading-5 text-foreground">
              Continue Your
              <br />
              Puzzle
            </p>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-5">
            <div className="relative h-[68px] w-[132px] shrink-0 overflow-hidden rounded-md">
              <SafeImage
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=300&fit=crop"
                alt="Mountain Lake Escape"
                fill
                sizes="132px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[22px] font-semibold leading-tight text-foreground">
                Mountain Lake Escape
              </h3>
              <div className="mt-2.5 flex items-center gap-4">
                <div className="h-[7px] max-w-[340px] flex-1 overflow-hidden rounded-full bg-[#e5dcc6] dark:bg-[#332c20]">
                  <div className="h-full w-[78%] rounded-full bg-[#4a7259]" />
                </div>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">82 / 100 pieces</span>
              </div>
            </div>
            <span className="hidden shrink-0 text-sm font-semibold text-muted-foreground sm:block">78%</span>
          </div>

          <Link href="/play/alpine-lake-reflection" className="btn btn-primary btn-md shrink-0">
            Continue Puzzle
          </Link>
        </div>
      </div>
    </section>
  )
}
