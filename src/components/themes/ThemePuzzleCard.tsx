import Link from 'next/link'
import { Puzzle, Star, Users } from 'lucide-react'
import { SafeImage } from '@/components/ui/SafeImage'
import type { DisplayDifficulty, PublicPuzzle } from '@/lib/data/public'
import { cn } from '@/lib/utils'

const difficultyStyles: Record<DisplayDifficulty, string> = {
  Easy: 'difficulty-easy',
  Medium: 'difficulty-medium',
  Hard: 'difficulty-hard',
}

function formatCount(count: number) {
  if (count < 1000) return count.toLocaleString()
  const value = count / 1000
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)}K`
}

export function ThemePuzzleCard({ puzzle }: { puzzle: PublicPuzzle }) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group overflow-hidden rounded-lg border border-border bg-card shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)]"
    >
      <div className="relative aspect-[1.55/1] overflow-hidden bg-muted">
        <SafeImage
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
        <span
          className={cn(
            'absolute right-2.5 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm',
            difficultyStyles[puzzle.difficulty]
          )}
        >
          {puzzle.difficulty}
        </span>
        <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5">
          <h2 className="truncate font-display text-base font-semibold leading-tight text-white [text-shadow:0_1px_8px_rgba(20,14,4,0.7)]">
            {puzzle.title}
          </h2>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-medium text-white/90">
            <span className="flex min-w-0 items-center gap-1">
              <Puzzle className="h-3.5 w-3.5 shrink-0" />
              {puzzle.piece_count} pieces
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {puzzle.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-8 items-center px-3 text-[10px] font-medium text-muted-foreground">
        <Users className="mr-1.5 h-3.5 w-3.5" />
        {formatCount(puzzle.plays_count)} plays
      </div>
    </Link>
  )
}
