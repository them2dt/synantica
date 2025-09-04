'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, hasPermission } from './roles'
import { getUserProfileClient } from '@/lib/database/users-client'

/**
 * User context interface
 */
interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

/**
 * Create user context
 */
const UserContext = createContext<UserContextType | undefined>(undefined)

/**
 * User provider component
 * Manages user state and authentication
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  /**
   * Fetch user data from Supabase
   */
  const fetchUser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Fetch user profile from database
        const userProfile = await getUserProfileClient(authUser.id)
        
        if (userProfile) {
          setUser(userProfile)
        } else {
          // If no profile exists, create a default student profile
          const defaultUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            role: 'student', // Default role
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
            created_at: authUser.created_at,
            updated_at: new Date().toISOString(),
          }
          setUser(defaultUser)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    setLoading(true)
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          await fetchUser()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchUser])

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * Hook to use user context
 * @returns user context value
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

/**
 * Hook to check if user has permission
 * @param permission - permission to check
 * @returns boolean indicating if user has permission
 */
export function usePermission(permission: keyof typeof import('./roles').ROLE_PERMISSIONS.admin) {
  const { user } = useUser()
  return hasPermission(user, permission)
}
