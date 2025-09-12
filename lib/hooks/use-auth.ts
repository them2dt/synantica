/**
 * Centralized authentication hooks and utilities
 * Provides consistent authentication patterns across the application
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { handleAsyncError, handleDatabaseError } from '@/lib/utils/error-handling'

/**
 * Extended user interface with commonly used fields
 */
export interface AuthUser extends Omit<SupabaseUser, 'created_at' | 'last_sign_in_at' | 'email_confirmed_at'> {
  created_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
  phone?: string
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
}

/**
 * Hook for managing authentication state with consistent patterns
 * @param redirectTo - Optional path to redirect to when not authenticated
 * @param requireAuth - Whether to require authentication (default: false)
 */
export function useAuth(redirectTo?: string, requireAuth: boolean = false) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    error: null,
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        if (mounted) {
          const isAuthenticated = !!user
          setState({
            user: user as AuthUser,
            loading: false,
            isAuthenticated,
            error: null,
          })

          // Handle authentication requirements
          if (requireAuth && !isAuthenticated && redirectTo) {
            router.push(redirectTo)
          }
        }
      } catch (error) {
        if (mounted) {
          handleAsyncError(error, 'auth', (message) => {
            setState(prev => ({ ...prev, error: message, loading: false }))
          })

          if (requireAuth && redirectTo) {
            router.push(redirectTo)
          }
        }
      }
    }

    // Initial auth check
    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          const user = session?.user as AuthUser
          const isAuthenticated = !!user

          setState({
            user,
            loading: false,
            isAuthenticated,
            error: null,
          })

          // Handle authentication requirements
          if (requireAuth && !isAuthenticated && redirectTo) {
            router.push(redirectTo)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth, router, redirectTo, requireAuth])

  /**
   * Sign out the current user
   * @param redirectTo - Optional path to redirect to after sign out
   */
  const signOut = useCallback(async (redirectTo: string = '/auth/login') => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
        error: null,
      })

      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error) {
      handleAsyncError(error, 'auth', (message) => {
        setState(prev => ({ ...prev, error: message, loading: false }))
      })
    }
  }, [supabase.auth, router])

  /**
   * Refresh the current user data
   */
  const refreshUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        throw error
      }

      setState({
        user: user as AuthUser,
        loading: false,
        isAuthenticated: !!user,
        error: null,
      })
    } catch (error) {
      handleAsyncError(error, 'auth', (message) => {
        setState(prev => ({ ...prev, error: message, loading: false }))
      })
    }
  }, [supabase.auth])

  return {
    ...state,
    signOut,
    refreshUser,
  }
}

/**
 * Hook for authentication state without requiring auth
 * Useful for components that need to know auth status but don't require it
 */
export function useAuthState() {
  return useAuth()
}

/**
 * Hook for protected routes that requires authentication
 * @param redirectTo - Path to redirect to if not authenticated (default: '/auth/login')
 */
export function useProtectedAuth(redirectTo: string = '/auth/login') {
  return useAuth(redirectTo, true)
}

/**
 * Hook for authentication actions (sign in, sign up, etc.)
 */
export function useAuthActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (redirectTo) {
        router.push(redirectTo)
      }

      return { data, error: null }
    } catch (error) {
      const errorResult = handleDatabaseError(error, 'auth')
      setError(errorResult.message)
      setLoading(false)
      return { data: null, error: errorResult.message }
    }
  }, [supabase.auth, router])

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (redirectTo) {
        router.push(redirectTo)
      }

      return { data, error: null }
    } catch (error) {
      const errorResult = handleDatabaseError(error, 'auth')
      setError(errorResult.message)
      setLoading(false)
      return { data: null, error: errorResult.message }
    }
  }, [supabase.auth, router])

  /**
   * Reset password
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      const errorResult = handleDatabaseError(error, 'auth')
      setError(errorResult.message)
      setLoading(false)
      return { error: errorResult.message }
    }
  }, [supabase.auth])

  /**
   * Update password
   */
  const updatePassword = useCallback(async (password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      const errorResult = handleDatabaseError(error, 'auth')
      setError(errorResult.message)
      setLoading(false)
      return { error: errorResult.message }
    }
  }, [supabase.auth])

  return {
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    loading,
    error,
  }
}

/**
 * Common authentication redirect utilities
 */
export const authRedirects = {
  /**
   * Redirect to login page
   */
  toLogin: (router: ReturnType<typeof useRouter>, from?: string) => {
    const path = from ? `/auth/login?redirect=${encodeURIComponent(from)}` : '/auth/login'
    router.push(path)
  },

  /**
   * Redirect to dashboard after login
   */
  toDashboard: (router: ReturnType<typeof useRouter>) => {
    router.push('/dashboard')
  },

  /**
   * Redirect to profile page
   */
  toProfile: (router: ReturnType<typeof useRouter>) => {
    router.push('/profile')
  },

  /**
   * Redirect to forgot password page
   */
  toForgotPassword: (router: ReturnType<typeof useRouter>) => {
    router.push('/auth/forgot-password')
  },

  /**
   * Redirect to update password page
   */
  toUpdatePassword: (router: ReturnType<typeof useRouter>) => {
    router.push('/auth/update-password')
  },
}

/**
 * Note: AuthGuard component moved to separate file to avoid circular dependencies
 * Use useProtectedAuth hook instead for component-level authentication guards
 */
