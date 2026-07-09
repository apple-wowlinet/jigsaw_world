# Leaderboard Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/leaderboard` page ranking users by score across three periods (all-time, monthly, weekly), with a medal podium for the top 3 and a ranked list below.

**Architecture:** A client-component page (`src/app/leaderboard/page.tsx`) consumes an async data-access module (`src/lib/leaderboard.ts`) that currently returns mock data but is shaped for a future Supabase swap. Shared types live in `src/lib/types.ts`. Header (desktop + mobile) and Footer get new nav links.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, lucide-react icons. No test suite is configured in this project — verification is via `npm run lint` and `npm run build`, plus manual browser checks.

**Spec:** `docs/superpowers/specs/2026-07-09-leaderboard-page-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/lib/types.ts` | Modify | Add `LeaderboardPeriod`, `LeaderboardEntry` shared types |
| `src/lib/leaderboard.ts` | Create | Async `fetchLeaderboard(period)` returning mock data now, Supabase-shaped for later |
| `src/app/leaderboard/page.tsx` | Create | Page: title, period tabs, medal podium (top 3), ranked list (rank 4+), loading skeletons |
| `src/components/navigation/Header.tsx` | Modify | Desktop nav link in `navLinks` + mobile menu link + `Trophy` import |
| `src/components/navigation/Footer.tsx` | Modify | Add Leaderboard link to `explore` footer group |

---

## Task 1: Add shared leaderboard types

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add the new types**

Append to the existing `src/lib/types.ts` (after the `Puzzle` interface, currently lines 1-11):

```ts
export type LeaderboardPeriod = 'all' | 'monthly' | 'weekly'

export interface LeaderboardEntry {
  rank: number       // 1-based
  userId: string
  username: string
  avatar: string     // emoji (matches existing puzzle-detail convention)
  score: number      // points / 积分
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: No errors (lint covers `.ts` files in `src/`).

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(leaderboard): add shared LeaderboardEntry types"
```

---

## Task 2: Create the data-access module

**Files:**
- Create: `src/lib/leaderboard.ts`

- [ ] **Step 1: Create the module with mock data**

Create `src/lib/leaderboard.ts` with this exact content:

```ts
import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'

/**
 * Fetches leaderboard entries for a given period.
 *
 * Currently returns mock data with an 800ms delay (matches the site-wide
 * mock-data convention). The function signature is async and shaped for a
 * future swap to a Supabase query against user_stats.total_xp — only this
 * file changes when real data is wired in.
 *
 * Future real query (NOT implemented now):
 *   const { data } = await supabase
 *     .from('user_stats')
 *     .select('user_id, total_xp, ...')
 *     .order('total_xp', { ascending: false })
 *     .limit(50)
 */
export async function fetchLeaderboard(
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  const data = mockLeaderboards[period]
  await delay(800)
  return data
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockLeaderboards: Record<LeaderboardPeriod, LeaderboardEntry[]> = {
  all: [
    { rank: 1, userId: 'u1', username: 'PuzzleMaster', avatar: '👑', score: 48200 },
    { rank: 2, userId: 'u2', username: 'SpeedSolver', avatar: '🥈', score: 41500 },
    { rank: 3, userId: 'u3', username: 'PixelNinja', avatar: '🥉', score: 38900 },
    { rank: 4, userId: 'u4', username: 'JigsawPro', avatar: '🧩', score: 34200 },
    { rank: 5, userId: 'u5', username: 'PieceHunter', avatar: '🎯', score: 31800 },
    { rank: 6, userId: 'u6', username: 'MosaicMind', avatar: '🌟', score: 29500 },
    { rank: 7, userId: 'u7', username: 'TileTamer', avatar: '🎨', score: 27100 },
    { rank: 8, userId: 'u8', username: 'SnapDragon', avatar: '⚡', score: 25400 },
    { rank: 9, userId: 'u9', username: 'QuiltQueen', avatar: '💎', score: 23800 },
    { rank: 10, userId: 'u10', username: 'FrameFinder', avatar: '🔍', score: 22100 },
    { rank: 11, userId: 'u11', username: 'EdgeWizard', avatar: '🪄', score: 20500 },
    { rank: 12, userId: 'u12', username: 'CornerKing', avatar: '🏰', score: 18900 },
  ],
  monthly: [
    { rank: 1, userId: 'u3', username: 'PixelNinja', avatar: '👑', score: 12400 },
    { rank: 2, userId: 'u7', username: 'TileTamer', avatar: '🥈', score: 10800 },
    { rank: 3, userId: 'u1', username: 'PuzzleMaster', avatar: '🥉', score: 9600 },
    { rank: 4, userId: 'u9', username: 'QuiltQueen', avatar: '💎', score: 8200 },
    { rank: 5, userId: 'u5', username: 'PieceHunter', avatar: '🎯', score: 7500 },
    { rank: 6, userId: 'u11', username: 'EdgeWizard', avatar: '🪄', score: 6900 },
    { rank: 7, userId: 'u2', username: 'SpeedSolver', avatar: '⚡', score: 6400 },
    { rank: 8, userId: 'u8', username: 'SnapDragon', avatar: '🐉', score: 5800 },
    { rank: 9, userId: 'u4', username: 'JigsawPro', avatar: '🧩', score: 5200 },
    { rank: 10, userId: 'u12', username: 'CornerKing', avatar: '🏰', score: 4700 },
    { rank: 11, userId: 'u6', username: 'MosaicMind', avatar: '🌟', score: 4300 },
    { rank: 12, userId: 'u10', username: 'FrameFinder', avatar: '🔍', score: 3900 },
  ],
  weekly: [
    { rank: 1, userId: 'u9', username: 'QuiltQueen', avatar: '👑', score: 3200 },
    { rank: 2, userId: 'u11', username: 'EdgeWizard', avatar: '🥈', score: 2900 },
    { rank: 3, userId: 'u5', username: 'PieceHunter', avatar: '🥉', score: 2600 },
    { rank: 4, userId: 'u7', username: 'TileTamer', avatar: '🎨', score: 2300 },
    { rank: 5, userId: 'u3', username: 'PixelNinja', avatar: '💎', score: 2100 },
    { rank: 6, userId: 'u8', username: 'SnapDragon', avatar: '🐉', score: 1900 },
    { rank: 7, userId: 'u12', username: 'CornerKing', avatar: '🏰', score: 1700 },
    { rank: 8, userId: 'u1', username: 'PuzzleMaster', avatar: '🧩', score: 1500 },
    { rank: 9, userId: 'u6', username: 'MosaicMind', avatar: '🌟', score: 1300 },
    { rank: 10, userId: 'u2', username: 'SpeedSolver', avatar: '⚡', score: 1100 },
    { rank: 11, userId: 'u10', username: 'FrameFinder', avatar: '🔍', score: 950 },
    { rank: 12, userId: 'u4', username: 'JigsawPro', avatar: '🪄', score: 800 },
  ],
}
```

Note: the three datasets use the same pool of usernames but in different orders, so switching tabs visibly changes the podium and rankings.

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/leaderboard.ts
git commit -m "feat(leaderboard): add data-access module with mock data"
```

---

## Task 3: Create the leaderboard page

**Files:**
- Create: `src/app/leaderboard/page.tsx`

This is the largest task. It follows the `explore/weekly/page.tsx` convention exactly: `'use client'`, inner `LeaderboardContent` function, default export wrapped in `<Suspense>`, ambient background glow, loading skeleton.

- [ ] **Step 1: Create the page file**

Create `src/app/leaderboard/page.tsx` with this content:

```tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'
import { fetchLeaderboard } from '@/lib/leaderboard'

const PERIODS: { value: LeaderboardPeriod; label: string; description: string }[] = [
  { value: 'all', label: 'All-Time', description: 'All-time total score' },
  { value: 'monthly', label: 'Monthly', description: "This month's score" },
  { value: 'weekly', label: 'Weekly', description: "This week's score" },
]

// Medal colors reused from puzzle/[slug]/page.tsx getRankStyle convention.
function getRankStyle(rank: number) {
  switch (rank) {
    case 1: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
    case 2: return 'bg-gray-400/20 text-gray-300 border-gray-400/40'
    case 3: return 'bg-orange-600/20 text-orange-400 border-orange-600/40'
    default: return 'bg-secondary text-secondary-foreground border-border'
  }
}

function LeaderboardContent() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('all')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchLeaderboard(period).then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [period])

  const periodMeta = PERIODS.find((p) => p.value === period)!

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Title skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-secondary dark:bg-secondary/40 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-secondary dark:bg-secondary/40 rounded w-80 mx-auto animate-pulse" />
          </div>
          {/* Podium skeleton */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[2, 1, 3].map((slot) => (
              <Card key={slot} className={cn('animate-pulse border-0 dark:border dark:border-white/10 dark:bg-card', slot === 1 && 'mt-0', slot !== 1 && 'mt-8')}>
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-secondary dark:bg-secondary/40 mb-3" />
                  <div className="h-4 bg-secondary dark:bg-secondary/40 rounded w-24 mb-2" />
                  <div className="h-3 bg-secondary dark:bg-secondary/40 rounded w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* List skeleton */}
          <div className="max-w-3xl mx-auto space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary dark:bg-secondary/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="min-h-screen bg-background dark:bg-[#08080c] relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <section className="pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4 border border-primary/20 animate-fade-in">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 dark:from-white dark:to-white/70 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Top Players
            </h1>
            <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '150ms' }}>
              {periodMeta.description} — ranked by score.
            </p>
          </div>
        </section>

        {/* Period Tabs */}
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-card/50 dark:bg-white/5 backdrop-blur-sm border border-border/50 dark:border-white/10 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
              {PERIODS.map((p) => (
                <Button
                  key={p.value}
                  variant={period === p.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPeriod(p.value)}
                  className={cn(
                    'min-w-[100px] transition-all',
                    period === p.value
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                      : 'hover:bg-secondary dark:hover:bg-white/10'
                  )}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Medal Podium (top 3) */}
        {top3.length > 0 && (
          <section className="pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 gap-3 md:gap-6 items-end">
                {/* Rank 2 (left) */}
                {top3[1] && <PodiumBlock entry={top3[1]} place={2} />}
                {/* Rank 1 (center, tallest) */}
                {top3[0] && <PodiumBlock entry={top3[0]} place={1} />}
                {/* Rank 3 (right) */}
                {top3[2] && <PodiumBlock entry={top3[2]} place={3} />}
              </div>
            </div>
          </section>
        )}

        {/* Ranked List (rank 4+) */}
        {rest.length > 0 && (
          <section className="pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-2">
                {rest.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className="leaderboard-item flex items-center gap-4 p-4 rounded-xl bg-card dark:bg-card border border-border/50 dark:border-white/5 transition-colors hover:bg-accent/5 animate-fade-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="w-10 text-center text-sm font-bold text-muted-foreground dark:text-gray-400 shrink-0">
                      #{entry.rank}
                    </div>
                    <div className="text-2xl shrink-0">{entry.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-foreground dark:text-white truncate block">
                        {entry.username}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-primary">
                        {entry.score.toLocaleString()}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground dark:text-gray-500">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// Single podium column. `place` is 1/2/3 for medal styling and height.
function PodiumBlock({ entry, place }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) {
  const heightClass = place === 1 ? 'md:py-10' : 'md:py-7'
  const avatarSize = place === 1 ? 'text-5xl' : 'text-4xl'
  return (
    <div className={cn('animate-fade-in', place !== 1 && 'mt-6 md:mt-10')} style={{ animationDelay: `${place * 60}ms` }}>
      <Card className={cn(
        'border text-center bg-card dark:bg-card/60 backdrop-blur-sm shadow-lg',
        getRankStyle(place).split(' ').filter(c => c.startsWith('border-')).join(' ')
      )}>
        <CardContent className={cn('p-4 md:p-6 flex flex-col items-center', heightClass)}>
          <div className={cn('mb-2', avatarSize)}>{entry.avatar}</div>
          {place === 1 && <div className="text-2xl mb-1">👑</div>}
          <div className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm font-bold mb-2',
            getRankStyle(place)
          )}>
            {place}
          </div>
          <span className="font-semibold text-foreground dark:text-white text-sm md:text-base truncate max-w-full">
            {entry.username}
          </span>
          <span className="font-bold text-primary text-sm md:text-lg mt-1">
            {entry.score.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground dark:text-gray-500">pts</span>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-[#08080c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  )
}
```

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Verify production build passes**

Run: `npm run build`
Expected: Build succeeds, `/leaderboard` route appears in the route list output.

- [ ] **Step 4: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat(leaderboard): add leaderboard page with podium and ranked list"
```

---

## Task 4: Add Header navigation (desktop + mobile)

**Files:**
- Modify: `src/components/navigation/Header.tsx`

The mobile menu is hardcoded separately from `navLinks` (the explore agent confirmed this), so both must be edited.

- [ ] **Step 1: Add `Trophy` to the lucide-react import**

In `src/components/navigation/Header.tsx`, line 5 currently is:
```tsx
import { Search, Menu, X, Puzzle, Sparkles, ImagePlus } from 'lucide-react'
```
Change it to:
```tsx
import { Search, Menu, X, Puzzle, Sparkles, ImagePlus, Trophy } from 'lucide-react'
```

- [ ] **Step 2: Add the desktop nav link**

In the `navLinks` array (currently lines 22-34), insert a Leaderboard entry after the Daily Puzzle entry (after line 24). The array should become:
```tsx
  const navLinks = [
    { href: '/create', label: 'Create', icon: ImagePlus },
    { href: '/daily', label: 'Daily Puzzle', icon: Sparkles },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/categories', label: 'Categories' },
    { 
      label: 'Explore', 
      children: [
        { href: '/explore/weekly', label: 'Most Played This Week' },
        { href: '/explore/all-time', label: 'Most Played All Time' },
        { href: '/explore/trending', label: 'Trending Searches' },
      ]
    },
  ]
```

- [ ] **Step 3: Add the mobile menu link**

In the Mobile Nav Links block (currently lines 163-186), insert a Leaderboard link after the Daily Puzzle link (after line 179) and before the Categories link. The block should become:
```tsx
              <Link
                href="/create"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ImagePlus className="w-4 h-4 mr-2 text-primary" />
                Create
              </Link>
              <Link
                href="/daily"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4 mr-2 text-accent" />
                Daily Puzzle
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                Leaderboard
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
```

- [ ] **Step 4: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: Both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/Header.tsx
git commit -m "feat(leaderboard): add nav link in header (desktop + mobile)"
```

---

## Task 5: Add Footer link

**Files:**
- Modify: `src/components/navigation/Footer.tsx`

- [ ] **Step 1: Add the link to the `explore` footer group**

In `src/components/navigation/Footer.tsx`, the `footerLinks.explore` array is currently lines 12-17:
```tsx
  explore: [
    { href: '/daily', label: 'Daily Puzzle' },
    { href: '/explore/weekly', label: 'Most Played This Week' },
    { href: '/explore/all-time', label: 'Most Played All Time' },
    { href: '/explore/trending', label: 'Trending' },
  ],
```
Change it to:
```tsx
  explore: [
    { href: '/daily', label: 'Daily Puzzle' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/explore/weekly', label: 'Most Played This Week' },
    { href: '/explore/all-time', label: 'Most Played All Time' },
    { href: '/explore/trending', label: 'Trending' },
  ],
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: Both pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/navigation/Footer.tsx
git commit -m "feat(leaderboard): add footer link"
```

---

## Task 6: Final verification

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: Build succeeds with `/leaderboard` listed in routes and no errors.

- [ ] **Step 2: Manual browser verification**

Run: `npm run dev`
Then open `http://localhost:3000/leaderboard` and verify:
- Page loads, All-Time data shows by default
- Podium displays top 3: rank 1 center+tallest with 👑, ranks 2/3 flanking with silver/bronze borders
- Ranked list shows entries from rank 4 onward with `#rank`, avatar, username, score
- Switching to Monthly then Weekly reloads and shows different rankings (different podium order)
- Loading skeletons appear during the ~800ms reload when switching tabs
- Click "Leaderboard" in the desktop header nav → lands on page
- Resize to mobile width → header hamburger menu shows Leaderboard link → works
- Scroll to footer → Explore column shows "Leaderboard" link → works

- [ ] **Step 3: Stop dev server**

Stop the running `npm run dev` process.

---

## Notes for the implementer

- **No test suite exists** in this project (no `package.json` test script, no test deps). Verification gates are `npm run lint` and `npm run build` plus the manual browser checks in Task 6. Do not add a test framework — that is out of scope.
- **The 800ms delay** in `fetchLeaderboard` is intentional and matches every other page's mock-data convention. Do not remove it.
- **`.leaderboard-item` CSS class** already exists in `globals.css` (dark-mode hover/border styles, lines ~485-492). The ranked list reuses it.
- **Medal colors** (`getRankStyle`) mirror the existing helper in `puzzle/[slug]/page.tsx` for visual consistency across the site.
- **Migration path:** when real data is wanted, only `src/lib/leaderboard.ts` changes — replace the mock return with the Supabase query in the doc comment. The `async (period) => Promise<LeaderboardEntry[]>` signature stays the same, so the page and types need no changes.
