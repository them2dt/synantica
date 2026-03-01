'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AuthNav } from './auth-nav'
import { NavigationLinks } from './navigation-links'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
  showLogo?: boolean
  showAuth?: boolean
  logoSize?: 'sm' | 'md' | 'lg'
}

export function Navigation({
  className,
  showLogo = true,
  showAuth = true,
  logoSize = 'md',
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-[60] bg-white', className)}>
      <div className={cn('mx-auto flex w-full max-w-[1100px] items-center justify-between border-b border-slate-200 md:border-x')}>
        <div className="flex items-center gap-6 py-4 md:py-0">
          {showLogo && (
            <span className={cn("font-heading text-xl pl-4", logoSize === 'lg' && 'text-2xl', logoSize === 'sm' && 'text-lg')}>
              Synantica
            </span>
          )}
          <div className="hidden md:block">
            <NavigationLinks />
          </div>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 pr-4 md:pr-0">
          {showAuth && <AuthNav />}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden pr-4 flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-700" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white absolute top-full left-0 right-0 w-full flex flex-col p-4 shadow-lg space-y-4">
          <NavigationLinks className="flex-col items-start gap-4" />
          {showAuth && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <AuthNav />
            </div>
          )}
        </div>
      )}
    </header>
  )
}
