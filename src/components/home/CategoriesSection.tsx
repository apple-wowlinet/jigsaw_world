'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Flame } from 'lucide-react'
import { fetchCategories, type PublicCategory } from '@/lib/data/public'

const category = (
  slug: string,
  name: string,
  image_url: string,
  icon: string,
  puzzle_count: number
): PublicCategory => ({
  id: slug,
  slug,
  name,
  image_url,
  icon,
  puzzle_count,
  description: '',
  color: '#4f46e5',
  dark_color: '#818cf8',
})

const FALLBACK_CATEGORIES: PublicCategory[] = [
  category('nature', 'Nature', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&h=500&fit=crop', 'trees', 328),
  category('animals', 'Animals', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=700&h=500&fit=crop', 'paw-print', 276),
  category('cities', 'Cities', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=700&h=500&fit=crop', 'building-2', 198),
  category('food', 'Food', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&h=500&fit=crop', 'utensils', 142),
  category('fantasy', 'Fantasy', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=700&h=500&fit=crop', 'sparkles', 116),
  category('art', 'Art & Culture', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=700&h=500&fit=crop', 'palette', 98),
]

const themes = [
  ['🌸', 'Flowers', 'flowers'],
  ['🐱', 'Cats', 'cats'],
  ['🏰', 'Castles', 'fantasy'],
  ['🌅', 'Sunset', 'ocean'],
  ['🎄', 'Christmas', 'christmas'],
  ['🍂', 'Autumn', 'nature'],
  ['🚂', 'Trains', 'trains'],
  ['🏖️', 'Beaches', 'beaches'],
]

export function CategoriesSection() {
  const [categories, setCategories] = useState<PublicCategory[]>(FALLBACK_CATEGORIES)

  useEffect(() => {
    let cancelled = false

    fetchCategories(6).then((items) => {
      if (!cancelled && items.length) setCategories(items)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Browse by Category</h2>
          <Link href="/categories" className="group flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300">
            View all categories <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((item) => (
            <Link key={item.id} href={`/category/${item.slug}`} className="group relative aspect-[1.45] overflow-hidden rounded-xl shadow-md">
              <Image src={item.image_url} alt={item.name} fill sizes="(max-width: 640px) 50vw, 17vw" className="object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <h3 className="truncate text-sm font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">{item.name}</h3>
                <p className="mt-0.5 text-[11px] font-medium text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">{item.puzzle_count} puzzles</p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-lg font-black tracking-tight text-slate-900 dark:text-white">Popular Themes</h2>
        <div className="flex flex-wrap gap-2.5">
          {themes.map(([emoji, label, slug]) => (
            <Link key={label} href={`/category/${slug}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <span aria-hidden="true">{emoji}</span>{label}
            </Link>
          ))}
          <Link href="/categories" aria-label="View all themes" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm hover:border-indigo-200 dark:border-white/10 dark:bg-white/5 dark:text-indigo-300">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid items-center gap-5 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(30,41,59,.06)] md:grid-cols-[240px_1fr_auto] md:px-7 dark:border-white/10 dark:bg-slate-900">
          <div>
            <strong className="block text-sm font-black text-slate-900 dark:text-white">Keep the Streak!</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400">Puzzle every day to build your streak and earn rewards.</span>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-center">
            <strong className="flex items-center gap-2 whitespace-nowrap text-base font-black text-rose-500">
              <Flame className="h-7 w-7 fill-orange-500 text-orange-500" />4 Day Streak
            </strong>
            <div className="flex items-end gap-3 sm:ml-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <span className="mb-1 block text-[9px] font-semibold text-slate-400">{day}</span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border text-white ${index < 4 ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800'}`}>
                    {index < 4 && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/daily" className="btn btn-primary btn-md">
            Play Today&apos;s Puzzle
          </Link>
        </div>
      </div>
    </section>
  )
}
