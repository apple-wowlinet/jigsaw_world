'use client'

import type { ImageLoaderProps } from 'next/image'
import { getResizedImageUrl } from './urls'

export default function cloudflareLoader(props: ImageLoaderProps): string {
  return getResizedImageUrl(props)
}
