'use client'

import { FormEvent, useMemo, useState } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
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
import type { PublicCategory } from '@/lib/data/public'
import {
  categoryGroups,
  getPublishedCategoryCatalogue,
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
        'group relative block overflow-hidden bg-muted shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)]',
        'transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)]',
        compact ? 'h-[185px] rounded-lg lg:h-[210px]' : 'aspect-[1.08] rounded-lg'
      )}
    >
      <SafeImage
        src={category.image_url}
        alt={category.name}
        fill
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={compact
          ? '(max-width: 767px) 42vw, (max-width: 1280px) 13vw, 150px'
          : '(max-width: 639px) 48vw, (max-width: 767px) 32vw, 20vw'}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-[#241d10]/85 via-[#241d10]/10 to-transparent" />

      <span className={cn('absolute inset-x-0 bottom-0', compact ? 'p-3' : 'p-3 sm:p-3.5')}>
        <span className="flex items-center gap-1.5 font-bold leading-tight text-white [text-shadow:0_1px_8px_rgba(20,14,4,0.65)]">
          {compact && <Icon className="h-4 w-4 shrink-0 fill-white/15" />}
          <span className={cn('truncate', compact ? 'text-[15px]' : 'font-display text-[17px]')}>{category.name}</span>
        </span>
        <span className="mt-1 block text-[11px] font-medium text-white/80 [text-shadow:0_1px_6px_rgba(20,14,4,0.6)]">
          {category.puzzle_count} puzzles
        </span>
      </span>
    </Link>
  )
}

export function CategoriesContent({ initialCategories }: { initialCategories: PublicCategory[] }) {
  const categories = useMemo(() => getPublishedCategoryCatalogue(initialCategories), [initialCategories])
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState<'All' | CategoryGroup>('All')
  const [sortOrder, setSortOrder] = useState<'catalogue' | 'popular' | 'za'>('catalogue')
  const [visibleCount, setVisibleCount] = useState(INITIAL_CATEGORY_COUNT)

  const popularCategories = categories.filter((category) => category.popular).slice(0, 8)

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const matches = categories.filter((category) => {
      if (activeGroup !== 'All' && category.group !== activeGroup) return false
      return !normalizedQuery
        || category.name.toLocaleLowerCase().includes(normalizedQuery)
        || category.description.toLocaleLowerCase().includes(normalizedQuery)
    })

    if (sortOrder === 'popular') return [...matches].sort((a, b) => b.puzzle_count - a.puzzle_count)
    if (sortOrder === 'za') return [...matches].sort((a, b) => b.name.localeCompare(a.name))
    return [...matches].sort((a, b) => a.name.localeCompare(b.name))
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
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[194px] overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_10%,rgba(255,255,255,0.95),rgba(247,243,234,0.85)_55%,rgba(239,232,216,0.9))] dark:bg-[radial-gradient(circle_at_32%_10%,rgba(34,29,21,0.6),rgba(20,23,15,1)_65%)]" />

        <div className="relative z-10 mx-auto max-w-[1380px] px-4 pb-6 pt-7 sm:px-6 lg:px-8">
          <h1 className="font-display text-[32px] font-semibold tracking-[-0.01em] text-foreground sm:text-[38px]">
            Explore Jigsaw Puzzles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Find the perfect puzzle for your mood and interest.
          </p>

          <form onSubmit={handleSearch} className="relative mt-4 w-full max-w-[325px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search puzzles or categories..."
              aria-label="Search puzzles or categories"
              className="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm text-foreground shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-[1380px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        {popularCategories.length > 0 && (
          <section aria-labelledby="popular-categories-title">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id="popular-categories-title" className="label-caps flex items-center gap-2 text-foreground">
                <Star className="h-4 w-4 fill-gold text-gold" />
                Popular Categories
              </h2>
              <button
                type="button"
                onClick={() => document.getElementById('all-categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="hidden items-center text-[13px] font-semibold text-accent transition hover:text-accent/80 sm:inline-flex"
              >
                View all categories&nbsp;→
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
              {popularCategories.map((category, index) => (
                <CategoryCard key={category.slug} category={category} compact priority={index === 0} />
              ))}
            </div>
          </section>
        )}

        <section id="all-categories" aria-labelledby="all-categories-title" className="scroll-mt-24 pt-8">
          <div className="mb-4 flex items-center gap-5">
            <h2 id="all-categories-title" className="label-caps shrink-0 text-foreground">
              Browse All Categories
            </h2>
            <span className="h-px flex-1 bg-sand-dark/70" />
          </div>

          <div className="mb-3 flex items-center gap-2">
            <div className="-mx-1 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(['All', ...categoryGroups.filter((group) => categories.some((category) => category.group === group))] as const).map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => selectGroup(group)}
                  className={cn(
                    'h-8 shrink-0 rounded-md border px-4 text-xs font-semibold transition',
                    activeGroup === group
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-[#ddd2ba] bg-card text-muted-foreground hover:border-accent/60 hover:text-accent dark:border-[#3b3327]'
                  )}
                >
                  {group}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  selectGroup('All')
                  setVisibleCount(categories.length)
                }}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-[#ddd2ba] bg-card px-4 text-xs font-semibold text-muted-foreground transition hover:border-accent/60 hover:text-accent dark:border-[#3b3327]"
              >
                More
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            <label className="relative ml-auto shrink-0">
              <span className="sr-only">Sort categories</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}
                className="h-8 appearance-none rounded-md border border-input bg-card py-0 pl-3 pr-8 text-xs font-semibold text-muted-foreground shadow-sm outline-none focus:border-accent"
              >
                <option value="catalogue">A–Z</option>
                <option value="popular">Most popular</option>
                <option value="za">Z–A</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </label>
          </div>

          {visibleCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {visibleCategories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-14 text-center text-sm text-muted-foreground">
              No categories match your search.
            </div>
          )}

          {visibleCount < filteredCategories.length && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + INITIAL_CATEGORY_COUNT)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-[#ddd2ba] bg-card px-5 text-xs font-semibold text-foreground shadow-sm transition hover:border-accent/60 hover:text-accent dark:border-[#3b3327]"
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
