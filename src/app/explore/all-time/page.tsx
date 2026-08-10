'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Puzzle, Users, Star, ChevronLeft, ChevronRight, Filter, Check, ChevronDown, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchPuzzles, type PublicPuzzle } from '@/lib/data/public'
import { cn } from '@/lib/utils'

function AllTimeContent() {
  const [puzzles, setPuzzles] = useState<PublicPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 12

  // Close the filter dropdown when clicking outside of it
  useEffect(() => {
    if (!filterOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filterOpen])

  useEffect(() => {
    let cancelled = false

    fetchPuzzles({ limit: 48, orderBy: 'rating' }).then((items) => {
      if (cancelled) return
      setPuzzles(items)
      setLoading(false)

    })

    return () => { cancelled = true }
  }, [])

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy'
      case 'Medium': return 'difficulty-medium'
      case 'Hard': return 'difficulty-hard'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  // Apply the difficulty filter, then paginate the filtered set
  const filteredPuzzles = difficultyFilter === 'All'
    ? puzzles
    : puzzles.filter(p => p.difficulty === difficultyFilter)

  const totalPages = Math.max(1, Math.ceil(filteredPuzzles.length / itemsPerPage))

  // Keep the current page within the valid range after filtering
  const safePage = Math.min(currentPage, totalPages)

  const paginatedPuzzles = filteredPuzzles.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  )

  const selectFilter = (value: 'All' | 'Easy' | 'Medium' | 'Hard') => {
    setDifficultyFilter(value)
    setFilterOpen(false)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 dark:bg-secondary/20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="animate-pulse text-center">
              <div className="h-8 bg-secondary dark:bg-secondary/50 rounded w-48 mx-auto mb-4" />
              <div className="h-4 bg-secondary dark:bg-secondary/50 rounded w-96 mx-auto" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 dark:border dark:border-white/10 dark:bg-card">
                <CardHeader className="p-0">
                  <div className="bg-secondary dark:bg-secondary/30 aspect-[4/3] rounded-t-xl" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-4 bg-secondary dark:bg-secondary/30 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-secondary dark:bg-secondary/30 rounded w-full mb-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      {/* Ambient Background Glow - Gold/Amber theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <section className="relative pt-5 pb-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8 animate-fade-in">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-foreground font-medium">Hall of Fame</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 border border-amber-500/20">
                  <Trophy className="w-4 h-4 mr-2" />
                  All-Time Legends
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-amber-500 to-yellow-600 dark:from-amber-400 dark:to-yellow-200">
                  Hall of Fame
                </h1>
                <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl leading-relaxed">
                  The greatest collection of puzzles ever created. These legendary challenges have been solved by millions and rated purely 5 stars.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Puzzles Grid */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sticky top-20 z-20 bg-background/80 dark:bg-[#08080c]/80 backdrop-blur-xl p-4 rounded-2xl border border-border/50 dark:border-white/10 shadow-sm">
              <p className="text-muted-foreground text-sm">
                Showing <span className="font-semibold text-foreground dark:text-white">{paginatedPuzzles.length}</span> of{' '}
                <span className="font-semibold text-foreground dark:text-white">{filteredPuzzles.length}</span> legends
              </p>

              <div className="relative" ref={filterRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterOpen(v => !v)}
                  className="bg-transparent border-border/50 dark:border-white/10 hover:bg-accent/10 hover:text-foreground dark:hover:text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {difficultyFilter === 'All' ? 'Filter' : difficultyFilter}
                  {difficultyFilter !== 'All' && (
                    <span
                      role="img"
                      aria-label={difficultyFilter}
                      className={cn('ml-2 w-2 h-2 rounded-full', getDifficultyStyle(difficultyFilter))}
                    />
                  )}
                  <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform', filterOpen && 'rotate-180')} />
                </Button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-background dark:bg-[#13131a] border border-border/50 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-black/40 py-1 z-30 animate-fade-in">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(value => {
                      const active = difficultyFilter === value
                      return (
                        <button
                          key={value}
                          onClick={() => selectFilter(value)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
                            'hover:bg-muted dark:hover:bg-white/10',
                            'hover:text-foreground dark:hover:text-white',
                            active ? 'text-foreground dark:text-white font-medium' : 'text-muted-foreground dark:text-gray-300'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {value !== 'All' && (
                              <span className={cn('w-2 h-2 rounded-full', getDifficultyStyle(value))} />
                            )}
                            {value}
                          </span>
                          {active && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedPuzzles.map((puzzle, index) => (
                <Card
                  key={puzzle.id}
                  className={cn(
                    "group overflow-hidden border-0 shadow-lg cursor-pointer relative",
                    "bg-white dark:bg-[#121218]/50",
                    "backdrop-blur-sm",
                    "border border-border/50 dark:border-white/10",
                    "transition-all duration-300 ease-out",
                    "hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-amber-500/10",
                    "hover:-translate-y-1 hover:border-amber-500/20 dark:hover:border-amber-500/30",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={puzzle.image_url}
                      alt={puzzle.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3">
                       <div className={cn(
                         "flex items-center justify-center w-8 h-8 rounded-full font-bold text-white shadow-lg border border-white/20 backdrop-blur-md",
                         index < 3 ? "bg-amber-500" : "bg-black/50"
                       )}>
                         #{index + 1 + (safePage - 1) * itemsPerPage}
                       </div>
                    </div>

                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg border border-white/10",
                        getDifficultyStyle(puzzle.difficulty)
                      )}>
                        {puzzle.difficulty}
                      </span>
                    </div>

                    <Link href={`/play/${puzzle.id}`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]">
                        <Button size="sm" className="rounded-full w-12 h-12 p-0 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-xl">
                          <span className="ml-1 text-xl">▶</span>
                        </Button>
                      </div>
                    </Link>

                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
                        {puzzle.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-white/80">
                        <span className="flex items-center">
                          <Puzzle className="w-3.5 h-3.5 mr-1" />
                          {puzzle.piece_count}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-yellow-400" />
                          {puzzle.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {puzzle.plays_count.toLocaleString()} plays
                      </span>
                      <span className="text-xs opacity-70">
                        {new Date(puzzle.created_at).getFullYear()}
                      </span>
                    </div>

                    <Link href={`/puzzle/${puzzle.id}`} className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-secondary/50 dark:hover:bg-white/5 group/btn">
                        View Details
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <nav className="flex items-center gap-2 p-2 rounded-xl bg-card/50 dark:bg-white/5 backdrop-blur-sm border border-border/50 dark:border-white/5 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                    className="hidden sm:flex hover:bg-secondary dark:hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .map((page) => (
                        <Button
                          key={page}
                          variant={safePage === page ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "min-w-[36px] h-9 rounded-lg transition-all",
                            safePage === page
                              ? "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
                              : "hover:bg-secondary dark:hover:bg-white/10"
                          )}
                        >
                          {page}
                        </Button>
                      ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages}
                    className="hidden sm:flex hover:bg-secondary dark:hover:bg-white/10"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default function AllTimeExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
      </div>
    }>
      <AllTimeContent />
    </Suspense>
  )
}
