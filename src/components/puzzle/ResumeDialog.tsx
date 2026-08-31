'use client'

/**
 * ResumeDialog —— 检测到本地存档时的「继续 / 重新开始」选择卡片
 */
import { History, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Utils } from '@/lib/puzzle/core/utils'

export interface ResumeDialogProps {
  elapsed: number
  moves: number
  nop: number
  onResume: () => void
  onRestart: () => void
}

export function ResumeDialog({ elapsed, moves, nop, onResume, onRestart }: ResumeDialogProps) {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1500]">
      <Card className="max-w-sm w-full mx-4 border-0 shadow-2xl animate-fade-in dark:bg-card dark:border dark:border-white/10">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <History className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Unfinished Puzzle Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-5">
          <p className="text-sm text-muted-foreground">
            {nop} pieces · {Utils.fmtTime(elapsed)} elapsed · {moves} moves
          </p>
          <div className="flex gap-3">
            <Button onClick={onRestart} variant="outline" className="flex-1 dark:bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
            <Button onClick={onResume} className="flex-1">
              Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
