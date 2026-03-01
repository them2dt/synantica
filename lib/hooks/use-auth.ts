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
  signInWithPopup,
  AuthProvider
} from 'firebase/auth'
import { auth, googleProvider, appleProvider } from '@/lib/firebase/client'

/**
 * Extended user interface with commonly used fields
 */
interface AuthUser {
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
interface AuthState {
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

  const signOut = useCallback(async (redirectTo: string = '/') => {
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
 * Hook for authentication actions
 */
export function useAuthActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signInWithProvider = useCallback(async (provider: AuthProvider, redirectTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      const userCredential = await signInWithPopup(auth, provider)

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
      console.log('Provider sign in error:', error)
      const err = error as Error
      setError(err.message || 'Sign in failed')
      setLoading(false)
      return { data: null, error: err.message || 'Sign in failed' }
    }
  }, [router])

  const signInWithGoogle = useCallback((redirectTo?: string) =>
    signInWithProvider(googleProvider, redirectTo),
    [signInWithProvider])

  const signInWithApple = useCallback((redirectTo?: string) =>
    signInWithProvider(appleProvider, redirectTo),
    [signInWithProvider])

  return {
    signInWithGoogle,
    signInWithApple,
    loading,
    error,
  }
}


