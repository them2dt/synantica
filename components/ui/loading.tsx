/**
 * Comprehensive loading state components
 * Provides consistent loading experiences across the application
 */

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

/**
 * Props for spinner components
 */
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'muted' | 'accent' | 'current'
}

export function InlineSpinner({ className, color = 'current' }: Omit<SpinnerProps, 'size'>) {
  return (
    <Loader2
      className={cn(
        'h-4 w-4 animate-spin',
        color === 'current' ? 'text-current' : color === 'primary' ? 'text-slate-950' : color === 'muted' ? 'text-slate-500' : color === 'accent' ? 'text-blue-600' : 'text-slate-950',
        className
      )}
      aria-hidden="true"
    />
  )
}


/**
 * Skeleton loading component for placeholder content
 */
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  lines?: number
  animate?: boolean
}

export function Skeleton({
  className,
  variant = 'rectangular',
  lines = 1,
  animate = true
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-slate-100',
    animate && 'animate-pulse',
    className
  )

  if (variant === 'text') {
    if (lines === 1) {
      return <div className={cn(baseClasses, 'h-4 rounded-none')} />
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4 rounded-none',
              i === lines - 1 && lines > 1 && 'w-3/4' // Last line shorter
            )}
          />
        ))}
      </div>
    )
  }

  if (variant === 'circular') {
    return <div className={cn(baseClasses, 'rounded-none aspect-square', className)} />
  }

  // Default rectangular
  return <div className={cn(baseClasses, 'rounded-none', className)} />
}

/**
 * Skeleton card for event loading states
 */
export function EventCardSkeleton() {
  return (
    <div className="border border-slate-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-16 rounded-none" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-none" />
        <Skeleton className="h-6 w-20 rounded-none" />
      </div>

      <Skeleton className="h-9 w-full rounded-none" />
    </div>
  )
}


