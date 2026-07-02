'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react'
import { Play, Pause, RotateCcw, Clock, Home, Shuffle, Eye, EyeOff, ChevronLeft, Trophy, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Puzzle as PuzzleEngine, Subject, Utils, computeChoices, type PieceChoice, type SubjectData } from '@/lib/jigsaw-engine'

// Module-level mutable holders populated by the component so the render loop
// (also module-level) can read latest values without re-creation.
const loopRefs = {
  puzzle: null as PuzzleEngine | null,
  rafId: null as number | null,
}

// Stable self-scheduling render loop. Reads puzzle + rafId from loopRefs.
function gameLoop() {
  if (loopRefs.puzzle) loopRefs.puzzle.render()
  loopRefs.rafId = requestAnimationFrame(gameLoop)
}

interface PuzzleGame {
  id: string
  title: string
  image_url: string
  piece_count: number
  difficulty: 'easy' | 'medium' | 'hard'
}

// Mock puzzle catalog (keyed by slug). Will be replaced by Supabase fetching later.
const PUZZLES: Record<string, PuzzleGame> = {
  '1': {
    id: '1',
    title: 'Mountain Landscape',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    piece_count: 0,
    difficulty: 'easy',
  },
  '2': {
    id: '2',
    title: 'Ocean Sunset',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    piece_count: 0,
    difficulty: 'easy',
  },
  '3': {
    id: '3',
    title: 'Forest Path',
    image_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
    piece_count: 0,
    difficulty: 'medium',
  },
  '4': {
    id: '4',
    title: 'City Lights',
    image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
    piece_count: 0,
    difficulty: 'hard',
  },
}

function PlayPuzzleContent() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [progress, setProgress] = useState(0)
  const [moves, setMoves] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const [pieceCount, setPieceCount] = useState(0)
  const [choices, setChoices] = useState<PieceChoice[]>([])
  const [selectedNop, setSelectedNop] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const puzzleRef = useRef<PuzzleEngine | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const choiceRef = useRef<PieceChoice | null>(null)
  const dprRef = useRef(1)
  const boardRef = useRef({ w: 0, h: 0 })
  // raf id tracked in loopRefs.rafId (no separate ref needed)
  const pointerIdRef = useRef<number | null>(null)
  const timerStartRef = useRef(0)
  const timerLockedRef = useRef(0)
  const timerRunningRef = useRef(false)

  // Derive puzzle from slug (pure, no setState in effect)
  const puzzle = useMemo<PuzzleGame>(
    () => PUZZLES[slug] || PUZZLES['1'],
    [slug]
  )

  // Compute board size from wrapper
  const computeBoardSize = useCallback(() => {
    const wrap = canvasWrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const w = rect.width || window.innerWidth
    const h = rect.height || window.innerHeight - 52
    boardRef.current = {
      w: Math.max(320, Math.floor(w)),
      h: Math.max(240, Math.floor(h)),
    }
  }, [])

  // Resize canvas backing store
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    dprRef.current = dpr
    canvas.width = boardRef.current.w * dpr
    canvas.height = boardRef.current.h * dpr
    canvas.style.width = boardRef.current.w + 'px'
    canvas.style.height = boardRef.current.h + 'px'
    const ctx = canvas.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
  }, [])

  // Build a fresh puzzle from the loaded image + an optional forced choice
  const buildPuzzle = useCallback((forceChoice?: PieceChoice) => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')!

    computeBoardSize()
    resizeCanvas()

    const subject: SubjectData = Subject.create(img, boardRef.current.w, boardRef.current.h)
    const computedChoices = computeChoices(subject)
    setChoices(computedChoices)
    // Default to the fewest pieces; respect a user-selected choice if provided
    const choice: PieceChoice = forceChoice ?? computedChoices[0]
    choiceRef.current = choice

    const pz = new PuzzleEngine(ctx, boardRef.current.w, boardRef.current.h)
    pz.onComplete = () => {
      setIsCompleted(true)
      setIsPlaying(false)
      timerRunningRef.current = false
      setProgress(100)
    }
    pz.onProgress = (pct) => {
      setProgress(pct)
      if (pz) setMoves(pz.moves)
    }
    pz.init(subject, choice, (Math.random() * 1e9) | 0)
    puzzleRef.current = pz
    loopRefs.puzzle = pz

    setPieceCount(choice.nop)
    setSelectedNop(choice.nop)
    setProgress(0)
    setMoves(0)
    setIsReady(true)

    // Auto-start the game (no manual Start overlay)
    timerStartRef.current = performance.now()
    timerLockedRef.current = 0
    timerRunningRef.current = true
    setIsPlaying(true)
    setIsCompleted(false)
    if (loopRefs.rafId == null) loopRefs.rafId = requestAnimationFrame(loopRef.current)
  }, [computeBoardSize, resizeCanvas])

  // Rebuild with a user-selected piece count (resets game state + timer)
  const rebuildWithChoice = useCallback((choice: PieceChoice) => {
    timerRunningRef.current = false
    timerStartRef.current = 0
    timerLockedRef.current = 0
    setIsPlaying(false)
    setIsCompleted(false)
    setTimer(0)
    buildPuzzle(choice)
  }, [buildPuzzle])

  // Once puzzle metadata is loaded, fetch the image and build the puzzle
  useEffect(() => {
    if (!puzzle) return
    let cancelled = false
    Utils.loadImage(puzzle.image_url)
      .then((img) => {
        if (cancelled) return
        imgRef.current = img
        buildPuzzle()
      })
      .catch(() => {
        // ignore load failure; UI shows loading
      })
    return () => {
      cancelled = true
    }
  }, [puzzle, buildPuzzle])

  // Timer
  const updateClock = useCallback(() => {
    if (!timerRunningRef.current) return
    const sec = Math.round(
      (timerLockedRef.current + (performance.now() - timerStartRef.current)) / 1000
    )
    setTimer(sec)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(updateClock, 500)
    return () => clearInterval(id)
  }, [isPlaying, updateClock])

  // Render loop is a stable module-level function (reads state from loopRefs).
  // loopRefs.puzzle is kept in sync inside buildPuzzle (an effect/callback),
  // not during render, to satisfy react-hooks/immutability.
  const loopRef = useRef(gameLoop)

  // Pointer handling
  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const r = canvas.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pz = puzzleRef.current
    if (!pz || !isPlaying || isCompleted) return
    canvasRef.current!.setPointerCapture(e.pointerId)
    pointerIdRef.current = e.pointerId
    pz.pointerDown(getPoint(e))
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pz = puzzleRef.current
    if (!pz || !isPlaying) return
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return
    pz.pointerMove(getPoint(e))
  }

  const handlePointerUp = () => {
    const pz = puzzleRef.current
    if (!pz) return
    pointerIdRef.current = null
    pz.pointerUp()
    setMoves(pz.moves)
  }

  // Game control
  const startGame = () => {
    timerStartRef.current = performance.now()
    timerLockedRef.current = 0
    timerRunningRef.current = true
    setIsPlaying(true)
    setIsCompleted(false)
    if (loopRefs.rafId == null) loopRefs.rafId = requestAnimationFrame(loopRef.current)
  }

  const pauseGame = () => {
    timerLockedRef.current += performance.now() - timerStartRef.current
    timerRunningRef.current = false
    setIsPlaying(false)
  }

  const resetGame = () => {
    setIsPlaying(false)
    setIsCompleted(false)
    timerRunningRef.current = false
    timerStartRef.current = 0
    timerLockedRef.current = 0
    setTimer(0)
    setProgress(0)
    setMoves(0)
    buildPuzzle()
  }

  const scatterPieces = () => {
    const pz = puzzleRef.current
    if (!pz || pz.complete) return
    pz.scatter()
  }

  const togglePreview = () => {
    const pz = puzzleRef.current
    if (!pz) return
    pz.showPreview = !pz.showPreview
    setShowPreview(pz.showPreview)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loopRefs.rafId != null) cancelAnimationFrame(loopRefs.rafId)
    }
  }, [])

  // Responsive resize
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const onResize = () => {
      const pz = puzzleRef.current
      if (!pz) return
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        computeBoardSize()
        resizeCanvas()
        pz.W = boardRef.current.w
        pz.H = boardRef.current.h
        for (const g of pz.uniqueGroups()) pz.keepInBounds(g)
      }, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [computeBoardSize, resizeCanvas])

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

  if (!puzzle) {
    return (
      <div className="min-h-screen bg-muted dark:bg-[#08080c] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted dark:bg-[#08080c] flex flex-col">
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
              <h1 className="text-lg font-bold text-foreground">{puzzle.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <select
                  value={selectedNop}
                  onChange={(e) => {
                    const nop = Number(e.target.value)
                    const choice = choices.find((c) => c.nop === nop)
                    if (choice) rebuildWithChoice(choice)
                  }}
                  className="bg-secondary/60 dark:bg-[#0f172a] border border-border/60 dark:border-primary/35 rounded-lg pl-2.5 pr-1 py-1 shadow-sm dark:shadow-[0_0_0_1px_rgba(96,165,250,0.12)] text-sm font-semibold text-foreground dark:text-white dark:[&>option]:bg-[#0f172a] dark:[&>option]:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer hover:bg-white/40 dark:hover:bg-primary/10 transition-colors"
                  aria-label="Select piece count"
                >
                  {choices.length === 0 && (
                    <option value={0}>{pieceCount || puzzle.piece_count} pieces</option>
                  )}
                  {choices.map((c) => (
                    <option key={c.nop} value={c.nop}>
                      {c.nop} pieces ({c.rows}×{c.cols})
                    </option>
                  ))}
                </select>
                <span className="hidden sm:inline">•</span>
                <span className={cn(
                  "hidden sm:inline px-2 py-0.5 rounded text-xs font-medium",
                  puzzle.difficulty === 'easy' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  puzzle.difficulty === 'medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                  puzzle.difficulty === 'hard' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {puzzle.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-secondary/80 dark:bg-[#0f172a] border border-border/60 dark:border-primary/35 px-4 py-2 rounded-xl shadow-sm dark:shadow-[0_0_0_1px_rgba(96,165,250,0.12)]">
              <Clock className="h-4 w-4 text-primary dark:text-primary" />
              <span className="text-xl font-mono font-extrabold text-foreground dark:text-white tabular-nums tracking-tight dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.18)]">{formatTime(timer)}</span>
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
                onClick={togglePreview}
                className={cn(
                  "border border-transparent transition-all",
                  showPreview
                    ? "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30"
                    : "bg-secondary/60 text-foreground border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10"
                )}
                title="Toggle reference image"
              >
                {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={scatterPieces}
                className="bg-secondary/60 text-foreground border border-border/60 dark:bg-white/[0.06] dark:text-white dark:border-white/10 hover:bg-secondary dark:hover:bg-white/10 transition-all"
                title="Scatter unsolved pieces"
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              {!isPlaying ? (
                <Button onClick={startGame} size="sm" className="btn-shine shadow-md shadow-primary/20 dark:shadow-primary/30">
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={pauseGame}
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
      <div className="flex-1 p-4 sm:p-6 overflow-hidden">
        <div
          ref={canvasWrapRef}
          className="relative w-full h-[calc(100vh-180px)] min-h-[500px] bg-card dark:bg-[#13131a] rounded-2xl shadow-lg overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="block w-full h-full touch-none"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* Loading overlay until engine ready */}
          {!isReady && (
            <div className="absolute inset-0 bg-card/80 dark:bg-[#13131a]/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Preparing puzzle...</p>
              </div>
            </div>
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
                            "w-8 h-8 transition-all",
                            i < calculateStars()
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 dark:text-gray-600"
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
                    <Button onClick={resetGame} variant="outline" className="flex-1 dark:bg-transparent">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                    <Button onClick={() => router.push('/')} className="flex-1">
                      <Home className="w-4 h-4 mr-2" />
                      Home
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
    <Suspense fallback={
      <div className="min-h-screen bg-muted dark:bg-[#08080c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <PlayPuzzleContent />
    </Suspense>
  )
}
