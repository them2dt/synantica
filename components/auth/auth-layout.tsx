'use client'

import { ReactNode } from 'react'

/**
 * Props for the auth layout component
 */
interface AuthLayoutProps {
  children: ReactNode
  title: string
}

/**
 * HelloFresh-style authentication layout component
 * Features a two-column layout with auth form on left and promotional content on right
 */
export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[520px] px-6 py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Account
            </div>
            <h1 className="text-3xl text-neutral-950">
              {title}
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
