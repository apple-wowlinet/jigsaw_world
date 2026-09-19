import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to JigsawWorld with email or Google to save progress and compete on leaderboards.',
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
