# JigsawWorld - AI Coding Agent Guide

## Project Overview

JigsawWorld is an online jigsaw puzzle game platform built with Next.js. Users can browse puzzle categories, play interactive jigsaw puzzles, view leaderboards, and search for specific puzzles.

**Live URL**: Not deployed yet (designed for Vercel deployment)
**Local Dev**: http://localhost:3000

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Frontend | React 19.2.3, TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Package Manager | npm |

## Project Structure

```
/mnt/host/d/code/jigsaw_world/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── category/[slug]/page.tsx   # Category page (/category/nature, /category/ocean, etc.)
│   │   ├── puzzle/[slug]/page.tsx   # Puzzle detail page
│   │   ├── play/[slug]/page.tsx # Puzzle game interface
│   │   ├── search/page.tsx     # Search results page
│   │   ├── layout.tsx          # Root layout (Header, Footer, Metadata)
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles + Tailwind
│   ├── components/
│   │   ├── home/               # Home page sections
│   │   │   ├── HeroSection.tsx       # Daily puzzle showcase
│   │   │   ├── CategoriesSection.tsx # Category grid
│   │   │   └── RecommendationsSection.tsx # Puzzle recommendations
│   │   ├── navigation/
│   │   │   └── Header.tsx      # Site header with nav, search, auth
│   │   └── ui/                 # Reusable UI components
│   │       ├── button.tsx      # Button component
│   │       ├── card.tsx        # Card component
│   │       └── input.tsx       # Input component
│   └── lib/
│       ├── supabase.ts         # Supabase client configuration
│       ├── types.ts            # TypeScript type definitions
│       └── utils.ts            # Utility functions (cn helper)
├── supabase/
│   └── migrations/             # Database migrations
│       └── add_puzzles_seo_description.sql
├── public/                     # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── .env.local                  # Environment variables (contains Supabase credentials)
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Page Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with daily puzzle, recommendations, categories |
| `/c/[slug]` | Category page (e.g., `/c/nature`, `/c/ocean`) |
| `/p/[slug]` | Puzzle detail page with stats and leaderboard |
| `/play/[slug]` | Interactive puzzle game interface |
| `/search?q=...` | Search results page |

## Key Implementation Details

### Database Schema (Supabase)

**puzzles table:**
```sql
- id: uuid (primary key)
- title: text (required)
- slug: text (unique, required)
- image_url: text (required)
- description: text (nullable)
- seo_description: text (nullable)
- piece_count: integer (default: 100)
- created_at: timestamptz
- updated_at: timestamptz
```

Row Level Security (RLS) is enabled with a policy allowing read access to everyone.

### Component Conventions

1. **Client Components**: Marked with `'use client'` directive when using:
   - React hooks (useState, useEffect, useParams, etc.)
   - Browser APIs
   - Event handlers

2. **Path Aliases**: Use `@/` prefix for imports from `src/`:
   ```typescript
   import { Button } from '@/components/ui/button'
   import { supabase } from '@/lib/supabase'
   ```

3. **UI Components**: Built with `cn()` utility for Tailwind class merging:
   ```typescript
   import { cn } from '@/lib/utils'
   ```

### Styling Guidelines

- **Tailwind CSS v4**: Uses `@import "tailwindcss"` in globals.css
- **Color scheme**: Blue (#2563eb) as primary, gray scale for neutrals
- **Layout**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for consistent container width
- **Components**: Custom UI components in `src/components/ui/`

### Data Fetching Pattern

Currently uses mock data with TODO comments indicating planned Supabase integration:

```typescript
// Current pattern (mock data)
useEffect(() => {
  // TODO: Fetch from Supabase
  const mockData = { ... }
  setTimeout(() => {
    setData(mockData)
    setLoading(false)
  }, 1000)
}, [])

// Target pattern
useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('puzzles')
      .select('*')
      .eq('slug', slug)
      .single()
    if (data) setPuzzle(data)
  }
  fetchData()
}, [slug])
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

**Note**: The current `.env.local` contains actual Supabase credentials for development.

## Development Status & TODOs

### Implemented
- ✅ Basic page structure and routing
- ✅ UI component library (Button, Card, Input)
- ✅ Responsive layout with Tailwind CSS
- ✅ Puzzle game interface with drag-and-drop
- ✅ Category browsing interface
- ✅ Search UI (mock functionality)
- ✅ Supabase client setup
- ✅ Database migration for puzzles table

### Not Yet Implemented (TODOs in code)
- 🔲 Supabase data fetching (using mock data throughout)
- 🔲 User authentication (login/register pages exist in UI only)
- 🔲 Actual search functionality
- 🔲 Leaderboard data persistence
- 🔲 Game progress saving
- 🔲 Daily puzzle rotation logic
- 🔲 Pages: `/daily`, `/explore/*`, `/categories`, `/help`, `/contact`, `/privacy`, `/terms`

## Game Mechanics

The puzzle game (`/play/[slug]`) implements:
- Drag-and-drop piece movement
- Snap-to-grid placement (30px tolerance)
- Progress tracking (percentage complete)
- Timer functionality
- Completion detection with celebration modal

Pieces are rendered as colored divs with IDs (actual image slicing not yet implemented).

## Security Considerations

1. **Supabase RLS**: Enabled on all tables with appropriate policies
2. **Environment Variables**: Public Supabase key is safe for client-side; service role key should never be exposed
3. **Image Domains**: Only `images.unsplash.com` is whitelisted in next.config.ts

## Testing Strategy

Currently no test suite is configured. Recommended additions:
- Unit tests for utility functions
- Component tests with React Testing Library
- E2E tests for puzzle game flow

## Deployment

Designed for Vercel deployment:
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Build command: `npm run build`
4. Output directory: `.next`

## External Dependencies

- **Images**: Uses Unsplash for puzzle images (configured in next.config.ts)
- **Database**: Supabase cloud instance
- **Fonts**: Inter (Google Fonts via next/font)

