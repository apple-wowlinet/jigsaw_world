'use client'

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
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
  Easy: 'difficulty-easy',
  Medium: 'difficulty-medium',
  Hard: 'difficulty-hard',
  Expert: 'difficulty-expert',
}

function combineCategories(remoteCategories: PublicCategory[]) {
  const catalogue = mergeCategoryCatalogue(remoteCategories)
  const knownSlugs = new Set(catalogue.map((category) => category.slug))
  return [
    ...catalogue,
    ...remoteCategories.filter((category) => !knownSlugs.has(category.slug)),
  ]
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
      <div className="flex min-h-[65vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <Puzzle className="mx-auto mb-4 h-12 w-12 text-sand-dark" />
          <h1 className="font-display text-2xl font-semibold">Category not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/categories"
            className="btn btn-primary btn-md mt-6"
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
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-[1380px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] font-medium text-slate-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:text-xs"
        >
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-sand-dark" />
          <Link href="/categories" className="transition hover:text-accent">
            Categories
          </Link>
          {ancestors.map((ancestor) => (
            <span key={ancestor.slug} className="contents">
              <ChevronRight className="h-3 w-3 shrink-0 text-sand-dark" />
              <Link
                href={`/category/${ancestor.slug}`}
                className="transition hover:text-accent"
              >
                {ancestor.name}
              </Link>
            </span>
          ))}
          <ChevronRight className="h-3 w-3 shrink-0 text-sand-dark" />
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {category.name}
          </span>
        </nav>

        <header className="mt-4 flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-primary-subtle shadow-sm sm:h-[72px] sm:w-[72px]">
            <CategoryIcon className="h-8 w-8 text-primary sm:h-9 sm:w-9" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display truncate text-[30px] font-semibold leading-tight tracking-[-0.01em] text-foreground sm:text-[36px]">
              {category.name} Puzzles
            </h1>
            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground sm:text-sm">
              {category.description}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Puzzle className="h-4 w-4 fill-accent text-accent" />
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
                className="inline-flex h-8 shrink-0 items-center rounded-md bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm"
              >
                All
              </Link>
              {primaryChildren.map((child) => (
                <Link
                  key={child.slug}
                  href={`/category/${child.slug}`}
                  className="inline-flex h-8 shrink-0 items-center rounded-md border border-[#ddd2ba] bg-card px-4 text-xs font-semibold text-muted-foreground transition hover:border-accent/60 hover:text-accent dark:border-[#3b3327]"
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
                  className="flex h-8 items-center gap-1 rounded-md border border-[#ddd2ba] bg-card px-4 text-xs font-semibold text-muted-foreground transition hover:border-accent/60 dark:border-[#3b3327]"
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
                    className="absolute left-0 top-10 z-30 min-w-40 overflow-hidden rounded-lg border border-border bg-popover p-1.5 shadow-xl"
                  >
                    {overflowChildren.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/category/${child.slug}`}
                        role="menuitem"
                        onClick={() => setMoreCategoriesOpen(false)}
                        className="block rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-accent"
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
                ['Expert', 'Expert'],
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
            <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 text-center">
              <Puzzle className="mb-3 h-9 w-9 text-sand-dark" />
              <h2 className="font-display text-sm font-semibold">No puzzles found</h2>
              <p className="mt-1 text-xs text-muted-foreground">
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
                    'flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md border px-2 text-xs font-bold transition',
                    item === currentPage
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-[#ddd2ba] bg-card text-muted-foreground hover:border-accent/60 hover:text-accent dark:border-[#3b3327]'
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
        className="h-8 w-full appearance-none rounded-md border border-input bg-card py-0 pl-2.5 pr-7 text-[11px] font-semibold text-muted-foreground shadow-sm outline-none transition focus:border-accent sm:pl-3 sm:text-xs"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {label}: {optionLabel}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </label>
  )
}

function PuzzleCard({ puzzle }: { puzzle: PublicPuzzle }) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group overflow-hidden rounded-lg border border-[#e7decb] bg-card shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
    >
      <div className="relative aspect-[1.55/1] overflow-hidden bg-muted">
        <SafeImage
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241d10]/90 via-[#241d10]/15 to-transparent" />
        <span
          className={cn(
            'absolute right-2.5 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm',
            difficultyStyles[puzzle.difficulty]
          )}
        >
          {puzzle.difficulty}
        </span>
        <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5">
          <p className="truncate font-display text-[15px] font-semibold leading-tight text-white [text-shadow:0_1px_8px_rgba(20,14,4,0.7)] sm:text-base">
            {puzzle.title}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-medium">
            <span className="flex min-w-0 items-center gap-1 text-white/90">
              <Puzzle className="h-3.5 w-3.5 shrink-0" />
              {puzzle.piece_count} pieces
              <span className="text-white/50">•</span>
              {puzzle.difficulty}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-white/90">
              <Star className="h-3.5 w-3.5 fill-[#dca93f] text-[#dca93f]" />
              {puzzle.rating.toFixed(1)}
            </span>
          </div>
        </div>
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
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#ddd2ba] bg-card text-muted-foreground transition hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35 dark:border-[#3b3327]"
    >
      {children}
    </button>
  )
}

function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1380px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
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

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent />
    </Suspense>
  )
}
