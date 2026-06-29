'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Puzzle, Users, Star, ChevronLeft, ChevronRight, Filter, Grid3X3, List, Clock, Play } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PuzzleItem {
  id: string
  title: string
  image_url: string
  description: string
  piece_count: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  plays_count: number
  rating: number
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  puzzle_count: number
  icon: string
}

function CategoryContent() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [puzzles, setPuzzles] = useState<PuzzleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const itemsPerPage = 12

  useEffect(() => {
    const mockCategory: Category = {
      id: '1',
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug: slug,
      description: `Beautiful ${slug} puzzles to challenge your mind. Explore our collection of carefully curated puzzles featuring stunning ${slug} imagery.`,
      puzzle_count: 24,
      icon: '🏞️'
    }

    const mockPuzzles: PuzzleItem[] = Array.from({ length: 24 }, (_, i) => ({
      id: `${i + 1}`,
      title: `${mockCategory.name} Puzzle ${i + 1}`,
      image_url: `https://images.unsplash.com/photo-${1506905925346 + i}?w=400&h=300&fit=crop`,
      description: `A beautiful ${slug} puzzle with ${100 + (i * 10)} pieces`,
      piece_count: 100 + (i * 10),
      difficulty: ['Easy', 'Medium', 'Hard'][i % 3] as 'Easy' | 'Medium' | 'Hard',
      plays_count: Math.floor(Math.random() * 5000) + 100,
      rating: 4 + (Math.random() * 1),
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }))

    setTimeout(() => {
      setCategory(mockCategory)
      setPuzzles(mockPuzzles)
      setTotalPages(Math.ceil(mockPuzzles.length / itemsPerPage))
      setLoading(false)
    }, 800)
  }, [slug])

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy'
      case 'Medium': return 'difficulty-medium'
      case 'Hard': return 'difficulty-hard'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const paginatedPuzzles = puzzles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3.5 w-3.5",
          i < Math.floor(rating) ? 'star-filled' : 'star-empty'
        )}
      />
    ))
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
                  <div className="flex justify-between">
                    <div className="h-3 bg-secondary dark:bg-secondary/30 rounded w-16" />
                    <div className="h-3 bg-secondary dark:bg-secondary/30 rounded w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Category not found</h1>
          <p className="text-muted-foreground mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Category Header */}
        <section className="relative pt-24 pb-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8 animate-fade-in">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-foreground font-medium">{category.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4 border border-primary/20">
                  <span className="mr-2 text-base">{category.icon}</span>
                  {category.puzzle_count} Puzzles Collection
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 dark:from-white dark:to-white/70">
                  {category.name} Puzzles
                </h1>
                <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl leading-relaxed">
                  {category.description}
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
                <span className="font-semibold text-foreground dark:text-white">{puzzles.length}</span> puzzles
              </p>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent border-border/50 dark:border-white/10 hover:bg-accent/5">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                
                <div className="flex items-center bg-muted/50 dark:bg-white/5 rounded-lg p-1 border border-border/50 dark:border-white/5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-md transition-all duration-200",
                      viewMode === 'grid' 
                        ? "bg-background dark:bg-white/10 text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50 dark:hover:bg-white/5"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-md transition-all duration-200",
                      viewMode === 'list' 
                        ? "bg-background dark:bg-white/10 text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50 dark:hover:bg-white/5"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedPuzzles.map((puzzle, index) => (
                  <Link 
                    key={puzzle.id} 
                    href={`/play/${puzzle.id}`}
                    className="block cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card 
                      className={cn(
                        "group overflow-hidden border-0 shadow-lg cursor-pointer relative h-full",
                        "bg-white dark:bg-[#121218]/50",
                        "backdrop-blur-sm",
                        "border border-border/50 dark:border-white/10",
                        "transition-all duration-300 ease-out",
                        "hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50",
                        "hover:-translate-y-1 hover:border-primary/20 dark:hover:border-white/20"
                      )}
                    >
                      <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={puzzle.image_url}
                          alt={puzzle.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        
                        {/* Badges */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg border border-white/10",
                            getDifficultyStyle(puzzle.difficulty)
                          )}>
                            {puzzle.difficulty}
                          </span>
                        </div>
                        
                        {/* Hover play button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]">
                          <Button size="sm" className="rounded-full w-12 h-12 p-0 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-2xl shadow-black/30 ring-1 ring-white/40">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </Button>
                        </div>

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
                            {puzzle.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-white/80">
                            <span className="flex items-center">
                              <Puzzle className="w-3.5 h-3.5 mr-1" />
                              {puzzle.piece_count} pcs
                            </span>
                            <span className="flex items-center">
                              <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-yellow-400" />
                              {puzzle.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4 relative">
                        {/* Subtle shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {puzzle.plays_count.toLocaleString()} plays
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            ~{Math.round(puzzle.piece_count / 10)} min
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {paginatedPuzzles.map((puzzle, index) => (
                  <Card 
                    key={puzzle.id} 
                    className={cn(
                      "group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300",
                      "bg-white dark:bg-[#121218]/50",
                      "border border-border/50 dark:border-white/10",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                        <Image
                          src={puzzle.image_url}
                          alt={puzzle.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute top-3 left-3">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 shadow-sm",
                            getDifficultyStyle(puzzle.difficulty)
                          )}>
                            {puzzle.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6 flex flex-col justify-between relative">
                         {/* Subtle shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-foreground dark:text-white group-hover:text-primary transition-colors">
                              {puzzle.title}
                            </h3>
                            <div className="flex items-center bg-secondary/50 dark:bg-white/5 px-2 py-1 rounded-md">
                              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium">{puzzle.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground dark:text-gray-400 mb-4 line-clamp-2">
                            {puzzle.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-6 text-sm">
                            <span className="flex items-center text-muted-foreground dark:text-gray-400">
                              <Puzzle className="w-4 h-4 mr-2 text-primary" />
                              {puzzle.piece_count} pieces
                            </span>
                            <span className="flex items-center text-muted-foreground dark:text-gray-400">
                              <Users className="w-4 h-4 mr-2 text-primary" />
                              {puzzle.plays_count.toLocaleString()} plays
                            </span>
                            <span className="flex items-center text-muted-foreground dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-2 text-primary" />
                              {new Date(puzzle.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6 sm:mt-0 pt-4 border-t border-border/50 dark:border-white/5">
                          <Link href={`/p/${puzzle.id}`} className="flex-1 sm:flex-initial">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent border-border/50 dark:border-white/10 hover:bg-secondary/50 dark:hover:bg-white/5">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/play/${puzzle.id}`} className="flex-1 sm:flex-initial">
                            <Button size="sm" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                              <Play className="w-4 h-4 mr-2" />
                              Play Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <nav className="flex items-center gap-2 p-2 rounded-xl bg-card/50 dark:bg-white/5 backdrop-blur-sm border border-border/50 dark:border-white/5 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="hidden sm:flex hover:bg-secondary dark:hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "min-w-[36px] h-9 rounded-lg transition-all",
                              currentPage === page 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" 
                                : "hover:bg-secondary dark:hover:bg-white/10"
                            )}
                          >
                            {page}
                          </Button>
                        </div>
                      ))}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
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

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <CategoryContent />
    </Suspense>
  )
}
