'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Eye,
  Heart,
  Home,
  Play,
  Puzzle,
  Share2,
  Star,
  Tag,
  Trophy,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  fetchPuzzleBySlug,
  fetchPuzzles,
  type PublicPuzzle,
} from '@/lib/data/public'

interface GameStats {
  totalPlays: number
  averageCompletionTime: number
  completionRate: number
}

function formatApproximateTime(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60))
  return `~${minutes} min`
}

function PuzzleDetailContent() {
  const params = useParams()
  const slug = params?.slug as string
  const [puzzle, setPuzzle] = useState<PublicPuzzle | null>(null)
  const [relatedPuzzles, setRelatedPuzzles] = useState<PublicPuzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadPuzzle() {
      setLoading(true)
      const item = await fetchPuzzleBySlug(slug)

      if (cancelled) return
      setPuzzle(item)

      if (item) {
        const related = await fetchPuzzles({
          categorySlug: item.category_slug,
          limit: 5,
          orderBy: 'rating',
        })

        if (cancelled) return
        setRelatedPuzzles(
          related.filter((candidate) => candidate.slug !== item.slug).slice(0, 4)
        )
      }

      setLoading(false)
    }

    loadPuzzle()
    return () => {
      cancelled = true
    }
  }, [slug])

  const handleShare = async () => {
    const shareData = {
      title: puzzle?.title ?? 'JigsawWorld puzzle',
      text: puzzle?.description ?? 'Play this puzzle on JigsawWorld',
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      window.setTimeout(() => setShareCopied(false), 2000)
    } catch {
      // The native share sheet can be dismissed by the user.
    }
  }

  const difficultyClass = (difficulty: PublicPuzzle['difficulty']) => {
    if (difficulty === 'Easy') return 'difficulty-easy'
    if (difficulty === 'Medium') return 'difficulty-medium'
    return 'difficulty-hard'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#08080c]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-6 h-4 w-72 rounded-full skeleton" />
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="grid lg:grid-cols-[3fr_2fr]">
              <div className="aspect-[4/3] skeleton lg:min-h-[500px]" />
              <div className="space-y-7 p-7 lg:p-9">
                <div className="h-10 w-4/5 rounded-lg skeleton" />
                <div className="h-20 rounded-lg skeleton" />
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-28 rounded-xl skeleton" />
                  ))}
                </div>
                <div className="h-12 rounded-lg skeleton" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <Puzzle className="mx-auto mb-4 h-14 w-14 text-primary" />
          <h1 className="mb-2 text-2xl font-bold">Puzzle not found</h1>
          <p className="mb-6 text-muted-foreground">
            The puzzle you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const gameStats: GameStats = {
    totalPlays: puzzle.plays_count,
    averageCompletionTime: Math.max(300, puzzle.piece_count * 18),
    completionRate:
      puzzle.plays_count > 0
        ? Math.round((puzzle.completions_count / puzzle.plays_count) * 100)
        : 0,
  }

  const addedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(puzzle.created_at))

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16 dark:bg-[#08080c]">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex min-w-0 items-center gap-2 overflow-hidden text-xs font-medium text-muted-foreground sm:text-sm"
        >
          <Link href="/" className="flex shrink-0 items-center gap-1 transition-colors hover:text-primary">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link href="/categories" className="shrink-0 transition-colors hover:text-primary">
            Categories
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            href={`/category/${puzzle.category_slug}`}
            className="shrink-0 transition-colors hover:text-primary"
          >
            {puzzle.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-foreground">{puzzle.title}</span>
        </nav>

        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_12px_45px_-25px_rgba(15,23,42,0.28)] dark:border-white/10 dark:shadow-black/30">
          <div className="grid lg:grid-cols-[3fr_2fr]">
            <div className="group relative aspect-[4/3] min-h-[310px] overflow-hidden sm:min-h-[420px] lg:aspect-auto lg:min-h-[520px]">
              <Image
                src={puzzle.image_url}
                alt={puzzle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                <span className="rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-indigo-950/20">
                  {puzzle.category}
                </span>
                <span
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-md',
                    difficultyClass(puzzle.difficulty)
                  )}
                >
                  {puzzle.difficulty}
                </span>
              </div>

              <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
                <button
                  type="button"
                  onClick={() => setIsLiked((liked) => !liked)}
                  aria-label={isLiked ? 'Remove from favorites' : 'Save to favorites'}
                  aria-pressed={isLiked}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border border-white/60 shadow-lg backdrop-blur-md transition-all hover:scale-105',
                    isLiked
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/90 text-slate-600 hover:bg-white'
                  )}
                >
                  <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share puzzle"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-600 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <Link
                href={`/play/${puzzle.slug}`}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-colors hover:bg-slate-950/85 sm:bottom-6 sm:right-6"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-9 xl:p-10">
              <div className="mb-6">
                <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.55rem] lg:leading-[1.08]">
                  {puzzle.title}
                </h1>
                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                  {puzzle.description ||
                    `A beautiful ${puzzle.category.toLowerCase()} puzzle made for a relaxing challenge.`}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {puzzle.rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {gameStats.totalPlays.toLocaleString()} players
                  </span>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-3">
                <HeroStat
                  icon={<Puzzle className="h-5 w-5 text-blue-500" />}
                  value={puzzle.piece_count.toString()}
                  label="Pieces"
                  iconClassName="bg-blue-50 dark:bg-blue-500/10"
                />
                <HeroStat
                  icon={<BarChart3 className="h-5 w-5 text-orange-500" />}
                  value={puzzle.difficulty}
                  label="Difficulty"
                  iconClassName="bg-orange-50 dark:bg-orange-500/10"
                />
                <HeroStat
                  icon={<Clock3 className="h-5 w-5 text-indigo-500" />}
                  value={formatApproximateTime(gameStats.averageCompletionTime)}
                  label="Avg. Time"
                  iconClassName="bg-indigo-50 dark:bg-indigo-500/10"
                />
              </div>

              <Link
                href={`/play/${puzzle.slug}`}
                className="btn-shine inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25"
              >
                <Play className="h-5 w-5 fill-current" />
                Start Puzzle
              </Link>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <button
                  type="button"
                  onClick={() => setIsLiked((liked) => !liked)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg py-2 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Heart className={cn('h-4 w-4', isLiked && 'fill-rose-500 text-rose-500')} />
                  {isLiked ? 'Saved' : 'Save to Favorites'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 rounded-lg py-2 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {shareCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                  {shareCopied ? 'Link Copied' : 'Share Puzzle'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-3 divide-x divide-border/80 rounded-2xl border border-border/80 bg-card px-2 py-5 shadow-sm dark:border-white/10 sm:px-6 sm:py-6">
          <OverviewStat
            icon={<Users className="h-6 w-6 text-blue-500" />}
            value={gameStats.totalPlays.toLocaleString()}
            label="Players"
          />
          <OverviewStat
            icon={<CheckCircle2 className="h-6 w-6 text-emerald-500" />}
            value={`${gameStats.completionRate}%`}
            label="Completed"
          />
          <OverviewStat
            icon={<Star className="h-6 w-6 text-amber-400" />}
            value={puzzle.rating.toFixed(1)}
            label="Rating"
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm dark:border-white/10 sm:p-7">
            <h2 className="mb-4 text-lg font-bold">About This Puzzle</h2>
            <p className="mb-6 text-sm leading-6 text-muted-foreground">
              {puzzle.description ||
                `Immerse yourself in this ${puzzle.category.toLowerCase()} puzzle. Take your time, focus on the details, and enjoy putting every piece into place.`}
            </p>

            <dl className="grid gap-4 text-sm">
              <DetailRow
                icon={<Tag className="h-4 w-4" />}
                label="Category"
                value={puzzle.category}
              />
              <DetailRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Added"
                value={addedDate}
              />
              <DetailRow
                icon={<Puzzle className="h-4 w-4" />}
                label="Pieces"
                value={puzzle.piece_count.toString()}
              />
              <DetailRow
                icon={<BarChart3 className="h-4 w-4" />}
                label="Difficulty"
                value={
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-semibold',
                      difficultyClass(puzzle.difficulty)
                    )}
                  >
                    {puzzle.difficulty}
                  </span>
                }
              />
            </dl>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm dark:border-white/10">
            <div className="flex items-center justify-between border-b border-border/70 px-6 py-5 sm:px-7">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Trophy className="h-5 w-5 text-amber-400" />
                Leaderboard
              </h2>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
              >
                View Full Leaderboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex min-h-[235px] flex-col items-center justify-center px-6 py-8 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
                <Crown className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-semibold">Be the first to set the best time!</h3>
              <p className="max-w-xs text-sm leading-5 text-muted-foreground">
                Finish this puzzle and claim the number one spot on the leaderboard.
              </p>
              <Link
                href={`/play/${puzzle.slug}`}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-subtle px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <Play className="h-4 w-4 fill-current" />
                Play now
              </Link>
            </div>
          </section>
        </div>

        {relatedPuzzles.length > 0 && (
          <section className="mt-6 rounded-2xl border border-border/80 bg-card p-5 shadow-sm dark:border-white/10 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold">More Like This</h2>
              <Link
                href={`/category/${puzzle.category_slug}`}
                className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-primary transition-colors hover:text-primary/80 sm:text-sm"
              >
                View All {puzzle.category} Puzzles
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPuzzles.map((item) => (
                <RelatedPuzzleCard key={item.id} puzzle={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function HeroStat({
  icon,
  value,
  label,
  iconClassName,
}: {
  icon: React.ReactNode
  value: string
  label: string
  iconClassName: string
}) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-xl border border-border/80 px-1.5 py-4 text-center dark:border-white/10 sm:px-2">
      <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-full', iconClassName)}>
        {icon}
      </div>
      <strong className="max-w-full truncate text-sm font-bold text-foreground sm:text-base">
        {value}
      </strong>
      <span className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{label}</span>
    </div>
  )
}

function OverviewStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex items-center justify-center gap-2 px-2 sm:gap-4 sm:px-6">
      <div className="hidden sm:block">{icon}</div>
      <div>
        <div className="text-sm font-bold text-foreground sm:text-base">{value}</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{label}</div>
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      <dt className="flex items-center gap-3 text-muted-foreground">
        <span className="text-slate-400">{icon}</span>
        {label}
      </dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}

function RelatedPuzzleCard({ puzzle }: { puzzle: PublicPuzzle }) {
  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group overflow-hidden rounded-xl border border-border/80 bg-background transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-white/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={puzzle.image_url}
          alt={puzzle.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-indigo-500 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-md">
          {puzzle.category}
        </span>
      </div>
      <div className="p-3.5">
        <h3 className="truncate text-sm font-bold transition-colors group-hover:text-primary">
          {puzzle.title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>{puzzle.piece_count} Pieces</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {puzzle.rating.toFixed(1)}
          </span>
          <span>{formatApproximateTime(Math.max(300, puzzle.piece_count * 18))}</span>
        </div>
      </div>
    </Link>
  )
}

export default function PuzzleDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-background">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <PuzzleDetailContent />
    </Suspense>
  )
}
