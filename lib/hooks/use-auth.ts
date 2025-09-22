/**
 * Simplified authentication hooks and utilities
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
 * Hook for managing authentication state
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
          console.log('Auth error:', error.message)
          if (mounted) {
            setState({
              user: null,
              loading: false,
              isAuthenticated: false,
              error: null,
            })
          }
          return
        }

        if (mounted) {
          const isAuthenticated = !!user
          setState({
            user: user as AuthUser,
            loading: false,
            isAuthenticated,
            error: null,
          })

          if (requireAuth && !isAuthenticated && redirectTo) {
            router.push(redirectTo)
          }
        }
      } catch (error) {
        console.log('Auth check error:', error)
        if (mounted) {
          setState(prev => ({ ...prev, error: 'Authentication error', loading: false }))
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

  const signOut = useCallback(async (redirectTo: string = '/auth/login') => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.log('Sign out error:', error.message)
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
      console.log('Sign out error:', error)
      setState(prev => ({ ...prev, error: 'Sign out error', loading: false }))
    }
  }, [supabase.auth, router])

  const refreshUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.log('Refresh user error:', error.message)
        setState({
          user: null,
          loading: false,
          isAuthenticated: false,
          error: null,
        })
        return
      }

      setState({
        user: user as AuthUser,
        loading: false,
        isAuthenticated: !!user,
        error: null,
      })
    } catch (error) {
      console.log('Refresh user error:', error)
      setState(prev => ({ ...prev, error: 'Refresh error', loading: false }))
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
 */
export function useAuthState() {
  return useAuth()
}

/**
 * Hook for protected routes that requires authentication
 */
export function useProtectedAuth(redirectTo: string = '/auth/login') {
  return useAuth(redirectTo, true)
}

/**
 * Hook for authentication actions
 */
export function useAuthActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const signIn = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('Sign in error:', error.message)
        setError(error.message)
        setLoading(false)
        return { data: null, error: error.message }
      }

      if (redirectTo) {
        router.push(redirectTo)
      }

      return { data, error: null }
    } catch (error) {
      console.log('Sign in error:', error)
      setError('Sign in failed')
      setLoading(false)
      return { data: null, error: 'Sign in failed' }
    }
  }, [supabase.auth, router])

  const signUp = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.log('Sign up error:', error.message)
        setError(error.message)
        setLoading(false)
        return { data: null, error: error.message }
      }

      if (redirectTo) {
        router.push(redirectTo)
      }

      return { data, error: null }
    } catch (error) {
      console.log('Sign up error:', error)
      setError('Sign up failed')
      setLoading(false)
      return { data: null, error: 'Sign up failed' }
    }
  }, [supabase.auth, router])

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        console.log('Reset password error:', error.message)
        setError(error.message)
        setLoading(false)
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.log('Reset password error:', error)
      setError('Reset password failed')
      setLoading(false)
      return { error: 'Reset password failed' }
    }
  }, [supabase.auth])

  const updatePassword = useCallback(async (password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        console.log('Update password error:', error.message)
        setError(error.message)
        setLoading(false)
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.log('Update password error:', error)
      setError('Update password failed')
      setLoading(false)
      return { error: 'Update password failed' }
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
  toLogin: (router: ReturnType<typeof useRouter>, from?: string) => {
    const path = from ? `/auth/login?redirect=${encodeURIComponent(from)}` : '/auth/login'
    router.push(path)
  },

  toDashboard: (router: ReturnType<typeof useRouter>) => {
    router.push('/dashboard')
  },

  toProfile: (router: ReturnType<typeof useRouter>) => {
    router.push('/profile')
  },

  toForgotPassword: (router: ReturnType<typeof useRouter>) => {
    router.push('/auth/forgot-password')
  },

  toUpdatePassword: (router: ReturnType<typeof useRouter>) => {
    router.push('/auth/update-password')
  },
}
