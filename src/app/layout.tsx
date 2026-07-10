import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/navigation/Header'
import { ConditionalFooter } from '@/components/navigation/ConditionalFooter'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JigsawWorld - Online Jigsaw Puzzle Games',
  description: 'Play beautiful jigsaw puzzles online. Challenge yourself with daily puzzles, explore categories, and compete with other players.',
  keywords: 'jigsaw puzzles, online puzzles, daily puzzles, puzzle games, brain games',
  authors: [{ name: 'JigsawWorld' }],
  openGraph: {
    title: 'JigsawWorld - Online Jigsaw Puzzle Games',
    description: 'Play beautiful jigsaw puzzles online. Challenge yourself with daily puzzles, explore categories, and compete with other players.',
    type: 'website',
    locale: 'en_US',
    siteName: 'JigsawWorld',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JigsawWorld - Online Jigsaw Puzzle Games',
    description: 'Play beautiful jigsaw puzzles online. Challenge yourself with daily puzzles, explore categories, and compete with other players.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <ConditionalFooter />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
