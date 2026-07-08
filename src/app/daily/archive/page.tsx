'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, ArrowRight, Puzzle, Search, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface DailyPuzzle {
  id: string
  title: string
  image_url: string
  description: string
  piece_count: number
  created_at: string
}

// 按月份分组的归档数据生成器（mock）
const makeArchive = (): DailyPuzzle[] => {
  const seeds: Array<Omit<DailyPuzzle, 'id' | 'created_at'>> = [
    {
      title: 'Ocean Sunset',
      image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
      description: 'A calming sunset over the ocean waves.',
      piece_count: 150
    },
    {
      title: 'Urban Lights',
      image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      description: 'City lights shining bright in the night.',
      piece_count: 200
    },
    {
      title: 'Forest Path',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      description: 'A mysterious path leading through the ancient forest.',
      piece_count: 120
    },
    {
      title: 'Misty Mountains',
      image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
      description: 'Mist rolling over jagged mountain peaks at dawn.',
      piece_count: 180
    },
    {
      title: 'Desert Dunes',
      image_url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&h=600&fit=crop',
      description: 'Golden sand dunes sculpted by the wind.',
      piece_count: 90
    },
    {
      title: 'Northern Lights',
      image_url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&h=600&fit=crop',
      description: 'Aurora borealis dancing over a snowy landscape.',
      piece_count: 250
    },
    {
      title: 'Cherry Blossom',
      image_url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop',
      description: 'Delicate pink cherry blossoms in full bloom.',
      piece_count: 140
    },
    {
      title: 'Lake Reflection',
      image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
      description: 'A still lake perfectly mirroring the surrounding peaks.',
      piece_count: 160
    },
    {
      title: 'Autumn Trail',
      image_url: 'https://images.unsplash.com/photo-1507783548227-544c3b8fc065?w=800&h=600&fit=crop',
      description: 'A trail blanketed in vibrant autumn leaves.',
      piece_count: 110
    },
    {
      title: 'Coastal Cliffs',
      image_url: 'https://images.unsplash.com/photo-1505857347264-847e289fc03d?w=800&h=600&fit=crop',
      description: 'Dramatic cliffs dropping into the crashing sea.',
      piece_count: 220
    },
    {
      title: 'Lavender Field',
      image_url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&h=600&fit=crop',
      description: 'Endless rows of purple lavender at sunset.',
      piece_count: 130
    },
    {
      title: 'Glacier Bay',
      image_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
      description: 'Towering ice formations in a remote glacial bay.',
      piece_count: 240
    }
  ]
  // 从今天往前推，每天一个挑战
  const day = 86400000
  return seeds.map((s, i) => ({
    ...s,
    id: String(i + 2),
    created_at: new Date(Date.now() - day * (i + 1)).toISOString()
  }))
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
}

export default function ArchivePage() {
  const [archive, setArchive] = useState<DailyPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    // mock 异步加载
    const t = setTimeout(() => {
      setArchive(makeArchive())
      setLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  // 按月份分组，月份倒序（最近在前）
  const grouped = useMemo(() => {
    const filtered = archive.filter((p) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    })
    const map = new Map<string, DailyPuzzle[]>()
    for (const p of filtered) {
      const key = formatMonth(new Date(p.created_at))
      const arr = map.get(key) || []
      arr.push(p)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [archive, query])

  return (
    <div className="min-h-screen relative overflow-hidden bg-background dark:bg-[#08080c]">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <section className="pt-16 pb-10 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/daily"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Today
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary-subtle dark:bg-primary/20 border border-primary/30 backdrop-blur-sm mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">Daily Archive</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white leading-tight">
                  Puzzle Archive
                </h1>
                <p className="text-lg text-muted-foreground dark:text-gray-400 mt-3 max-w-2xl">
                  Browse every daily challenge we&apos;ve featured. Missed a day? Catch up anytime.
                </p>
              </div>

              {/* Search */}
              <div className="w-full sm:w-72">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search archive..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-4 pr-10 bg-secondary dark:bg-[#0f172a]/80 border-transparent dark:border-white/10 text-foreground dark:text-slate-100 placeholder:text-muted-foreground dark:placeholder:text-slate-500 focus:bg-card dark:focus:bg-[#111827] dark:focus:border-primary/50 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0 dark:focus:shadow-[0_0_0_1px_rgba(96,165,250,0.35),0_0_12px_rgba(96,165,250,0.2)] shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {query ? (
                      <button
                        type="button"
                        aria-label="Clear"
                        onClick={() => setQuery('')}
                        className="pointer-events-auto cursor-pointer text-muted-foreground hover:text-foreground dark:text-slate-500 dark:hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : (
                      <Search className="h-4 w-4 text-muted-foreground dark:text-slate-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="space-y-10 animate-pulse">
                {[0, 1].map((g) => (
                  <div key={g}>
                    <div className="h-7 bg-secondary rounded w-40 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden bg-secondary/50 dark:bg-white/5">
                          <div className="aspect-video bg-secondary dark:bg-white/5" />
                          <div className="p-5 space-y-3">
                            <div className="h-5 bg-secondary rounded w-2/3" />
                            <div className="h-4 bg-secondary rounded w-full" />
                            <div className="h-4 bg-secondary rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <div className="text-center py-24 animate-fade-in">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-secondary dark:bg-white/5 flex items-center justify-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">
                    No puzzles found
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400">
                    We couldn&apos;t find any puzzles matching &quot;{query}&quot;.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {grouped.map(([month, items]) => (
                  <div key={month}>
                    {/* Month divider */}
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-xl font-bold text-foreground dark:text-white whitespace-nowrap">
                        {month}
                      </h2>
                      <div className="h-px flex-1 bg-border dark:bg-white/10" />
                      <span className="text-xs font-medium text-muted-foreground dark:text-gray-500">
                        {items.length} {items.length === 1 ? 'puzzle' : 'puzzles'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((puzzle) => (
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
                              <div className="absolute bottom-3 left-3 inline-flex items-center px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(puzzle.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-foreground dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                                  {puzzle.title}
                                </h3>
                                <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground dark:bg-white/10 dark:text-gray-300 whitespace-nowrap ml-2">
                                  <Puzzle className="w-3 h-3 mr-1" />
                                  {puzzle.piece_count}
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
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
