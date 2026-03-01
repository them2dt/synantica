'use client'

import { cn } from '@/lib/utils'

interface NavigationSpacerProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Navigation Spacer Component
 * 
 * Creates appropriate spacing to prevent content from being hidden behind
 * the fixed navigation bar. Accounts for different navigation heights on
 * mobile vs desktop.
 */
export function NavigationSpacer({ className }: NavigationSpacerProps) {
  return (
    <div 
      className={cn(
        // Mobile: Standard navigation height (64px + border)
        "h-20",
        // Desktop: Navigation height + top offset
        "md:h-24",
        className
      )}
      aria-hidden="true"
    />
  )
}
