import 'server-only'

import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { fetchCategories, fetchCategoryPuzzlePage, fetchDailyPuzzle, fetchPuzzles } from './public'
import { readWithRetry } from './read-with-retry'

// Public catalogue reads never inherit a visitor's cookies or auth session.
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
)
const readOptions = { client, strict: true }
const lifetime = { revalidate: 1800 }

export const getCategories = cache(unstable_cache(
  () => readWithRetry(() => fetchCategories(undefined, readOptions)), ['public-categories-v1'], lifetime,
))

export const getHomePuzzles = unstable_cache(
  () => readWithRetry(() => fetchPuzzles({ limit: 8, orderBy: 'featured' }, readOptions)),
  ['home-puzzles-v1'], lifetime,
)

// Date is an argument so yesterday's entry can never serve today's request.
export const getDailyPuzzle = unstable_cache(
  (date: string) => readWithRetry(() => fetchDailyPuzzle(date, readOptions)), ['daily-puzzle-v1'], lifetime,
)

export const getCategoryPuzzlePage = unstable_cache(
  (options: Parameters<typeof fetchCategoryPuzzlePage>[0]) => readWithRetry(() => fetchCategoryPuzzlePage(options, readOptions)),
  ['category-puzzles-v1'], lifetime,
)

export type ExploreMode = 'weekly' | 'all-time' | 'trending'
export const getExplorePuzzles = unstable_cache(
  (mode: ExploreMode) => readWithRetry(() => fetchPuzzles({
    limit: 96,
    orderBy: mode === 'weekly' ? 'weekly' : mode === 'trending' ? 'editor' : 'plays',
  }, readOptions)),
  ['explore-puzzles-v1'], lifetime,
)
