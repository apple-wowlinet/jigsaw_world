import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest, NextResponse } from 'next/server'
import { getSafeRedirectPath } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function loginErrorResponse(request: NextRequest, message: string, nextPath: string) {
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('error', message)

  if (nextPath !== '/') {
    loginUrl.searchParams.set('next', nextPath)
  }

  return NextResponse.redirect(loginUrl)
}

export async function GET(request: NextRequest) {
  const nextPath = getSafeRedirectPath(request.nextUrl.searchParams.get('next'))
  const providerError =
    request.nextUrl.searchParams.get('error_description')
    || request.nextUrl.searchParams.get('error')
  const code = request.nextUrl.searchParams.get('code')

  if (providerError) {
    return loginErrorResponse(request, providerError, nextPath)
  }

  if (!code) {
    return loginErrorResponse(
      request,
      'The authentication callback did not include an authorization code. Please try again.',
      nextPath
    )
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return loginErrorResponse(
      request,
      'Authentication is not configured for this deployment.',
      nextPath
    )
  }

  const destination = new URL(nextPath, request.url)
  const response = NextResponse.redirect(destination)
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return loginErrorResponse(request, error.message, nextPath)
  }

  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
