'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Home, LayoutDashboard, User, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Logo } from '@/components/ui/logo'
import { AuthButtonClient } from '@/components/auth-button-client'
import { UserMenu } from '@/components/user/user-menu'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { hasEnvVars } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * Props for the mobile navigation component
 */
interface MobileNavigationProps {
  /** Whether to show the auth button */
  showAuth?: boolean
  /** Whether to show the theme switcher */
  showThemeSwitcher?: boolean
}

/**
 * Mobile navigation component with hamburger menu
 * Provides mobile-optimized navigation experience
 */
export function MobileNavigation({ 
  showAuth = true, 
  showThemeSwitcher = true 
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navigationItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      active: isActive('/')
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: isActive('/dashboard')
    }
  ]

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 touch-manipulation"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center">
                <Logo size="md" />
              </div>
            </SheetHeader>

            {/* Navigation Items */}
            <nav className="flex-1 p-6">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors touch-manipulation",
                        item.active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Footer with Auth and Theme */}
            <div className="p-4 border-t bg-muted/30">
              {/* Auth Section */}
              {showAuth && (
                <div className="space-y-3">
                  {!hasEnvVars ? (
                    <div className="text-xs text-muted-foreground p-3 bg-background/50 rounded-lg text-center border">
                      Environment variables not configured
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* User Profile Card */}
                      <UserMenu showEmail={false} onClick={() => setOpen(false)}>
                        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border hover:bg-background/70 transition-colors cursor-pointer w-full">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">My Account</div>
                            <div className="text-xs text-muted-foreground">Manage your profile</div>
                          </div>
                          <div className="w-6 h-6 flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </UserMenu>
                      
                      {/* Auth Button */}
                      <AuthButtonClient fullWidth onClick={() => setOpen(false)} />
                    </div>
                  )}
                </div>
              )}

              {/* Theme Switcher */}
              {showThemeSwitcher && (
                <div className="mt-3">
                  <ThemeSwitcher>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border hover:bg-background/70 transition-colors cursor-pointer w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <Sun className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium">Theme</span>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <Sun className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </ThemeSwitcher>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

/**
 * Mobile navigation with simplified layout for specific pages
 */
export function MobileNavigationSimple() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center">
                <Logo size="sm" />
              </div>
            </SheetHeader>

            <div className="flex-1 p-4">
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted touch-manipulation"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted touch-manipulation"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="p-4 border-t bg-muted/30">
              <ThemeSwitcher>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border hover:bg-background/70 transition-colors cursor-pointer w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Sun className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Theme</span>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </ThemeSwitcher>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
