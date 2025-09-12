'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { EnvVarWarning } from '@/components/env-var-warning'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { hasEnvVars } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
  showLogo?: boolean
  showAuth?: boolean
  showThemeSwitcher?: boolean
  logoSize?: 'sm' | 'md' | 'lg'
  authComponent: React.ReactNode
}

export function Navigation({
  className,
  showLogo = true,
  showAuth = true,
  showThemeSwitcher = true,
  logoSize = 'md',
  authComponent
}: NavigationProps) {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          // Common styles
          "flex h-16 items-center justify-between transition-all duration-300",
          // Styles for fixed navigation
          "border-b bg-background/95 backdrop-blur-sm px-4 w-full"
        )}
      >
        {/* Left side: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          {showLogo && <Logo size={logoSize} />}
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
          </div>
        </div>
        
        {/* Right side: Auth + Theme + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2">
            {showAuth && (
              <>
                {!hasEnvVars && <EnvVarWarning />}
                {authComponent}
              </>
            )}
            {showThemeSwitcher && <ThemeSwitcher />}
          </div>
          
          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <MobileNavigation showAuth={showAuth} showThemeSwitcher={showThemeSwitcher} />
          </div>
        </div>
      </div>
    </header>
  )
}
