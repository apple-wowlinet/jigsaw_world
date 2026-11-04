import type { ImageLoaderProps } from 'next/image'

export const IMAGE_SOURCE_HOSTS = ['images.unsplash.com', 'img.spotdiffs.com']

export function isAllowedImageSource(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && IMAGE_SOURCE_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

export function canResizeImage(
  src: string,
  origin = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_ORIGIN
): boolean {
  return Boolean(origin) && isAllowedImageSource(src)
}

export function getResizedImageUrl(
  { src, width, quality = 75 }: ImageLoaderProps,
  origin = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_ORIGIN
): string {
  // Local assets, uploaded blobs and data URLs stay local. Missing configuration
  // serves originals instead of falling back to Vercel's exhausted optimizer.
  if (!canResizeImage(src, origin) || !origin) return src
  const base = new URL(origin)
  if (base.protocol !== 'https:' || base.username || base.password
    || base.pathname !== '/' || base.search || base.hash || base.port) {
    throw new Error('NEXT_PUBLIC_CLOUDFLARE_IMAGE_ORIGIN must be an HTTPS origin without a path.')
  }
  const w = Math.max(1, Math.min(3840, Math.round(width)))
  const q = Math.max(1, Math.min(100, Math.round(quality)))
  return `${base.origin}/cdn-cgi/image/width=${w},quality=${q},fit=scale-down,format=auto/${src}`
}

export function getCanvasImageUrl(src: string): string {
  return `/api/puzzle-image?${new URLSearchParams({ url: src })}`
}
