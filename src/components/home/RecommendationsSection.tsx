'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Flame, Play, Puzzle, Star, Users } from 'lucide-react'
import { fetchPuzzles, type DisplayDifficulty, type PublicPuzzle } from '@/lib/data/public'
import { cn } from '@/lib/utils'

const puzzle = (
  slug: string,
  title: string,
  image_url: string,
  piece_count: number,
  difficulty: DisplayDifficulty,
  plays_count: number,
  rating = 4.8
): PublicPuzzle => ({
  id: slug,
  uuid: slug,
  slug,
  title,
  image_url,
  piece_count,
  difficulty,
  plays_count,
  rating,
  description: '',
  completions_count: Math.round(plays_count * 0.6),
  created_at: '2026-08-20T00:00:00.000Z',
  category: 'Featured',
  category_slug: 'featured',
})

const FALLBACK_PUZZLES: PublicPuzzle[] = [
  puzzle('cozy-cottage', 'Cozy Cottage', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 100, 'Easy', 8200),
  puzzle('ocean-sunset-waves', 'Sunset Beach', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 200, 'Medium', 6700),
  puzzle('japanese-garden', 'Japanese Garden', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop', 100, 'Easy', 5900),
  puzzle('golden-retriever-smile', 'Golden Retriever', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop', 150, 'Easy', 4800),
  puzzle('ocean-sunset-waves', 'Ocean Sunset Waves', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=900&h=700&fit=crop', 150, 'Easy', 2200, 4.8),
  puzzle('mountain-morning-glow', 'Mountain Morning Glow', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=700&fit=crop', 200, 'Medium', 1800, 4.9),
  puzzle('tropical-island-escape', 'Tropical Island Escape', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=700&fit=crop', 100, 'Easy', 3100, 4.7),
  puzzle('old-town-street', 'Kyoto Lantern Festival', 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=900&h=700&fit=crop', 500, 'Hard', 1200, 4.9),
]

const filters = ['For You', 'Easy', 'Medium', 'Hard', '500+ Pieces'] as const
type Filter = (typeof filters)[number]

function formatPlays(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value.toString()
}

export function RecommendationsSection() {
  const [puzzles, setPuzzles] = useState<PublicPuzzle[]>(FALLBACK_PUZZLES)
  const [activeFilter, setActiveFilter] = useState<Filter>('For You')

  useEffect(() => {
    let cancelled = false

    fetchPuzzles({ limit: 8, orderBy: 'featured' }).then((items) => {
      if (!cancelled && items.length >= 4) {
        setPuzzles([...items, ...FALLBACK_PUZZLES].slice(0, 8))
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const recommended = useMemo(() => {
    const items = puzzles.slice(4)
    if (activeFilter === 'For You') return items
    if (activeFilter === '500+ Pieces') {
      const filtered = items.filter((item) => item.piece_count >= 500)
      return filtered.length ? filtered : items
    }
    const filtered = items.filter((item) => item.difficulty === activeFilter)
    return filtered.length ? filtered : items
  }, [activeFilter, puzzles])

  return (
    <section className="px-4 pb-4 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
            <Flame className="h-6 w-6 fill-orange-500 text-orange-500" />
            Popular Today
          </h2>
          <Link href="/explore/weekly" className="group flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300">
            View all <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {puzzles.slice(0, 4).map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/play/${item.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-[0_6px_18px_rgba(30,41,59,.08)] transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
            >
              <div className="relative h-[86px] w-[105px] shrink-0 overflow-hidden rounded-lg">
                <Image src={item.image_url} alt={item.title} fill sizes="105px" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-black text-amber-600 shadow">{index + 1}</span>
              </div>
              <div className="min-w-0 py-1">
                <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatPlays(item.plays_count)} plays</p>
                <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">{item.piece_count} pcs</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-5 mt-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="mr-3 text-xl font-black tracking-tight text-slate-900 dark:text-white">Recommended for You</h2>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold transition',
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <Link href="/categories" className="group flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300">
            View all puzzles <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.slice(0, 4).map((item, index) => (
            <article key={`${item.slug}-recommended-${index}`} className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(30,41,59,.08)] transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">
              <Link href={`/play/${item.slug}`} className="relative block aspect-[1.42] overflow-hidden">
                <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-800 shadow-md">{item.piece_count}</span>
              </Link>
              <div className="p-4">
                <h3 className="truncate text-base font-black text-slate-900 dark:text-white">{item.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Puzzle className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />{item.piece_count} pieces</span>
                  <span className="flex items-center gap-1"><span className={cn('h-2 w-2 rounded-full', item.difficulty === 'Easy' ? 'bg-emerald-500' : item.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-rose-500')} />{item.difficulty}</span>
                </div>
                <div className="mt-3 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{item.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{formatPlays(item.plays_count)}</span>
                </div>
                <Link href={`/play/${item.slug}`} className="mt-4 flex h-9 items-center justify-center gap-2 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400/20 dark:text-indigo-300 dark:hover:bg-indigo-400/10">
                  <Play className="h-3 w-3 fill-current" /> Play Puzzle
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
