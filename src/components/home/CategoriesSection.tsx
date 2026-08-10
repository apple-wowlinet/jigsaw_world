'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mountain, Waves, Building, TreePine, Palette, Camera, ArrowRight, Grid3X3, PawPrint, Sparkles, Utensils, Map } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

export function CategoriesSection() {
  const [categories, setCategories] = useState<PublicCategory[]>([])

  useEffect(() => {
    let cancelled = false

    fetchCategories(6).then((items) => {
      if (!cancelled) setCategories(items)
    })

    return () => { cancelled = true }
  }, [])

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
                      gradient,
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
