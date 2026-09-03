'use client'

import { useEffect, useState } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import { ArrowRight, Check, Flame } from 'lucide-react'
import { fetchCategories, type PublicCategory } from '@/lib/data/public'
import { themeCatalogue } from '@/lib/data/theme-catalogue'

const category = (
  slug: string,
  name: string,
  image_url: string,
  icon: string,
  puzzle_count: number
): PublicCategory => ({
  id: slug,
  slug,
  name,
  image_url,
  icon,
  puzzle_count,
  description: '',
  color: '#b4592e',
  dark_color: '#cd7a45',
})

const FALLBACK_CATEGORIES: PublicCategory[] = [
  category('nature', 'Nature', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&h=520&fit=crop', 'trees', 128),
  category('animals', 'Animals', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=700&h=520&fit=crop', 'paw-print', 96),
  category('lakes-rivers', 'Lakes & Rivers', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=700&h=520&fit=crop', 'waves', 86),
  category('food', 'Food', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&h=520&fit=crop', 'utensils', 74),
  category('cities', 'Cities', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=700&h=520&fit=crop', 'building-2', 64),
  category('beaches', 'Beaches', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&h=520&fit=crop', 'waves', 58),
]

export function CategoriesSection() {
  const [categories, setCategories] = useState<PublicCategory[]>(FALLBACK_CATEGORIES)

  useEffect(() => {
    let cancelled = false

    fetchCategories(6).then((items) => {
      if (!cancelled && items.length) setCategories(items)
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
        <div className="relative mt-10 overflow-hidden border border-[#e7decb] bg-panel shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] dark:border-[#3b3327]">
          <div
            className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-[#ece3cf] blur-2xl dark:bg-[#2a241a]"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:gap-8">
            <div
              className="hidden h-24 w-24 shrink-0 place-items-center rounded-full border border-[#d8cbb0] bg-[#f3edde] shadow-inner lg:grid dark:border-[#3b3327] dark:bg-[#241f17]"
              aria-hidden="true"
            >
              <div className="relative h-[76px] w-[76px] overflow-hidden rounded-full border border-[#d8cbb0] bg-[#262219] dark:bg-[#282218]">
                <SafeImage
                  src="/images/streak-statue.jpg"
                  alt=""
                  fill
                  sizes="76px"
                  className="object-cover [filter:grayscale(1)_sepia(0.12)_contrast(1.05)] dark:opacity-90"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[26px] font-semibold leading-tight text-foreground">
                Keep the streak, unlock the rewards.
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Puzzle every day to build your streak and earn exclusive rewards.
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <Flame className="mx-auto h-5 w-5 fill-accent text-accent" />
                <p className="mt-1 font-display text-2xl font-semibold leading-none text-foreground">
                  4 <span className="text-sm">Day</span>
                </p>
                <p className="label-caps mt-1 text-[9px] text-muted-foreground">Streak</p>
              </div>
              <div className="flex items-end gap-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <span className="mb-1.5 block text-[9px] font-medium text-muted-foreground">{day}</span>
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full border ${
                        index < 4
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-[#d5c9ae] bg-transparent text-transparent dark:border-[#3b3327]'
                      }`}
                    >
                      {index < 4 && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/daily" className="btn btn-terracotta btn-md btn-shine shrink-0">
              Play Today&rsquo;s Puzzle
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
