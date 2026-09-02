'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

/**
 * next/image wrapper with a graceful fallback: DB-driven image URLs can go
 * stale (404), which would render a broken image. On load error we swap to
 * a verified fallback photo once, and never loop if the fallback fails too.
 */
export const IMAGE_FALLBACK_SRC =
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=900&h=700&fit=crop'

type SafeImageProps = Omit<ImageProps, 'src' | 'onError'> & {
  src: string
  fallbackSrc?: string
}

export function SafeImage({
  src,
  fallbackSrc = IMAGE_FALLBACK_SRC,
  alt = '',
  ...rest
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <Image
      {...rest}
      alt={alt}
      src={currentSrc}
      onError={() => {
        setCurrentSrc((prev) => (prev === fallbackSrc ? prev : fallbackSrc))
      }}
    />
  )
}
