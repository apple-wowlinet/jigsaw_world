'use client'

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Mountain,
  Puzzle,
  Star,
  Sun,
  TreePine,
  Users,
  Waves,
} from 'lucide-react'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import {
  fetchCategories,
  fetchPuzzles,
  type DisplayDifficulty,
  type PublicCategory,
  type PublicPuzzle,
} from '@/lib/data/public'
import { mergeCategoryCatalogue } from '@/lib/data/category-catalogue'
import {
  buildCategoryTaxonomy,
  getCategoryAncestors,
  getCategoryChildren,
  getCategoryDescendants,
  getCategorySourceSlug,
  puzzleMatchesCategory,
} from '@/lib/data/category-taxonomy'
import { cn } from '@/lib/utils'

const ITEMS_PER_PAGE = 8
const VISIBLE_CATEGORY_TABS = 7

type PieceFilter = 'any' | 'small' | 'medium' | 'large'
type SortOrder = 'popular' | 'rating' | 'newest' | 'pieces'

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  trees: TreePine,
  mountain: Mountain,
  'flower-2': Flower2,
  waves: Waves,
  sun: Sun,
}

const difficultyStyles: Record<DisplayDifficulty, string> = {
  Easy: 'border-emerald-500 bg-white/95 text-emerald-600',
  Medium: 'border-orange-400 bg-white/95 text-orange-500',
  Hard: 'border-red-500 bg-white/95 text-red-500',
}

function combineCategories(remoteCategories: PublicCategory[]) {
  const catalogue = mergeCategoryCatalogue(remoteCategories)
  const knownSlugs = new Set(catalogue.map((category) => category.slug))
  return [
    ...catalogue,
    ...remoteCategories.filter((category) => !knownSlugs.has(category.slug)),
  ]
}

function formatCount(count: number) {
  if (count < 1000) return count.toLocaleString()
  const value = count / 1000
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)}K`
}

function getPaginationItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])
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

function CategoryContent() {
  const params = useParams()
  const slug = params?.slug as string
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<PublicCategory[]>(() =>
    combineCategories([])
  )
  const [puzzles, setPuzzles] = useState<PublicPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState<'All' | DisplayDifficulty>('All')
  const [pieceFilter, setPieceFilter] = useState<PieceFilter>('any')
  const [sortOrder, setSortOrder] = useState<SortOrder>('popular')
  const [moreCategoriesOpen, setMoreCategoriesOpen] = useState(false)

  const taxonomy = useMemo(
    () => buildCategoryTaxonomy(categories),
    [categories]
  )
  const category = taxonomy.find((node) => node.slug === slug)
  const ancestors = category ? getCategoryAncestors(category, taxonomy) : []
  const children = category ? getCategoryChildren(category.slug, taxonomy) : []
  const sourceSlug = category
    ? getCategorySourceSlug(category, taxonomy)
    : slug

  useEffect(() => {
    let cancelled = false

    async function loadCategory() {
      setLoading(true)
      setPuzzles([])

      const remoteCategories = await fetchCategories()
      if (cancelled) return

      const mergedCategories = combineCategories(remoteCategories)
      const loadedTaxonomy = buildCategoryTaxonomy(mergedCategories)
      const loadedCategory = loadedTaxonomy.find((node) => node.slug === slug)

      setCategories(mergedCategories)

      if (!loadedCategory) {
        setLoading(false)
        return
      }

      const loadedSourceSlug = getCategorySourceSlug(
        loadedCategory,
        loadedTaxonomy
      )
      const categorySlugs = [
        loadedSourceSlug,
        ...getCategoryDescendants(loadedSourceSlug, loadedTaxonomy).map(
          (node) => node.slug
        ),
      ]
      const loadedPuzzles = await fetchPuzzles({
        categorySlugs,
        limit: 500,
        orderBy: 'plays',
      })

      if (!cancelled) {
        setPuzzles(loadedPuzzles)
        setLoading(false)
      }
    }

    loadCategory()
    return () => {
      cancelled = true
    }
  }, [slug])

  const filteredPuzzles = (() => {
    if (!category) return []

    let result = sourceSlug === category.slug
      ? [...puzzles]
      : puzzles.filter((puzzle) => puzzleMatchesCategory(puzzle, category))

    if (difficulty !== 'All') {
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
      if (sortOrder === 'pieces') return a.piece_count - b.piece_count
      return b.plays_count - a.plays_count
    })

    return result
  })()

  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPuzzles.length / ITEMS_PER_PAGE)
  )
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1
  const paginatedPuzzles = filteredPuzzles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    const nextParams = new URLSearchParams(searchParams.toString())
    if (nextPage === 1) nextParams.delete('page')
    else nextParams.set('page', nextPage.toString())
    const query = nextParams.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    document.getElementById('puzzle-grid')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const resetPagination = () => {
    if (currentPage !== 1) goToPage(1)
  }

  if (loading) return <CategorySkeleton />

  if (!category) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-white px-4 dark:bg-[#08080c]">
        <div className="text-center">
          <Puzzle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h1 className="text-2xl font-extrabold">Category not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex rounded-lg bg-[#4b925f] px-5 py-2.5 text-sm font-bold text-white"
          >
            Browse categories
          </Link>
        </div>
      </div>
    )
  }

  const CategoryIcon = iconMap[category.icon] ?? Puzzle
  const primaryChildren = children.slice(0, VISIBLE_CATEGORY_TABS)
  const overflowChildren = children.slice(VISIBLE_CATEGORY_TABS)
  const paginationItems = getPaginationItems(totalPages, currentPage)

  return (
    <div className="min-h-screen bg-white text-[#111827] dark:bg-[#08080c] dark:text-white">
      <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-5 sm:px-6 lg:px-9">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] font-medium text-slate-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:text-xs"
        >
          <Link href="/" className="transition hover:text-[#4b925f]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-300 dark:text-slate-600" />
          <Link href="/categories" className="transition hover:text-[#4b925f]">
            Categories
          </Link>
          {ancestors.map((ancestor) => (
            <span key={ancestor.slug} className="contents">
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-300 dark:text-slate-600" />
              <Link
                href={`/category/${ancestor.slug}`}
                className="transition hover:text-[#4b925f]"
              >
                {ancestor.name}
              </Link>
            </span>
          ))}
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {category.name}
          </span>
        </nav>

        <header className="mt-4 flex items-center gap-5">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-sm sm:h-[72px] sm:w-[72px]"
            style={{ backgroundColor: category.color }}
          >
            <CategoryIcon className="h-8 w-8 text-white sm:h-9 sm:w-9" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[28px] font-black leading-tight tracking-[-0.035em] text-[#10172c] dark:text-white sm:text-[34px]">
              {category.name} Puzzles
            </h1>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              {category.description}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Puzzle
                className="h-4 w-4 fill-current"
                style={{ color: category.color }}
              />
              {category.puzzleCount.toLocaleString()} puzzles
            </p>
          </div>
        </header>

        <section
          aria-label="Category and puzzle filters"
          className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex min-w-0 items-center gap-1">
            <div className="-mx-1 flex min-w-0 items-center gap-1 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex h-8 shrink-0 items-center rounded-full bg-[#4b925f] px-4 text-xs font-bold text-white shadow-sm"
              >
                All
              </Link>
              {primaryChildren.map((child) => (
                <Link
                  key={child.slug}
                  href={`/category/${child.slug}`}
                  className="inline-flex h-8 shrink-0 items-center rounded-md border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-[#4b925f]/40 hover:text-[#377249] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-emerald-400"
                >
                  {child.name}
                </Link>
              ))}
            </div>
            {overflowChildren.length > 0 && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  aria-expanded={moreCategoriesOpen}
                  aria-haspopup="menu"
                  onClick={() => setMoreCategoriesOpen((open) => !open)}
                  className="flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-[#4b925f]/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                  More
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition',
                      moreCategoriesOpen && 'rotate-180'
                    )}
                  />
                </button>
                {moreCategoriesOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-10 z-30 min-w-40 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#17171e]"
                  >
                    {overflowChildren.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/category/${child.slug}`}
                        role="menuitem"
                        onClick={() => setMoreCategoriesOpen(false)}
                        className="block rounded-md px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#377249] dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-end">
            <FilterSelect
              label="Difficulty"
              value={difficulty}
              onChange={(value) => {
                setDifficulty(value as typeof difficulty)
                resetPagination()
              }}
              options={[
                ['All', 'All'],
                ['Easy', 'Easy'],
                ['Medium', 'Medium'],
                ['Hard', 'Hard'],
              ]}
            />
            <FilterSelect
              label="Pieces"
              value={pieceFilter}
              onChange={(value) => {
                setPieceFilter(value as PieceFilter)
                resetPagination()
              }}
              options={[
                ['any', 'Any'],
                ['small', 'Up to 100'],
                ['medium', '101–200'],
                ['large', '200+'],
              ]}
            />
            <FilterSelect
              label="Sort"
              value={sortOrder}
              onChange={(value) => {
                setSortOrder(value as SortOrder)
                resetPagination()
              }}
              options={[
                ['popular', 'Popular'],
                ['rating', 'Rating'],
                ['newest', 'Newest'],
                ['pieces', 'Pieces'],
              ]}
            />
          </div>
        </section>

        <section id="puzzle-grid" className="scroll-mt-24 pt-4">
          {paginatedPuzzles.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedPuzzles.map((puzzle) => (
                <PuzzleCard key={puzzle.uuid} puzzle={puzzle} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center dark:border-white/10 dark:bg-white/[0.025]">
              <Puzzle className="mb-3 h-9 w-9 text-slate-300 dark:text-slate-600" />
              <h2 className="text-sm font-extrabold">No puzzles found</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Try another difficulty or piece count.
              </p>
            </div>
          )}
        </section>

        {filteredPuzzles.length > 0 && (
          <nav
            aria-label="Puzzle pages"
            className="mt-4 flex items-center justify-center gap-1.5"
          >
            <PaginationButton
              label="Previous page"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationButton>
            {paginationItems.map((item) =>
              typeof item === 'number' ? (
                <button
                  key={item}
                  type="button"
                  onClick={() => goToPage(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={cn(
                    'flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-bold transition',
                    item === currentPage
                      ? 'border-[#4b925f] bg-[#4b925f] text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-[#4b925f]/50 hover:text-[#377249] dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                  )}
                >
                  {item}
                </button>
              ) : (
                <span
                  key={item}
                  className="flex h-8 w-6 items-center justify-center text-xs text-slate-400"
                >
                  …
                </span>
              )
            )}
            <PaginationButton
              label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationButton>
          </nav>
        )}
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
    <label className="relative min-w-0 sm:min-w-[108px]">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full appearance-none rounded-md border border-slate-200 bg-white py-0 pl-2.5 pr-7 text-[11px] font-semibold text-slate-600 shadow-sm outline-none transition focus:border-[#4b925f] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:pl-3 sm:text-xs"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {label}: {optionLabel}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
    </label>
  )
}

function PuzzleCard({ puzzle }: { puzzle: PublicPuzzle }) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_2px_7px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-[#14141a]"
    >
      <div className="relative aspect-[1.55/1] overflow-hidden bg-slate-100">
        <Image
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-transparent" />
        <span
          className={cn(
            'absolute right-2.5 top-2 rounded-full border px-2.5 py-0.5 text-[10px] font-bold shadow-sm',
            difficultyStyles[puzzle.difficulty]
          )}
        >
          {puzzle.difficulty}
        </span>
        <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 text-white">
          <h2 className="truncate text-[13px] font-extrabold leading-tight drop-shadow-sm sm:text-sm">
            {puzzle.title}
          </h2>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-medium">
            <span className="flex min-w-0 items-center gap-1">
              <Puzzle className="h-3.5 w-3.5 shrink-0" />
              {puzzle.piece_count} pieces
              <span className="text-white/50">•</span>
              <span
                className={cn(
                  puzzle.difficulty === 'Easy' && 'text-emerald-300',
                  puzzle.difficulty === 'Medium' && 'text-orange-300',
                  puzzle.difficulty === 'Hard' && 'text-red-300'
                )}
              >
                {puzzle.difficulty}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {puzzle.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-8 items-center px-3 text-[10px] font-medium text-slate-500 dark:text-slate-400">
        <Users className="mr-1.5 h-3.5 w-3.5" />
        {formatCount(puzzle.plays_count)} plays
      </div>
    </Link>
  )
}

function PaginationButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode
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
      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-[#4b925f]/50 hover:text-[#377249] disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
    >
      {children}
    </button>
  )
}

function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08080c]">
      <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-5 sm:px-6 lg:px-9">
        <div className="h-3 w-52 rounded-full skeleton" />
        <div className="mt-4 flex items-center gap-5">
          <div className="h-[72px] w-[72px] rounded-full skeleton" />
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg skeleton" />
            <div className="h-3 w-80 max-w-[70vw] rounded-full skeleton" />
            <div className="h-3 w-24 rounded-full skeleton" />
          </div>
        </div>
        <div className="mt-6 h-8 rounded-lg skeleton" />
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-lg border border-slate-100 dark:border-white/5">
              <div className="aspect-[1.55/1] skeleton" />
              <div className="h-8 skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent />
    </Suspense>
  )
}
