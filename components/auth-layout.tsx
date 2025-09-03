'use client'

import { ReactNode } from 'react'
// No icon imports needed for the minimal design

/**
 * Props for the auth layout component
 */
interface AuthLayoutProps {
  children: ReactNode
  subtitle: string
}

/**
 * HelloFresh-style authentication layout component
 * Features a two-column layout with auth form on left and promotional content on right
 */
export function AuthLayout({ children, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-header-bold text-primary">S</span>
            </div>
            <h1 className="text-3xl font-header-bold text-foreground mb-2">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Auth Form */}
          {children}
        </div>
      </div>

      {/* Right Side - Decorative Pattern */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-4 gap-8 h-full w-full p-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-400 rounded-full"
                style={{
                  width: '60px',
                  height: '60px',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
                  transform: 'rotate(45deg)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
