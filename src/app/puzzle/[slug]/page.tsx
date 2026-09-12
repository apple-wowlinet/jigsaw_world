'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  ImageIcon,
  Loader2,
  Play,
  Puzzle,
  Share2,
  Trophy,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { SafeImage } from '@/components/ui/SafeImage'
import {
  fetchPuzzleBySlug,
  fetchPuzzleLeaderboard,
  fetchPuzzles,
  type PublicPuzzle,
  type PublicPuzzleLeaderboardEntry,
} from '@/lib/data/public'
import { addFavorite, fetchFavoriteStatus, removeFavorite } from '@/lib/favorites'
import {
  getPuzzlePieceCounts,
  resolvePuzzlePieceCount,
} from '@/lib/puzzle/piece-counts'
import { cn } from '@/lib/utils'

function formatLeaderboardTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function PuzzleDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const slug = params?.slug as string
  const [puzzle, setPuzzle] = useState<PublicPuzzle | null>(null)
  const [relatedPuzzles, setRelatedPuzzles] = useState<PublicPuzzle[]>([])
  const [leaderboard, setLeaderboard] = useState<PublicPuzzleLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [favoriteError, setFavoriteError] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle')
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const shareResetTimer = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadPuzzle() {
      setLoading(true)
      setRelatedPuzzles([])
      setLeaderboard([])
      setSelectedSize(null)
      setIsLiked(false)
      setFavoriteError(null)
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

  useEffect(() => {
    let cancelled = false

    async function loadFavorite() {
      if (authLoading || !puzzle) return

      if (!user) {
        setIsLiked(false)
        setFavoriteLoading(false)
        return
      }

      setFavoriteLoading(true)
      setFavoriteError(null)

      try {
        const favorited = await fetchFavoriteStatus(user.id, puzzle.uuid)
        if (!cancelled) setIsLiked(favorited)
      } catch (error) {
        console.error('Failed to load favorite status:', error)
        if (!cancelled) setFavoriteError('Could not load your favorite status. Please try again.')
      } finally {
        if (!cancelled) setFavoriteLoading(false)
      }
    }

    loadFavorite()
    return () => {
      cancelled = true
    }
  }, [authLoading, puzzle, user])

  useEffect(() => {
    return () => {
      if (shareResetTimer.current) window.clearTimeout(shareResetTimer.current)
    }
  }, [])

  const showShareStatus = (status: 'copied' | 'shared' | 'error') => {
    if (shareResetTimer.current) window.clearTimeout(shareResetTimer.current)
    setShareStatus(status)
    shareResetTimer.current = window.setTimeout(() => setShareStatus('idle'), 2500)
  }

  const copyShareUrl = async (url: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
      return
    }

    const input = document.createElement('textarea')
    input.value = url
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    const copied = document.execCommand('copy')
    input.remove()
    if (!copied) throw new Error('Copy command failed')
  }

  const handleFavorite = async () => {
    if (!puzzle || authLoading || favoriteLoading) return

    if (!user) {
      const nextPath = `/puzzle/${encodeURIComponent(puzzle.slug)}`
      router.push(`/login?next=${encodeURIComponent(nextPath)}`)
      return
    }

    const nextLiked = !isLiked
    setIsLiked(nextLiked)
    setFavoriteLoading(true)
    setFavoriteError(null)

    try {
      if (nextLiked) {
        await addFavorite(user.id, puzzle.uuid)
      } else {
        await removeFavorite(user.id, puzzle.uuid)
      }
    } catch (error) {
      console.error('Failed to update favorite:', error)
      setIsLiked(!nextLiked)
      setFavoriteError('Could not update your favorites. Please try again.')
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleShare = async () => {
    if (!puzzle) return

    const url = `${window.location.origin}/puzzle/${encodeURIComponent(puzzle.slug)}`
    const shareData = {
      title: `${puzzle.title} - JigsawWorld`,
      text: puzzle.description || 'Play this puzzle on JigsawWorld',
      url,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        showShareStatus('shared')
        return
      }

      await copyShareUrl(url)
      showShareStatus('copied')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      try {
        await copyShareUrl(url)
        showShareStatus('copied')
      } catch (copyError) {
        console.error('Failed to share puzzle:', copyError)
        showShareStatus('error')
      }
    }
  }

  if (loading) {
    return <PuzzleDetailSkeleton />
  }

  if (!puzzle) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <Puzzle className="mx-auto mb-4 h-14 w-14 text-accent" />
          <h1 className="font-display mb-2 text-2xl font-semibold">Puzzle not found</h1>
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
  const sizeOptions = getPuzzlePieceCounts(canonicalSize)
  const activeSize = selectedSize ?? resolvePuzzlePieceCount(
    null,
    sizeOptions,
    canonicalSize
  )
  const baseMinutes = (activeSize * 18) / 60
  const timeLow = Math.max(5, Math.round((baseMinutes * 0.75) / 5) * 5)
  const timeHigh = Math.max(timeLow + 10, Math.round((baseMinutes * 1.25) / 5) * 5)

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_88%_7%,rgba(230,235,225,0.55),transparent_22%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_2%_48%,rgba(243,226,214,0.5),transparent_22%)]"
      />

      <div className="relative mx-auto max-w-[1380px] px-4 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex min-w-0 items-center gap-2.5 overflow-hidden text-xs font-medium text-muted-foreground sm:text-sm"
        >
          <Link href="/" className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-accent">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sand-dark" />
          <Link
            href={`/category/${puzzle.category_slug}`}
            className="shrink-0 transition-colors hover:text-accent"
          >
            {puzzle.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sand-dark" />
          <span className="truncate font-semibold text-foreground">{puzzle.title}</span>
        </nav>

        <section className="grid items-start gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 xl:gap-[68px]">
          <div className="relative">
            <div className="frame-gold relative p-[10px]">
              <div className="frame-gold-inner p-[7px]">
                <div className="group relative aspect-[1.055/1] min-h-[320px] overflow-hidden bg-muted sm:min-h-[500px] lg:min-h-0">
                  <SafeImage
                    src={puzzle.image_url}
                    alt={puzzle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241d10]/15 via-transparent to-transparent" />

                  <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7 sm:top-7">
                    <span className="label-caps rounded-full bg-primary px-3.5 py-1.5 text-[10px] text-primary-foreground shadow-lg">
                      {puzzle.category}
                    </span>
                  </div>

                  <div className="absolute right-5 top-5 flex gap-2.5 sm:right-7 sm:top-7">
                    <button
                      type="button"
                      onClick={handleFavorite}
                      aria-label={isLiked ? 'Remove from favorites' : 'Save to favorites'}
                      aria-pressed={isLiked}
                      aria-busy={favoriteLoading}
                      disabled={authLoading || favoriteLoading}
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full border border-[#e7decb] shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70',
                        isLiked
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-card/95 text-muted-foreground hover:bg-card'
                      )}
                    >
                      {favoriteLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      aria-label="Share puzzle"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7decb] bg-card/95 text-muted-foreground shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-card"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-1 lg:py-0">
            <h1 className="font-display max-w-[570px] text-[34px] font-semibold leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[40px] lg:text-[46px]">
              {puzzle.title}
            </h1>
            <p className="mt-4 max-w-[520px] text-sm leading-7 text-muted-foreground sm:text-base sm:leading-7">
              {puzzle.description ||
                `A beautiful ${puzzle.category.toLowerCase()} puzzle made for a relaxing challenge.`}
            </p>

            <div className="mt-6">
              <p className="label-caps text-[11px] text-muted-foreground">
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
                      'h-11 min-w-[64px] rounded-md border text-sm font-bold transition-all',
                      activeSize === count
                        ? 'border-accent bg-accent text-accent-foreground shadow-[0_8px_18px_-8px_rgba(180,89,46,0.55)]'
                        : 'border-[#ddd2ba] bg-card text-muted-foreground hover:border-accent/60 hover:text-accent dark:border-[#3b3327]'
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="mt-3.5 flex flex-wrap items-center gap-x-2.5 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      puzzle.difficulty === 'Easy'
                        ? 'bg-[#4a7259]'
                        : puzzle.difficulty === 'Medium'
                          ? 'bg-[#c9973f]'
                          : puzzle.difficulty === 'Hard'
                          ? 'bg-[#c0453a]'
                          : 'bg-[#6d4aae]'
                    )}
                  />
                  {puzzle.difficulty} difficulty
                </span>
                <span className="text-sand-dark">·</span>
                <span>About {timeLow}–{timeHigh} min</span>
              </p>
            </div>

            <Link
              href={`/play/${puzzle.slug}?pieces=${activeSize}`}
              className="btn btn-terracotta btn-lg btn-shine mt-5 w-full"
            >
              <Play className="h-5 w-5 fill-current" />
              Start {activeSize}-Piece Puzzle
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleFavorite}
                aria-pressed={isLiked}
                aria-busy={favoriteLoading}
                disabled={authLoading || favoriteLoading}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-accent disabled:cursor-wait disabled:opacity-70"
              >
                {favoriteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className={cn('h-4 w-4', isLiked && 'fill-accent text-accent')} />
                )}
                {isLiked ? 'Saved' : user ? 'Save to Favorites' : 'Log in to Save'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-accent"
              >
                {shareStatus === 'copied' || shareStatus === 'shared' ? (
                  <CheckCircle2 className="h-4 w-4 text-[#4a7259]" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {shareStatus === 'copied'
                  ? 'Link Copied'
                  : shareStatus === 'shared'
                    ? 'Shared'
                    : 'Share Puzzle'}
              </button>
            </div>
            {(favoriteError || shareStatus === 'error') && (
              <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                {favoriteError || 'Sharing is unavailable. Please copy the page URL manually.'}
              </p>
            )}
            <p className="sr-only" role="status" aria-live="polite">
              {shareStatus === 'copied'
                ? 'Puzzle link copied to clipboard.'
                : shareStatus === 'shared'
                  ? 'Puzzle shared.'
                  : isLiked
                    ? 'Puzzle saved to favorites.'
                    : ''}
            </p>
          </div>
        </section>

        {relatedPuzzles.length > 0 && (
          <section className="mt-9">
            <div className="mb-5 flex items-center justify-between gap-5">
              <h2 className="label-caps shrink-0 text-foreground">
                More Like This
              </h2>
              <span className="h-px flex-1 bg-sand-dark/70" />
              <Link
                href={`/category/${puzzle.category_slug}`}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
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
          <section className="relative mt-9 overflow-hidden rounded-lg border border-[#e7decb] bg-card shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] dark:border-[#3b3327]">
            <div className="flex items-center justify-between px-6 pb-3 pt-6 sm:px-8 sm:pt-7">
              <h2 className="label-caps flex items-center gap-2.5 text-foreground">
                <Trophy className="h-5 w-5 fill-gold text-gold" />
                Fastest Solvers
              </h2>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
              >
                View Full Leaderboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="px-6 pb-6 sm:px-8">
              <ol className="border-t border-border pt-1">
                {leaderboard.slice(0, 3).map((entry) => (
                  <LeaderboardRow key={entry.userId} entry={entry} />
                ))}
              </ol>
            </div>
          </section>
        ) : (
          <div className="mt-9 flex flex-col items-start justify-between gap-4 rounded-lg border border-accent/25 bg-accent-subtle px-5 py-4 sm:flex-row sm:items-center sm:px-7">
            <div className="flex items-start gap-3">
              <Trophy className="mt-0.5 h-6 w-6 shrink-0 fill-accent/40 text-accent" />
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  Be the first to set the record
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-7 h-4 w-72 rounded-full skeleton" />
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="aspect-[1.055/1] rounded-lg skeleton" />
          <div className="space-y-7 py-8">
            <div className="h-14 w-4/5 rounded-lg skeleton" />
            <div className="h-20 rounded-lg skeleton" />
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-11 w-16 rounded-lg skeleton" />
              ))}
            </div>
            <div className="h-14 rounded-lg skeleton" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ entry }: { entry: PublicPuzzleLeaderboardEntry }) {
  const { rank, username, timeSeconds } = entry
  const medalClass = {
    1: 'bg-[#c9973f] text-white',
    2: 'bg-[#b8b4a2] text-white',
    3: 'bg-[#b95c38] text-white',
  }[rank]
  const avatarColors = [
    'from-[#d8b25e] to-[#b98a2f]',
    'from-[#cd7a45] to-[#9c4b2b]',
    'from-[#8fb49c] to-[#4a7259]',
    'from-[#e8cf9a] to-[#c9973f]',
    'from-[#a4a695] to-[#6e7263]',
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
          medalClass ?? 'text-muted-foreground'
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
      <span className="flex-1 truncate font-bold text-foreground">
        {username}
      </span>
      <time className="font-display font-semibold text-foreground">
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
      className="group overflow-hidden rounded-lg border border-[#e7decb] bg-card shadow-[0_10px_30px_-22px_rgba(80,60,25,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(80,60,25,0.5)] dark:border-[#3b3327]"
    >
      <div className="relative aspect-[1.4/1] overflow-hidden bg-muted">
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-parchment via-panel to-accent-subtle text-olive">
            <ImageIcon className="mb-2 h-9 w-9" />
            <span className="label-caps text-[10px]">
              {puzzle.category}
            </span>
          </div>
        ) : (
          <SafeImage
            src={puzzle.image_url}
            alt={puzzle.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute right-2.5 top-2.5 rounded-full border border-[#e7decb] bg-card/95 px-2.5 py-1 font-display text-xs font-semibold text-foreground shadow-md">
          {puzzle.piece_count}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display truncate text-[17px] font-semibold text-foreground transition-colors group-hover:text-accent">
          {puzzle.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
          <span>{puzzle.category}</span>
          <span className="text-sand-dark">·</span>
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
        <div className="flex min-h-[70vh] items-center justify-center bg-background">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      }
    >
      <PuzzleDetailContent />
    </Suspense>
  )
}
