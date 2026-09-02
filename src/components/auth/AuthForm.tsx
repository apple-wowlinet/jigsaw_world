'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Loader2, LockKeyhole, Mail, Puzzle, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getSafeRedirectPath } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'register'

interface AuthFormProps {
  mode: AuthMode
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  )
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

  const inputClass =
    'h-12 rounded-lg border-input bg-panel pl-11 text-sm text-foreground transition-all duration-200 hover:border-primary/40 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25 focus-visible:ring-offset-0'

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Gallery-wall backdrop: arched niche + warm light */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)]" />
        <div className="absolute -left-8 top-10 hidden h-[420px] w-[220px] rounded-t-full border border-sand-dark/50 bg-gradient-to-b from-parchment to-transparent lg:block dark:border-[#3b3327] dark:from-[#221d15]" />
        <div className="absolute -right-24 top-24 h-[420px] w-[420px] rounded-full bg-accent-subtle/60 blur-3xl dark:bg-[#3a2517]/40" />
        <div className="absolute -bottom-32 left-1/3 h-[420px] w-[420px] rounded-full bg-primary-subtle/70 blur-3xl dark:bg-[#24312a]/40" />
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center">
        <Link href="/" className="hero-rise mb-8 flex items-center gap-2.5">
          <Puzzle className="h-8 w-8 text-foreground" strokeWidth={1.8} />
          <span className="font-display text-[26px] font-semibold leading-none tracking-tight text-foreground">
            Jigsaw<span className="text-accent">World</span>
          </span>
        </Link>

        <div className="hero-rise hero-d-1 relative w-full overflow-hidden rounded-lg border border-[#e7decb] bg-card shadow-[0_30px_70px_-38px_rgba(80,60,25,0.45)] dark:border-[#3b3327]">
          <div className="h-[3px] bg-gradient-to-r from-primary via-gold to-accent" aria-hidden="true" />

          <div className="p-7 sm:p-8">
            <h1 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.01em] text-foreground">
              {isRegister ? (
                <>
                  Create your <em className="accent-word">account</em>
                </>
              ) : (
                <>
                  <em className="accent-word">Welcome</em> back
                </>
              )}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isRegister
                ? 'Sign up with email or Google to save your puzzle progress.'
                : 'Log in with email or Google to continue playing.'}
            </p>

            <div className="mt-7">
              <button
                type="button"
                className="btn btn-outline btn-md w-full"
                disabled={loadingAction !== null}
                onClick={handleGoogleAuth}
              >
                {loadingAction === 'google' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {isRegister ? 'Sign up with Google' : 'Continue with Google'}
              </button>
            </div>

            <div className="relative my-6" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="label-caps bg-card px-3 text-[10px] text-muted-foreground">or use email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isRegister && (
                <label className="block space-y-1.5">
                  <span className="text-[13px] font-semibold text-foreground">Display name</span>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Puzzle Master"
                      className={inputClass}
                      autoComplete="name"
                      disabled={loadingAction !== null}
                    />
                  </div>
                </label>
              )}

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold text-foreground">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    autoComplete="email"
                    disabled={loadingAction !== null}
                    required
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold text-foreground">Password</span>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className={inputClass}
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
                <div className="rounded-lg border border-primary/30 bg-primary-subtle p-3 text-sm text-success">
                  {message}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg btn-shine w-full" disabled={loadingAction !== null}>
                {loadingAction === 'email' && <Loader2 className="h-4 w-4 animate-spin" />}
                {isRegister ? 'Create account' : 'Log in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isRegister ? 'Already have an account?' : 'New to JigsawWorld?'}{' '}
              <Link
                href={isRegister ? `/login?next=${encodeURIComponent(nextPath)}` : `/register?next=${encodeURIComponent(nextPath)}`}
                className="font-bold text-accent hover:text-accent/80 hover:underline"
              >
                {isRegister ? 'Log in' : 'Create an account'}
              </Link>
            </p>
          </div>
        </div>

        <p className="hero-rise hero-d-2 mt-6 text-center text-xs text-muted-foreground">
          Just here to play?{' '}
          <Link href="/categories" className="font-bold text-foreground hover:text-accent">
            Browse puzzles as guest
          </Link>{' '}
          — no account needed.
        </p>
      </div>
    </div>
  )
}
