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
  User,
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

const ITEMS_PER_PAGE = 15
const FETCH_LIMIT = 60

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
]

const PIECE_OPTIONS: Array<{ value: PieceFilter; label: string }> = [
  { value: 'any', label: 'Any' },
  { value: 'small', label: 'Up to 100' },
  { value: 'medium', label: '101–200' },
  { value: 'large', label: '200+' },
]

function formatPlays(count: number) {
  if (count < 1000) return count.toLocaleString()
  if (count < 1_000_000) {
    const value = count / 1000
    const formatted = value >= 100
      ? Math.round(value).toString()
      : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
    return `${formatted}K`
  }
  const value = count / 1_000_000
  return `${value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}M`
}

function difficultyClass(difficulty: string) {
  switch (difficulty) {
    case 'Easy':
      return 'difficulty-easy'
    case 'Medium':
      return 'difficulty-medium'
    case 'Hard':
      return 'difficulty-hard'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function rankCircleClass(rank: number) {
  if (rank === 1) return 'bg-gradient-to-b from-[#e8cf9a] to-[#b98a2f] text-white shadow-[0_4px_12px_rgba(185,138,47,0.45)]'
  if (rank === 2) return 'bg-gradient-to-b from-[#ddd8c8] to-[#948f7d] text-white shadow-[0_4px_12px_rgba(148,143,125,0.35)]'
  if (rank === 3) return 'bg-gradient-to-b from-[#cd7a45] to-[#9c4b2b] text-white shadow-[0_4px_12px_rgba(156,75,43,0.4)]'
  return 'bg-[#2c322a]/70 text-white backdrop-blur-sm'
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
    setLoading(true)

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
    setSortOrder(copy.defaultSort)
    setCurrentPage(1)
    setCategorySlug('all')
    setDifficulty('Any')
    setPieceFilter('any')
    setOpenMenu(null)
  }, [mode, copy.defaultSort])

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
  const featured = safePage === 1 ? paginatedPuzzles.slice(0, 3) : []
  const gridPuzzles = safePage === 1 ? paginatedPuzzles.slice(3) : paginatedPuzzles
  const paginationItems = getPaginationItems(totalPages, safePage)

  const resetToFirstPage = () => setCurrentPage(1)
  const playsCountFor = (puzzle: PublicPuzzle) =>
    mode === 'weekly' ? puzzle.weekly_plays_count : puzzle.plays_count

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

        {featured.length > 0 && (
          <div className="mb-8">
            <Podium puzzles={featured} playsCountFor={playsCountFor} />
          </div>
        )}

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
        ) : gridPuzzles.length > 0 ? (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gridPuzzles.map((puzzle, index) => {
              const rank = (safePage - 1) * ITEMS_PER_PAGE + featured.length + index + 1
              return (
                <GridCard
                  key={puzzle.uuid}
                  puzzle={puzzle}
                  rank={rank}
                  playsCount={playsCountFor(puzzle)}
                />
              )
            })}
          </section>
        ) : null}

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
                  'flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition',
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

function Podium({
  puzzles,
  playsCountFor,
}: {
  puzzles: PublicPuzzle[]
  playsCountFor: (puzzle: PublicPuzzle) => number
}) {
  const first = puzzles[0]
  const second = puzzles[1]
  const third = puzzles[2]

  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-center md:gap-5">
      {second && (
        <div className="order-2 w-full md:order-1 md:w-[30%] md:max-w-[300px]">
          <HeroCard puzzle={second} rank={2} playsCount={playsCountFor(second)} />
        </div>
      )}
      {first && (
        <div className="order-1 w-full md:order-2 md:w-[38%] md:max-w-[360px]">
          <HeroCard puzzle={first} rank={1} featured playsCount={playsCountFor(first)} />
        </div>
      )}
      {third && (
        <div className="order-3 w-full md:order-3 md:w-[30%] md:max-w-[300px]">
          <HeroCard puzzle={third} rank={3} playsCount={playsCountFor(third)} />
        </div>
      )}
    </section>
  )
}

function HeroCard({
  puzzle,
  rank,
  featured = false,
  playsCount,
}: {
  puzzle: PublicPuzzle
  rank: number
  featured?: boolean
  playsCount: number
}) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-xl shadow-[0_12px_30px_-18px_rgba(80,60,25,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-22px_rgba(80,60,25,0.45)]',
        featured
          ? 'ring-2 ring-[#d8b25e] ring-offset-2 ring-offset-background'
          : 'ring-1 ring-[#e7decb] dark:ring-[#3b3327]'
      )}
    >
      <div className={cn('relative w-full', featured ? 'aspect-[3/4]' : 'aspect-[4/5]')}>
        <SafeImage
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={rank <= 3}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241d10]/90 via-[#241d10]/30 to-transparent" />

        <div
          className={cn(
            'absolute left-3 top-3 flex items-center justify-center rounded-full font-extrabold',
            featured ? 'h-12 w-12 text-xl' : 'h-10 w-10 text-lg',
            rankCircleClass(rank)
          )}
        >
          {rank}
        </div>

        <span
          className={cn(
            'absolute right-3 top-3 rounded-md px-2.5 py-0.5 text-[11px] font-bold shadow-sm',
            difficultyClass(puzzle.difficulty)
          )}
        >
          {puzzle.difficulty}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="line-clamp-2 text-lg font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-xl">
            {puzzle.title}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            <span className="inline-flex items-center gap-1 text-white">
              <User className="h-3.5 w-3.5 text-white" />
              {formatPlays(playsCount)} plays
            </span>
            <span className="inline-flex items-center gap-1 text-white">
              <Star className="h-3.5 w-3.5 fill-[#e8cf9a] text-[#e8cf9a]" />
              {puzzle.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1 text-white">
              <Puzzle className="h-3.5 w-3.5 text-white" />
              {puzzle.piece_count} pieces
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function GridCard({
  puzzle,
  rank,
  playsCount,
}: {
  puzzle: PublicPuzzle
  rank: number
  playsCount: number
}) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group overflow-hidden rounded-lg border border-border bg-card shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <SafeImage
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={cn(
            'absolute left-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold',
            rankCircleClass(rank)
          )}
        >
          {rank}
        </div>
        <span
          className={cn(
            'absolute right-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm',
            difficultyClass(puzzle.difficulty)
          )}
        >
          {puzzle.difficulty}
        </span>
      </div>
      <div className="px-3.5 pb-3 pt-3">
        <h3 className="line-clamp-1 text-sm font-bold text-foreground">
          {puzzle.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {formatPlays(playsCount)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#dca93f] text-[#dca93f]" />
            {puzzle.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Puzzle className="h-3.5 w-3.5" />
            {puzzle.piece_count}
          </span>
        </div>
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
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
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
        <div className="mt-8 flex flex-col items-end gap-4 md:flex-row md:justify-center">
          <div className="aspect-[4/5] w-full animate-pulse rounded-xl bg-secondary md:w-[30%]" />
          <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-secondary md:w-[38%]" />
          <div className="aspect-[4/5] w-full animate-pulse rounded-xl bg-secondary md:w-[30%]" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-border">
              <div className="aspect-[16/10] animate-pulse bg-secondary" />
              <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
