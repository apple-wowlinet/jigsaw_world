import Link from 'next/link'
import { ArrowUpRight, Puzzle } from 'lucide-react'
import { SafeImage } from '@/components/ui/SafeImage'
import type { PublicTheme } from '@/lib/data/theme-catalogue'

export function ThemeCard({
  theme,
  priority = false,
}: {
  theme: PublicTheme
  priority?: boolean
}) {
  return (
    <Link
      href={`/theme/${theme.slug}`}
      className="group block border border-border bg-card p-2.5 shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)]"
    >
      <div className="relative aspect-[1.35/1] overflow-hidden bg-muted">
        <SafeImage
          src={theme.image_url}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-card/90 text-xl shadow-sm backdrop-blur-sm"
        >
          {theme.emoji}
        </span>
        <ArrowUpRight className="absolute right-3 top-3 h-5 w-5 text-white opacity-0 drop-shadow transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>

      <div className="px-1.5 pb-1.5 pt-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[22px] font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
            {theme.name}
          </h2>
          <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Puzzle className="h-3.5 w-3.5 text-primary" />
            {theme.puzzle_count}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {theme.description}
        </p>
      </div>
    </Link>
  )
}
