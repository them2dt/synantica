import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser-side usage
 * 
 * This client is configured for browser environments and includes
 * proper session management and cookie handling.
 * 
 * @returns {SupabaseClient} Configured Supabase client for browser use
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  )
}
