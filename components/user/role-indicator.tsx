'use client'

import { Badge } from '@/components/ui/badge'
import { useUser } from '@/lib/auth/user-context'
import { getRoleDisplayName } from '@/lib/auth/roles'
import { Shield, User } from 'lucide-react'

/**
 * User role indicator component
 * Shows the current user's role with appropriate styling
 */
export function RoleIndicator() {
  const { user, loading } = useUser()

  if (loading || !user) {
    return null
  }

  const isAdmin = user.role === 'admin'
  const roleIcon = isAdmin ? Shield : User
  const Icon = roleIcon

  return (
    <Badge 
      variant={isAdmin ? "default" : "secondary"} 
      className="gap-1 text-xs"
    >
      <Icon className="w-3 h-3" />
      {getRoleDisplayName(user.role)}
    </Badge>
  )
}
