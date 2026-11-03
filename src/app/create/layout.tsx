import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...createPageMetadata(
    'Create a Jigsaw Puzzle from Your Photo',
    'Turn your own photo into a playable jigsaw puzzle on JigsawWorld. Upload an image or paste an image URL, preview your picture, and start assembling.',
    '/create'
  ),
  robots: { index: false, follow: true },
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
