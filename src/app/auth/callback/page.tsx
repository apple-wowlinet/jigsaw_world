import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthCallback } from '@/components/auth/AuthCallback'

export const metadata: Metadata = {
  title: 'Signing In',
  robots: 'noindex, nofollow',
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallback />
    </Suspense>
  )
}
