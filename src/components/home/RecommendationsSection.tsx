'use client'

import { useEffect, useMemo, useState } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import { ArrowRight, Puzzle } from 'lucide-react'
import { fetchPuzzles, type PublicPuzzle } from '@/lib/data/public'
import { cn } from '@/lib/utils'

const filters = ['For You', 'Easy', 'Medium', 'Hard', '500+ Pieces'] as const
type Filter = (typeof filters)[number]

function SectionHeading({
  title,
  linkHref,
  linkLabel,
}: {
  title: string
  linkHref: string
  linkLabel: string
}) {
  return (
    <div className="mb-6 flex items-center gap-5">
      <h2 className="label-caps shrink-0 text-foreground">{title}</h2>
      <span className="h-px flex-1 bg-[#ddd2ba] dark:bg-[#3b3327]" />
      <Link
        href={linkHref}
        className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
      >
        {linkLabel}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export function RecommendationsSection() {
  const [puzzles, setPuzzles] = useState<PublicPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<Filter>('For You')

  useEffect(() => {
    let cancelled = false

    fetchPuzzles({ limit: 8, orderBy: 'featured' }).then((items) => {
      if (!cancelled) {
        setPuzzles(items)
        setLoading(false)
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
      return items.filter((item) => item.piece_count >= 500)
    }
    return items.filter((item) => item.difficulty === activeFilter)
  }, [activeFilter, puzzles])

  return (
    <section className="px-4 pb-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <SectionHeading title="Popular Today" linkHref="/explore/weekly" linkLabel="View all" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {puzzles.slice(0, 4).map((item) => (
            <Link
              key={`${item.slug}-${item.title}`}
              href={`/puzzle/${item.slug}`}
              className="group block border border-[#e7decb] bg-card p-2.5 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
            >
              <div className="relative aspect-[1.55/1] overflow-hidden">
                <SafeImage
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-1.5 pb-1.5 pt-3">
                <h3 className="font-display text-[19px] font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.piece_count} pcs
                </p>
              </div>
            </Link>
          ))}
          {loading && Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="aspect-[1.3/1] rounded-lg skeleton" />
          ))}
          {!loading && puzzles.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-card px-5 py-10 text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">
              No published puzzles are available yet.
            </div>
          )}
        </div>

        <div className="mt-12">
          <SectionHeading title="Recommended for You" linkHref="/categories" linkLabel="View all puzzles" />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'rounded-md border px-4 py-2 text-xs font-semibold transition-all',
                activeFilter === filter
                  ? 'border-primary bg-primary text-primary-foreground shadow-[0_8px_18px_-8px_rgba(47,74,58,0.6)]'
                  : 'border-[#ddd2ba] bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground dark:border-[#3b3327]'
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.slice(0, 4).map((item) => (
            <Link
              key={`rec-${item.slug}-${item.title}`}
              href={`/puzzle/${item.slug}`}
              className="group block border border-[#e7decb] bg-card p-2.5 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
            >
              <div className="relative aspect-[1.55/1] overflow-hidden">
                <SafeImage
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-[#3c382e] shadow-md">
                  {item.piece_count}
                </span>
              </div>
              <div className="px-1.5 pb-1.5 pt-3">
                <h3 className="font-display text-[19px] font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Puzzle className="h-3.5 w-3.5 text-primary" />
                  {item.piece_count} pieces
                  <span className="text-[#c9bfa8] dark:text-[#4a4234]">•</span>
                  {item.difficulty}
                </p>
              </div>
            </Link>
          ))}
          {loading && Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="aspect-[1.3/1] rounded-lg skeleton" />
          ))}
          {!loading && recommended.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-card px-5 py-10 text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">
              No published puzzles match this selection.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
