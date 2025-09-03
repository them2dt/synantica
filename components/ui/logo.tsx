import { cn } from "@/lib/utils"

/**
 * Props for the Logo component
 */
interface LogoProps {
  /** Size variant for the logo */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Whether to show the icon */
  showIcon?: boolean
  /** Whether to show the text */
  showText?: boolean
  /** Additional CSS classes */
  className?: string
  /** Click handler for the logo */
  onClick?: () => void
}

/**
 * Reusable Logo component for Synentica branding
 * Displays the "S" icon and "Synentica" text with consistent styling
 */
export function Logo({ 
  size = 'md', 
  showIcon = true, 
  showText = true, 
  className,
  onClick 
}: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6 text-lg',
      text: 'text-lg',
      container: 'gap-2'
    },
    md: {
      icon: 'w-8 h-8 text-xl',
      text: 'text-xl',
      container: 'gap-2'
    },
    lg: {
      icon: 'w-12 h-12 text-2xl',
      text: 'text-2xl',
      container: 'gap-3'
    },
    xl: {
      icon: 'w-16 h-16 text-3xl',
      text: 'text-3xl',
      container: 'gap-4'
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <div 
      className={cn(
        'flex items-center',
        currentSize.container,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {showIcon && (
        <div className={cn(
          'bg-primary/20 rounded-full flex items-center justify-center',
          currentSize.icon
        )}>
          <span className="font-bold text-primary">S</span>
        </div>
      )}
      {showText && (
        <span className={cn('font-bold text-primary', currentSize.text)}>
          Synentica
        </span>
      )}
    </div>
  )
}
