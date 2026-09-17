'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react'
import {
  Play, Pause, RotateCcw, Clock, Shuffle, Eye, EyeOff,
  ChevronLeft, ChevronRight, Star, X, Volume2, VolumeX, RefreshCw, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Utils } from '@/lib/puzzle/core/utils'
import {
  Subject,
  computeChoices,
  computeExactChoice,
  optimizeSubjectSize,
  type SubjectData,
} from '@/lib/puzzle/core/subject'
import type { PieceChoice, SaveGameV6 } from '@/lib/puzzle/core/types'
import { PuzzleCanvas, type PuzzleCanvasHandle } from '@/components/puzzle/PuzzleCanvas'
import { ResumeDialog } from '@/components/puzzle/ResumeDialog'
import { clearPuzzleSaves, loadSave, storeSave, clearSave, getRotationPref, setRotationPref } from '@/lib/puzzle/storage/save-store'
import { getImage } from '@/lib/puzzle/storage/image-store'
import { sfx } from '@/lib/puzzle/audio/sfx'
import { fetchPuzzleBySlug } from '@/lib/data/public'
import { useAuth } from '@/components/auth/AuthProvider'
import {
  abandonGameSession,
  checkpointGameSession,
  completeGameSession,
  startGameSession,
  type CompletedGameResult,
} from '@/lib/game-sessions'
import {
  getPuzzlePieceCounts,
  resolvePuzzlePieceCount,
} from '@/lib/puzzle/piece-counts'

interface PuzzleMeta {
  id: string
  slug: string
  title: string
  image_url: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  piece_count: number
}

type PuzzleImageSource =
  | { type: 'stored'; key: string }
  | { type: 'remote'; url: string }

type RecordingState =
  | 'waiting'
  | 'connecting'
  | 'recording'
  | 'verified'
  | 'local'
  | 'failed'

function parseRequestedPieceCount(value: string | null): number | null {
  if (value === null) return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : null
}

function getCanvasImageUrl(url: string): string {
  // Load third-party images through Next's same-origin optimizer. Some image
  // hosts allow display in <img> but omit CORS headers required by canvas.
  const params = new URLSearchParams({ url, w: '3840', q: '75' })
  return `/_next/image?${params.toString()}`
}

function PlayPuzzleContent() {
  const { user, loading: authLoading } = useAuth()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const isCustom = slug === 'custom'
  const idbKey = isCustom ? searchParams?.get('img') ?? '' : ''
  const requestedPiecesParam = searchParams?.get('pieces')
  const requestedNop = parseRequestedPieceCount(requestedPiecesParam)
  const dailyChallengeId = isCustom ? null : searchParams?.get('daily') ?? null
  const isDaily = dailyChallengeId !== null
  // 存档 id：目录 slug 或 idb:<key>
  const puzzleId = isCustom
    ? `idb:${idbKey}`
    : isDaily
      ? `daily:${dailyChallengeId}:${slug}`
      : slug

  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [progress, setProgress] = useState(0)
  const [moves, setMoves] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const [muted, setMuted] = useState(false)
  const [rotationOn, setRotationOn] = useState(false)
  const [choices, setChoices] = useState<PieceChoice[]>([])
  const [selectedNop, setSelectedNop] = useState(0)
  const [remotePuzzle, setRemotePuzzle] = useState<PuzzleMeta | null>(null)
  const [loadedRemoteSlug, setLoadedRemoteSlug] = useState<string | null>(null)
  const [recordingState, setRecordingState] = useState<RecordingState>('waiting')
  const [serverResult, setServerResult] = useState<CompletedGameResult | null>(null)

  // 游戏构建参数（作为 PuzzleCanvas 的 key 输入，变化即重建）
  const [subject, setSubject] = useState<SubjectData | null>(null)
  const [choice, setChoice] = useState<PieceChoice | null>(null)
  const [seed, setSeed] = useState(0)
  const [pendingSave, setPendingSave] = useState<SaveGameV6 | null>(null)
  const [resumeCandidate, setResumeCandidate] = useState<SaveGameV6 | null>(null)

  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<PuzzleCanvasHandle>(null)
  const imgRef = useRef<HTMLImageElement | ImageBitmap | null>(null)
  const baseSizeRef = useRef({ w: 0, h: 0 }) // 自动尺寸（档位计算基准）
  const boardRef = useRef({ w: 0, h: 0 })
  const timerStartRef = useRef(0)
  const timerLockedRef = useRef(0)
  const timerRunningRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const serverSessionRef = useRef<string | null>(null)
  const serverAttemptRef = useRef(0)
  const lastCheckpointRef = useRef({ sessionId: '', progress: 0, at: 0 })

  useEffect(() => {
    if (isCustom) return

    let cancelled = false

    fetchPuzzleBySlug(slug).then((item) => {
      if (cancelled) return
      setRemotePuzzle(item ? {
        id: item.uuid,
        slug: item.slug,
        title: item.title,
        image_url: item.image_url,
        difficulty: item.difficulty.toLowerCase() as PuzzleMeta['difficulty'],
        piece_count: item.piece_count,
      } : null)
      setLoadedRemoteSlug(slug)
    })

    return () => { cancelled = true }
  }, [isCustom, slug])

  const puzzle = useMemo<PuzzleMeta | null>(() => {
    if (isCustom) {
      return idbKey
        ? {
            id: 'custom',
            slug: 'custom',
            title: 'My Puzzle',
            image_url: '',
            difficulty: 'medium',
            piece_count: 100,
          }
        : null
    }
    return remotePuzzle
  }, [isCustom, idbKey, remotePuzzle])

  // 上传拼图与目录拼图只在图片来源上有区别；后续构建及玩法完全共用。
  const imageSource = useMemo<PuzzleImageSource | null>(() => {
    if (!puzzle) return null
    return isCustom
      ? { type: 'stored', key: idbKey }
      : { type: 'remote', url: puzzle.image_url }
  }, [puzzle, isCustom, idbKey])

  const pieceCount = choice?.nop ?? 0
  const puzzleLoading = !isCustom && loadedRemoteSlug !== slug
  const completedImageUrl = useMemo(() => {
    if (!subject) return puzzle?.image_url ?? ''

    try {
      return subject.canvas.toDataURL('image/jpeg', 0.9)
    } catch {
      return puzzle?.image_url ?? ''
    }
  }, [puzzle?.image_url, subject])
  const currentGameQuery = searchParams?.toString()
  const loginHref = `/login?next=${encodeURIComponent(
    `/play/${slug}${currentGameQuery ? `?${currentGameQuery}` : ''}`
  )}`

  /* ---------------- 计时 ---------------- */

  const currentElapsed = useCallback(() => {
    const running = timerRunningRef.current
      ? performance.now() - timerStartRef.current
      : 0
    return Math.round((timerLockedRef.current + running) / 1000)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => setTimer(currentElapsed()), 500)
    return () => clearInterval(id)
  }, [isPlaying, currentElapsed])

  const startClock = useCallback((baseSeconds = 0) => {
    timerLockedRef.current = baseSeconds * 1000
    timerStartRef.current = performance.now()
    timerRunningRef.current = true
    setTimer(baseSeconds)
    setIsPlaying(true)
  }, [])

  const pauseClock = useCallback(() => {
    if (timerRunningRef.current) {
      timerLockedRef.current += performance.now() - timerStartRef.current
      timerRunningRef.current = false
    }
    setIsPlaying(false)
  }, [])

  const abandonActiveSession = useCallback(() => {
    serverAttemptRef.current += 1
    const sessionId = serverSessionRef.current
    serverSessionRef.current = null
    lastCheckpointRef.current = { sessionId: '', progress: 0, at: 0 }
    setServerResult(null)

    if (sessionId) {
      void abandonGameSession(sessionId).catch((error) => {
        console.error('Failed to abandon game session:', error)
      })
    }
  }, [])

  /* ---------------- 自动存档 ---------------- */

  const flushSave = useCallback(() => {
    const game = gameRef.current
    if (!game || !choice) return
    if (game.isComplete()) {
      clearPuzzleSaves(puzzleId)
      return
    }
    const save = game.getSave(currentElapsed())
    if (!save) return

    storeSave(puzzleId, save)

    const sessionId = serverSessionRef.current
    const checkpointProgress = game.getPercent()
    const now = Date.now()
    const checkpoint = lastCheckpointRef.current
    if (
      sessionId &&
      checkpointProgress > checkpoint.progress &&
      (checkpoint.sessionId !== sessionId || now - checkpoint.at >= 15_000)
    ) {
      lastCheckpointRef.current = {
        sessionId,
        progress: Math.min(99, checkpointProgress),
        at: now,
      }
      void checkpointGameSession(sessionId, checkpointProgress).catch((error) => {
        console.error('Failed to checkpoint game session:', error)
      })
    }
  }, [choice, puzzleId, currentElapsed])

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(flushSave, 500)
  }, [flushSave])

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') flushSave()
    }
    window.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', flushSave)
    return () => {
      window.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', flushSave)
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [flushSave])

  /* ---------------- 图片加载 + 构建 ---------------- */

  const loadSource = useCallback(async (): Promise<HTMLImageElement | ImageBitmap> => {
    if (!imageSource) throw new Error('missing-image')
    if (imageSource.type === 'stored') {
      const rec = await getImage(imageSource.key)
      if (!rec) throw new Error('missing-image')
      return createImageBitmap(rec.blob, { imageOrientation: 'from-image' })
    }
    return Utils.loadImage(getCanvasImageUrl(imageSource.url))
  }, [imageSource])

  /** 针对档位生成最优 subject（块尺寸 × 初始缩放 最大化）并应用 */
  const applyChoice = useCallback((c: PieceChoice) => {
    const img = imgRef.current
    if (!img) return
    const base = baseSizeRef.current
    const board = boardRef.current
    const opt = optimizeSubjectSize(base.w, base.h, c, board.w, board.h)
    const sub = Subject.createSized(img, opt.width, opt.height)
    setSubject(sub)
    setChoice({ ...c, size: opt.size })
    setSelectedNop(c.nop)
  }, [])

  // 初次加载：读图 → subject/choices → 检查存档
  useEffect(() => {
    if (!puzzle) return
    let cancelled = false
    ;(async () => {
      try {
        const img = await loadSource()
        if (cancelled) return
        setIsReady(false)
        setLoadError(null)
        const wrap = canvasWrapRef.current
        const boardW = Math.max(320, wrap?.clientWidth ?? window.innerWidth)
        const boardH = Math.max(320, wrap?.clientHeight ?? window.innerHeight - 180)
        boardRef.current = { w: boardW, h: boardH }
        imgRef.current = img
        // 自动尺寸只用于计算档位基准
        const autoSub = Subject.create(img, boardW, boardH)
        baseSizeRef.current = { w: autoSub.width, h: autoSub.height }
        const allowedCounts = isDaily
          ? [puzzle.piece_count]
          : getPuzzlePieceCounts(puzzle.piece_count)
        const cs = isCustom
          ? computeChoices(autoSub)
          : allowedCounts.map((nop) => {
              const exactChoice = computeExactChoice(autoSub, nop)
              if (!exactChoice) throw new Error(`invalid-piece-count:${nop}`)
              return exactChoice
            })
        if (cancelled) return
        setChoices(cs)
        setResumeCandidate(null)
        const rotPref = isDaily ? false : getRotationPref()
        setRotationOn(rotPref)
        setMuted(sfx.muted)

        const counts = cs.map((c) => c.nop)
        const defaultNop = isCustom
          ? counts[0]
          : resolvePuzzlePieceCount(null, counts, puzzle.piece_count)
        const currentPiecesParam = new URLSearchParams(
          window.location.search
        ).get('pieces')
        const initialNop = resolvePuzzlePieceCount(
          parseRequestedPieceCount(currentPiecesParam),
          counts,
          defaultNop
        )
        const initialChoice = cs.find((c) => c.nop === initialNop) ?? cs[0]
        const found: SaveGameV6 | null = loadSave(puzzleId, initialChoice.nop)
        if (found) {
          setSelectedNop(found.nop)
          setResumeCandidate(found)
        } else {
          setSeed((Math.random() * 1e9) | 0)
          setPendingSave(null)
          applyChoice(initialChoice)
        }
      } catch (err) {
        if (cancelled) return
        setLoadError(
          err instanceof Error && err.message === 'missing-image'
            ? "We couldn't find this image (it may have been cleared). Please upload it again."
            : 'Failed to load the image. Please try again later.'
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [puzzle, puzzleId, loadSource, applyChoice, isCustom, isDaily])

  /* ---------------- 续玩选择 ---------------- */

  const resumeFromSave = useCallback(() => {
    const save = resumeCandidate
    if (!save) return
    const c = choices.find((x) => x.nop === save.nop)
    if (!c) {
      setResumeCandidate(null)
      return
    }
    setSeed(save.seed)
    setRotationOn(isDaily ? false : save.rot)
    setPendingSave(save)
    setResumeCandidate(null)
    applyChoice(c)
  }, [resumeCandidate, choices, applyChoice, isDaily])

  const restartFresh = useCallback(() => {
    const savedNop = resumeCandidate?.nop
    if (savedNop) clearSave(puzzleId, savedNop)
    setPendingSave(null)
    setResumeCandidate(null)
    setRecordingState('waiting')
    setSeed((Math.random() * 1e9) | 0)
    const freshChoice = choices.find((c) => c.nop === savedNop) ?? choices[0]
    if (freshChoice) applyChoice(freshChoice)
  }, [resumeCandidate, choices, puzzleId, applyChoice])

  /* ---------------- 游戏事件 ---------------- */

  const beginTrustedSession = useCallback(async () => {
    if (!puzzle || !choice || serverSessionRef.current) return
    if (authLoading) return

    if (isCustom || !user || pendingSave) {
      setRecordingState('local')
      return
    }

    const attempt = ++serverAttemptRef.current
    setRecordingState('connecting')

    try {
      const sessionId = await startGameSession({
        puzzleId: puzzle.id,
        pieceCount: choice.nop,
        rotationEnabled: isDaily ? false : rotationOn,
        dailyChallengeId,
      })

      if (attempt !== serverAttemptRef.current) {
        void abandonGameSession(sessionId).catch(() => undefined)
        return
      }

      serverSessionRef.current = sessionId
      lastCheckpointRef.current = { sessionId, progress: 0, at: Date.now() }
      setRecordingState('recording')
    } catch (error) {
      if (attempt !== serverAttemptRef.current) return
      console.error('Failed to start trusted game session:', error)
      setRecordingState('failed')
    }
  }, [
    authLoading,
    choice,
    dailyChallengeId,
    isCustom,
    isDaily,
    pendingSave,
    puzzle,
    rotationOn,
    user,
  ])

  const handleReady = useCallback(() => {
    setIsReady(true)
    setIsCompleted(false)
    setProgress(gameRef.current?.getPercent() ?? 0)
    setMoves(gameRef.current?.getMoves() ?? 0)
    startClock(pendingSave?.elapsed ?? 0)
    void beginTrustedSession()
  }, [startClock, pendingSave, beginTrustedSession])

  useEffect(() => {
    if (authLoading || !isReady || recordingState !== 'waiting') return
    const timerId = window.setTimeout(() => {
      void beginTrustedSession()
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [authLoading, beginTrustedSession, isReady, recordingState])

  const handleComplete = useCallback(() => {
    const completedMoves = gameRef.current?.getMoves() ?? moves
    const localElapsed = currentElapsed()
    const sessionId = serverSessionRef.current

    setIsCompleted(true)
    setProgress(100)
    setMoves(completedMoves)
    setTimer(localElapsed)
    pauseClock()
    clearPuzzleSaves(puzzleId)

    if (!sessionId) {
      serverAttemptRef.current += 1
      if (recordingState === 'connecting') setRecordingState('local')
      return
    }

    void completeGameSession(sessionId, completedMoves)
      .then((result) => {
        serverSessionRef.current = null
        setServerResult(result)
        setTimer(result.completion_time)
        setMoves(result.moves)
        setRecordingState(result.ranked ? 'recording' : 'verified')
      })
      .catch((error) => {
        console.error('Failed to complete trusted game session:', error)
        setRecordingState('failed')
      })
  }, [
    currentElapsed,
    moves,
    pauseClock,
    puzzleId,
    recordingState,
  ])

  /* ---------------- 控制操作 ---------------- */

  const rebuildWithChoice = useCallback(
    (c: PieceChoice) => {
      if (choice) flushSave() // 换档前先落盘当前档
      abandonActiveSession()
      pauseClock()
      setRecordingState('waiting')
      setIsCompleted(false)
      setIsReady(false)
      setTimer(0)
      setProgress(0)
      setMoves(0)
      setResumeCandidate(null)
      // 该档若有存档则恢复，否则新开
      const existing = loadSave(puzzleId, c.nop)
      if (existing) {
        setSeed(existing.seed)
        setPendingSave(existing)
      } else {
        setSeed((Math.random() * 1e9) | 0)
        setPendingSave(null)
      }
      applyChoice(c)
    },
    [choice, flushSave, abandonActiveSession, pauseClock, puzzleId, applyChoice]
  )

  const navigateToPieceCount = useCallback((nop: number, replace = false) => {
    const nextParams = new URLSearchParams(window.location.search)
    nextParams.set('pieces', String(nop))
    const href = `/play/${slug}?${nextParams.toString()}`
    if (replace) {
      router.replace(href, { scroll: false })
    } else {
      router.push(href, { scroll: false })
    }
  }, [router, slug])

  // URL changes select a tier without reloading the source image. Invalid and
  // legacy values are canonicalized to the closest choice exposed by this page.
  useEffect(() => {
    if (!puzzle || choices.length === 0 || !imgRef.current) return

    const counts = choices.map((c) => c.nop)
    const defaultNop = isCustom
      ? counts[0]
      : resolvePuzzlePieceCount(null, counts, puzzle.piece_count)
    const resolvedNop = resolvePuzzlePieceCount(
      requestedNop,
      counts,
      defaultNop
    )

    if (
      requestedPiecesParam !== null &&
      requestedPiecesParam !== String(resolvedNop)
    ) {
      navigateToPieceCount(resolvedNop, true)
    }
  }, [
    choices,
    isCustom,
    navigateToPieceCount,
    puzzle,
    requestedNop,
    requestedPiecesParam,
  ])

  // Back/forward navigation applies the URL tier through an event callback,
  // keeping URL-driven state changes out of the source-image loading effect.
  useEffect(() => {
    if (!puzzle || choices.length === 0) return

    const handlePopState = () => {
      const currentParam = new URLSearchParams(window.location.search).get('pieces')
      const counts = choices.map((c) => c.nop)
      const defaultNop = isCustom
        ? counts[0]
        : resolvePuzzlePieceCount(null, counts, puzzle.piece_count)
      const resolvedNop = resolvePuzzlePieceCount(
        parseRequestedPieceCount(currentParam),
        counts,
        defaultNop
      )

      if (currentParam !== null && currentParam !== String(resolvedNop)) {
        navigateToPieceCount(resolvedNop, true)
      }
      if (selectedNop === resolvedNop) return

      const nextChoice = choices.find((c) => c.nop === resolvedNop)
      if (nextChoice) rebuildWithChoice(nextChoice)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [
    choices,
    isCustom,
    navigateToPieceCount,
    puzzle,
    rebuildWithChoice,
    selectedNop,
  ])

  const resetGame = useCallback(() => {
    if (choice) clearSave(puzzleId, choice.nop)
    abandonActiveSession()
    pauseClock()
    setRecordingState('waiting')
    setIsCompleted(false)
    setIsReady(false)
    setTimer(0)
    setProgress(0)
    setMoves(0)
    setPendingSave(null)
    setSeed((Math.random() * 1e9) | 0)
  }, [choice, puzzleId, abandonActiveSession, pauseClock])

  const togglePause = useCallback(() => {
    if (isPlaying) {
      pauseClock()
      gameRef.current?.setPaused(true)
      flushSave()
    } else {
      timerStartRef.current = performance.now()
      timerRunningRef.current = true
      setIsPlaying(true)
      gameRef.current?.setPaused(false)
    }
  }, [isPlaying, pauseClock, flushSave])

  const toggleMute = useCallback(() => {
    sfx.ensureContext()
    const next = !sfx.muted
    sfx.setMuted(next)
    setMuted(next)
  }, [])

  const toggleRotation = useCallback(() => {
    if (isDaily) return
    const next = !rotationOn
    // 中途切换旋转模式会重建拼图（存档依赖角度语义）
    if (isReady && progress > 0) {
      const ok = window.confirm('Switching rotation mode will restart this puzzle. Are you sure?')
      if (!ok) return
    }
    setRotationPref(next)
    abandonActiveSession()
    pauseClock()
    setRotationOn(next)
    setRecordingState('waiting')
    if (choice) clearSave(puzzleId, choice.nop)
    setPendingSave(null)
    setIsReady(false)
    setTimer(0)
    setProgress(0)
    setMoves(0)
    setSeed((Math.random() * 1e9) | 0)
  }, [
    abandonActiveSession,
    choice,
    isDaily,
    isReady,
    pauseClock,
    progress,
    puzzleId,
    rotationOn,
  ])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateStars = () => {
    if (serverResult) return serverResult.stars
    if (!pieceCount) return 0
    const timePerPiece = timer / pieceCount
    const movesPerPiece = moves / pieceCount
    if (pieceCount <= 9) {
      if (timePerPiece < 20 && movesPerPiece < 3) return 3
      if (timePerPiece < 30 && movesPerPiece < 5) return 2
      return 1
    } else if (pieceCount <= 16) {
      if (timePerPiece < 15 && movesPerPiece < 4) return 3
      if (timePerPiece < 25 && movesPerPiece < 6) return 2
      return 1
    } else {
      if (timePerPiece < 12 && movesPerPiece < 5) return 3
      if (timePerPiece < 20 && movesPerPiece < 8) return 2
      return 1
    }
  }

  /* ---------------- 渲染 ---------------- */

  if (puzzleLoading || !puzzle || loadError) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-muted dark:bg-[#08080c] flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          {loadError ? (
            <>
              <p className="text-foreground font-medium mb-4">{loadError}</p>
              <Button onClick={() => router.push('/create')}>Create a puzzle</Button>
            </>
          ) : !puzzleLoading && !puzzle ? (
            <>
              <p className="text-foreground font-medium mb-4">
                This puzzle is not available or has not been published yet.
              </p>
              <Button onClick={() => router.push('/categories')}>Browse puzzles</Button>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading puzzle...</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100dvh-4rem)] bg-muted dark:bg-[#08080c] flex flex-col overflow-hidden">
      {/* Game Header */}
      <header className="bg-card dark:bg-[#13131a] border-b border-border dark:border-white/10 px-4 sm:px-6 py-2">
        <h1 className="sr-only">{puzzle.title}</h1>
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hidden sm:flex dark:hover:bg-white/10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {isDaily ? (
                <span className="rounded-lg border border-border/60 bg-secondary/60 px-2.5 py-1 text-sm font-semibold text-foreground">
                  {selectedNop || puzzle.piece_count} pieces · Daily rules
                </span>
              ) : (
                <select
                  value={selectedNop}
                  onChange={(e) => {
                    const nop = Number(e.target.value)
                    const c = choices.find((x) => x.nop === nop)
                    if (c) {
                      rebuildWithChoice(c)
                      navigateToPieceCount(c.nop)
                    }
                  }}
                  className="bg-secondary/60 dark:bg-[#0f172a] border border-border/60 dark:border-primary/35 rounded-lg pl-2.5 pr-1 py-1 shadow-sm dark:shadow-[0_0_0_1px_rgba(96,165,250,0.12)] text-sm font-semibold text-foreground dark:text-white dark:[&>option]:bg-[#0f172a] dark:[&>option]:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer hover:bg-white/40 dark:hover:bg-primary/10 transition-colors"
                  aria-label="Select piece count"
                >
                  {choices.length === 0 && <option value={0}>… pieces</option>}
                  {choices.map((c) => (
                    <option key={c.nop} value={c.nop}>
                      {c.nop} pieces ({c.rows}×{c.cols})
                    </option>
                  ))}
                </select>
              )}
              <span className="hidden sm:inline">•</span>
              <span
                className={cn(
                  'hidden sm:inline px-2 py-0.5 rounded text-xs font-medium',
                  puzzle.difficulty === 'easy' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                  puzzle.difficulty === 'medium' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                  puzzle.difficulty === 'hard' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                  puzzle.difficulty === 'expert' && 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                )}
              >
                {puzzle.difficulty}
              </span>
              {recordingState !== 'waiting' && (
                <span
                  className={cn(
                    'hidden rounded px-2 py-0.5 text-xs font-semibold md:inline',
                    recordingState === 'recording' || recordingState === 'verified'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : recordingState === 'connecting'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  )}
                >
                  {recordingState === 'recording'
                    ? serverResult
                      ? 'Result recorded'
                      : rotationOn
                        ? 'Completion recording · unranked'
                        : 'Score recording'
                    : recordingState === 'verified'
                      ? 'Verified · not ranked'
                    : recordingState === 'connecting'
                      ? 'Connecting score…'
                      : recordingState === 'failed'
                        ? 'Local mode · score sync failed'
                        : pendingSave
                          ? 'Local resume · not ranked'
                          : 'Local mode · not ranked'}
                </span>
              )}
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-between sm:justify-end gap-2 sm:gap-4">
            {/* Timer */}
            <div className="flex shrink-0 items-center gap-2 bg-secondary/80 dark:bg-[#0f172a] border border-border/60 dark:border-primary/35 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-sm dark:shadow-[0_0_0_1px_rgba(96,165,250,0.12)]">
              <Clock className="h-4 w-4 text-primary dark:text-primary" />
              <span className="text-lg sm:text-xl font-mono font-extrabold text-foreground dark:text-white tabular-nums tracking-tight dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.18)]">
                {formatTime(timer)}
              </span>
            </div>

            {/* Progress - Circular */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-secondary dark:text-white/15" />
                  <circle
                    cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                    className="text-primary transition-all duration-500 drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 18}`,
                      strokeDashoffset: `${2 * Math.PI * 18 * (1 - progress / 100)}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground tabular-nums">{progress}</span>
                </div>
              </div>
            </div>

            {/* Control buttons (swipeable on small screens) */}
            <div className="flex items-center gap-2 min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="bg-secondary/60 text-foreground border border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10 transition-all"
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRotation}
                disabled={isDaily}
                className={cn(
                  'border border-transparent transition-all',
                  rotationOn
                    ? 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30'
                    : 'bg-secondary/60 text-foreground border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10'
                )}
                title={isDaily ? 'Rotation is disabled for daily challenges' : rotationOn ? 'Turn off rotation mode' : 'Turn on rotation mode (R key / right-click / double-click to rotate)'}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview((v) => !v)}
                className={cn(
                  'border border-transparent transition-all',
                  showPreview
                    ? 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30'
                    : 'bg-secondary/60 text-foreground border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10'
                )}
                title="Toggle reference image"
              >
                {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => gameRef.current?.scatter(true)}
                className="bg-secondary/60 text-foreground border border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10 transition-all"
                title="Scatter unsolved pieces"
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              {!isPlaying ? (
                <Button onClick={togglePause} size="sm" className="btn-shine shadow-md shadow-primary/20 dark:shadow-primary/30" disabled={!isReady || isCompleted}>
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={togglePause}
                  variant="outline"
                  size="sm"
                  className="bg-secondary/60 text-foreground border-border/60 hover:bg-secondary dark:bg-white/[0.06] dark:text-white dark:border-white/15 dark:hover:bg-white/10 dark:hover:border-white/25"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}

              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="bg-secondary/60 text-foreground border-border/60 hover:bg-secondary dark:bg-white/[0.06] dark:text-white dark:border-white/15 dark:hover:bg-white/10 dark:hover:border-white/25"
                title="Restart puzzle"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div
          ref={canvasWrapRef}
          className="relative w-full h-full min-h-[500px] bg-card dark:bg-[#13131a] rounded-2xl shadow-lg overflow-hidden"
        >
          <PuzzleCanvas
            ref={gameRef}
            className="absolute inset-0"
            subject={subject}
            choice={choice}
            seed={seed}
            rotationEnabled={rotationOn}
            showPreview={showPreview}
            save={pendingSave}
            onProgress={setProgress}
            onComplete={handleComplete}
            onMove={setMoves}
            onDirty={scheduleSave}
            onReady={handleReady}
          />

          {/* 暂停遮罩 */}
          {isReady && !isPlaying && !isCompleted && !resumeCandidate && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1200]">
              <button
                onClick={togglePause}
                className="flex flex-col items-center gap-3 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <span className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Play className="w-9 h-9 ml-1" />
                </span>
                <span className="text-sm font-medium">Paused · Click to resume</span>
              </button>
            </div>
          )}

          {/* Loading overlay until engine ready */}
          {!isReady && !resumeCandidate && (
            <div className="absolute inset-0 bg-card/80 dark:bg-[#13131a]/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Preparing puzzle...</p>
              </div>
            </div>
          )}

          {/* 续玩对话框 */}
          {resumeCandidate && (
            <ResumeDialog
              elapsed={resumeCandidate.elapsed}
              moves={resumeCandidate.moves}
              nop={resumeCandidate.nop}
              onResume={resumeFromSave}
              onRestart={restartFresh}
            />
          )}

          {/* Completion Modal */}
          {isCompleted && (
            <div className="absolute inset-0 z-[1500] flex items-start justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:items-center">
              <Card
                role="dialog"
                aria-modal="true"
                aria-label="Puzzle results"
                className="relative my-auto w-full max-w-[32rem] overflow-hidden rounded-[1.75rem] border border-white/50 bg-card shadow-[0_28px_90px_rgba(0,0,0,0.38)] animate-fade-in dark:border-white/10 dark:bg-card"
              >
                <button
                  onClick={() => setIsCompleted(false)}
                  className="absolute right-1 top-1 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground dark:hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <CardContent className="space-y-3 px-5 pb-4 pt-5 text-center sm:px-8">
                  {completedImageUrl && (
                    <div className="relative aspect-[16/8.6] overflow-hidden rounded-xl border-[6px] border-card bg-secondary shadow-[0_10px_24px_-14px_rgba(47,74,58,0.65)] ring-1 ring-border dark:ring-white/10">
                      <Image
                        src={completedImageUrl}
                        alt={`Completed ${puzzle.title} puzzle`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) calc(100vw - 3.5rem), 512px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="pt-1">
                    <p className="font-mono text-5xl font-black leading-none tracking-tight text-primary tabular-nums sm:text-6xl">
                      {formatTime(timer)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">Completion Time</p>
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-2 dark:divide-white/10 dark:border-white/10">
                    <div>
                      <p className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">{pieceCount}</p>
                      <p className="text-xs font-medium text-muted-foreground sm:text-sm">Pieces</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">{moves}</p>
                      <p className="text-xs font-medium text-muted-foreground sm:text-sm">Moves</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex gap-0.5" aria-label={`${calculateStars()} out of 3 stars`}>
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-5 w-5 sm:h-6 sm:w-6',
                              i < calculateStars()
                                ? 'fill-[#f2ae19] text-[#f2ae19] drop-shadow-[0_3px_4px_rgba(185,138,47,0.24)]'
                                : 'fill-secondary text-border dark:fill-white/5 dark:text-white/15'
                            )}
                            strokeWidth={1.8}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">Stars</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    <Info className="h-4 w-4 shrink-0" />
                    {user ? (
                      <span>
                        {serverResult?.ranked
                          ? 'Result verified and added to eligible records.'
                          : 'This result is saved on this device.'}
                      </span>
                    ) : (
                      <span>
                        <Link
                          href={loginHref}
                          className="font-semibold text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
                        >
                          Log in
                        </Link>{' '}
                        to save your record and track your progress.
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-[0.95fr_1.35fr] gap-3 pt-1">
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent font-semibold"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Replay Puzzle
                    </Button>
                    <Button
                      onClick={() => router.push('/explore/weekly')}
                      size="lg"
                      className="btn-shine w-full text-base font-bold shadow-lg shadow-primary/20"
                    >
                      Next Puzzle
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlayPuzzlePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100dvh-4rem)] bg-muted dark:bg-[#08080c] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <PlayPuzzleContent />
    </Suspense>
  )
}
