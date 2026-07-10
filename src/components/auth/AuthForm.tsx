'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Loader2, LockKeyhole, Mail, Puzzle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getSafeRedirectPath } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type AuthMode = 'login' | 'register'

interface AuthFormProps {
  mode: AuthMode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<'email' | 'google' | null>(null)

  const isRegister = mode === 'register'
  const nextPath = useMemo(() => {
    return getSafeRedirectPath(searchParams.get('next'))
  }, [searchParams])

  const resetFeedback = () => {
    setError(null)
    setMessage(null)
  }

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetFeedback()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      setError('Please enter your email and password.')
      return
    }

    if (isRegister && password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoadingAction('email')

    try {
      if (isRegister) {
        const displayName = username.trim() || normalizedEmail.split('@')[0]
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              username: displayName,
              full_name: displayName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        })

        if (signUpError) {
          throw signUpError
        }

        if (data.session) {
          router.replace(nextPath)
          router.refresh()
          return
        }

        setMessage('Registration successful. Please check your email to confirm your account before signing in.')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (signInError) {
        throw signInError
      }

      router.replace(nextPath)
      router.refresh()
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed. Please try again.')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleGoogleAuth = async () => {
    resetFeedback()
    setLoadingAction('google')

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setLoadingAction(null)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-hero px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Puzzle className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JigsawWorld
          </span>
        </Link>

        <Card className="w-full border-border/80 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? 'Sign up with email or Google to save your puzzle progress.'
                : 'Log in with email or Google to continue playing.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-2 dark:bg-transparent"
              disabled={loadingAction !== null}
              onClick={handleGoogleAuth}
            >
              {loadingAction === 'google' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs font-bold text-primary">
                  G
                </span>
              )}
              {isRegister ? 'Sign up with Google' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or use email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isRegister && (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Display name</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Puzzle Master"
                      className="pl-10"
                      autoComplete="name"
                      disabled={loadingAction !== null}
                    />
                  </div>
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    autoComplete="email"
                    disabled={loadingAction !== null}
                    required
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Password</span>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className="pl-10"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    disabled={loadingAction !== null}
                    required
                    minLength={isRegister ? 6 : undefined}
                  />
                </div>
              </label>

              {error && (
                <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="rounded-lg border border-success/30 bg-success-subtle p-3 text-sm text-success">
                  {message}
                </div>
              )}

              <Button type="submit" className="h-11 w-full btn-shine" disabled={loadingAction !== null}>
                {loadingAction === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isRegister ? 'Create account' : 'Log in'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isRegister ? 'Already have an account?' : 'New to JigsawWorld?'}{' '}
              <Link href={isRegister ? `/login?next=${encodeURIComponent(nextPath)}` : `/register?next=${encodeURIComponent(nextPath)}`} className="font-medium text-primary hover:underline">
                {isRegister ? 'Log in' : 'Create an account'}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
