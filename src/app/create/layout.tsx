import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create a Jigsaw Puzzle',
  robots: { index: false, follow: true },
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
