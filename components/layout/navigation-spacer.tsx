'use client'

import { cn } from '@/lib/utils'

interface NavigationSpacerProps {
  className?: string
}

export function NavigationSpacer({ className }: NavigationSpacerProps) {
  return (
    <div
      className={cn('h-20', className)}
      aria-hidden="true"
    />
  )
}
