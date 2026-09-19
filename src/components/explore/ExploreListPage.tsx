'use client'

import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import {
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  Puzzle,
  RefreshCw,
  Star,
  Trophy,
} from 'lucide-react'
import {
  fetchPuzzles,
  type DisplayDifficulty,
  type PublicPuzzle,
} from '@/lib/data/public'
import { cn } from '@/lib/utils'

export type ExploreMode = 'weekly' | 'all-time' | 'trending'

type SortOrder = 'plays' | 'rating' | 'newest'
type PieceFilter = 'any' | 'small' | 'medium' | 'large'
type OpenMenu = 'sort' | 'difficulty' | 'pieces' | null

const ITEMS_PER_PAGE = 24
const FETCH_LIMIT = ITEMS_PER_PAGE * 4

const CATEGORY_CHIPS = [
  { slug: 'all', name: 'All' },
  { slug: 'nature', name: 'Nature' },
  { slug: 'animals', name: 'Animals' },
  { slug: 'cities', name: 'Cities' },
  { slug: 'travel', name: 'Travel' },
  { slug: 'art', name: 'Art' },
  { slug: 'architecture', name: 'Architecture' },
  { slug: 'food', name: 'Food' },
] as const

const TIME_TABS = [
  { mode: 'weekly' as const, href: '/explore/weekly', label: 'This Week', icon: Calendar },
  { mode: 'all-time' as const, href: '/explore/all-time', label: 'All Time', icon: Trophy },
  { mode: 'trending' as const, href: '/explore/trending', label: 'Trending', icon: Flame },
]

const MODE_COPY: Record<
  ExploreMode,
  { crumb: string; title: string; subtitle: string; orderBy: 'plays' | 'rating' | 'editor' | 'weekly'; defaultSort: SortOrder }
> = {
  weekly: {
    crumb: 'Popular',
    title: 'Weekly Top Puzzles',
    subtitle: 'The most-played puzzles from the last 7 days.\nRankings update daily.',
    orderBy: 'weekly',
    defaultSort: 'plays',
  },
  'all-time': {
    crumb: 'All Time',
    title: 'All-Time Top Puzzles',
    subtitle: 'The most popular puzzles ever played.\nRankings update daily.',
    orderBy: 'plays',
    defaultSort: 'plays',
  },
  trending: {
    crumb: 'Trending',
    title: 'Trending Puzzles',
    subtitle: 'Puzzles climbing the charts right now.\nRankings update daily.',
    orderBy: 'editor',
    defaultSort: 'plays',
  },
}

const SORT_OPTIONS: Array<{ value: SortOrder; label: string }> = [
  { value: 'plays', label: 'Most Played' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
]

const DIFFICULTY_OPTIONS: Array<{ value: 'Any' | DisplayDifficulty; label: string }> = [
  { value: 'Any', label: 'Any' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
  { value: 'Expert', label: 'Expert' },
]

const PIECE_OPTIONS: Array<{ value: PieceFilter; label: string }> = [
  { value: 'any', label: 'Any' },
  { value: 'small', label: 'Up to 100' },
  { value: 'medium', label: '101–200' },
  { value: 'large', label: '200+' },
]

function difficultyClass(difficulty: string) {
  switch (difficulty) {
    case 'Easy':
      return 'difficulty-easy'
    case 'Medium':
      return 'difficulty-medium'
    case 'Hard':
      return 'difficulty-hard'
    case 'Expert':
      return 'difficulty-expert'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getPaginationItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  const visiblePages = [...pages]
    .filter((page) => page > 0 && page <= totalPages)
    .sort((a, b) => a - b)
  const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = []

  visiblePages.forEach((page, index) => {
    const previous = visiblePages[index - 1]
    if (previous && page - previous > 1) {
      items.push(index === 1 ? 'ellipsis-start' : 'ellipsis-end')
    }
    items.push(page)
  })

  return items
}

export function ExploreListPage({ mode }: { mode: ExploreMode }) {
  const copy = MODE_COPY[mode]
  const [puzzles, setPuzzles] = useState<PublicPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [categorySlug, setCategorySlug] = useState('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>(copy.defaultSort)
  const [difficulty, setDifficulty] = useState<'Any' | DisplayDifficulty>('Any')
  const [pieceFilter, setPieceFilter] = useState<PieceFilter>('any')
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    fetchPuzzles({ limit: FETCH_LIMIT, orderBy: copy.orderBy })
      .then((items) => {
        if (cancelled) return
        setPuzzles(items)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setPuzzles([])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [copy.orderBy])

  useEffect(() => {
    if (!openMenu) return

    const handlePointer = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [openMenu])

  const filteredPuzzles = useMemo(() => {
    let result = [...puzzles]

    if (categorySlug !== 'all') {
      result = result.filter((puzzle) => puzzle.category_slug === categorySlug)
    }
    if (difficulty !== 'Any') {
      result = result.filter((puzzle) => puzzle.difficulty === difficulty)
    }
    if (pieceFilter === 'small') {
      result = result.filter((puzzle) => puzzle.piece_count <= 100)
    } else if (pieceFilter === 'medium') {
      result = result.filter(
        (puzzle) => puzzle.piece_count > 100 && puzzle.piece_count <= 200
      )
    } else if (pieceFilter === 'large') {
      result = result.filter((puzzle) => puzzle.piece_count > 200)
    }

    result.sort((a, b) => {
      if (sortOrder === 'rating') return b.rating - a.rating
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (mode === 'weekly') return b.weekly_plays_count - a.weekly_plays_count
      return b.plays_count - a.plays_count
    })

    return result
  }, [puzzles, categorySlug, difficulty, pieceFilter, sortOrder, mode])

  const totalPages = Math.max(1, Math.ceil(filteredPuzzles.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedPuzzles = filteredPuzzles.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  )
  const paginationItems = getPaginationItems(totalPages, safePage)

  const resetToFirstPage = () => setCurrentPage(1)

  if (loading) return <ExploreListSkeleton />

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1380px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center text-xs font-medium text-muted-foreground sm:text-sm"
        >
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-foreground">{copy.crumb}</span>
        </nav>

        <header className="mt-4 mb-6">
          <h1 className="font-display text-[32px] font-semibold leading-tight tracking-[-0.01em] text-foreground sm:text-[38px]">
            {copy.title}{' '}
            <span aria-hidden="true">{mode === 'trending' ? '🔥' : '🏆'}</span>
          </h1>
          <p className="mt-2 max-w-xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {TIME_TABS.map((tab) => {
            const active = tab.mode === mode
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-background text-foreground hover:bg-secondary'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            )
          })}
        </div>

        <div
          ref={toolbarRef}
          className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="-mx-1 flex min-w-0 items-center gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_CHIPS.map((chip) => {
              const active = categorySlug === chip.slug
              return (
                <button
                  key={chip.slug}
                  type="button"
                  onClick={() => {
                    setCategorySlug(chip.slug)
                    resetToFirstPage()
                  }}
                  className={cn(
                    'inline-flex h-8 shrink-0 items-center rounded-full px-4 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {chip.name}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <FilterMenu
              icon={ArrowUpDown}
              label="Sort"
              value={sortOrder}
              options={SORT_OPTIONS}
              open={openMenu === 'sort'}
              onToggle={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
              onChange={(value) => {
                setSortOrder(value as SortOrder)
                setOpenMenu(null)
                resetToFirstPage()
              }}
            />
            <FilterMenu
              icon={Layers}
              label="Difficulty"
              value={difficulty}
              options={DIFFICULTY_OPTIONS}
              open={openMenu === 'difficulty'}
              onToggle={() => setOpenMenu(openMenu === 'difficulty' ? null : 'difficulty')}
              onChange={(value) => {
                setDifficulty(value as 'Any' | DisplayDifficulty)
                setOpenMenu(null)
                resetToFirstPage()
              }}
            />
            <FilterMenu
              icon={Puzzle}
              label="Pieces"
              value={pieceFilter}
              options={PIECE_OPTIONS}
              open={openMenu === 'pieces'}
              onToggle={() => setOpenMenu(openMenu === 'pieces' ? null : 'pieces')}
              onChange={(value) => {
                setPieceFilter(value as PieceFilter)
                setOpenMenu(null)
                resetToFirstPage()
              }}
            />
          </div>
        </div>

        {filteredPuzzles.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 text-center">
            <Puzzle className="mb-3 h-9 w-9 text-muted-foreground/50" />
            <h2 className="text-sm font-extrabold">No puzzles found</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another category, difficulty, or piece count.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedPuzzles.map((puzzle, index) => (
              <PuzzleCard
                key={puzzle.uuid}
                puzzle={puzzle}
                priority={index < 4}
              />
            ))}
          </section>
        )}

        <nav
          aria-label="Puzzle pages"
          className="mt-10 flex items-center justify-center gap-1.5"
        >
          <PaginationButton
            label="Previous page"
            disabled={safePage === 1}
            onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationButton>
          {paginationItems.map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                type="button"
                onClick={() => setCurrentPage(item)}
                aria-label={`Page ${item}`}
                aria-current={item === safePage ? 'page' : undefined}
                className={cn(
                  'flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm font-bold transition',
                  item === safePage
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                {item}
              </button>
            ) : (
              <span
                key={item}
                className="flex h-9 w-6 items-center justify-center text-sm text-muted-foreground"
              >
                …
              </span>
            )
          )}
          <PaginationButton
            label="Next page"
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>
        </nav>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
          New puzzles and rankings update daily
        </p>
      </div>
    </div>
  )
}

function PuzzleCard({
  puzzle,
  priority = false,
}: {
  puzzle: PublicPuzzle
  priority?: boolean
}) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group block border border-[#e7decb] bg-card p-2.5 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
    >
      <div className="relative aspect-[1.55/1] overflow-hidden bg-muted">
        <SafeImage
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span
          className={cn(
            'absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm',
            difficultyClass(puzzle.difficulty)
          )}
        >
          {puzzle.difficulty}
        </span>
      </div>
      <div className="px-1.5 pb-1.5 pt-3">
        <h3 className="font-display text-[19px] font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
          {puzzle.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-[#dca93f] text-[#dca93f]" />
          {puzzle.rating.toFixed(1)}
          <span className="text-[#c9bfa8] dark:text-[#4a4234]">•</span>
          {puzzle.piece_count} pcs
        </p>
      </div>
    </Link>
  )
}

function FilterMenu<T extends string>({
  icon: Icon,
  label,
  value,
  options,
  open,
  onToggle,
  onChange,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  open: boolean
  onToggle: () => void
  onChange: (value: T) => void
}) {
  const selected = options.find((option) => option.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/40"
      >
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}: {selected?.label ?? 'Any'}
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-30 mt-2 min-w-44 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-xl"
        >
          {options.map((option) => {
            const active = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onChange(option.value)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-secondary',
                  active ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )}
              >
                {option.label}
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PaginationButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: ReactNode
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}

export function ExploreListSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="h-3 w-32 animate-pulse rounded-full bg-secondary" />
        <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-lg bg-secondary" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-secondary" />
        <div className="mt-6 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-9 w-28 animate-pulse rounded-full bg-secondary" />
          ))}
        </div>
        <div className="mt-4 h-8 animate-pulse rounded-lg bg-secondary" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 24 }, (_, index) => (
            <div key={index} className="border border-border bg-card p-2.5">
              <div className="aspect-[1.55/1] animate-pulse bg-secondary" />
              <div className="px-1.5 pb-1.5 pt-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
                <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
