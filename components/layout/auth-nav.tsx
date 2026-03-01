'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { UserMenu } from '@/components/user/user-menu'
import { AuthButtonClient } from '@/components/auth/auth-button-client'
import { Skeleton } from '@/components/ui/loading'

export function AuthNav() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Skeleton className="w-20 h-4" />
  }

  if (user) {
    return <UserMenu />
  }

  return <AuthButtonClient />
}
