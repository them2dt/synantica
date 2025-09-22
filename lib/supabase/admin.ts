import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client with service role key for elevated permissions
 * 
 * This client bypasses Row Level Security (RLS) policies and has full database access.
 * It should ONLY be used in server-side admin operations and never exposed to the client.
 * 
 * @returns {SupabaseClient} Configured Supabase client with service role permissions
 * @throws {Error} When required environment variables are missing
 * 
 * @example
 * ```typescript
 * // In an API route
 * const adminSupabase = createAdminClient()
 * const { data: events } = await adminSupabase
 *   .from('events')
 *   .select('*')
 * ```
 * 
 * @security
 * - Uses service role key for elevated permissions
 * - Bypasses RLS policies
 * - Should only be used server-side
 * - Never expose service role key to client
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
