'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks'
import { LoginLayout } from './login-layout'
import { Loader2 } from 'lucide-react'

/**
 * Props for the authentication guard component
 */
interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Authentication guard component
 * Protects routes by requiring authentication
 * Shows login form if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground font-mono">Loading...</p>
        </div>
      </div>
    )
  }

  // Show authentication form if user is not authenticated
  if (!user) {
    return (
      <LoginLayout 
        mode={authMode} 
        onModeChange={setAuthMode} 
      />
    )
  }

  // Render protected content if user is authenticated
  return <>{children}</>
}
