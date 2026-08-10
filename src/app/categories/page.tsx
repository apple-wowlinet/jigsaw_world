'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mountain, Waves, Building, TreePine, Palette, Camera, ChevronLeft, ChevronRight, PawPrint, Sparkles, Utensils, Map } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchCategories, type PublicCategory } from '@/lib/data/public'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trees: TreePine,
  waves: Waves,
  'paw-print': PawPrint,
  'building-2': Building,
  sparkles: Sparkles,
  utensils: Utensils,
  map: Map,
  palette: Palette,
  camera: Camera,
}

const gradientMap: Record<string, string> = {
  nature: 'from-green-500 to-emerald-600',
  ocean: 'from-blue-500 to-cyan-600',
  animals: 'from-orange-500 to-red-600',
  cities: 'from-purple-500 to-indigo-600',
  fantasy: 'from-fuchsia-500 to-pink-600',
  food: 'from-amber-500 to-orange-600',
  travel: 'from-sky-500 to-blue-600',
  art: 'from-pink-500 to-rose-600',
}

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<PublicCategory[]>([])
  const itemsPerPage = 24

  useEffect(() => {
    let cancelled = false

    fetchCategories().then((items) => {
      if (!cancelled) setCategories(items)
    })

    return () => { cancelled = true }
  }, [])

  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedCategories = categories.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-background dark:bg-[#08080c]">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <section className="relative pt-5 pb-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8 animate-fade-in">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-foreground font-medium">Categories</span>
            </nav>

            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 dark:from-white dark:to-white/70">
                Explore All Categories
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-400 max-w-2xl leading-relaxed">
                Discover thousands of beautiful puzzles across our curated collections.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <p className="text-muted-foreground text-sm">
                Showing <span className="font-semibold text-foreground dark:text-white">{paginatedCategories.length}</span> of{' '}
                <span className="font-semibold text-foreground dark:text-white">{categories.length}</span> categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCategories.map((category, index) => {
            const IconComponent = iconMap[category.icon] ?? Mountain
            const gradient = gradientMap[category.slug] ?? 'from-primary to-accent'
            return (
              <Link key={category.id} href={`/category/${category.slug}`} className="block h-full">
                <Card 
                  className={cn(
                    "group h-full overflow-hidden border-0 shadow-lg cursor-pointer relative",
                    "bg-white dark:bg-white/5",
                    "backdrop-blur-md",
                    "border border-border/50 dark:border-white/10",
                    "transition-all duration-500 ease-out",
                    "hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50",
                    "hover:-translate-y-2 hover:border-primary/20 dark:hover:border-white/20",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="p-0 relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t opacity-60 transition-opacity duration-500 group-hover:opacity-75",
                      gradient,
                      "dark:opacity-70 dark:group-hover:opacity-85"
                    )} />
                    
                    {/* Glass Content Container */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="flex items-center justify-between items-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner mb-3 group-hover:scale-110 transition-transform duration-500">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md tracking-tight">
                            {category.name}
                          </h3>
                          <p className="text-white/90 text-xs font-medium flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            {category.puzzle_count} puzzles
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 relative">
                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <p className="text-muted-foreground dark:text-gray-400 leading-relaxed text-sm relative z-10">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
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
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
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
