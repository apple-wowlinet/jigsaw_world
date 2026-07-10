'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Clock, Sparkles, ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DailyPuzzle {
  id: string
  title: string
  image_url: string
  description: string
  piece_count: number
  created_at: string
}

const historyPuzzles: DailyPuzzle[] = [
  {
    id: '2',
    title: 'Ocean Sunset',
    image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    description: 'A calming sunset over the ocean waves.',
    piece_count: 150,
    created_at: '2026-07-09T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Urban Lights',
    image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    description: 'City lights shining bright in the night.',
    piece_count: 200,
    created_at: '2026-07-08T00:00:00.000Z'
  },
  {
    id: '4',
    title: 'Forest Path',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    description: 'A mysterious path leading through the ancient forest.',
    piece_count: 120,
    created_at: '2026-07-07T00:00:00.000Z'
  }
]

export default function DailyPage() {
  const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzle | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const mockDailyPuzzle: DailyPuzzle = {
      id: '1',
      title: 'Mountain Landscape',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      description: 'A beautiful mountain landscape puzzle to challenge your mind and provide hours of entertainment',
      piece_count: 100,
      created_at: new Date().toISOString()
    }
    
    setTimeout(() => {
      setDailyPuzzle(mockDailyPuzzle)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-background dark:bg-[#08080c] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded-full w-48 mx-auto" />
            <div className="h-12 bg-secondary rounded w-3/4 mx-auto" />
            <div className="aspect-[2/1] bg-secondary rounded-2xl w-full max-w-4xl mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!dailyPuzzle) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-background dark:bg-[#08080c]">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Today's Puzzle Section (Hero Style) */}
        <section className="py-20 lg:py-28 relative">
           {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fade-in">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground dark:text-white leading-tight">
                  {dailyPuzzle.title}
                </h1>
                
                {/* Description */}
                <p className="text-lg text-muted-foreground dark:text-gray-400 leading-relaxed max-w-xl">
                  {dailyPuzzle.description}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link href={`/play/${dailyPuzzle.id}`}>
                    <Button size="lg" className="btn-shine text-base px-8 h-12 shadow-lg shadow-primary/20">
                      <Play className="w-5 h-5 mr-2" />
                      Play Now
                    </Button>
                  </Link>
                  <Link href={`/puzzle/${dailyPuzzle.id}`}>
                    <Button size="lg" variant="outline" className="text-base px-8 h-12 group bg-card/50 dark:bg-transparent dark:text-white dark:border-white/20 dark:hover:bg-white/10 dark:hover:border-white/40 backdrop-blur-sm">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative lg:pl-8">
                <div className="relative group">
                  {/* Decorative glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-60 dark:opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <Card className="relative overflow-hidden shadow-2xl border-0 dark:border dark:border-white/10 dark:bg-[#121218] card-hover">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={dailyPuzzle.image_url}
                          alt={dailyPuzzle.title}
                          fill
                          className={cn(
                            "object-cover transition-all duration-700",
                            imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                          )}
                          priority
                          onLoad={() => setImageLoaded(true)}
                        />
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Hover play button */}
                        <Link href={`/play/${dailyPuzzle.id}`}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px] cursor-pointer">
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 scale-90 hover:scale-100 transition-transform shadow-xl rounded-full w-16 h-16 p-0 flex items-center justify-center cursor-pointer">
                              <Play className="w-6 h-6 ml-1 fill-current" />
                            </Button>
                          </div>
                        </Link>
                        
                        {/* Today's Challenge badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-subtle/95 dark:bg-accent/20 border border-accent/30 backdrop-blur-sm text-accent shadow-lg">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Today&apos;s Challenge
                          </span>
                        </div>

                        {/* Daily date badge */}
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-foreground dark:bg-black/60 dark:text-white backdrop-blur-sm shadow-lg">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(dailyPuzzle.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Previous Days Section */}
        <section className="py-16 bg-muted/30 dark:bg-white/5 border-t border-border/50 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2">Previous Challenges</h2>
                <p className="text-muted-foreground dark:text-gray-400">Missed a day? Catch up on past daily puzzles.</p>
              </div>
              <Link href="/daily/archive">
                <Button variant="outline" className="hidden sm:flex cursor-pointer dark:bg-white/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/25">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Archive
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyPuzzles.map((puzzle) => (
                <Link key={puzzle.id} href={`/play/${puzzle.id}`} className="block h-full">
                  <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card dark:bg-[#121218] dark:border dark:border-white/10 hover:-translate-y-1">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={puzzle.image_url}
                        alt={puzzle.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                        {new Date(puzzle.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-foreground dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                          {puzzle.title}
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground dark:bg-white/10 dark:text-gray-300">
                          {puzzle.piece_count} pcs
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2 mb-4">
                        {puzzle.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary">
                        Play Now <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
