'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'
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
    <header className={cn('fixed top-4 left-0 right-0 z-[60]', className)}>
      <div className={cn('mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between border border-border bg-background px-5')}>
        <div className="flex items-center gap-6">
          {showLogo && <Logo size={logoSize} />}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={cn(
                'text-sm transition-colors',
                isActive('/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                'text-sm transition-colors',
                isActive('/dashboard') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Dashboard
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {showAuth && authComponent}
          {showThemeSwitcher && <ThemeSwitcher />}
        </div>
      </div>
    </header>
  )
}
