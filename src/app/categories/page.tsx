'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mountain, Waves, Building, TreePine, Palette, Camera, ChevronLeft, ChevronRight, Coffee, Music, Car, Plane, Ghost, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  image_url: string
  puzzle_count: number
  color: string
}

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

  const categories: Category[] = [
    {
      id: '1',
      name: 'Nature',
      slug: 'nature',
      description: 'Beautiful landscapes and natural scenes',
      icon: Mountain,
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      puzzle_count: 25,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '2',
      name: 'Ocean',
      slug: 'ocean',
      description: 'Stunning ocean and beach views',
      icon: Waves,
      image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
      puzzle_count: 18,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: '3',
      name: 'City',
      slug: 'city',
      description: 'Urban landscapes and cityscapes',
      icon: Building,
      image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      puzzle_count: 32,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: '4',
      name: 'Forest',
      slug: 'forest',
      description: 'Peaceful forest and woodland scenes',
      icon: TreePine,
      image_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
      puzzle_count: 21,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: '5',
      name: 'Art',
      slug: 'art',
      description: 'Artistic and creative puzzles',
      icon: Palette,
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      puzzle_count: 15,
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: '6',
      name: 'Photography',
      slug: 'photography',
      description: 'Stunning photographic puzzles',
      icon: Camera,
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      puzzle_count: 28,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: '7',
      name: 'Food & Drink',
      slug: 'food-drink',
      description: 'Delicious culinary delights',
      icon: Coffee,
      image_url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
      puzzle_count: 12,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: '8',
      name: 'Music',
      slug: 'music',
      description: 'Instruments and musical vibes',
      icon: Music,
      image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
      puzzle_count: 10,
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: '9',
      name: 'Vehicles',
      slug: 'vehicles',
      description: 'Cars, planes, and more',
      icon: Car,
      image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
      puzzle_count: 24,
      color: 'from-slate-500 to-zinc-600'
    },
    {
      id: '10',
      name: 'Travel',
      slug: 'travel',
      description: 'Explore the world',
      icon: Plane,
      image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      puzzle_count: 35,
      color: 'from-sky-500 to-blue-600'
    },
    {
      id: '11',
      name: 'Fantasy',
      slug: 'fantasy',
      description: 'Magical and mythical worlds',
      icon: Ghost,
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
      puzzle_count: 18,
      color: 'from-fuchsia-500 to-pink-600'
    },
    {
      id: '12',
      name: 'Animals',
      slug: 'animals',
      description: 'Cute and wild creatures',
      icon: Heart,
      image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=300&fit=crop',
      puzzle_count: 42,
      color: 'from-rose-500 to-red-600'
    }
  ]

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
            const IconComponent = category.icon
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
                      category.color,
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