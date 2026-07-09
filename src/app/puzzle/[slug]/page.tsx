'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Clock, Users, Star, Trophy, Calendar, Puzzle, TrendingUp, ArrowLeft, Share2, Heart, ChevronRight, Home } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Puzzle {
  id: string
  title: string
  image_url: string
  description: string
  piece_count: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  plays_count: number
  rating: number
  created_at: string
  category: string
}

interface LeaderboardEntry {
  id: string
  username: string
  completion_time: number
  completed_at: string
  rank: number
  avatar: string
}

interface GameStats {
  total_plays: number
  average_completion_time: number
  completion_rate: number
  best_time: number
  total_completions: number
}

function PuzzleDetailContent() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [gameStats, setGameStats] = useState<GameStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const mockPuzzle: Puzzle = {
      id: slug || '1',
      title: 'Mountain Landscape',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      description: 'A stunning mountain landscape puzzle that will challenge your mind and provide hours of entertainment. This beautiful scene features majestic peaks, rolling hills, and a serene atmosphere perfect for puzzle enthusiasts of all skill levels.',
      piece_count: 150,
      difficulty: 'Medium',
      plays_count: 1247,
      rating: 4.7,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Nature'
    }

    const mockLeaderboard: LeaderboardEntry[] = [
      { id: '1', username: 'PuzzleMaster', completion_time: 1800, completed_at: new Date().toISOString(), rank: 1, avatar: '👑' },
      { id: '2', username: 'SpeedSolver', completion_time: 2100, completed_at: new Date().toISOString(), rank: 2, avatar: '🥈' },
      { id: '3', username: 'QuickFingers', completion_time: 2400, completed_at: new Date().toISOString(), rank: 3, avatar: '🥉' },
      { id: '4', username: 'PuzzlePro', completion_time: 2700, completed_at: new Date().toISOString(), rank: 4, avatar: '🎯' },
      { id: '5', username: 'BrainTeaser', completion_time: 3000, completed_at: new Date().toISOString(), rank: 5, avatar: '🧩' },
    ]

    const mockGameStats: GameStats = {
      total_plays: 1247,
      average_completion_time: 3200,
      completion_rate: 68,
      best_time: 1800,
      total_completions: 848
    }

    setTimeout(() => {
      setPuzzle(mockPuzzle)
      setLeaderboard(mockLeaderboard)
      setGameStats(mockGameStats)
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-5 w-5",
          i < Math.floor(rating) ? 'star-filled' : 'star-empty'
        )}
      />
    ))
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
      case 2: return 'bg-gray-400/20 text-gray-300 border-gray-400/40'
      case 3: return 'bg-orange-600/20 text-orange-400 border-orange-600/40'
      default: return 'bg-secondary text-secondary-foreground border-border dark:bg-secondary/50 dark:border-white/10'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-secondary dark:bg-secondary/30 aspect-[4/3] rounded-2xl" />
                <div className="h-8 bg-secondary dark:bg-secondary/30 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-secondary dark:bg-secondary/30 rounded w-full" />
                  <div className="h-4 bg-secondary dark:bg-secondary/30 rounded w-5/6" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-40 bg-secondary dark:bg-secondary/30 rounded-2xl" />
                <div className="h-64 bg-secondary dark:bg-secondary/30 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!puzzle || !gameStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧩</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Puzzle not found</h1>
          <p className="text-muted-foreground mb-6">The puzzle you&apos;re looking for doesn&apos;t exist.</p>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8 animate-fade-in">
          <Link href="/" className="hover:text-primary transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/category/${puzzle.category.toLowerCase()}`} className="hover:text-primary transition-colors">
            {puzzle.category}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{puzzle.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* Puzzle Preview */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-card dark:bg-[#121218] dark:border dark:border-white/10">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={puzzle.image_url}
                      alt={puzzle.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md shadow-lg border border-white/10",
                        getDifficultyStyle(puzzle.difficulty)
                      )}>
                        {puzzle.difficulty}
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/95 dark:bg-white/90 text-black backdrop-blur-md shadow-lg">
                        {puzzle.category}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => setIsLiked(!isLiked)}
                        className={cn(
                          "p-2.5 rounded-full backdrop-blur-md shadow-lg border border-white/10 transition-all duration-200 hover:scale-110",
                          isLiked ? "bg-red-500 text-white border-red-500" : "bg-black/30 text-white hover:bg-black/50"
                        )}
                      >
                        <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                      </button>
                      <button className="p-2.5 rounded-full bg-black/30 text-white backdrop-blur-md shadow-lg border border-white/10 hover:bg-black/50 hover:scale-110 transition-all">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Hover play overlay */}
                    <Link href={`/play/${puzzle.id}`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                        <Button size="lg" className="rounded-full h-16 w-16 p-0 bg-white text-black hover:bg-white/90 hover:scale-110 transition-all shadow-2xl">
                          <Play className="w-6 h-6 ml-1 fill-current" />
                        </Button>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Puzzle Info */}
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-[#121218]/50 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/70">
                      {puzzle.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {puzzle.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-border/50 dark:border-white/5 backdrop-blur-sm">
                    <div className="flex gap-0.5">
                      {renderStars(puzzle.rating)}
                    </div>
                    <span className="font-bold text-foreground dark:text-white ml-2 text-lg">{puzzle.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5 text-center group hover:bg-secondary/50 dark:hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Puzzle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground dark:text-white mb-1">{puzzle.piece_count}</div>
                    <div className="text-xs font-medium text-muted-foreground">Pieces</div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5 text-center group hover:bg-secondary/50 dark:hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-foreground dark:text-white mb-1">{gameStats.total_plays.toLocaleString()}</div>
                    <div className="text-xs font-medium text-muted-foreground">Total Plays</div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5 text-center group hover:bg-secondary/50 dark:hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold text-foreground dark:text-white mb-1">{gameStats.completion_rate}%</div>
                    <div className="text-xs font-medium text-muted-foreground">Completion Rate</div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-secondary/30 dark:bg-white/5 border border-border/50 dark:border-white/5 text-center group hover:bg-secondary/50 dark:hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-foreground dark:text-white mb-1">{formatTime(gameStats.average_completion_time)}</div>
                    <div className="text-xs font-medium text-muted-foreground">Avg. Time</div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border/50 dark:border-white/10">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 dark:bg-white/5 border border-border/50 dark:border-white/5">
                    <span className="text-muted-foreground flex items-center font-medium">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      Best Time
                    </span>
                    <span className="font-bold text-foreground dark:text-white font-mono">{formatTime(gameStats.best_time)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 dark:bg-white/5 border border-border/50 dark:border-white/5">
                    <span className="text-muted-foreground flex items-center font-medium">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      Added
                    </span>
                    <span className="font-bold text-foreground dark:text-white">{new Date(puzzle.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {/* Play Card */}
            <Card className="border-0 shadow-lg overflow-hidden dark:bg-[#121218] dark:border dark:border-white/10 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">Ready to play?</h3>
                <p className="text-primary-foreground/90 text-sm mb-8 relative z-10 font-medium">
                  Challenge yourself with this {puzzle.piece_count}-piece puzzle
                </p>
                <Link href={`/play/${puzzle.id}`}>
                  <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold h-12">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Start Puzzle
                  </Button>
                </Link>
              </div>
              <CardContent className="p-6 bg-card dark:bg-[#121218] relative z-10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Difficulty Level</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border",
                    getDifficultyStyle(puzzle.difficulty)
                  )}>
                    {puzzle.difficulty}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="border-0 shadow-lg dark:bg-[#121218]/80 dark:border dark:border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50 dark:divide-white/5">
                  {leaderboard.map((entry) => (
                    <div key={entry.id} className="px-6 py-4 hover:bg-secondary/30 dark:hover:bg-white/5 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border shadow-sm transition-transform group-hover:scale-110",
                            getRankStyle(entry.rank)
                          )}>
                            {entry.rank <= 3 ? entry.avatar : entry.rank}
                          </div>
                          <div>
                            <div className="font-bold text-foreground dark:text-white text-sm">{entry.username}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.completed_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground dark:text-white text-sm font-mono">{formatTime(entry.completion_time)}</div>
                          <div className="text-xs text-muted-foreground">completed</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border/50 dark:border-white/5">
                  <Button variant="ghost" className="w-full text-sm font-medium hover:bg-secondary dark:hover:bg-white/5">
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PuzzleDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <PuzzleDetailContent />
    </Suspense>
  )
}
