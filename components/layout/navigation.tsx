'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { AuthButtonClient } from '@/components/auth-button-client'
import { UserMenu } from '@/components/user/user-menu'
import { EnvVarWarning } from '@/components/env-var-warning'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { hasEnvVars } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * Props for the Navigation component
 */
interface NavigationProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to show the logo */
  showLogo?: boolean
  /** Whether to show the auth button */
  showAuth?: boolean
  /** Whether to show the theme switcher */
  showThemeSwitcher?: boolean
  /** Custom content to display in the navigation */
  children?: ReactNode
  /** Logo size variant */
  logoSize?: 'sm' | 'md' | 'lg' | 'xl'
  /** Whether the navigation is sticky */
  sticky?: boolean
}

/**
 * Reusable Navigation component
 * Provides consistent navigation across all pages
 */
export function Navigation({
  className,
  showLogo = true,
  showAuth = true,
  showThemeSwitcher = true,
  children,
  logoSize = 'md',
  sticky = false
}: NavigationProps) {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className={cn(
      'w-full flex justify-center border-b border-b-foreground/10 h-16',
      sticky && 'sticky top-0 z-50 bg-background/95 backdrop-blur-sm',
      className
    )}>
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          {showLogo && (
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size={logoSize} />
            </Link>
          )}
          {children}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Home Link */}
            <Link 
              href="/" 
              className={cn(
                "text-sm font-medium transition-colors",
                isActive('/') 
                  ? "text-accent font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Home
            </Link>
            
            {/* Dashboard Link */}
            <Link 
              href="/dashboard" 
              className={cn(
                "text-sm font-medium transition-colors",
                isActive('/dashboard') 
                  ? "text-accent font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
            
            {/* Separator */}
            
            {showAuth ? (
              <>
                {!hasEnvVars && <EnvVarWarning />}
                <UserMenu showEmail={false} />

                {/* Separator */}

                <AuthButtonClient />

                {/* Separator */}
              </>
            ) : null}
            
            {showThemeSwitcher && <ThemeSwitcher />}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNavigation 
              showAuth={showAuth}
              showThemeSwitcher={showThemeSwitcher}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
