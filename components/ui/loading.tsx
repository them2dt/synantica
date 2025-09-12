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

/**
 * Spinner component with consistent styling
 * Replaces various animate-spin implementations
 */
export function Spinner({
  size = 'md',
  className,
  color = 'primary'
}: SpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  }

  const colorClasses = {
    primary: 'text-primary',
    muted: 'text-muted-foreground',
    accent: 'text-accent',
    current: 'text-current'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

/**
 * Inline spinner for buttons and small spaces
 */
export function InlineSpinner({ className, color = 'current' }: Omit<SpinnerProps, 'size'>) {
  return (
    <Loader2
      className={cn(
        'h-4 w-4 animate-spin',
        color === 'current' ? 'text-current' : `text-${color}`,
        className
      )}
      aria-hidden="true"
    />
  )
}

/**
 * Page-level loading spinner with text
 */
interface PageSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PageSpinner({
  text = 'Loading...',
  size = 'md',
  className
}: PageSpinnerProps) {
  const containerSize = {
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12'
  }

  const spinnerSize = {
    sm: 'md' as const,
    md: 'lg' as const,
    lg: 'xl' as const
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', containerSize[size], className)}>
      <Spinner size={spinnerSize[size]} className="mb-4" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
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
    'bg-muted',
    animate && 'animate-pulse',
    className
  )

  if (variant === 'text') {
    if (lines === 1) {
      return <div className={cn(baseClasses, 'h-4 rounded')} />
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4 rounded',
              i === lines - 1 && lines > 1 && 'w-3/4' // Last line shorter
            )}
          />
        ))}
      </div>
    )
  }

  if (variant === 'circular') {
    return <div className={cn(baseClasses, 'rounded-full aspect-square', className)} />
  }

  // Default rectangular
  return <div className={cn(baseClasses, 'rounded', className)} />
}

/**
 * Skeleton card for event loading states
 */
export function EventCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-16 rounded-full" />
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
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  )
}

/**
 * Skeleton table for event table loading states
 */
export function EventTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b bg-muted/50 p-4">
        <div className="grid grid-cols-6 gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b p-4 last:border-b-0">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Loading button component with spinner
 */
interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function LoadingButton({
  loading,
  children,
  loadingText,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <InlineSpinner />}
      {loading && loadingText ? loadingText : children}
    </button>
  )
}

/**
 * Loading overlay for modals and forms
 */
interface LoadingOverlayProps {
  loading: boolean
  children: React.ReactNode
  text?: string
  className?: string
}

export function LoadingOverlay({
  loading,
  children,
  text = 'Loading...',
  className
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Loading text with ellipsis animation
 */
export function LoadingText({
  text = 'Loading',
  className
}: {
  text?: string
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} role="status">
      <span className="sr-only">Loading</span>
      {text}
      <span className="animate-pulse" aria-hidden="true">...</span>
    </span>
  )
}

/**
 * Grid skeleton for multiple items
 */
interface GridSkeletonProps {
  count?: number
  className?: string
  itemComponent?: React.ComponentType<{ className?: string }>
}

export function GridSkeleton({
  count = 6,
  className,
  itemComponent: ItemComponent = EventCardSkeleton
}: GridSkeletonProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ItemComponent key={i} />
      ))}
    </div>
  )
}
