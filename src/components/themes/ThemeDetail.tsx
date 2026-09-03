'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  Palette,
  Puzzle,
  Sparkles,
} from 'lucide-react'
import { SafeImage } from '@/components/ui/SafeImage'
import { ThemePuzzleCard } from '@/components/themes/ThemePuzzleCard'
import {
  fetchPuzzles,
  fetchPuzzlesByThemeSlug,
  fetchThemes,
  type DisplayDifficulty,
  type PublicPuzzle,
} from '@/lib/data/public'
import {
  mergeThemeCatalogue,
  themeCatalogue,
  type PublicTheme,
} from '@/lib/data/theme-catalogue'

const INITIAL_PUZZLE_COUNT = 12
type SortOrder = 'popular' | 'rating' | 'newest' | 'pieces'

export function ThemeDetail() {
  const params = useParams()
  const slug = params?.slug as string
  const [theme, setTheme] = useState<PublicTheme | null>(
    () => themeCatalogue.find((item) => item.slug === slug) ?? null
  )
  const [puzzles, setPuzzles] = useState<PublicPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState<'All' | DisplayDifficulty>('All')
  const [sortOrder, setSortOrder] = useState<SortOrder>('popular')
  const [visibleCount, setVisibleCount] = useState(INITIAL_PUZZLE_COUNT)

  useEffect(() => {
    let cancelled = false

    async function loadTheme() {
      setLoading(true)
      setPuzzles([])

      const [remoteThemes, assignedPuzzles] = await Promise.all([
        fetchThemes(),
        fetchPuzzlesByThemeSlug(slug),
      ])
      if (cancelled) return

      const themes = mergeThemeCatalogue(remoteThemes)
      const loadedTheme = themes.find((item) => item.slug === slug) ?? null
      setTheme(loadedTheme)

      if (!loadedTheme) {
        setLoading(false)
        return
      }

      let loadedPuzzles = assignedPuzzles
      if (!loadedPuzzles.length && loadedTheme.fallback_search) {
        loadedPuzzles = await fetchPuzzles({
          search: loadedTheme.fallback_search,
          limit: 100,
          orderBy: 'plays',
        })
      }
      if (
        !loadedPuzzles.length &&
        loadedTheme.fallback_category_slugs.length
      ) {
        loadedPuzzles = await fetchPuzzles({
          categorySlugs: loadedTheme.fallback_category_slugs,
          limit: 100,
          orderBy: 'plays',
        })
      }

      if (!cancelled) {
        setPuzzles(loadedPuzzles)
        setLoading(false)
      }
    }

    loadTheme()
    return () => {
      cancelled = true
    }
  }, [slug])

  const filteredPuzzles = useMemo(() => {
    const result =
      difficulty === 'All'
        ? [...puzzles]
        : puzzles.filter((puzzle) => puzzle.difficulty === difficulty)

    return result.sort((a, b) => {
      if (sortOrder === 'rating') return b.rating - a.rating
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortOrder === 'pieces') return a.piece_count - b.piece_count
      return b.plays_count - a.plays_count
    })
  }, [difficulty, puzzles, sortOrder])

  if (loading) return <ThemeDetailSkeleton />

  if (!theme) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-3xl font-semibold">
            Theme not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This collection may have moved or is no longer available.
          </p>
          <Link href="/themes" className="btn btn-primary btn-md mt-6">
            Browse all themes
          </Link>
        </div>
      </div>
    )
  }

  const displayedCount = puzzles.length || theme.puzzle_count

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-[1380px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-medium text-muted-foreground"
        >
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link href="/themes" className="transition hover:text-accent">
            Themes
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="font-semibold text-foreground">{theme.name}</span>
        </nav>

        <header className="mt-4 grid overflow-hidden rounded-lg border border-border bg-panel shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] lg:grid-cols-[1fr_0.72fr]">
          <div className="flex items-center px-6 py-9 sm:px-10 sm:py-12">
            <div>
              <p className="label-caps flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                Curated Theme
              </p>
              <div className="mt-3 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border bg-card text-3xl shadow-sm"
                >
                  {theme.emoji}
                </span>
                <h1 className="font-display text-[38px] font-semibold leading-none tracking-[-0.01em] sm:text-[48px]">
                  {theme.name} <span className="italic text-accent">Puzzles</span>
                </h1>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {theme.description}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Puzzle className="h-4 w-4 fill-primary text-primary" />
                {displayedCount.toLocaleString()} puzzles in this collection
              </p>
            </div>
          </div>

          <div className="relative min-h-56 overflow-hidden bg-muted lg:min-h-full">
            <SafeImage
              src={theme.image_url}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover transition duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-panel/40 to-transparent lg:from-panel/70" />
          </div>
        </header>

        <section aria-labelledby="theme-puzzles-title" className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-5">
              <h2
                id="theme-puzzles-title"
                className="label-caps shrink-0 text-foreground"
              >
                Explore the Collection
              </h2>
              <span className="hidden h-px flex-1 bg-border sm:block" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FilterSelect
                label="Difficulty"
                value={difficulty}
                onChange={(value) => {
                  setDifficulty(value as typeof difficulty)
                  setVisibleCount(INITIAL_PUZZLE_COUNT)
                }}
                options={[
                  ['All', 'All'],
                  ['Easy', 'Easy'],
                  ['Medium', 'Medium'],
                  ['Hard', 'Hard'],
                ]}
              />
              <FilterSelect
                label="Sort"
                value={sortOrder}
                onChange={(value) => setSortOrder(value as SortOrder)}
                options={[
                  ['popular', 'Popular'],
                  ['rating', 'Rating'],
                  ['newest', 'Newest'],
                  ['pieces', 'Pieces'],
                ]}
              />
            </div>
          </div>

          {filteredPuzzles.length ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filteredPuzzles.slice(0, visibleCount).map((puzzle) => (
                  <ThemePuzzleCard key={puzzle.uuid} puzzle={puzzle} />
                ))}
              </div>
              {visibleCount < filteredPuzzles.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((count) => count + INITIAL_PUZZLE_COUNT)
                    }
                    className="btn btn-outline btn-md"
                  >
                    Load more
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 text-center">
              <Puzzle className="h-10 w-10 text-muted-foreground" />
              <h2 className="mt-3 font-display text-xl font-semibold">
                No puzzles found
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                This theme is ready for its first puzzle. Try another collection
                in the meantime.
              </p>
              <Link href="/themes" className="btn btn-outline btn-sm mt-5">
                Explore themes
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<[string, string]>
  onChange: (value: string) => void
}) {
  return (
    <label className="relative min-w-[128px]">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-md border border-input bg-card py-0 pl-3 pr-8 text-xs font-semibold text-muted-foreground shadow-sm outline-none transition focus:border-primary"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {label}: {optionLabel}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </label>
  )
}

function ThemeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1380px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="h-3 w-48 rounded-full skeleton" />
        <div className="mt-4 h-72 rounded-lg skeleton" />
        <div className="mt-10 h-5 w-56 rounded-full skeleton" />
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-lg border border-border">
              <div className="aspect-[1.55/1] skeleton" />
              <div className="h-8 skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
