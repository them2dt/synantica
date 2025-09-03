import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for browser-side operations
 * This client is used for client-side authentication and data operations
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
