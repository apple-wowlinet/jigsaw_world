# Leaderboard Page Design

**Date:** 2026-07-09
**Status:** Approved (pending implementation)
**Route:** `/leaderboard`

## Goal

Add a new leaderboard page that ranks users by score (积分), with three time periods: All-time (总排行), Monthly (月排行), and Weekly (周排行).

## Scope

### In scope
- New `/leaderboard` route and page
- Data-access module with a Supabase-shaped interface, currently backed by mock data
- Shared TypeScript types for leaderboard entries
- Three-period tab switcher (segmented control)
- Medal podium for top 3 + ranked list from rank 4
- Header (desktop + mobile) and Footer navigation entries

### Out of scope (YAGNI)
- User authentication / "my rank" highlighting (project has no auth yet)
- Pagination (mock data is 10-15 rows; revisit when real data grows)
- User search/filter
- API routes (none exist in the project; stay consistent)
- Modifying the existing per-puzzle leaderboard in `puzzle/[slug]/page.tsx` (different semantics)

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Data source | Mock + Supabase-shaped accessor | Smoothest path to real data later; only one file changes on switch |
| Row density | Minimal (rank, avatar, name, score) | Keeps focus on the score ranking |
| Top-3 treatment | Medal podium + table list | Richer visual per user choice |
| Page type | Client component with `useEffect` | Matches `explore/*` and `category/[slug]` conventions (tab interactivity) |

## Architecture

### Files to create/modify

| File | Action | Purpose |
|---|---|---|
| `src/lib/types.ts` | Modify | Add `LeaderboardPeriod`, `LeaderboardEntry` |
| `src/lib/leaderboard.ts` | Create | Data-access module (mock now, Supabase later) |
| `src/app/leaderboard/page.tsx` | Create | Page: tabs, podium, ranked list |
| `src/components/navigation/Header.tsx` | Modify | Add desktop nav link + mobile menu link |
| `src/components/navigation/Footer.tsx` | Modify | Add link to `explore` footer group |

### Data model

Added to `src/lib/types.ts`:

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

Note: the existing inline `LeaderboardEntry` in `puzzle/[slug]/page.tsx` is left untouched. It carries `completion_time` and represents a single-puzzle time leaderboard — different semantics. Forcing a merge would be awkward.

### Data-access layer

`src/lib/leaderboard.ts`:

```ts
import { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types'

/**
 * Fetches leaderboard entries for a given period.
 * Currently returns mock data with an 800ms delay (matches the site-wide
 * mock-data convention). The function signature is async and shaped for
 * a future swap to a Supabase query against user_stats.total_xp — only
 * this file changes when real data is wired in.
 */
export async function fetchLeaderboard(
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]>
```

Behavior:
- Returns 10-15 mock entries per period, ranked by `score` descending.
- 800ms artificial delay, identical to every other page's mock pattern.
- Mock usernames are playful/gamified; avatars are emoji, continuing the existing style.
- Three distinct datasets (one per period) so switching tabs visibly changes content.

Future real query (NOT implemented now, documented for the swap):
```ts
// From user_stats, ranked by total_xp desc
const { data } = await supabase
  .from('user_stats')
  .select('user_id, total_xp, ...')
  .order('total_xp', { ascending: false })
  .limit(50)
```
The DB schema (`user_stats.total_xp`, `level`, and views `v_leaderboard_time` / `v_leaderboard_moves`) already exists in `supabase/migrations/002_full_schema.sql`.

## UI Design

### Page structure (`src/app/leaderboard/page.tsx`)

Client component following the `explore/*` convention:

```tsx
'use client'

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

  // ...render
}

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <LeaderboardContent />
    </Suspense>
  )
}
```

### Layout (top to bottom)

1. **Ambient background** — reuse the site-wide convention: two blurred circles (`bg-primary/5` top-left, `bg-purple-500/5` bottom-right), `pointer-events-none`, content wrapped in `relative z-10`. Page background `bg-background dark:bg-[#08080c]`.

2. **Header / title area**
   - `Trophy` icon + title "Leaderboard"
   - Subtitle: "Top players ranked by score"
   - Period description line (e.g. "All-time total score" / "This month's score" / "This week's score")

3. **Period tabs** (segmented control)
   - Three `Button`s: All / Monthly / Weekly
   - Active: `variant="default"`, inactive: `variant="ghost"` (mirrors `category/[slug]` pagination active styling at lines 390-403)
   - Labels map to `LeaderboardPeriod`: `All → 'all'`, `Monthly → 'monthly'`, `Weekly → 'weekly'`
   - Switching sets `period` → `useEffect` reloads → loading skeletons show

4. **Medal podium** (top 3)
   - 3-column grid; rank 1 centered and tallest, ranks 2 and 3 flanking and shorter (classic podium silhouette)
   - Each podium block: large avatar, username, score, rank badge
   - Colors reuse the existing `getRankStyle` palette from `puzzle/[slug]/page.tsx`:
     - Rank 1: `yellow-500` + crown 👑
     - Rank 2: `gray-400`
     - Rank 3: `orange-600`
   - When fewer than 3 entries exist, missing slots render empty (defensive, though mock always has ≥10)

5. **Ranked list** (rank 4 onward)
   - Reuses the existing `.leaderboard-item` CSS class (dark-mode styles already defined at globals.css lines 485-492)
   - Each row: `#rank` | avatar | username | score (right-aligned)
   - Plain `div` list (no Table component exists in the project; keep it lightweight)
   - Staggered entry animation via existing `.animate-fade-in` with `animationDelay` (site convention)

6. **Loading state**
   - Podium skeleton: 3 pulsing `Card` blocks (`animate-pulse`)
   - List skeleton: 8-10 pulsing rows
   - Matches the skeleton style in `category/[slug]/page.tsx`

### Responsiveness
- Desktop: podium 3 columns, list as wide single-column rows
- Mobile: podium stays 3 columns but shrinks (ranks 2/3 still readable), list unchanged
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (site standard)

## Navigation integration

### Header (`src/components/navigation/Header.tsx`)

Two edits required (the mobile menu does NOT reuse `navLinks` — it is hardcoded):

1. **Desktop** — add to `navLinks` array (after Daily, before Categories), and add `Trophy` to the `lucide-react` import:
   ```tsx
   { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
   ```

2. **Mobile menu** — add a matching `<Link href="/leaderboard">` with `Trophy` icon in the hardcoded mobile JSX block, mirroring the Create/Daily entries (around lines 164-186).

### Footer (`src/components/navigation/Footer.tsx`)

Add to the `footerLinks.explore` array:
```tsx
{ href: '/leaderboard', label: 'Leaderboard' }
```

## Testing

The project has no test suite configured. Consistent with the rest of the codebase, this feature ships without automated tests. Verification is manual:
- `/leaderboard` loads, shows All-time data by default
- Switching tabs (All → Monthly → Weekly) reloads with different data
- Podium shows top 3 with correct medal colors and crown on #1
- List shows ranks 4+, reusing `.leaderboard-item` styling
- Desktop nav and mobile menu both link to `/leaderboard`
- Footer explore group includes Leaderboard
- Loading skeletons appear during the 800ms delay
- Responsive layout holds on mobile

## Migration path to real data

When `.env.local` is configured and real data is wanted, only `src/lib/leaderboard.ts` changes — replace the mock return with the Supabase query documented above. Page, components, and types stay unchanged because `fetchLeaderboard` keeps its `async (period) => Promise<LeaderboardEntry[]>` signature.
