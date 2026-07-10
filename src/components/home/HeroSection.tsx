'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Sparkles, ArrowRight } from 'lucide-react'
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

export function HeroSection() {
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
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-secondary rounded-full w-32" />
              <div className="h-12 bg-secondary rounded w-3/4" />
              <div className="space-y-3">
                <div className="h-4 bg-secondary rounded w-full" />
                <div className="h-4 bg-secondary rounded w-5/6" />
              </div>
              <div className="h-12 bg-secondary rounded w-40" />
            </div>
            <div className="animate-pulse">
              <div className="bg-secondary rounded-2xl aspect-[4/3] w-full" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!dailyPuzzle) {
    return null
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Slogan */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              <span className="text-foreground dark:text-white dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Piece Together</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-sm dark:from-blue-400 dark:via-orange-400 dark:to-blue-400">
                Moments of Joy
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground dark:text-slate-300 leading-relaxed max-w-xl">
              Discover thousands of beautiful jigsaw puzzles, challenge your mind, and relax with every piece you place. Your next masterpiece awaits.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href={`/play/${dailyPuzzle.id}`} className="cursor-pointer group/btn">
                <Button size="lg" className="cursor-pointer btn-shine text-base px-8 h-12 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Play Now
                </Button>
              </Link>
              <Link href="/explore/weekly" className="cursor-pointer group/btn">
                <Button size="lg" variant="outline" className="cursor-pointer text-base px-8 h-12 group bg-card dark:bg-transparent dark:text-white dark:border-white/20 dark:hover:bg-white/10 dark:hover:border-white/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                  View What&apos;s Hot
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-60 dark:opacity-40" />
              
              <Card className="relative overflow-hidden shadow-2xl border-0 dark:hero-card">
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
                    
                    {/* Title area with localized overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)' }}>
                        {dailyPuzzle.title}
                      </h2>
                    </div>
                    
                    {/* Hover play button */}
                    <Link href={`/play/${dailyPuzzle.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 bg-black/50 backdrop-blur-sm group/start cursor-pointer">
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/95 dark:bg-white/90 shadow-2xl scale-75 group-hover/start:scale-100 transition-transform duration-300">
                        <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                        <Play className="relative w-8 h-8 text-primary fill-primary ml-1" />
                      </div>
                      <span className="absolute bottom-24 text-white font-semibold text-lg drop-shadow-lg">
                        Start Puzzle
                      </span>
                    </Link>
                    
                    {/* Daily Challenge badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/95 dark:bg-white/10 dark:backdrop-blur-md border border-white/20 text-foreground dark:text-white shadow-lg">
                        <Sparkles className="w-4 h-4 mr-2 text-accent" />
                        Daily Challenge
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
  )
}
