import Link from 'next/link'
import { Star } from 'lucide-react'
import { SafeImage } from '@/components/ui/SafeImage'
import type { DisplayDifficulty, PublicPuzzle } from '@/lib/data/public'
import { cn } from '@/lib/utils'

const difficultyStyles: Record<DisplayDifficulty, string> = {
  Easy: 'difficulty-easy',
  Medium: 'difficulty-medium',
  Hard: 'difficulty-hard',
  Expert: 'difficulty-expert',
}

export function PuzzleCard({
  puzzle,
  priority = false,
}: {
  puzzle: PublicPuzzle
  priority?: boolean
}) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group block border border-[#e7decb] bg-card p-2.5 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
    >
      <div className="relative aspect-[1.55/1] overflow-hidden bg-muted">
        <SafeImage
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 25vw, 320px"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span
          className={cn(
            'absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm',
            difficultyStyles[puzzle.difficulty]
          )}
        >
          {puzzle.difficulty}
        </span>
      </div>
      <div className="px-1.5 pb-1.5 pt-3">
        <h3 className="font-display text-[19px] font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
          {puzzle.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-[#dca93f] text-[#dca93f]" />
          {puzzle.rating.toFixed(1)}
          <span className="text-[#c9bfa8] dark:text-[#4a4234]">•</span>
          {puzzle.piece_count} pcs
        </p>
      </div>
    </Link>
  )
}

