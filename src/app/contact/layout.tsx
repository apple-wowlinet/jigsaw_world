import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata(
  'Contact Us – Puzzle Support and Feedback',
  'Contact JigsawWorld with puzzle questions, support requests, or suggestions. Send a message through our contact form or reach the team directly by email.',
  '/contact'
)

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
