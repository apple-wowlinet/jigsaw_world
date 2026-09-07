'use client'

import { useEffect, useState } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import { JigsawGridOverlay } from '@/components/ui/JigsawGridOverlay'
import Link from 'next/link'
import { ArrowRight, Clock3, Layers, Puzzle, Star } from 'lucide-react'
import { fetchDailyPuzzle, type DailyPuzzle } from '@/lib/data/public'
import { ContinuePuzzleCard } from '@/components/home/ContinuePuzzleCard'

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
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.75),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(240,233,220,0.06),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          {/* Left — headline */}
          <div className="max-w-[600px]">
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

          {/* Right — today's puzzle mounted in a CSS-built gallery wall. */}
          <div className="relative mt-4 lg:mt-0 lg:-mr-5">
            <div className="daily-wall">
              <div className="daily-wall-cornice" aria-hidden="true" />
              <p className="daily-wall-heading">Today&rsquo;s Puzzle</p>

              <div className="daily-wall-recess">
                <div className="daily-puzzle-layout">
                  <div className="daily-puzzle-copy">
                    <h2 className="font-display text-[clamp(1.75rem,2vw,1.95rem)] font-semibold leading-[0.98] text-[#252219] dark:text-[#f0e9dc]">
                      {dailyPuzzle.title}
                    </h2>
                    <hr className="my-4 w-12 border-[#cfc2a9] dark:border-[#514536]" />
                    <p className="text-[12px] leading-[1.55] text-[#6e6657] dark:text-[#b8ae9c]">
                      {dailyPuzzle.description ||
                        'A beautiful scene worth every piece. Set aside a quiet moment and enjoy.'}
                    </p>

                    <ul className="mt-5 space-y-2.5 text-[12px] font-medium text-[#514c41] dark:text-[#d5cbbb]">
                      <li className="flex items-center gap-2.5">
                        <Puzzle className="h-3.5 w-3.5 text-[#72593b] dark:text-[#c9a66b]" />
                        {dailyPuzzle.piece_count} pieces
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Layers className="h-3.5 w-3.5 text-[#72593b] dark:text-[#c9a66b]" />
                        {dailyPuzzle.difficulty}
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Clock3 className="h-3.5 w-3.5 text-[#72593b] dark:text-[#c9a66b]" />
                        ~{Math.max(10, Math.round(dailyPuzzle.piece_count / 10))} min
                      </li>
                    </ul>

                    <Link
                      href={`/play/${dailyPuzzle.slug}`}
                      className="btn btn-terracotta btn-md btn-shine mt-6"
                    >
                      Begin Puzzle
                    </Link>
                  </div>

                  <div className="daily-picture-frame">
                    <div className="daily-picture-liner">
                      <div className="relative h-full w-full overflow-hidden bg-[#d7d0c2]">
                        <SafeImage
                          src={dailyPuzzle.image_url}
                          alt={dailyPuzzle.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 88vw, 430px"
                          className="object-cover"
                        />
                        <JigsawGridOverlay
                          rows={4}
                          cols={4}
                          className="absolute inset-0 h-full w-full opacity-55 drop-shadow-[0_1px_2px_rgba(60,48,28,0.35)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="daily-wall-ledge" aria-hidden="true">
                <span className="daily-wall-plaque">Featured Today</span>
              </div>
            </div>
          </div>
        </div>

        <ContinuePuzzleCard />
      </div>
    </section>
  )
}
