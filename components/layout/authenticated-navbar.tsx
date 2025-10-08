'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Settings, LogOut, Moon, Sun, Home, LayoutDashboard } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthContext } from '@/lib/contexts/auth-context'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface AuthenticatedNavbarProps {
  className?: string
}

export function AuthenticatedNavbar({ className }: AuthenticatedNavbarProps) {
  const { user, signOut } = useAuthContext()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut('/auth/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-50",
      "w-[95%] max-w-6xl",
      "backdrop-blur-md bg-background/80 border border-border/50",
      "rounded-2xl shadow-lg shadow-black/5",
      "px-6 py-3",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <Button
                variant={isActive('/') && !isActive('/dashboard') && !isActive('/profile') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Theme Toggle and User Menu */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 rounded-full px-3"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden sm:inline-block text-sm font-medium max-w-[150px] truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">My Account</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-600 focus:text-red-600"
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
