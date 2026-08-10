'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react'
import {
  Play, Pause, RotateCcw, Clock, Home, Shuffle, Eye, EyeOff,
  ChevronLeft, ChevronRight, Trophy, Star, X, Volume2, VolumeX, RefreshCw, Bug,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Utils } from '@/lib/puzzle/core/utils'
import { Subject, computeChoices, optimizeSubjectSize, type SubjectData } from '@/lib/puzzle/core/subject'
import type { PieceChoice, PuzzleDebugInfo, SaveGameV6 } from '@/lib/puzzle/core/types'
import { PuzzleCanvas, type PuzzleCanvasHandle } from '@/components/puzzle/PuzzleCanvas'
import { ResumeDialog } from '@/components/puzzle/ResumeDialog'
import { loadSave, storeSave, clearSave, getRotationPref, setRotationPref } from '@/lib/puzzle/storage/save-store'
import { getImage } from '@/lib/puzzle/storage/image-store'
import { sfx } from '@/lib/puzzle/audio/sfx'
import { fetchPuzzleBySlug } from '@/lib/data/public'

interface PuzzleMeta {
  id: string
  title: string
  image_url: string
  difficulty: 'easy' | 'medium' | 'hard'
}

function PlayPuzzleContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const isCustom = slug === 'custom'
  const idbKey = isCustom ? searchParams?.get('img') ?? '' : ''
  // 存档 id：目录 slug 或 idb:<key>
  const puzzleId = isCustom ? `idb:${idbKey}` : slug

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
  const [debugInfo, setDebugInfo] = useState<PuzzleDebugInfo | null>(null)
  const [remotePuzzle, setRemotePuzzle] = useState<PuzzleMeta | null>(null)
  const [puzzleLoading, setPuzzleLoading] = useState(!isCustom)

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

  useEffect(() => {
    if (isCustom) {
      setPuzzleLoading(false)
      return
    }

    let cancelled = false
    setPuzzleLoading(true)

    fetchPuzzleBySlug(slug).then((item) => {
      if (cancelled) return
      setRemotePuzzle(item ? {
        id: item.id,
        title: item.title,
        image_url: item.image_url,
        difficulty: item.difficulty.toLowerCase() as PuzzleMeta['difficulty'],
      } : null)
      setPuzzleLoading(false)
    })

    return () => { cancelled = true }
  }, [isCustom, slug])

  const puzzle = useMemo<PuzzleMeta | null>(() => {
    if (isCustom) {
      return idbKey
        ? { id: 'custom', title: '我的拼图', image_url: '', difficulty: 'medium' }
        : null
    }
    return remotePuzzle
  }, [isCustom, idbKey, remotePuzzle])

  const pieceCount = choice?.nop ?? 0

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

  /* ---------------- 自动存档 ---------------- */

  const flushSave = useCallback(() => {
    const game = gameRef.current
    if (!game || !choice) return
    if (game.isComplete()) {
      clearSave(puzzleId, choice.nop)
      return
    }
    const save = game.getSave(currentElapsed())
    if (save) storeSave(puzzleId, save)
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
    if (isCustom) {
      const rec = await getImage(idbKey)
      if (!rec) throw new Error('missing-image')
      return createImageBitmap(rec.blob, { imageOrientation: 'from-image' })
    }
    return Utils.loadImage(puzzle!.image_url)
  }, [isCustom, idbKey, puzzle])

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
    setIsReady(false)
    setLoadError(null)
    ;(async () => {
      try {
        const img = await loadSource()
        if (cancelled) return
        const wrap = canvasWrapRef.current
        const boardW = Math.max(320, wrap?.clientWidth ?? window.innerWidth)
        const boardH = Math.max(320, wrap?.clientHeight ?? window.innerHeight - 180)
        boardRef.current = { w: boardW, h: boardH }
        imgRef.current = img
        // 自动尺寸只用于计算档位基准
        const autoSub = Subject.create(img, boardW, boardH)
        baseSizeRef.current = { w: autoSub.width, h: autoSub.height }
        const cs = computeChoices(autoSub)
        if (cancelled) return
        setChoices(cs)
        const rotPref = getRotationPref()
        setRotationOn(rotPref)
        setMuted(sfx.muted)

        // 找任一档位的存档（优先块数最小档）
        let found: SaveGameV6 | null = null
        for (const c of cs) {
          const s = loadSave(puzzleId, c.nop)
          if (s) {
            found = s
            break
          }
        }
        if (found) {
          setResumeCandidate(found)
        } else {
          setSeed((Math.random() * 1e9) | 0)
          setPendingSave(null)
          applyChoice(cs[0])
        }
      } catch (err) {
        if (cancelled) return
        setLoadError(
          err instanceof Error && err.message === 'missing-image'
            ? '找不到这张图片（可能已被清理），请重新上传。'
            : '图片加载失败，请稍后重试。'
        )
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle, puzzleId])

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
    setRotationOn(save.rot)
    setPendingSave(save)
    setResumeCandidate(null)
    applyChoice(c)
  }, [resumeCandidate, choices, applyChoice])

  const restartFresh = useCallback(() => {
    if (resumeCandidate) clearSave(puzzleId, resumeCandidate.nop)
    setPendingSave(null)
    setResumeCandidate(null)
    setSeed((Math.random() * 1e9) | 0)
    if (choices[0]) applyChoice(choices[0])
  }, [resumeCandidate, choices, puzzleId, applyChoice])

  /* ---------------- 游戏事件 ---------------- */

  const handleReady = useCallback(() => {
    setIsReady(true)
    setIsCompleted(false)
    setProgress(gameRef.current?.getPercent() ?? 0)
    setMoves(gameRef.current?.getMoves() ?? 0)
    startClock(pendingSave?.elapsed ?? 0)
  }, [startClock, pendingSave])

  const handleComplete = useCallback(() => {
    setIsCompleted(true)
    setProgress(100)
    pauseClock()
    if (choice) clearSave(puzzleId, choice.nop)
  }, [pauseClock, choice, puzzleId])

  /* ---------------- 控制操作 ---------------- */

  const rebuildWithChoice = useCallback(
    (c: PieceChoice) => {
      if (choice) flushSave() // 换档前先落盘当前档
      pauseClock()
      setIsCompleted(false)
      setIsReady(false)
      setTimer(0)
      setProgress(0)
      setMoves(0)
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
    [choice, flushSave, pauseClock, puzzleId, applyChoice]
  )

  const resetGame = useCallback(() => {
    if (choice) clearSave(puzzleId, choice.nop)
    pauseClock()
    setIsCompleted(false)
    setIsReady(false)
    setTimer(0)
    setProgress(0)
    setMoves(0)
    setPendingSave(null)
    setSeed((Math.random() * 1e9) | 0)
  }, [choice, puzzleId, pauseClock])

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

  const runDebug = useCallback(() => {
    const info = gameRef.current?.getDebugInfo() ?? null
    setDebugInfo(info)
    if (info) {
      // 同步打印到控制台，便于复制
      console.group('%c[Jigsaw Debug]', 'color:#60a5fa;font-weight:bold')
      console.log('图片原始尺寸:', `${info.image.naturalWidth} × ${info.image.naturalHeight}`)
      console.log(
        '参考图逻辑尺寸:',
        `${info.image.subjectWidth} × ${info.image.subjectHeight}`,
        `(物理画布 ${info.image.subjectCanvasWidth} × ${info.image.subjectCanvasHeight})`
      )
      console.log('世界(散布区)尺寸:', `${info.board.worldWidth} × ${info.board.worldHeight}`)
      console.log('画布(屏幕)尺寸:', `${info.board.screenWidth} × ${info.board.screenHeight}`)
      console.log('视图缩放:', info.board.viewScale, ' DPR:', info.board.devicePixelRatio)
      console.log('图集:', `${info.atlas.pages} 页, bakeDpr=${info.atlas.bakeDpr}`)
      console.log('碎片数量:', info.pieceCount, ' 进度:', info.percent + '%', ' 步数:', info.moves)
      console.table(info.pieces)
      if (info.overlapCount > 0) {
        console.warn(`⚠ 检测到 ${info.overlapCount} 对实体重叠:`)
        console.table(info.overlaps)
      } else {
        console.log('%c✓ 无实体重叠', 'color:#22c55e')
      }
      console.groupEnd()
    }
  }, [])

  const toggleRotation = useCallback(() => {
    const next = !rotationOn
    // 中途切换旋转模式会重建拼图（存档依赖角度语义）
    if (isReady && progress > 0) {
      const ok = window.confirm('切换旋转模式将重新开始本局，确定吗？')
      if (!ok) return
    }
    setRotationPref(next)
    setRotationOn(next)
    if (choice) clearSave(puzzleId, choice.nop)
    setPendingSave(null)
    setIsReady(false)
    setTimer(0)
    setProgress(0)
    setMoves(0)
    setSeed((Math.random() * 1e9) | 0)
  }, [rotationOn, isReady, progress, choice, puzzleId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateStars = () => {
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
              <Button onClick={() => router.push('/create')}>去创建拼图</Button>
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
      <header className="bg-card dark:bg-[#13131a] border-b border-border dark:border-white/10 px-4 sm:px-6 py-4">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hidden sm:flex dark:hover:bg-white/10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              {!isCustom && (
                <h1 className="text-lg font-bold text-foreground">{puzzle.title}</h1>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <select
                  value={selectedNop}
                  onChange={(e) => {
                    const nop = Number(e.target.value)
                    const c = choices.find((x) => x.nop === nop)
                    if (c) rebuildWithChoice(c)
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
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-secondary/80 dark:bg-[#0f172a] border border-border/60 dark:border-primary/35 px-4 py-2 rounded-xl shadow-sm dark:shadow-[0_0_0_1px_rgba(96,165,250,0.12)]">
              <Clock className="h-4 w-4 text-primary dark:text-primary" />
              <span className="text-xl font-mono font-extrabold text-foreground dark:text-white tabular-nums tracking-tight dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.18)]">
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

            {/* Control buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="bg-secondary/60 text-foreground border border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10 transition-all"
                title={muted ? '取消静音' : '静音'}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRotation}
                className={cn(
                  'border border-transparent transition-all',
                  rotationOn
                    ? 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30'
                    : 'bg-secondary/60 text-foreground border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10'
                )}
                title={rotationOn ? '关闭旋转模式' : '开启旋转模式（R 键/右键/双击旋转）'}
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

              <Button
                variant="ghost"
                size="icon"
                onClick={runDebug}
                disabled={!isReady}
                className={cn(
                  'border border-transparent transition-all',
                  debugInfo
                    ? 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30'
                    : 'bg-secondary/60 text-foreground border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10'
                )}
                title="调试信息（图片/画布尺寸、碎片位置、重叠检测）"
              >
                <Bug className="h-4 w-4" />
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

        {/* Mobile Progress - Circular */}
        <div className="sm:hidden mt-3 flex items-center justify-center">
          <div className="relative w-10 h-10">
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
              <span className="text-[10px] font-bold text-foreground tabular-nums">{progress}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <div className={cn("flex-1 min-h-0 overflow-hidden", isCustom ? "p-0" : "p-4 sm:p-6")}>
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
                <span className="text-sm font-medium">已暂停 · 点击继续</span>
              </button>
            </div>
          )}

          {/* 调试面板 */}
          {debugInfo && (
            <div className="absolute top-3 left-3 z-[1400] w-[340px] max-w-[calc(100%-24px)] max-h-[calc(100%-24px)] flex flex-col rounded-xl border border-border/60 dark:border-white/15 bg-card/95 dark:bg-[#0f172a]/95 backdrop-blur-md shadow-2xl text-xs">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 dark:border-white/10">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Bug className="w-4 h-4 text-primary" />
                  调试信息
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={runDebug}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="刷新"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDebugInfo(null)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="关闭"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto p-3 space-y-2 font-mono text-[11px] leading-relaxed text-foreground">
                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                  <span className="text-muted-foreground">图片原始</span>
                  <span>{debugInfo.image.naturalWidth} × {debugInfo.image.naturalHeight}</span>
                  <span className="text-muted-foreground">参考图逻辑</span>
                  <span>{debugInfo.image.subjectWidth} × {debugInfo.image.subjectHeight}</span>
                  <span className="text-muted-foreground">参考图物理</span>
                  <span>{debugInfo.image.subjectCanvasWidth} × {debugInfo.image.subjectCanvasHeight}</span>
                  <span className="text-muted-foreground">世界(散布区)</span>
                  <span>{debugInfo.board.worldWidth} × {debugInfo.board.worldHeight}</span>
                  <span className="text-muted-foreground">画布(屏幕)</span>
                  <span>{debugInfo.board.screenWidth} × {debugInfo.board.screenHeight}</span>
                  <span className="text-muted-foreground">视图缩放</span>
                  <span>{debugInfo.board.viewScale}× · DPR {debugInfo.board.devicePixelRatio}</span>
                  <span className="text-muted-foreground">图集</span>
                  <span>{debugInfo.atlas.pages} 页 · bakeDpr {debugInfo.atlas.bakeDpr}</span>
                  <span className="text-muted-foreground">碎片数量</span>
                  <span>
                    {debugInfo.pieceCount}
                    {debugInfo.choice && ` (${debugInfo.choice.rows}×${debugInfo.choice.cols}, size ${debugInfo.choice.size})`}
                  </span>
                  <span className="text-muted-foreground">进度 / 步数</span>
                  <span>{debugInfo.percent}% · {debugInfo.moves} 步</span>
                </div>

                <div
                  className={cn(
                    'px-2 py-1.5 rounded font-sans font-semibold',
                    debugInfo.overlapCount > 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  )}
                >
                  {debugInfo.overlapCount > 0
                    ? `⚠ ${debugInfo.overlapCount} 对碎片重叠`
                    : '✓ 无碎片重叠'}
                </div>

                {debugInfo.overlapCount > 0 && (
                  <div className="space-y-0.5">
                    {debugInfo.overlaps.slice(0, 20).map((o, i) => (
                      <div key={i} className="text-red-600 dark:text-red-400">
                        #{o.a} ↔ #{o.b} · 深度 ({o.depthX}, {o.depthY})px
                      </div>
                    ))}
                    {debugInfo.overlaps.length > 20 && (
                      <div className="text-muted-foreground">…还有 {debugInfo.overlaps.length - 20} 对</div>
                    )}
                  </div>
                )}

                <details className="mt-1">
                  <summary className="cursor-pointer text-muted-foreground font-sans select-none">
                    碎片位置列表（{debugInfo.pieces.length}）
                  </summary>
                  <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-[2rem_3.5rem_3.5rem_2.5rem_2rem] gap-x-1 text-muted-foreground border-b border-border/40 dark:border-white/10 pb-0.5">
                      <span>id</span><span>x</span><span>y</span><span>ang</span><span>grp</span>
                    </div>
                    {debugInfo.pieces.map((p) => (
                      <div
                        key={p.id}
                        className={cn(
                          'grid grid-cols-[2rem_3.5rem_3.5rem_2.5rem_2rem] gap-x-1',
                          debugInfo.overlaps.some((o) => o.a === p.id || o.b === p.id) &&
                            'text-red-600 dark:text-red-400'
                        )}
                      >
                        <span>{p.id}</span>
                        <span>{Math.round(p.x)}</span>
                        <span>{Math.round(p.y)}</span>
                        <span>{p.angle}°</span>
                        <span>{p.groupSize > 1 ? `g${p.group}` : '-'}</span>
                      </div>
                    ))}
                  </div>
                </details>

                <p className="text-muted-foreground font-sans text-[10px] pt-1 border-t border-border/40 dark:border-white/10">
                  完整数据已打印到浏览器控制台（含 console.table）
                </p>
              </div>
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
