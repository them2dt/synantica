'use client'

import { useEffect, useState } from 'react'
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

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const isDev = process.env.NODE_ENV !== 'production'

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
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    onClick?.()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 h-4 bg-muted rounded animate-pulse" />
      </div>
    )
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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => {
          onClick?.()
          router.push('/profile')
        }}>
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
