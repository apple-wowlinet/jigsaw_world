'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react'
import {
  Play, Pause, RotateCcw, Clock, Home, Shuffle, Eye, EyeOff,
  ChevronLeft, ChevronRight, Trophy, Star, X, Volume2, VolumeX, RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { loadSave, storeSave, clearSave, getRotationPref, setRotationPref } from '@/lib/puzzle/storage/save-store'
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
  difficulty: 'easy' | 'medium' | 'hard'
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
      clearSave(puzzleId, choice.nop)
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
    return Utils.loadImage(imageSource.url)
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
    if (choice) clearSave(puzzleId, choice.nop)

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
    choice,
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
      <div className="min-h-screen bg-muted dark:bg-[#08080c] flex items-center justify-center">
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
    <div className="h-screen bg-muted dark:bg-[#08080c] flex flex-col overflow-hidden">
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
                  puzzle.difficulty === 'hard' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1500]">
              <Card className="relative max-w-md w-full mx-4 border-0 shadow-2xl animate-fade-in dark:bg-card dark:border dark:border-white/10">
                <button
                  onClick={() => setIsCompleted(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 dark:hover:bg-white/10 transition-colors cursor-pointer z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success-subtle dark:bg-success/20 flex items-center justify-center animate-pulse-ring">
                    <Trophy className="w-10 h-10 text-success" />
                  </div>
                  <CardTitle className="text-2xl text-success">Puzzle Completed!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div>
                    <p className="text-lg text-foreground mb-2">
                      Outstanding work! You&apos;ve mastered this puzzle!
                    </p>
                    <p className="text-4xl font-bold text-primary mb-2">{formatTime(timer)}</p>
                    <p className="mb-3 text-xs font-medium text-muted-foreground">
                      {serverResult
                        ? serverResult.ranked
                          ? 'Verified by the server and included in eligible records.'
                          : 'Verified completion; rotation-mode results are not ranked.'
                        : recordingState === 'failed'
                          ? 'Saved locally. The server could not record this result.'
                          : 'Local result only; it is not included in records.'}
                    </p>
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-8 h-8 transition-all',
                            i < calculateStars()
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-border dark:border-white/10">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{pieceCount}</p>
                      <p className="text-xs text-muted-foreground">Pieces</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{moves}</p>
                      <p className="text-xs text-muted-foreground">Moves</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{calculateStars()}</p>
                      <p className="text-xs text-muted-foreground">Stars</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => router.push('/')} variant="outline" className="flex-1 dark:bg-transparent">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                    <Button
                      onClick={() => {
                        router.push('/explore/weekly')
                      }}
                      className="flex-1 btn-shine"
                    >
                      Next Level
                      <ChevronRight className="w-4 h-4 ml-2" />
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
        <div className="min-h-screen bg-muted dark:bg-[#08080c] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <PlayPuzzleContent />
    </Suspense>
  )
}
