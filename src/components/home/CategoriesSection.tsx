'use client'

import { useEffect, useState } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchCategories, type PublicCategory } from '@/lib/data/public'
import { themeCatalogue } from '@/lib/data/theme-catalogue'

export function CategoriesSection() {
  const [categories, setCategories] = useState<PublicCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchCategories(6).then((items) => {
      if (!cancelled) {
        setCategories(items)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-6 flex items-center gap-5">
          <h2 className="label-caps shrink-0 text-foreground">Browse by Category</h2>
          <span className="h-px flex-1 bg-[#ddd2ba] dark:bg-[#3b3327]" />
          <Link
            href="/categories"
            className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
          >
            View all categories
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className="group relative aspect-[1.3/1] overflow-hidden rounded-lg shadow-[0_12px_28px_-18px_rgba(80,60,25,0.55)]"
            >
              <SafeImage
                src={item.image_url}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 17vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241d10]/90 via-[#241d10]/35 to-transparent transition-opacity group-hover:from-[#241d10]/95" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="font-display text-[19px] font-semibold leading-tight text-white [text-shadow:0_1px_10px_rgba(20,14,4,0.65)]">
                  {item.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-white/80 [text-shadow:0_1px_6px_rgba(20,14,4,0.6)]">
                  {item.puzzle_count} puzzles
                </p>
              </div>
            </Link>
          ))}
          {loading && Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-[1.3/1] rounded-lg skeleton" />
          ))}
          {!loading && categories.length === 0 && (
            <div className="col-span-2 rounded-lg border border-dashed border-border bg-card px-5 py-8 text-sm text-muted-foreground sm:col-span-3 lg:col-span-6">
              No categories with published puzzles are available yet.
            </div>
          )}
        </div>

        <h2 className="label-caps mb-4 mt-10 text-foreground">Popular Themes</h2>
        <div className="flex flex-wrap gap-2.5">
          {themeCatalogue.filter((theme) => theme.is_featured).map((theme) => (
            <Link
              key={theme.slug}
              href={`/theme/${theme.slug}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-panel px-4 text-xs font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-accent"
            >
              <span aria-hidden="true">{theme.emoji}</span>
              {theme.name}
            </Link>
          ))}
          <Link
            href="/themes"
            aria-label="View all themes"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-panel text-accent shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Streak banner */}
        <div className="relative mt-10">
          <SafeImage
            src="/images/steak-statue_rz.png"
            alt=""
            width={120}
            height={148}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-5 z-10 hidden h-[150px] w-auto dark:opacity-90 lg:block"
          />
          <div className="relative overflow-hidden border border-[#e0d5c0] bg-panel shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] dark:border-[#3b3327]">
            <div
              className="pointer-events-none absolute inset-[6px] border border-[#d8cbb0] dark:border-[#3b3327]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:gap-8 lg:pl-[180px]">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[26px] font-bold leading-tight text-foreground">
                  Keep the streak,
                </h3>
                <p className="mt-1.5 max-w-72 font-display text-[17px] leading-snug text-muted-foreground">
                  Puzzle every day to build your streak and earn exclusive rewards.
                </p>
              </div>

              <Link href="/daily" className="btn btn-terracotta btn-md btn-shine shrink-0">
                Play Today&rsquo;s Puzzle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
