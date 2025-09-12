import { createClient } from '@/lib/supabase/server'
import { UserMenu } from '@/components/user/user-menu'
import { AuthButtonClient } from '@/components/auth-button-client'

export async function AuthNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return <UserMenu />
  }

  return <AuthButtonClient />
}
