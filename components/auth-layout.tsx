'use client'

import { ReactNode } from 'react'
import Image from 'next/image'

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
    <div className="min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 bg-background lg:border-r-[1px] border-r-gray-300">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 font-heading">
              {title}
            </h1>
          </div>

          {/* Auth Form */}
          {children}
        </div>
      </div>

      {/* Right Side - Decorative Pattern */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden">
        {/* Decorative Pattern */}
        <Image src="/cover2.png" alt="cover" fill className="object-cover" priority />
      </div>
    </div>
  )
}
