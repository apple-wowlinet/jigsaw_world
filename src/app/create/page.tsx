'use client'

/**
 * /create —— 上传图片即玩
 * 拖拽 / 文件选择 / URL 输入 → 客户端降采样（≤2048px）→ IndexedDB → /play/custom?img=<key>
 */
import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Link2, Loader2, Play, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { putImage } from '@/lib/puzzle/storage/image-store'

const MAX_SIDE = 2048

interface Preview {
  blob: Blob
  url: string
  name: string
  w: number
  h: number
}

/** 降采样到最长边 ≤ MAX_SIDE，EXIF 方向由 createImageBitmap 处理 */
async function normalizeImage(blob: Blob, name: string): Promise<Preview> {
  const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' })
  let { width: w, height: h } = bmp
  if (Math.max(w, h) > MAX_SIDE) {
    const k = MAX_SIDE / Math.max(w, h)
    w = Math.round(w * k)
    h = Math.round(h * k)
  }
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, 0, 0, w, h)
  bmp.close()
  const out = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('encode failed'))),
      'image/jpeg',
      0.92
    )
  )
  return { blob: out, url: URL.createObjectURL(out), name, w, h }
}

export default function CreatePuzzlePage() {
  const router = useRouter()
  const [preview, setPreview] = useState<Preview | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlValue, setUrlValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptBlob = useCallback(async (blob: Blob, name: string) => {
    setError(null)
    setBusy(true)
    try {
      if (!blob.type.startsWith('image/')) throw new Error('not-image')
      const p = await normalizeImage(blob, name)
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old.url)
        return p
      })
    } catch {
      setError("Couldn't read this image. Please try another one.")
    } finally {
      setBusy(false)
    }
  }, [])

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (file) void acceptBlob(file, file.name)
    },
    [acceptBlob]
  )

  const handleUrl = useCallback(async () => {
    const url = urlValue.trim()
    if (!url) return
    setError(null)
    setBusy(true)
    try {
      const res = await fetch(url, { mode: 'cors' })
      if (!res.ok) throw new Error('http ' + res.status)
      const blob = await res.blob()
      await acceptBlob(blob, url.split('/').pop() || 'image')
    } catch {
      setError(
        'Could not load the image from this URL (it may be blocked by CORS). Try saving the image locally and uploading it instead.'
      )
      setBusy(false)
    }
  }, [urlValue, acceptBlob])

  const startPuzzle = useCallback(async () => {
    if (!preview) return
    setBusy(true)
    try {
      const key = await putImage(preview.blob, preview.name, preview.w, preview.h)
      router.push(`/play/custom?img=${encodeURIComponent(key)}`)
    } catch {
      setError('Failed to save the image (browser storage may be full).')
      setBusy(false)
    }
  }, [preview, router])

  return (
    <div className="min-h-screen bg-muted dark:bg-[#08080c] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Puzzle</h1>
          <p className="text-muted-foreground">
            Upload an image or paste an image URL to start puzzling instantly
          </p>
        </div>

        <Card className="dark:bg-[#13131a] dark:border-white/10">
          <CardContent className="pt-6 space-y-5">
            {/* 拖拽/点击上传区 */}
            {!preview && (
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  handleFile(e.dataTransfer.files?.[0])
                }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-16 cursor-pointer transition-colors',
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border dark:border-white/15 hover:border-primary/60 hover:bg-secondary/40 dark:hover:bg-white/5'
                )}
              >
                {busy ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-muted-foreground" />
                )}
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    Drag an image here, or click to choose a file
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports JPG / PNG / WebP — the long edge is auto-resized to 2048px
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleFile(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
              </div>
            )}

            {/* 预览 */}
            {preview && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full max-h-[420px] object-contain"
                  />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(preview.url)
                      setPreview(null)
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="truncate max-w-[60%]">{preview.name}</span>
                  <span>
                    {preview.w} × {preview.h}
                  </span>
                </div>
                <Button
                  onClick={startPuzzle}
                  disabled={busy}
                  className="w-full btn-shine shadow-md shadow-primary/20"
                  size="lg"
                >
                  {busy ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 mr-2" />
                  )}
                  Start Puzzle
                </Button>
              </div>
            )}

            {/* URL 输入 */}
            {!preview && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Link2 className="w-4 h-4" />
                  Or import from an image URL
                </div>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void handleUrl()
                    }}
                  />
                  <Button
                    onClick={handleUrl}
                    variant="outline"
                    disabled={busy || !urlValue.trim()}
                    className="shrink-0"
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive dark:text-red-400">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-[#13131a] dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-base">Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1.5">
            <p>· Images are stored only in your browser (IndexedDB) and never uploaded to a server</p>
            <p>· Progress is saved automatically — close the page and pick up where you left off</p>
            <p>· With rotation mode on: press R / right-click / double-click to rotate pieces</p>
            <p>· Scroll or pinch to zoom the canvas, drag empty space to pan</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
