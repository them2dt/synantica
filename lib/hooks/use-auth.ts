import { useAuth as useAuthContext } from '@/lib/auth/auth-context'

/**
 * Custom hook for authentication
 * Re-exports the auth context hook with better naming
 */
export function useAuth() {
  return useAuthContext()
}

/**
 * Custom hook to check if user is authenticated
 * Returns boolean indicating authentication status
 */
export function useIsAuthenticated() {
  const { user, loading } = useAuth()
  return { isAuthenticated: !!user, loading }
}

/**
 * Custom hook to get user display information
 * Returns formatted user data for display
 */
export function useUserDisplay() {
  const { user } = useAuth()

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    const name = user.user_metadata?.full_name || user.email.split('@')[0]
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
  }

  const getUserEmail = () => {
    return user?.email || ''
  }

  const isEmailVerified = () => {
    return !!user?.email_confirmed_at
  }

  return {
    user,
    initials: getUserInitials(),
    displayName: getUserDisplayName(),
    email: getUserEmail(),
    isEmailVerified: isEmailVerified(),
  }
}
