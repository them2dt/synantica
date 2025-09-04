'use client'

import { ReactNode } from 'react'
import { useUser } from '@/lib/auth/user-context'
import { hasPermission, UserRole } from '@/lib/auth/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Lock } from 'lucide-react'
import Link from 'next/link'

/**
 * Props for role guard component
 */
interface RoleGuardProps {
  children: ReactNode
  permission?: keyof typeof import('@/lib/auth/roles').ROLE_PERMISSIONS.admin
  role?: UserRole
  fallback?: ReactNode
  requireAuth?: boolean
}

/**
 * Role-based access control component
 * Shows content only if user has required permissions
 */
export function RoleGuard({ 
  children, 
  permission, 
  role, 
  fallback, 
  requireAuth = true 
}: RoleGuardProps) {
  const { user, loading } = useUser()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check if user is authenticated
  if (requireAuth && !user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            You need to be logged in to access this content.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Check role-based access
  if (role && user?.role !== role) {
    return fallback || (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this content. Required role: {role}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Check permission-based access
  if (permission && !hasPermission(user, permission)) {
    return fallback || (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to perform this action.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // User has access, render children
  return <>{children}</>
}

/**
 * Admin-only component wrapper
 */
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard role="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

/**
 * Student-only component wrapper
 */
export function StudentOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard role="student" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
