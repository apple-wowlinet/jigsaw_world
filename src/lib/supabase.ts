import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Browser auth uses the SSR helper's cookie storage so the PKCE verifier and
// the resulting session are available to the OAuth callback. Public data also
// runs during server rendering, where an anonymous non-persistent client is
// sufficient and avoids touching browser-only cookie APIs.
export const supabase = typeof window === 'undefined'
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    })
  : createBrowserClient(supabaseUrl, supabaseAnonKey)
