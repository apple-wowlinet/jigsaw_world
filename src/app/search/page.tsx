'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Frown, Sparkles, Clock, Filter, X, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/ui/SafeImage'
import { fetchPuzzles, type PublicPuzzle } from '@/lib/data/public'
import { cn } from '@/lib/utils'

const popularSearches = ['mountain', 'ocean', 'forest', 'city', 'sunset', 'animals', 'flowers', 'space']
const recentSearches = ['beach sunset', 'winter mountain', 'city night']

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<PublicPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(query)
  const [showFilters, setShowFilters] = useState(false)

  // URL 中的 q 变化时（如同页 <Link> 跳转），同步搜索框内容
  useEffect(() => {
    setSearchInput(query)
  }, [query])

  useEffect(() => {
    let cancelled = false

    if (!query.trim()) {
      setSearchResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetchPuzzles({ search: query, limit: 60, orderBy: 'plays' }).then((results) => {
      if (!cancelled) {
        setSearchResults(results)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false)
      setSearchResults([])
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`
    }
  }

  const clearSearch = () => {
    setSearchInput('')
    window.location.href = '/search'
  }

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy'
      case 'Medium': return 'difficulty-medium'
      case 'Hard': return 'difficulty-hard'
      case 'Expert': return 'difficulty-expert'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const chipClass = 'inline-flex h-10 items-center gap-2 rounded-lg border border-[#ddd2ba] bg-panel px-4 text-xs font-semibold text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground dark:border-[#3b3327]'

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Gallery-wall backdrop: soft daylight from above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.85),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(240,233,220,0.05),transparent_60%)]"
        aria-hidden="true"
      />

      {/* Search Header */}
      <section className="relative pt-12 pb-14">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-border" aria-hidden="true" />
              <p className="label-caps text-muted-foreground">Search the Collection</p>
              <span className="h-px w-10 bg-border" aria-hidden="true" />
            </div>

            <h1 className="font-display mt-5 text-[36px] font-semibold leading-[1.05] tracking-[-0.01em] text-foreground sm:text-[44px]">
              {query ? (
                <>
                  Results for <span className="italic text-accent">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                <>
                  Discover your next <span className="italic text-accent">puzzle</span>
                </>
              )}
            </h1>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Find the perfect puzzle from our curated collection of 1000+ puzzles
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative z-10 mx-auto mt-9 max-w-2xl">
            {/* Bar: rounded-lg (12px). The submit button is btn-lg (8px radius) inset by p-1
                (4px), so 4 + 8 = 12 — the button arc stays concentric with the bar. */}
            <div className="flex h-[60px] items-center rounded-lg border border-[#e7decb] bg-card shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] transition-all duration-300 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 dark:border-[#3b3327]">
              <Search className="ml-5 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for puzzles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search for puzzles"
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="shrink-0 p-1">
                <Button type="submit" size="lg">Search</Button>
              </div>
            </div>
          </form>

          {/* Recent & Popular Searches */}
          {!query && (
            <div className="mt-12 grid gap-10 animate-fade-in lg:grid-cols-2">
              {recentSearches.length > 0 && (
                <div>
                  <div className="mb-5 flex items-center gap-5">
                    <h2 className="label-caps shrink-0 text-foreground">Recent Searches</h2>
                    <span className="h-px flex-1 bg-[#ddd2ba] dark:bg-[#3b3327]" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {recentSearches.map((term) => (
                      <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className={chipClass}>
                        <Clock className="h-3.5 w-3.5" />
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-5 flex items-center gap-5">
                  <h2 className="label-caps shrink-0 text-foreground">Popular Topics</h2>
                  <span className="h-px flex-1 bg-[#ddd2ba] dark:bg-[#3b3327]" />
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {popularSearches.map((term) => (
                    <Link key={term} href={`/search?q=${term}`} className={chipClass}>
                      <TrendingUp className="h-3.5 w-3.5 text-primary/70" />
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-[#e7decb] bg-card p-2.5 dark:border-[#3b3327]">
                  <div className="aspect-[1.55/1] animate-pulse bg-muted" />
                  <div className="px-1.5 pb-1.5 pt-3">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="mt-2.5 h-3.5 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="animate-fade-in">
              {/* Results Header */}
              <div className="mb-6 flex items-center gap-5">
                <h2 className="label-caps shrink-0 text-foreground">Search Results</h2>
                <span className="h-px flex-1 bg-[#ddd2ba] dark:bg-[#3b3327]" />
                <p className="shrink-0 text-[13px] font-semibold text-muted-foreground">
                  {searchResults.length} puzzle{searchResults.length !== 1 ? 's' : ''} found
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </Button>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {searchResults.map((puzzle, index) => (
                  <Link
                    key={puzzle.id}
                    href={`/puzzle/${puzzle.slug}`}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="group block animate-fade-in border border-[#e7decb] bg-card p-2.5 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
                  >
                    <div className="relative aspect-[1.55/1] overflow-hidden bg-muted">
                      <SafeImage
                        src={puzzle.image_url}
                        alt={puzzle.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <span
                        className={cn(
                          'absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm',
                          getDifficultyStyle(puzzle.difficulty)
                        )}
                      >
                        {puzzle.difficulty}
                      </span>
                    </div>
                    <div className="px-1.5 pb-1.5 pt-3">
                      <h3 className="font-display text-[19px] font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
                        {puzzle.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {puzzle.piece_count} pcs
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : query ? (
            <div className="animate-fade-in py-16 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#d8cbb0] bg-panel dark:border-[#3b3327]">
                  <Frown className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="font-display mt-6 text-[26px] font-semibold text-foreground">
                  No puzzles found
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  We couldn&rsquo;t find anything matching &ldquo;
                  <span className="font-medium text-foreground">{query}</span>&rdquo;.
                  Try searching for something else or browse a popular topic.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  {popularSearches.slice(0, 5).map((suggestion) => (
                    <Link key={suggestion} href={`/search?q=${suggestion}`} className={chipClass}>
                      <TrendingUp className="h-3.5 w-3.5 text-primary/70" />
                      {suggestion}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in py-16 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#d8cbb0] bg-panel dark:border-[#3b3327]">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display mt-6 text-[26px] font-semibold text-foreground">
                  Start your puzzle journey
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Enter a search term above to explore our collection,
                  <br />
                  or try one of the popular topics.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
