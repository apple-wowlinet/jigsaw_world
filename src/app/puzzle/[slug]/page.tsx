'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
  ImageIcon,
  Play,
  Puzzle,
  Share2,
  Star,
  Tag,
  Trophy,
  Users,
} from 'lucide-react'
import {
  fetchPuzzleBySlug,
  fetchPuzzles,
  type PublicPuzzle,
} from '@/lib/data/public'
import { cn } from '@/lib/utils'

interface GameStats {
  totalPlays: number
  averageCompletionTime: number
  completionRate: number
}

const leaderboardPreview = [
  { rank: 1, name: 'Alex', time: '18:42', initials: 'AL', color: 'from-sky-400 to-blue-600' },
  { rank: 2, name: 'Mike', time: '20:13', initials: 'MI', color: 'from-orange-400 to-red-500' },
  { rank: 3, name: 'Emma', time: '21:05', initials: 'EM', color: 'from-pink-400 to-rose-600' },
  { rank: 4, name: 'John', time: '22:14', initials: 'JO', color: 'from-amber-400 to-orange-600' },
  { rank: 5, name: 'David', time: '23:01', initials: 'DA', color: 'from-indigo-400 to-violet-600' },
]

function formatApproximateTime(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60))
  return `~${minutes} min`
}

function getDifficultyClass(difficulty: PublicPuzzle['difficulty']) {
  if (difficulty === 'Easy') return 'difficulty-easy'
  if (difficulty === 'Medium') return 'difficulty-medium'
  return 'difficulty-hard'
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

  if (loading) {
    return <PuzzleDetailSkeleton />
  }

  if (!puzzle) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf7] px-4 dark:bg-[#08080c]">
        <div className="text-center">
          <Puzzle className="mx-auto mb-4 h-14 w-14 text-[#ff654f]" />
          <h1 className="mb-2 text-2xl font-bold">Puzzle not found</h1>
          <p className="mb-6 text-muted-foreground">
            The puzzle you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#ff5238] to-[#ff7488] px-6 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-transform hover:-translate-y-0.5"
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
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf7] pb-20 dark:bg-[#08080c]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_88%_7%,rgba(255,216,149,0.18),transparent_22%),radial-gradient(circle_at_2%_48%,rgba(255,120,109,0.10),transparent_22%)] dark:opacity-20"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex min-w-0 items-center gap-2.5 overflow-hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm"
        >
          <Link href="/" className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-[#ff5f50]">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <Link href="/categories" className="shrink-0 transition-colors hover:text-[#ff5f50]">
            Categories
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <Link
            href={`/category/${puzzle.category_slug}`}
            className="shrink-0 transition-colors hover:text-[#ff5f50]"
          >
            {puzzle.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <span className="truncate font-semibold text-foreground">{puzzle.title}</span>
        </nav>

        <section className="grid items-start gap-9 lg:grid-cols-[1.22fr_0.88fr] lg:gap-14 xl:gap-[68px]">
          <div className="relative">
            <div className="group relative aspect-[1.055/1] min-h-[320px] overflow-hidden rounded-[28px] bg-muted shadow-[0_24px_60px_-30px_rgba(65,33,40,0.34)] sm:min-h-[500px] lg:min-h-0 lg:rounded-[40px]">
              <Image
                src={puzzle.image_url}
                alt={puzzle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />

              <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7 sm:top-7">
                <span className="rounded-full bg-[#3c82f6] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-blue-950/20">
                  {puzzle.category}
                </span>
                <span className="rounded-full bg-[#ff653f] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-950/20">
                  {puzzle.difficulty}
                </span>
              </div>

              <div className="absolute right-5 top-5 flex gap-2.5 sm:right-7 sm:top-7">
                <button
                  type="button"
                  onClick={() => setIsLiked((liked) => !liked)}
                  aria-label={isLiked ? 'Remove from favorites' : 'Save to favorites'}
                  aria-pressed={isLiked}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full border border-white/70 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5',
                    isLiked
                      ? 'bg-[#ff6680] text-white'
                      : 'bg-white/95 text-slate-600 hover:bg-white'
                  )}
                >
                  <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share puzzle"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-slate-600 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <Link
                href={`/play/${puzzle.slug}`}
                className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-0.5 sm:bottom-7 sm:right-7"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            </div>
          </div>

          <div className="py-1 lg:py-0">
            <h1 className="max-w-[570px] text-3xl font-black leading-[1.08] tracking-[-0.03em] text-[#111936] dark:text-white sm:text-4xl lg:text-[44px] xl:text-[48px]">
              {puzzle.title}
            </h1>
            <p className="mt-4 max-w-[520px] text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base sm:leading-7">
              {puzzle.description ||
                `A beautiful ${puzzle.category.toLowerCase()} puzzle made for a relaxing challenge.`}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2 font-bold text-[#1a2442] dark:text-slate-100">
                <Star className="h-[18px] w-[18px] fill-amber-400 text-amber-400" />
                {puzzle.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400">
                <Users className="h-[18px] w-[18px]" />
                {gameStats.totalPlays.toLocaleString()} players
              </span>
            </div>

            <div className="my-7 grid grid-cols-3 gap-3.5">
              <HeroStat
                icon={<Puzzle className="h-6 w-6 fill-[#6c43e8]/15 text-[#6c43e8]" />}
                value={puzzle.piece_count.toString()}
                label="Pieces"
                iconClassName="bg-violet-50 dark:bg-violet-500/10"
              />
              <HeroStat
                icon={<BarChart3 className="h-6 w-6 text-[#ff673c]" />}
                value={puzzle.difficulty}
                label="Difficulty"
                iconClassName="bg-orange-50 dark:bg-orange-500/10"
              />
              <HeroStat
                icon={<Clock3 className="h-6 w-6 text-[#20bd67]" />}
                value={formatApproximateTime(gameStats.averageCompletionTime)}
                label="Avg. Time"
                iconClassName="bg-emerald-50 dark:bg-emerald-500/10"
              />
            </div>

            <Link
              href={`/play/${puzzle.slug}`}
              className="btn-shine inline-flex h-[58px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#ff4f35] via-[#ff5e50] to-[#ff7589] px-6 text-base font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(255,84,75,0.65)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-12px_rgba(255,84,75,0.75)]"
            >
              <Play className="h-5 w-5 fill-current" />
              Start Puzzle
            </Link>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
              <button
                type="button"
                onClick={() => setIsLiked((liked) => !liked)}
                className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5 transition-colors hover:bg-white/70 hover:text-[#ff5f55] dark:hover:bg-white/5"
              >
                <Heart className={cn('h-[18px] w-[18px]', isLiked && 'fill-[#ff6680] text-[#ff6680]')} />
                {isLiked ? 'Saved' : 'Save to Favorites'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5 transition-colors hover:bg-white/70 hover:text-[#ff5f55] dark:hover:bg-white/5"
              >
                {shareCopied ? (
                  <CheckCircle2 className="h-[18px] w-[18px] text-emerald-500" />
                ) : (
                  <Share2 className="h-[18px] w-[18px]" />
                )}
                {shareCopied ? 'Link Copied' : 'Share Puzzle'}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-3 divide-x divide-slate-200/80 overflow-hidden rounded-2xl border border-slate-200/75 bg-white/70 px-1 py-7 shadow-[0_12px_36px_-26px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.035] sm:px-8 sm:py-8">
          <OverviewStat
            icon={<Users className="h-8 w-8 text-[#286cff]" />}
            value={gameStats.totalPlays.toLocaleString()}
            label="Players"
          />
          <OverviewStat
            icon={<CheckCircle2 className="h-8 w-8 text-[#20bd67]" />}
            value={`${gameStats.completionRate}%`}
            label="Completed"
          />
          <OverviewStat
            icon={<Star className="h-8 w-8 text-amber-400" />}
            value={puzzle.rating.toFixed(1)}
            label="Rating"
          />
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-2">
          <section className="relative overflow-hidden rounded-[24px] border border-slate-200/75 bg-white/85 p-6 shadow-[0_18px_55px_-40px_rgba(34,41,76,0.45)] dark:border-white/10 dark:bg-[#13131a] sm:p-8">
            <Puzzle
              aria-hidden="true"
              className="absolute -bottom-8 right-4 h-32 w-32 rotate-12 text-slate-100/75 dark:text-white/[0.025]"
            />
            <h2 className="relative mb-4 text-xl font-extrabold text-[#17203d] dark:text-white">
              About This Puzzle
            </h2>
            <p className="relative mb-7 text-sm leading-7 text-slate-500 dark:text-slate-400">
              {puzzle.description ||
                `Immerse yourself in this ${puzzle.category.toLowerCase()} puzzle. Take your time, focus on the details, and enjoy putting every piece into place.`}
            </p>

            <dl className="relative grid gap-5 text-sm">
              <DetailRow
                icon={<Tag className="h-[18px] w-[18px]" />}
                label="Category"
                value={puzzle.category}
              />
              <DetailRow
                icon={<CalendarDays className="h-[18px] w-[18px]" />}
                label="Added"
                value={addedDate}
              />
              <DetailRow
                icon={<Puzzle className="h-[18px] w-[18px]" />}
                label="Pieces"
                value={puzzle.piece_count.toString()}
              />
              <DetailRow
                icon={<BarChart3 className="h-[18px] w-[18px]" />}
                label="Difficulty"
                value={
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold',
                      getDifficultyClass(puzzle.difficulty)
                    )}
                  >
                    {puzzle.difficulty}
                  </span>
                }
              />
            </dl>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-slate-200/75 bg-white/85 shadow-[0_18px_55px_-40px_rgba(34,41,76,0.45)] dark:border-white/10 dark:bg-[#13131a]">
            <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5 dark:border-white/10 sm:px-8">
              <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-[#17203d] dark:text-white">
                <Trophy className="h-6 w-6 fill-amber-400/15 text-amber-400" />
                Leaderboard
              </h2>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff5f55] transition-colors hover:text-[#e94138] sm:text-xs"
              >
                View Full Leaderboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="px-6 pb-6 pt-2 sm:px-8">
              <ol>
                {leaderboardPreview.map((entry) => (
                  <LeaderboardRow key={entry.rank} {...entry} />
                ))}
              </ol>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50/80 to-rose-50/60 px-4 py-3 dark:border-violet-400/10 dark:from-violet-500/10 dark:to-rose-500/10">
                <div>
                  <p className="text-xs font-extrabold text-[#222a48] dark:text-slate-100 sm:text-sm">
                    Be the first to set the best time!
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                    Finish this puzzle and claim the #1 spot.
                  </p>
                </div>
                <Crown className="h-9 w-9 rotate-[-8deg] fill-amber-300 text-amber-400" />
              </div>
            </div>
          </section>
        </div>

        {relatedPuzzles.length > 0 && (
          <section className="mt-9">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-[#17203d] dark:text-white">
                <Puzzle className="h-6 w-6 fill-[#7b52f4] text-[#7b52f4]" />
                More Like This
              </h2>
              <Link
                href={`/category/${puzzle.category_slug}`}
                className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-bold text-[#ff5f55] transition-colors hover:text-[#e94138] sm:text-sm"
              >
                View All {puzzle.category} Puzzles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

function PuzzleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#fffaf7] dark:bg-[#08080c]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-7 h-4 w-72 rounded-full skeleton" />
        <div className="grid gap-10 lg:grid-cols-[1.22fr_0.88fr] lg:gap-14">
          <div className="aspect-[1.055/1] rounded-[32px] skeleton" />
          <div className="space-y-7 py-8">
            <div className="h-14 w-4/5 rounded-xl skeleton" />
            <div className="h-20 rounded-xl skeleton" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-32 rounded-2xl skeleton" />
              ))}
            </div>
            <div className="h-14 rounded-2xl skeleton" />
          </div>
        </div>
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
    <div className="flex min-w-0 flex-col items-center rounded-2xl border border-slate-200/80 bg-white/85 px-1.5 py-4 text-center shadow-[0_10px_28px_-18px_rgba(35,43,75,0.45)] dark:border-white/10 dark:bg-white/[0.035] sm:py-5">
      <div className={cn('mb-2.5 flex h-9 w-9 items-center justify-center rounded-full', iconClassName)}>
        {icon}
      </div>
      <strong className="max-w-full truncate text-sm font-extrabold text-[#17203d] dark:text-white sm:text-base">
        {value}
      </strong>
      <span className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
        {label}
      </span>
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
        <div className="text-sm font-extrabold text-[#17203d] dark:text-white sm:text-lg">{value}</div>
        <div className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
          {label}
        </div>
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
      <dt className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        {label}
      </dt>
      <dd className="font-bold text-[#28304c] dark:text-slate-100">{value}</dd>
    </div>
  )
}

function LeaderboardRow({
  rank,
  name,
  time,
  initials,
  color,
}: {
  rank: number
  name: string
  time: string
  initials: string
  color: string
}) {
  const medalClass = {
    1: 'bg-amber-400 text-white',
    2: 'bg-slate-300 text-white',
    3: 'bg-orange-500 text-white',
  }[rank]

  return (
    <li className="flex h-[45px] items-center gap-3 text-sm">
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
          medalClass ?? 'text-slate-500 dark:text-slate-400'
        )}
      >
        {rank}
      </span>
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[8px] font-black text-white',
          color
        )}
      >
        {initials}
      </span>
      <span className="flex-1 font-bold text-[#28304c] dark:text-slate-100">{name}</span>
      <time className="font-extrabold text-[#28304c] dark:text-slate-100">{time}</time>
    </li>
  )
}

function RelatedPuzzleCard({ puzzle }: { puzzle: PublicPuzzle }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_32px_-22px_rgba(34,41,76,0.5)] transition-all hover:-translate-y-1 hover:border-[#ff766a]/40 hover:shadow-lg dark:border-white/10 dark:bg-[#13131a]"
    >
      <div className="relative aspect-[1.52/1] overflow-hidden bg-muted">
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-rose-50 to-pink-100 text-[#ff6a5c] dark:from-orange-950 dark:via-slate-900 dark:to-rose-950">
            <ImageIcon className="mb-2 h-9 w-9" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              {puzzle.category}
            </span>
          </div>
        ) : (
          <Image
            src={puzzle.image_url}
            alt={puzzle.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#6a48e9] px-2.5 py-1 text-[9px] font-extrabold uppercase text-white shadow-md">
          {puzzle.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-extrabold text-[#202943] transition-colors group-hover:text-[#ff5f55] dark:text-white">
          {puzzle.title}
        </h3>
        <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-[11px]">
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
        <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf7] dark:bg-[#08080c]">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#ff6657] border-t-transparent" />
        </div>
      }
    >
      <PuzzleDetailContent />
    </Suspense>
  )
}
