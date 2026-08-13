'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bike,
  Binoculars,
  Bird,
  Building2,
  CakeSlice,
  CarFront,
  Cat,
  ChevronDown,
  Dog,
  Flower2,
  Globe2,
  Landmark,
  MapPin,
  Mountain,
  Orbit,
  Palette,
  Palmtree,
  PawPrint,
  Plane,
  Puzzle,
  Search,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  TrainFront,
  TreePine,
  Utensils,
  Waves,
} from 'lucide-react'
import { fetchCategories } from '@/lib/data/public'
import {
  categoryGroups,
  mergeCategoryCatalogue,
  type CatalogueCategory,
  type CategoryGroup,
} from '@/lib/data/category-catalogue'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bike: Bike,
  binoculars: Binoculars,
  bird: Bird,
  'building-2': Building2,
  'cake-slice': CakeSlice,
  'car-front': CarFront,
  cat: Cat,
  dog: Dog,
  'flower-2': Flower2,
  'globe-2': Globe2,
  landmark: Landmark,
  'map-pin': MapPin,
  mountain: Mountain,
  orbit: Orbit,
  palette: Palette,
  palmtree: Palmtree,
  'paw-print': PawPrint,
  plane: Plane,
  snowflake: Snowflake,
  sparkles: Sparkles,
  sun: Sun,
  'train-front': TrainFront,
  trees: TreePine,
  utensils: Utensils,
  waves: Waves,
}

const INITIAL_CATEGORY_COUNT = 15

function CategoryCard({
  category,
  compact = false,
  priority = false,
}: {
  category: CatalogueCategory
  compact?: boolean
  priority?: boolean
}) {
  const Icon = iconMap[category.icon] ?? Puzzle

  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'group relative block overflow-hidden bg-slate-200 shadow-[0_2px_8px_rgba(15,23,42,0.14)]',
        'transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.2)]',
        compact ? 'h-[185px] rounded-[10px] lg:h-[210px]' : 'aspect-[1.08] rounded-[9px]'
      )}
    >
      <Image
        src={category.image_url}
        alt={category.name}
        fill
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={compact
          ? '(max-width: 767px) 42vw, (max-width: 1280px) 13vw, 150px'
          : '(max-width: 639px) 48vw, (max-width: 767px) 32vw, 20vw'}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

      <span className={cn('absolute inset-x-0 bottom-0 text-white', compact ? 'p-3' : 'p-3 sm:p-3.5')}>
        <span className="flex items-center gap-1.5 font-bold leading-tight drop-shadow-sm">
          {compact && <Icon className="h-4 w-4 shrink-0 fill-white/15" />}
          <span className={cn('truncate', compact ? 'text-[15px]' : 'text-base')}>{category.name}</span>
        </span>
        <span className="mt-1 block text-[11px] font-medium text-white/90 drop-shadow-sm">
          {category.puzzle_count} puzzles
        </span>
      </span>
    </Link>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(() => mergeCategoryCatalogue([]))
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState<'All' | CategoryGroup>('All')
  const [sortOrder, setSortOrder] = useState<'catalogue' | 'az' | 'za'>('catalogue')
  const [visibleCount, setVisibleCount] = useState(INITIAL_CATEGORY_COUNT)

  useEffect(() => {
    let cancelled = false

    fetchCategories().then((remoteCategories) => {
      if (!cancelled) setCategories(mergeCategoryCatalogue(remoteCategories))
    })

    return () => {
      cancelled = true
    }
  }, [])

  const popularCategories = categories.filter((category) => category.popular).slice(0, 8)

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const matches = categories.filter((category) => {
      if (category.popular) return false
      if (activeGroup !== 'All' && category.group !== activeGroup) return false
      return !normalizedQuery
        || category.name.toLocaleLowerCase().includes(normalizedQuery)
        || category.description.toLocaleLowerCase().includes(normalizedQuery)
    })

    if (sortOrder === 'az') return [...matches].sort((a, b) => a.name.localeCompare(b.name))
    if (sortOrder === 'za') return [...matches].sort((a, b) => b.name.localeCompare(a.name))
    return matches
  }, [activeGroup, categories, query, sortOrder])

  const visibleCategories = filteredCategories.slice(0, visibleCount)

  const selectGroup = (group: 'All' | CategoryGroup) => {
    setActiveGroup(group)
    setVisibleCount(INITIAL_CATEGORY_COUNT)
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    document.getElementById('all-categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900 dark:bg-[#08080c] dark:text-white">
      <section className="relative min-h-[194px] overflow-hidden border-b border-slate-200/30 dark:border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_10%,rgba(255,255,255,1),rgba(248,250,252,0.82)_55%,rgba(241,245,249,0.92))] dark:bg-[radial-gradient(circle_at_32%_10%,rgba(30,41,59,0.35),rgba(8,8,12,1)_65%)]" />

        <div className="absolute right-0 top-0 hidden h-full w-[43%] overflow-hidden sm:block [clip-path:polygon(18%_0,100%_0,100%_100%,0_88%)]">
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&h=700&fit=crop"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="43vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-white/55 dark:to-[#08080c]/85" />
          <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 500 220" fill="none" aria-hidden="true">
            <path d="M60 0v42c0 13 11 24 24 24h8c13 0 24 11 24 24s-11 24-24 24h-8c-13 0-24 11-24 24v82M188 0v35c0 13 11 24 24 24s24-11 24-24V0M188 220v-34c0-13-11-24-24-24s-24 11-24 24v34M320 0v40c0 13-11 24-24 24s-24 11-24 24 11 24 24 24 24 11 24 24v84M440 0v40c0 13 11 24 24 24h36M440 220v-32c0-13-11-24-24-24s-24-11-24-24 11-24 24-24 24-11 24-24V64M0 66h60M116 66h72M236 66h36M320 66h120M60 138h24M116 138h48M212 138h84M344 138h48M440 138h60" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <Puzzle className="absolute right-[31%] top-7 hidden h-16 w-16 rotate-12 fill-[#ffd77d] text-[#f4c65e] drop-shadow-lg sm:block" strokeWidth={1.5} />
        <Puzzle className="absolute right-[24%] top-4 hidden h-10 w-10 -rotate-12 fill-white/70 text-slate-200 drop-shadow-md lg:block" strokeWidth={1.5} />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-6 pt-7 sm:px-6 lg:px-8">
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[34px]">
            Explore Jigsaw Puzzles
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Find the perfect puzzle for your mood and interest.
          </p>

          <form onSubmit={handleSearch} className="relative mt-4 w-full max-w-[325px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search puzzles or categories..."
              aria-label="Search puzzles or categories"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-4 text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 dark:focus:ring-amber-500/20"
            />
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <section aria-labelledby="popular-categories-title">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="popular-categories-title" className="flex items-center gap-2 text-lg font-extrabold tracking-[-0.02em]">
              <Star className="h-[19px] w-[19px] fill-[#ffb82e] text-[#ffb82e]" />
              Popular Categories
            </h2>
            <button
              type="button"
              onClick={() => document.getElementById('all-categories')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden text-xs font-semibold text-[#eaa018] transition hover:text-amber-600 sm:inline-flex"
            >
              View all categories&nbsp;→
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
            {popularCategories.map((category, index) => (
              <CategoryCard key={category.slug} category={category} compact priority={index < 4} />
            ))}
          </div>
        </section>

        <section id="all-categories" aria-labelledby="all-categories-title" className="scroll-mt-24 pt-8">
          <h2 id="all-categories-title" className="text-xl font-extrabold tracking-[-0.025em]">
            Browse All Categories
          </h2>

          <div className="mb-3 mt-3 flex items-center gap-2">
            <div className="-mx-1 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(['All', ...categoryGroups] as const).map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => selectGroup(group)}
                  className={cn(
                    'h-8 shrink-0 rounded-full border px-4 text-xs font-semibold transition',
                    activeGroup === group
                      ? 'border-[#f6b53d] bg-[#f6b53d] text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                  )}
                >
                  {group}
                </button>
              ))}
            </div>

            <label className="relative ml-auto shrink-0">
              <span className="sr-only">Sort categories</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}
                className="h-8 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-8 text-xs font-semibold text-slate-600 shadow-sm outline-none focus:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <option value="catalogue">Featured</option>
                <option value="az">A–Z</option>
                <option value="za">Z–A</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#eaa018]" />
            </label>
          </div>

          {visibleCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {visibleCategories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-14 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
              No categories match your search.
            </div>
          )}

          {visibleCount < filteredCategories.length && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + INITIAL_CATEGORY_COUNT)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Load more categories
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
