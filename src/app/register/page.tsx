import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Create an Account',
  description: 'Create a JigsawWorld account with email or Google to save progress and join leaderboards.',
  robots: { index: false, follow: true },
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="register" />
    </Suspense>
  )
}
