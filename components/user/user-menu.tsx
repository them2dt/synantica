'use client'

import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Skeleton } from '@/components/ui/loading'
import { ThemedText } from '@/components/ui/themed-text'

/**
 * Props for the UserMenu component
 */
interface UserMenuProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to show the user email */
  showEmail?: boolean
  /** Custom trigger element */
  children?: React.ReactNode
  /** Callback when menu items are clicked */
  onClick?: () => void
}

/**
 * User menu dropdown component
 * Provides access to profile, settings, and logout functionality
 */
export function UserMenu({ className, children, onClick }: UserMenuProps) {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut('/')
    onClick?.()
  }

  if (loading) {
    return <Skeleton className="w-20 h-4" />
  }

  if (!user) {
    return null
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className={className}>
            <User className="w-4 h-4" />
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <ThemedText variant="sm">My Account</ThemedText>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => {
          onClick?.()
          router.push('/profile')
        }}>
          <User className="w-4 h-4 mr-2" />
          <ThemedText variant="sm">Profile</ThemedText>
        </DropdownMenuItem>


        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          <ThemedText variant="sm">Log out</ThemedText>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
