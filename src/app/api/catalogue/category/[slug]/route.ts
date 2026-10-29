import { getCategoryPuzzlePage } from '@/lib/data/server'
import type { DisplayDifficulty, CategoryPuzzleSort } from '@/lib/data/public'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const query = new URL(request.url).searchParams
  const difficulty = query.get('difficulty') ?? 'All'
  const pieces = query.get('pieces') ?? 'any'
  const sort = query.get('sort') ?? 'popular'
  const page = Number(query.get('page') ?? '1')
  if (!['All', 'Easy', 'Medium', 'Hard', 'Expert'].includes(difficulty)
    || !['any', 'small', 'medium', 'large'].includes(pieces)
    || !['popular', 'rating', 'newest', 'pieces'].includes(sort)
    || !Number.isSafeInteger(page) || page < 1 || page > 100000) {
    return Response.json({ error: 'Invalid category filters' }, { status: 400 })
  }
  try {
    const result = await getCategoryPuzzlePage({
      categorySlug: slug,
      difficulty: difficulty === 'All' ? undefined : difficulty as DisplayDifficulty,
      minPieces: pieces === 'medium' ? 101 : pieces === 'large' ? 201 : undefined,
      maxPieces: pieces === 'small' ? 100 : pieces === 'medium' ? 200 : undefined,
      sort: sort as CategoryPuzzleSort,
      limit: 24,
      offset: (page - 1) * 24,
    })
    // Cache successful reads in the data layer; never HTTP-cache an error.
    return Response.json(result)
  } catch (error) {
    console.error('Failed to load category catalogue:', error)
    return Response.json({ error: 'Unable to load puzzles' }, { status: 503 })
  }
}
