'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getSafeRedirectPath } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasHandledCallback = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasHandledCallback.current) {
      return
    }

    hasHandledCallback.current = true

    const finishAuth = async () => {
      const safeNext = getSafeRedirectPath(searchParams.get('next'))
      const authError = searchParams.get('error_description') || searchParams.get('error')
      const code = searchParams.get('code')

      if (authError) {
        setError(authError)
        return
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          setError(exchangeError.message)
          return
        }
      } else {
        const { data } = await supabase.auth.getSession()

        if (!data.session) {
          setError('No active session was found. Please try signing in again.')
          return
        }
      }

      router.replace(safeNext)
      router.refresh()
    }

    finishAuth()
  }, [router, searchParams])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-hero px-4 py-16">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-border bg-card/95 p-8 text-center shadow-xl backdrop-blur">
        {error ? (
          <>
            <h1 className="text-2xl font-semibold">Authentication failed</h1>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h1 className="mt-4 text-2xl font-semibold">Signing you in</h1>
            <p className="mt-3 text-sm text-muted-foreground">Please wait while we complete your secure Supabase session.</p>
          </>
        )}
      </div>
    </div>
  )
}
