'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Puzzle, ArrowRight, Star, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Puzzle {
  id: string
  title: string
  image_url: string
  piece_count: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  rating: number
  plays: number
}

export function RecommendationsSection() {
  const recommendations: Puzzle[] = [
    {
      id: '1',
      title: 'Ocean Waves',
      image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
      piece_count: 150,
      difficulty: 'Medium',
      rating: 4.8,
      plays: 2847
    },
    {
      id: '2',
      title: 'Forest Path',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      piece_count: 200,
      difficulty: 'Hard',
      rating: 4.6,
      plays: 1923
    },
    {
      id: '3',
      title: 'City Skyline',
      image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      piece_count: 100,
      difficulty: 'Easy',
      rating: 4.9,
      plays: 4521
    }
  ]

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy'
      case 'Medium': return 'difficulty-medium'
      case 'Hard': return 'difficulty-hard'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <section className="py-20 section-alt dark:bg-[#0c0c12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3 tracking-tight">
              Today&apos;s Recommendations
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-xl">
              Discover amazing puzzles handpicked just for you by our community
            </p>
          </div>
          <Link 
            href="/explore/all"
            className={cn(
              "inline-flex items-center px-8 py-4 rounded-full cursor-pointer group",
              "bg-secondary/80 dark:bg-white/5 backdrop-blur-sm",
              "border border-transparent dark:border-white/10",
              "text-secondary-foreground dark:text-white font-medium",
              "hover:bg-secondary dark:hover:bg-white/10 dark:hover:border-white/20",
              "transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
            )}
          >
            View All Puzzles
            <ArrowRight className="w-4 h-4 ml-2 opacity-70 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Puzzles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((puzzle, index) => (
            <Link 
              key={puzzle.id} 
              href={`/play/${puzzle.id}`}
              className="block cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card 
                className={cn(
                  "group overflow-hidden card-hover border-0 shadow-lg h-full",
                  "dark:bg-[#15151a] dark:border dark:border-white/10 dark:shadow-lg dark:shadow-black/20 dark:hover:shadow-xl dark:hover:shadow-primary/5 dark:hover:border-primary/20 transition-all duration-300",
                  "hover:-translate-y-1"
                )}
              >
                <CardHeader className="p-0 relative">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={puzzle.image_url}
                      alt={puzzle.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Difficulty badge */}
                    <div className="absolute top-4 right-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm",
                        getDifficultyStyle(puzzle.difficulty)
                      )}>
                        {puzzle.difficulty}
                      </span>
                    </div>
                    
                    {/* Hover play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="lg" className="bg-white text-foreground hover:bg-white/90 scale-90 group-hover:scale-100 transition-transform shadow-2xl shadow-black/30 ring-1 ring-white/40">
                        <Play className="w-4 h-4 mr-2 fill-current" />
                        Play Now
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-semibold text-foreground dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors tracking-tight">
                    {puzzle.title}
                  </CardTitle>
                  
                  {/* Stats row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        {puzzle.plays.toLocaleString()} plays
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        {puzzle.rating}
                      </span>
                    </div>
                    <span className="flex items-center gap-3 text-sm text-muted-foreground dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Puzzle className="w-4 h-4" />
                        {puzzle.piece_count} pcs
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        ~{Math.round(puzzle.piece_count / 10)} min
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center relative z-10">
          <div className="relative inline-flex group">
            {/* Animated Glow Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className={cn(
              "relative inline-flex flex-col sm:flex-row items-center gap-6 md:gap-8 p-8 rounded-2xl",
              "bg-card/80 dark:bg-[#121218]/90 backdrop-blur-xl",
              "border border-border/50 dark:border-white/10",
              "shadow-2xl dark:shadow-black/50"
            )}>
              <div className="text-center sm:text-left">
                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/80">
                  Want more challenges?
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                  Browse our collection of <span className="text-primary dark:text-primary-400 font-medium">1000+ puzzles</span>
                </p>
              </div>
              
              <Link href="/explore/all" className="cursor-pointer">
                <Button 
                  size="lg"
                  className={cn(
                    "cursor-pointer relative overflow-hidden transition-all duration-300",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "dark:bg-white dark:text-black dark:hover:bg-white/90",
                    "shadow-lg hover:shadow-primary/25 dark:hover:shadow-white/20",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <span className="relative z-10 flex items-center font-semibold">
                    Explore All Puzzles
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
