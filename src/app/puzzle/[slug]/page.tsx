'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  ImageIcon,
  Play,
  Puzzle,
  Share2,
  Trophy,
} from 'lucide-react'
import {
  fetchPuzzleBySlug,
  fetchPuzzleLeaderboard,
  fetchPuzzles,
  type PublicPuzzle,
  type PublicPuzzleLeaderboardEntry,
} from '@/lib/data/public'
import { cn } from '@/lib/utils'

function formatLeaderboardTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function PuzzleDetailContent() {
  const params = useParams()
  const slug = params?.slug as string
  const [puzzle, setPuzzle] = useState<PublicPuzzle | null>(null)
  const [relatedPuzzles, setRelatedPuzzles] = useState<PublicPuzzle[]>([])
  const [leaderboard, setLeaderboard] = useState<PublicPuzzleLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadPuzzle() {
      setLoading(true)
      setRelatedPuzzles([])
      setLeaderboard([])
      const item = await fetchPuzzleBySlug(slug)

      if (cancelled) return
      setPuzzle(item)

      if (item) {
        const [related, leaderboardEntries] = await Promise.all([
          fetchPuzzles({
            categorySlug: item.category_slug,
            limit: 5,
            orderBy: 'rating',
          }),
          fetchPuzzleLeaderboard(item.uuid, item.piece_count),
        ])

        if (cancelled) return
        setRelatedPuzzles(
          related.filter((candidate) => candidate.slug !== item.slug).slice(0, 4)
        )
        setLeaderboard(leaderboardEntries)
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
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fbfcff] px-4 dark:bg-[#080b14]">
        <div className="text-center">
          <Puzzle className="mx-auto mb-4 h-14 w-14 text-blue-600" />
          <h1 className="mb-2 text-2xl font-bold">Puzzle not found</h1>
          <p className="mb-6 text-muted-foreground">
            The puzzle you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="btn btn-primary btn-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const canonicalSize = puzzle.piece_count
  const activeSize = selectedSize ?? canonicalSize
  const sizeOptions = Array.from(
    new Set([
      Math.max(12, Math.round((canonicalSize * 0.3) / 6) * 6),
      Math.max(24, Math.round((canonicalSize * 0.6) / 6) * 6),
      canonicalSize,
      Math.min(500, Math.round((canonicalSize * 2) / 6) * 6),
    ])
  ).sort((a, b) => a - b)
  const baseMinutes = (activeSize * 18) / 60
  const timeLow = Math.max(5, Math.round((baseMinutes * 0.75) / 5) * 5)
  const timeHigh = Math.max(timeLow + 10, Math.round((baseMinutes * 1.25) / 5) * 5)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfcff] pb-20 dark:bg-[#080b14]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_88%_7%,rgba(186,230,253,0.45),transparent_22%),radial-gradient(circle_at_50%_0%,rgba(254,243,199,0.4),transparent_26%),radial-gradient(circle_at_2%_48%,rgba(204,251,241,0.4),transparent_22%)] dark:opacity-20"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex min-w-0 items-center gap-2.5 overflow-hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm"
        >
          <Link href="/" className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-blue-600">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <Link
            href={`/category/${puzzle.category_slug}`}
            className="shrink-0 transition-colors hover:text-blue-600"
          >
            {puzzle.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <span className="truncate font-semibold text-foreground">{puzzle.title}</span>
        </nav>

        <section className="grid items-start gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 xl:gap-[68px]">
          <div className="relative">
            <div className="group relative aspect-[1.055/1] min-h-[320px] overflow-hidden rounded-[28px] bg-muted shadow-[0_24px_60px_-30px_rgba(30,41,59,0.34)] sm:min-h-[500px] lg:min-h-0 lg:rounded-[40px]">
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
                <span className="rounded-full bg-blue-600 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-blue-950/20">
                  {puzzle.category}
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
                      ? 'bg-rose-500 text-white'
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
            </div>
          </div>

          <div className="py-1 lg:py-0">
            <h1 className="max-w-[570px] text-3xl font-black leading-[1.08] tracking-[-0.03em] text-[#111936] dark:text-white sm:text-4xl lg:text-[44px] xl:text-[48px]">
              {puzzle.title}
            </h1>
            <p className="mt-4 max-w-[520px] text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base sm:leading-7">
              {puzzle.description ||
                `A beautiful ${puzzle.category.toLowerCase()} puzzle made for a relaxing challenge.`}
            </p>

            <div className="mt-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Choose puzzle size
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {sizeOptions.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedSize(count)}
                    aria-pressed={activeSize === count}
                    className={cn(
                      'h-11 min-w-[64px] rounded-xl border text-sm font-bold transition-all',
                      activeSize === count
                        ? 'border-blue-600 bg-blue-600 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-blue-400/40'
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="mt-3.5 flex flex-wrap items-center gap-x-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      puzzle.difficulty === 'Easy'
                        ? 'bg-emerald-500'
                        : puzzle.difficulty === 'Hard'
                          ? 'bg-rose-500'
                          : 'bg-amber-400'
                    )}
                  />
                  {puzzle.difficulty} difficulty
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span>About {timeLow}–{timeHigh} min</span>
              </p>
            </div>

            <Link
              href={`/play/${puzzle.slug}?pieces=${activeSize}`}
              className="btn btn-primary btn-lg btn-shine mt-5 w-full"
            >
              <Play className="h-5 w-5 fill-current" />
              Start {activeSize}-Piece Puzzle
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsLiked((liked) => !liked)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-white/70 hover:text-blue-600 dark:hover:bg-white/5 dark:hover:text-blue-400"
              >
                <Heart className={cn('h-4 w-4', isLiked && 'fill-rose-500 text-rose-500')} />
                {isLiked ? 'Saved' : 'Save to Favorites'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-white/70 hover:text-blue-600 dark:hover:bg-white/5 dark:hover:text-blue-400"
              >
                {shareCopied ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {shareCopied ? 'Link Copied' : 'Share Puzzle'}
              </button>
            </div>
          </div>
        </section>

        {relatedPuzzles.length > 0 && (
          <section className="mt-9">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-[#17203d] dark:text-white">
                <Puzzle className="h-6 w-6 fill-blue-600/15 text-blue-600" />
                More Like This
              </h2>
              <Link
                href={`/category/${puzzle.category_slug}`}
                className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 sm:text-sm"
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

        {leaderboard.length > 0 ? (
          <section className="relative mt-9 overflow-hidden rounded-[28px] bg-white/80 shadow-[0_16px_45px_-38px_rgba(34,41,76,0.38)] dark:bg-white/[0.035]">
            <div className="flex items-center justify-between px-6 pb-3 pt-6 sm:px-8 sm:pt-7">
              <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-[#17203d] dark:text-white">
                <Trophy className="h-6 w-6 fill-amber-400/15 text-amber-400" />
                Fastest Solvers
              </h2>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 sm:text-xs"
              >
                View Full Leaderboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="px-6 pb-6 sm:px-8">
              <ol className="border-t border-slate-200/60 pt-1 dark:border-white/[0.07]">
                {leaderboard.slice(0, 3).map((entry) => (
                  <LeaderboardRow key={entry.userId} entry={entry} />
                ))}
              </ol>
            </div>
          </section>
        ) : (
          <div className="mt-9 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50/80 to-rose-50/60 px-5 py-4 dark:border-amber-400/10 dark:from-amber-500/10 dark:to-rose-500/10 sm:flex-row sm:items-center sm:px-7">
            <div className="flex items-start gap-3">
              <Trophy className="mt-0.5 h-6 w-6 shrink-0 fill-amber-300 text-amber-500" />
              <div>
                <p className="text-sm font-extrabold text-[#222a48] dark:text-slate-100">
                  Be the first to set the record
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  No one has completed this puzzle yet. Finish it and claim the first spot on the
                  leaderboard.
                </p>
              </div>
            </div>
            <Link
              href={`/play/${puzzle.slug}?pieces=${activeSize}`}
              className="btn btn-primary btn-sm shrink-0"
            >
              Start Challenge
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function PuzzleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#fbfcff] dark:bg-[#080b14]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-7 h-4 w-72 rounded-full skeleton" />
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="aspect-[1.055/1] rounded-[32px] skeleton" />
          <div className="space-y-7 py-8">
            <div className="h-14 w-4/5 rounded-xl skeleton" />
            <div className="h-20 rounded-xl skeleton" />
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-11 w-16 rounded-xl skeleton" />
              ))}
            </div>
            <div className="h-14 rounded-2xl skeleton" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ entry }: { entry: PublicPuzzleLeaderboardEntry }) {
  const { rank, username, timeSeconds } = entry
  const medalClass = {
    1: 'bg-amber-400 text-white',
    2: 'bg-slate-300 text-white',
    3: 'bg-orange-500 text-white',
  }[rank]
  const avatarColors = [
    'from-sky-400 to-blue-600',
    'from-orange-400 to-red-500',
    'from-pink-400 to-rose-600',
    'from-amber-400 to-orange-600',
    'from-teal-400 to-emerald-600',
  ]
  const initials = username
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

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
          avatarColors[(rank - 1) % avatarColors.length]
        )}
      >
        {initials}
      </span>
      <span className="flex-1 truncate font-bold text-[#28304c] dark:text-slate-100">
        {username}
      </span>
      <time className="font-extrabold text-[#28304c] dark:text-slate-100">
        {formatLeaderboardTime(timeSeconds)}
      </time>
    </li>
  )
}

function RelatedPuzzleCard({ puzzle }: { puzzle: PublicPuzzle }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link
      href={`/puzzle/${puzzle.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_32px_-22px_rgba(34,41,76,0.5)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-white/10 dark:bg-[#13131a] dark:hover:border-blue-400/30"
    >
      <div className="relative aspect-[1.4/1] overflow-hidden bg-muted">
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-teal-100 text-blue-500 dark:from-sky-950 dark:via-slate-900 dark:to-teal-950">
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
        <span className="absolute right-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-800 shadow-md">
          {puzzle.piece_count}
        </span>
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-extrabold text-[#202943] transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {puzzle.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-[11px]">
          <span>{puzzle.category}</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>{puzzle.difficulty}</span>
        </div>
      </div>
    </Link>
  )
}

export default function PuzzleDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[#fbfcff] dark:bg-[#080b14]">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <PuzzleDetailContent />
    </Suspense>
  )
}
