'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, Sparkles } from 'lucide-react'
import { ThemeCard } from '@/components/themes/ThemeCard'
import { fetchThemes } from '@/lib/data/public'
import {
  mergeThemeCatalogue,
  themeCatalogue,
  type PublicTheme,
} from '@/lib/data/theme-catalogue'

export function ThemesBrowser() {
  const [themes, setThemes] = useState<PublicTheme[]>(themeCatalogue)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchThemes().then((remoteThemes) => {
      if (!cancelled && remoteThemes.length) {
        setThemes(mergeThemeCatalogue(remoteThemes))
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredThemes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return themes

    return themes.filter(
      (theme) =>
        theme.name.toLocaleLowerCase().includes(normalizedQuery) ||
        theme.description.toLocaleLowerCase().includes(normalizedQuery)
    )
  }, [query, themes])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-[1380px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-foreground">Themes</span>
        </nav>

        <header className="relative mt-4 overflow-hidden rounded-lg border border-border bg-panel px-6 py-10 shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] sm:px-10 sm:py-12">
          <div
            className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-accent-subtle blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-primary-subtle blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <p className="label-caps flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              Curated Collections
            </p>
            <h1 className="mt-3 font-display text-[38px] font-semibold leading-none tracking-[-0.01em] sm:text-[48px]">
              Find a theme to <span className="italic text-accent">inspire</span> you.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore hand-picked puzzle collections for every mood, season,
              and favorite subject.
            </p>

            <label className="relative mt-6 block w-full max-w-sm">
              <span className="sr-only">Search themes</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search themes..."
                className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
          </div>
        </header>

        <section aria-labelledby="all-themes-title" className="mt-10">
          <div className="mb-6 flex items-center gap-5">
            <h2 id="all-themes-title" className="label-caps shrink-0 text-foreground">
              Browse All Themes
            </h2>
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground">
              {filteredThemes.length} {filteredThemes.length === 1 ? 'theme' : 'themes'}
            </span>
          </div>

          {filteredThemes.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredThemes.map((theme, index) => (
                <ThemeCard key={theme.slug} theme={theme} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
              <Sparkles className="mx-auto h-9 w-9 text-muted-foreground" />
              <h2 className="mt-3 font-display text-xl font-semibold">
                No themes found
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different word or clear your search.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="btn btn-outline btn-sm mt-5"
              >
                Clear search
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
