'use client'

import Image, { type ImageProps } from 'next/image'
import { useState, type ReactNode } from 'react'
import { canResizeImage } from '@/lib/images/urls'

/**
 * Retry the original URL when the image CDN fails. Show the supplied
 * fallback only if the original also fails; other callers use a fallback photo.
 */
export const IMAGE_FALLBACK_SRC =
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=900&h=700&fit=crop'

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src: string
  fallbackSrc?: string
  fallback?: ReactNode
}

export function SafeImage({
  src,
  fallbackSrc = IMAGE_FALLBACK_SRC,
  fallback,
  alt = '',
  onError,
  unoptimized = false,
  ...rest
}: SafeImageProps) {
  const [failure, setFailure] = useState<{
    src: string
    stage: 'original' | 'fallback'
  } | null>(null)
  const stage = failure?.src === src ? failure.stage : 'optimized'
  if (stage === 'fallback' && fallback !== undefined) return fallback
  const currentSrc = stage === 'fallback' ? fallbackSrc : src
  const bypassOptimization = unoptimized || stage === 'original' || !canResizeImage(currentSrc)

  return (
    <Image
      {...rest}
      alt={alt}
      src={currentSrc}
      unoptimized={bypassOptimization}
      onError={(event) => {
        if (stage !== 'fallback') {
          setFailure({
            src,
            stage: stage === 'optimized' && !bypassOptimization ? 'original' : 'fallback',
          })
        }
        onError?.(event)
      }}
    />
  )
}
