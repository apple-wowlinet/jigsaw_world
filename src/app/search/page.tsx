'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Puzzle, Frown, Sparkles, Clock, Star, Filter, X, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PuzzleItem {
  id: string
  title: string
  image_url: string
  description: string
  piece_count: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  rating: number
  plays: number
  category: string
}

const popularSearches = ['mountain', 'ocean', 'forest', 'city', 'sunset', 'animals', 'flowers', 'space']
const recentSearches = ['beach sunset', 'winter mountain', 'city night']

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<PuzzleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(query)
  const [showFilters, setShowFilters] = useState(false)

  // URL 中的 q 变化时（如同页 <Link> 跳转），同步搜索框内容
  useEffect(() => {
    setSearchInput(query)
  }, [query])

  useEffect(() => {
    const mockResults: PuzzleItem[] = [
      {
        id: '1',
        title: 'Mountain Landscape',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        description: 'A breathtaking mountain landscape with snow-capped peaks and rolling hills',
        piece_count: 100,
        difficulty: 'Easy',
        rating: 4.8,
        plays: 3421,
        category: 'Nature'
      },
      {
        id: '2',
        title: 'Ocean Waves',
        image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
        description: 'Stunning ocean waves crashing against the shore at golden hour',
        piece_count: 150,
        difficulty: 'Medium',
        rating: 4.6,
        plays: 2847,
        category: 'Ocean'
      },
      {
        id: '3',
        title: 'City Skyline at Night',
        image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        description: 'Beautiful city skyline illuminated against the night sky',
        piece_count: 200,
        difficulty: 'Hard',
        rating: 4.9,
        plays: 4521,
        category: 'City'
      },
      {
        id: '4',
        title: 'Autumn Forest Path',
        image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        description: 'A serene forest path surrounded by vibrant autumn colors',
        piece_count: 120,
        difficulty: 'Medium',
        rating: 4.7,
        plays: 1923,
        category: 'Forest'
      },
      {
        id: '5',
        title: 'Desert Dunes',
        image_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
        description: 'Golden sand dunes stretching into the horizon',
        piece_count: 80,
        difficulty: 'Easy',
        rating: 4.5,
        plays: 1234,
        category: 'Nature'
      },
      {
        id: '6',
        title: 'Northern Lights',
        image_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop',
        description: 'Spectacular aurora borealis dancing across the night sky',
        piece_count: 250,
        difficulty: 'Hard',
        rating: 4.9,
        plays: 5678,
        category: 'Nature'
      }
    ]

    setTimeout(() => {
      if (query) {
        const filtered = mockResults.filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
      } else {
        setSearchResults([])
      }
      setLoading(false)
    }, 600)
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
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Search Header */}
        <section className="relative pt-24 pb-12 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 dark:from-white dark:to-white/70">
                {query ? (
                  <>
                    Search Results for{' '}
                    <span className="text-primary dark:text-primary-400">&quot;{query}&quot;</span>
                  </>
                ) : (
                  'Discover Puzzles'
                )}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Find the perfect puzzle from our collection of 1000+ puzzles
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative z-20">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500" />
                <div className="relative flex items-center bg-background/80 dark:bg-[#121218]/90 backdrop-blur-xl rounded-full border border-border/50 dark:border-white/10 shadow-2xl transition-all duration-300 group-hover:shadow-primary/10 group-hover:border-primary/20">
                  <div className="pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for puzzles..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full h-16 px-4 text-lg border-0 bg-transparent !ring-0 !ring-offset-0 !outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:shadow-none placeholder:text-muted-foreground/50 shadow-none hover:border-0"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-2 mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <div className="pr-1.5 py-1.5">
                    <Button
                      type="submit"
                      size="lg"
                      className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 text-base font-medium"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Recent & Popular Searches */}
            {!query && (
              <div className="mt-16 space-y-10 animate-fade-in">
                {recentSearches.length > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="h-px w-12 bg-border/50 dark:bg-white/10" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Recent Searches</p>
                      <div className="h-px w-12 bg-border/50 dark:bg-white/10" />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {recentSearches.map((term) => (
                        <Link
                          key={term}
                          href={`/search?q=${encodeURIComponent(term)}`}
                          className="group inline-flex items-center px-5 py-2.5 rounded-full text-sm bg-secondary/30 dark:bg-white/5 text-foreground hover:bg-secondary dark:hover:bg-white/10 border border-border/50 dark:border-white/5 hover:border-border dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <Clock className="w-3.5 h-3.5 mr-2.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="h-px w-12 bg-border/50 dark:bg-white/10" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Popular Topics</p>
                    <div className="h-px w-12 bg-border/50 dark:bg-white/10" />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {popularSearches.map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${term}`}
                        className="group inline-flex items-center px-5 py-2.5 rounded-full text-sm bg-primary/5 dark:bg-primary/10 text-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <TrendingUp className="w-3.5 h-3.5 mr-2.5 text-primary/70 group-hover:text-primary transition-colors" />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse border-0 shadow-lg bg-card dark:bg-[#121218] border-border/50 dark:border-white/5">
                    <CardHeader className="p-0">
                      <div className="bg-secondary dark:bg-white/5 aspect-[4/3] rounded-t-xl" />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-6 bg-secondary dark:bg-white/5 rounded w-3/4 mb-4" />
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-secondary dark:bg-white/5 rounded w-full" />
                        <div className="h-4 bg-secondary dark:bg-white/5 rounded w-5/6" />
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-secondary dark:bg-white/5 rounded w-20" />
                        <div className="h-4 bg-secondary dark:bg-white/5 rounded w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="animate-fade-in">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-background/80 dark:bg-[#08080c]/80 backdrop-blur-xl p-4 rounded-2xl border border-border/50 dark:border-white/10 sticky top-20 z-30 shadow-sm">
                  <div>
                    <p className="text-muted-foreground">
                      Found <span className="font-semibold text-foreground dark:text-white">{searchResults.length}</span> puzzle{searchResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-transparent border-border/50 dark:border-white/10 hover:bg-secondary/50 dark:hover:bg-white/5"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
                
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((puzzle, index) => (
                    <Card 
                      key={puzzle.id} 
                      className={cn(
                        "group overflow-hidden border-0 shadow-lg cursor-pointer relative",
                        "bg-white dark:bg-[#121218]/50",
                        "backdrop-blur-sm",
                        "border border-border/50 dark:border-white/10",
                        "transition-all duration-300 ease-out",
                        "hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50",
                        "hover:-translate-y-1 hover:border-primary/20 dark:hover:border-white/20",
                        "animate-fade-in"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={puzzle.image_url}
                          alt={puzzle.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg border border-white/10",
                            getDifficultyStyle(puzzle.difficulty)
                          )}>
                            {puzzle.difficulty}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-md border border-white/10">
                            {puzzle.category}
                          </span>
                        </div>
                        
                        {/* Hover play button */}
                        <Link href={`/play/${puzzle.id}`}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]">
                            <Button size="lg" className="rounded-full h-14 w-14 p-0 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-xl">
                              <span className="ml-1 text-xl">▶</span>
                            </Button>
                          </div>
                        </Link>

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
                            {puzzle.title}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-white/80">
                            <span className="flex items-center">
                              <Puzzle className="w-3.5 h-3.5 mr-1.5" />
                              {puzzle.piece_count}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-3.5 h-3.5 mr-1.5 text-yellow-400 fill-yellow-400" />
                              {puzzle.rating}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-6 relative">
                        {/* Subtle shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        
                        <p className="text-muted-foreground dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                          {puzzle.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border/50 dark:border-white/5">
                          <span className="text-xs font-medium text-muted-foreground dark:text-gray-500 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            ~{Math.round(puzzle.piece_count / 10)} min
                          </span>
                          <Link 
                            href={`/p/${puzzle.id}`}
                            className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary-400 transition-colors flex items-center group/link"
                          >
                            View Details 
                            <span className="ml-1 transition-transform group-hover/link:translate-x-0.5">→</span>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : query ? (
              <div className="text-center py-24 animate-fade-in">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-muted/50 dark:bg-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    <Frown className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground dark:text-white mb-3">
                    No puzzles found
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400 mb-8 leading-relaxed">
                    We couldn&apos;t find any puzzles matching &quot;<span className="text-foreground dark:text-white font-medium">{query}</span>&quot;. <br/>
                    Try searching for something else or browse our popular categories.
                  </p>
                  
                  <div className="p-6 rounded-2xl bg-card/50 dark:bg-white/5 border border-border/50 dark:border-white/5">
                    <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Try these instead</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularSearches.slice(0, 5).map((suggestion) => (
                        <Link
                          key={suggestion}
                          href={`/search?q=${suggestion}`}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 dark:bg-white/10 text-foreground dark:text-slate-100 hover:bg-secondary dark:hover:bg-white/[0.18] border border-transparent hover:border-border dark:border-white/10 dark:hover:border-white/20 transition-all"
                        >
                          {suggestion}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 animate-fade-in">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Sparkles className="h-12 w-12 text-primary relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground dark:text-white mb-3">
                    Start your puzzle journey
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                    Enter a search term above to explore our vast collection,<br/>or try one of the popular topics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
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
