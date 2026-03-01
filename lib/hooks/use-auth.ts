/**
 * Simplified authentication hooks and utilities
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

/**
 * Extended user interface with commonly used fields
 */
export interface AuthUser {
  id: string
  email: string | null
  created_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
  phone?: string | null
}

const mapFirebaseUser = (user: FirebaseUser | null): AuthUser | null => {
  if (!user) return null;
  return {
    id: user.uid,
    email: user.email,
    created_at: user.metadata.creationTime || new Date().toISOString(),
    last_sign_in_at: user.metadata.lastSignInTime,
    phone: user.phoneNumber,
  };
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

  useEffect(() => {
    let mounted = true

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;

      const user = mapFirebaseUser(firebaseUser);
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
    }, (error) => {
      console.log('Auth check error:', error)
      if (mounted) {
        setState(prev => ({ ...prev, error: 'Authentication error', loading: false }))
        if (requireAuth && redirectTo) {
          router.push(redirectTo)
        }
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [router, redirectTo, requireAuth])

  const signOut = useCallback(async (redirectTo: string = '/auth/login') => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      await firebaseSignOut(auth)
      await fetch('/api/auth/session', { method: 'DELETE' })

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
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      await auth.currentUser?.reload()
      const user = mapFirebaseUser(auth.currentUser)

      setState({
        user,
        loading: false,
        isAuthenticated: !!user,
        error: null,
      })
    } catch (error) {
      console.log('Refresh user error:', error)
      setState(prev => ({ ...prev, error: 'Refresh error', loading: false }))
    }
  }, [])

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
  const router = useRouter()

  const signIn = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Set session cookie
      const idToken = await userCredential.user.getIdToken()
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (redirectTo) {
        router.push(redirectTo)
      }

      return { data: { user: mapFirebaseUser(userCredential.user) }, error: null }
    } catch (error: unknown) {
      console.log('Sign in error:', error)
      const err = error as Error
      setError(err.message || 'Sign in failed')
      setLoading(false)
      return { data: null, error: err.message || 'Sign in failed' }
    }
  }, [router])

  const signUp = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Set session cookie
      const idToken = await userCredential.user.getIdToken()
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (redirectTo) {
        router.push(redirectTo)
      }

      return { data: { user: mapFirebaseUser(userCredential.user) }, error: null }
    } catch (error: unknown) {
      console.log('Sign up error:', error)
      const err = error as Error
      setError(err.message || 'Sign up failed')
      setLoading(false)
      return { data: null, error: err.message || 'Sign up failed' }
    }
  }, [router])

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/auth/update-password`,
      })

      return { error: null }
    } catch (error: unknown) {
      console.log('Reset password error:', error)
      const err = error as Error
      setError(err.message || 'Reset password failed')
      setLoading(false)
      return { error: err.message || 'Reset password failed' }
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    try {
      setLoading(true)
      setError(null)

      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }

      await firebaseUpdatePassword(auth.currentUser, password)

      return { error: null }
    } catch (error: unknown) {
      console.log('Update password error:', error)
      const err = error as Error
      setError(err.message || 'Update password failed')
      setLoading(false)
      return { error: err.message || 'Update password failed' }
    }
  }, [])

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
