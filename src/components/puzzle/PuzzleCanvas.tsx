'use client'

/**
 * PuzzleCanvas —— PixiJS 拼图游戏的 React 包装
 * - Pixi 通过 useEffect 内 dynamic import 加载（不进 SSR bundle）
 * - StrictMode 双挂载用取消 token 防护
 * - useImperativeHandle 暴露 scatter/preview/rotate/save 等命令
 */
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import type { PieceChoice, PuzzleDebugInfo, SaveGameV6 } from '@/lib/puzzle/core/types'
import type { SubjectData } from '@/lib/puzzle/core/subject'
import type { PuzzleGame } from '@/lib/puzzle/render/pixi-renderer'

export interface PuzzleCanvasHandle {
  scatter: (partial: boolean) => void
  setPreview: (show: boolean) => void
  setPaused: (paused: boolean) => void
  getSave: (elapsed: number) => SaveGameV6 | null
  isComplete: () => boolean
  getMoves: () => number
  getPercent: () => number
  getDebugInfo: () => PuzzleDebugInfo | null
}

export interface PuzzleCanvasProps {
  subject: SubjectData | null
  choice: PieceChoice | null
  seed: number
  rotationEnabled: boolean
  showPreview: boolean
  save?: SaveGameV6 | null
  onProgress?: (pct: number) => void
  onComplete?: () => void
  onMove?: (moves: number) => void
  onDirty?: () => void
  onReady?: () => void
  className?: string
}

export const PuzzleCanvas = forwardRef<PuzzleCanvasHandle, PuzzleCanvasProps>(
  function PuzzleCanvas(props, ref) {
    const mountRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<PuzzleGame | null>(null)
    // 回调通过 ref 透传，避免 effect 依赖回调导致重建游戏
    const cbRef = useRef(props)
    cbRef.current = props

    const { subject, choice, seed, rotationEnabled } = props

    useEffect(() => {
      if (!subject || !choice || !mountRef.current) return
      const mount = mountRef.current
      const token = { cancelled: false }
      let game: PuzzleGame | null = null

      ;(async () => {
        const { createPuzzleGame } = await import(
          '@/lib/puzzle/render/pixi-renderer'
        )
        if (token.cancelled) return
        game = await createPuzzleGame({
          mount,
          subject,
          choice,
          seed,
          rotationEnabled,
          showPreview: cbRef.current.showPreview,
          save: cbRef.current.save ?? null,
          callbacks: {
            onProgress: (pct) => cbRef.current.onProgress?.(pct),
            onComplete: () => cbRef.current.onComplete?.(),
            onMove: (moves) => cbRef.current.onMove?.(moves),
            onDirty: () => cbRef.current.onDirty?.(),
          },
        })
        if (token.cancelled) {
          game.destroy()
          return
        }
        gameRef.current = game
        cbRef.current.onReady?.()
      })()

      const onResize = () => gameRef.current?.resize()
      window.addEventListener('resize', onResize)

      return () => {
        token.cancelled = true
        window.removeEventListener('resize', onResize)
        gameRef.current?.destroy()
        gameRef.current = null
        game = null
      }
      // 仅在拼图内容变化时重建
    }, [subject, choice, seed, rotationEnabled])

    // 预览开关变化即时生效（不重建游戏）
    useEffect(() => {
      gameRef.current?.setPreview(props.showPreview)
    }, [props.showPreview])

    useImperativeHandle(ref, () => ({
      scatter: (partial) => gameRef.current?.scatter(partial),
      setPreview: (show) => gameRef.current?.setPreview(show),
      setPaused: (paused) => gameRef.current?.setPaused(paused),
      getSave: (elapsed) => gameRef.current?.getSave(elapsed) ?? null,
      isComplete: () => gameRef.current?.core.complete ?? false,
      getMoves: () => gameRef.current?.core.moves ?? 0,
      getPercent: () => gameRef.current?.core.percent() ?? 0,
      getDebugInfo: () => gameRef.current?.getDebugInfo() ?? null,
    }))

    return <div ref={mountRef} className={props.className} />
  }
)
