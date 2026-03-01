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
  return (
    <header className={cn('fixed top-0 left-0 right-0 z-[60]', className)}>
      <div className={cn('mx-auto flex w-full max-w-[1100px] items-center justify-between border-b border-x border-slate-200')}>
        <div className="flex items-center gap-6">
          {showLogo && (
            <span className={cn("font-heading text-xl pl-4", logoSize === 'lg' && 'text-2xl', logoSize === 'sm' && 'text-lg')}>
              Synantica
            </span>
          )}
          <NavigationLinks />
        </div>
        <div className="flex items-center gap-4">
          {showAuth && <AuthNav />}
        </div>
      </div>
    </header>
  )
}
