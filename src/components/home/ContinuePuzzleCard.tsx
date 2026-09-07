'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Puzzle } from 'lucide-react'
import { SafeImage } from '@/components/ui/SafeImage'
import { fetchPuzzleBySlug } from '@/lib/data/public'
import { getImage } from '@/lib/puzzle/storage/image-store'
import {
  listPuzzleSaves,
  type PuzzleSaveSummary,
} from '@/lib/puzzle/storage/save-store'

interface ContinuePuzzleData extends PuzzleSaveSummary {
  title: string
  imageUrl: string
  href: string
  isCustom: boolean
}

export function ContinuePuzzleCard() {
  const [puzzle, setPuzzle] = useState<ContinuePuzzleData | null>(null)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    const resolveLatestSave = async () => {
      for (const save of listPuzzleSaves()) {
        if (save.puzzleId.startsWith('idb:')) {
          const imageKey = save.puzzleId.slice(4)
          const storedImage = await getImage(imageKey)
          if (!storedImage) continue

          objectUrl = URL.createObjectURL(storedImage.blob)
          if (!cancelled) {
            setPuzzle({
              ...save,
              title: storedImage.name || 'My Puzzle',
              imageUrl: objectUrl,
              href: `/play/custom?img=${encodeURIComponent(imageKey)}&pieces=${save.nop}`,
              isCustom: true,
            })
          }
          return
        }

        const publicPuzzle = await fetchPuzzleBySlug(save.puzzleId)
        if (!publicPuzzle) continue

        if (!cancelled) {
          setPuzzle({
            ...save,
            title: publicPuzzle.title,
            imageUrl: publicPuzzle.image_url,
            href: `/play/${encodeURIComponent(save.puzzleId)}?pieces=${save.nop}`,
            isCustom: false,
          })
        }
        return
      }

      if (!cancelled) setPuzzle(null)
    }

    void resolveLatestSave()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  if (!puzzle) return null

  return (
    <div className="mt-10 flex flex-col items-start gap-5 border border-[#e7decb] bg-card px-6 py-5 shadow-[0_18px_45px_-32px_rgba(80,60,25,0.5)] sm:px-8 lg:flex-row lg:items-center lg:gap-10 dark:border-[#3b3327]">
      <div className="flex items-center gap-4 lg:w-[250px]">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#d8cbb0] bg-panel dark:border-[#3b3327] dark:bg-[#241f17]">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
            <Puzzle className="h-5 w-5" />
          </div>
        </div>
        <p className="label-caps leading-5 text-foreground">
          Continue Your
          <br />
          Puzzle
        </p>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-5">
        <div className="relative h-[68px] w-[132px] shrink-0 overflow-hidden rounded-md">
          <SafeImage
            src={puzzle.imageUrl}
            alt={puzzle.title}
            fill
            sizes="132px"
            unoptimized={puzzle.isCustom}
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display truncate text-[22px] font-semibold leading-tight text-foreground">
            {puzzle.title}
          </h3>
          <div className="mt-2.5 flex items-center gap-4">
            <div className="h-[7px] max-w-[340px] flex-1 overflow-hidden rounded-full bg-[#e5dcc6] dark:bg-[#332c20]">
              <div
                className="h-full rounded-full bg-[#4a7259]"
                style={{ width: `${puzzle.progressPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-semibold text-muted-foreground">
              {puzzle.connectedPieces} / {puzzle.totalPieces} pieces
            </span>
          </div>
        </div>
        <span className="hidden shrink-0 text-sm font-semibold text-muted-foreground sm:block">
          {puzzle.progressPercent}%
        </span>
      </div>

      <Link href={puzzle.href} className="btn btn-primary btn-md shrink-0">
        Continue Puzzle
      </Link>
    </div>
  )
}
