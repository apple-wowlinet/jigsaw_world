'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Mountain, Waves, Building, TreePine, Palette, Camera, ArrowRight, Grid3X3 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
  darkColor: string
}

export function CategoriesSection() {
  const categories: Category[] = [
    {
      id: '1',
      name: 'Nature',
      slug: 'nature',
      description: 'Beautiful landscapes and natural scenes',
      icon: Mountain,
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      puzzle_count: 25,
      color: 'from-green-500 to-emerald-600',
      darkColor: 'from-green-400 to-emerald-500'
    },
    {
      id: '2',
      name: 'Ocean',
      slug: 'ocean',
      description: 'Stunning ocean and beach views',
      icon: Waves,
      image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
      puzzle_count: 18,
      color: 'from-blue-500 to-cyan-600',
      darkColor: 'from-blue-400 to-cyan-500'
    },
    {
      id: '3',
      name: 'City',
      slug: 'city',
      description: 'Urban landscapes and cityscapes',
      icon: Building,
      image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      puzzle_count: 32,
      color: 'from-purple-500 to-indigo-600',
      darkColor: 'from-purple-400 to-indigo-500'
    },
    {
      id: '4',
      name: 'Forest',
      slug: 'forest',
      description: 'Peaceful forest and woodland scenes',
      icon: TreePine,
      image_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
      puzzle_count: 21,
      color: 'from-emerald-500 to-teal-600',
      darkColor: 'from-emerald-400 to-teal-500'
    },
    {
      id: '5',
      name: 'Art',
      slug: 'art',
      description: 'Artistic and creative puzzles',
      icon: Palette,
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      puzzle_count: 15,
      color: 'from-pink-500 to-rose-600',
      darkColor: 'from-pink-400 to-rose-500'
    },
    {
      id: '6',
      name: 'Photography',
      slug: 'photography',
      description: 'Stunning photographic puzzles',
      icon: Camera,
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      puzzle_count: 28,
      color: 'from-amber-500 to-orange-600',
      darkColor: 'from-amber-400 to-orange-500'
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden bg-background dark:bg-[#08080c]">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-400 max-w-2xl leading-relaxed">
              Explore our curated collections featuring stunning photography and art.
            </p>
          </div>
          <Link 
            href="/categories"
            className={cn(
              "inline-flex items-center px-8 py-4 rounded-full cursor-pointer",
              "bg-secondary/80 dark:bg-white/5 backdrop-blur-sm",
              "border border-transparent dark:border-white/10",
              "text-secondary-foreground dark:text-white font-medium",
              "hover:bg-secondary dark:hover:bg-white/10 dark:hover:border-white/20",
              "transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
            )}
          >
            <Grid3X3 className="w-5 h-5 mr-3" />
            View All Categories
            <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
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
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="p-0 relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t opacity-60 transition-opacity duration-500 group-hover:opacity-75",
                      category.color,
                      "dark:opacity-70 dark:group-hover:opacity-85"
                    )} />
                    
                    {/* Glass Content Container */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="flex items-center justify-between items-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div>
                          <div className="w-14 h-14 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner mb-4 group-hover:scale-110 transition-transform duration-500">
                            <IconComponent className="h-7 w-7 text-white" />
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md tracking-tight">
                            {category.name}
                          </h3>
                          <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            {category.puzzle_count} puzzles
                          </p>
                        </div>
                        
                        {/* Hover Action Button */}
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 relative">
                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <p className="text-muted-foreground dark:text-gray-400 leading-relaxed text-base relative z-10">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
