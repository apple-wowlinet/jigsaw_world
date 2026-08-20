'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

/**
 * Renders the Footer except on full-screen app pages where vertical space
 * matters (e.g. the puzzle game). The conditional lives in a client
 * component because usePathname is client-only.
 */
export function ConditionalFooter() {
  const pathname = usePathname()
  // The home page is a self-contained game lobby, while play pages need
  // every available pixel for the puzzle board.
  if (pathname === '/' || pathname?.startsWith('/play')) return null
  return <Footer />
}
