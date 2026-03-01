import { getCurrentUser } from '@/lib/firebase/server'
import { UserMenu } from '@/components/user/user-menu'
import { AuthButtonClient } from '@/components/auth-button-client'

export async function AuthNav() {
  const user = await getCurrentUser()

  if (user) {
    return <UserMenu />
  }

  return <AuthButtonClient />
}
