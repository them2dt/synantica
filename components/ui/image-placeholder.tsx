import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the ImagePlaceholder component
 */
interface ImagePlaceholderProps {
  /** Additional CSS classes */
  className?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Custom text to display */
  text?: string
  /** Whether to show loading spinner */
  loading?: boolean
}

/**
 * Reusable image placeholder component
 * Displays when images fail to load or are missing
 */
export function ImagePlaceholder({ 
  className, 
  size = 'md', 
  text = 'Image',
  loading = false 
}: ImagePlaceholderProps) {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-xs',
      container: 'p-2'
    },
    md: {
      icon: 'w-12 h-12',
      text: 'text-sm',
      container: 'p-4'
    },
    lg: {
      icon: 'w-16 h-16',
      text: 'text-base',
      container: 'p-6'
    },
    xl: {
      icon: 'w-20 h-20',
      text: 'text-lg',
      container: 'p-8'
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={cn(
      'w-full h-full flex items-center justify-center bg-muted',
      currentSize.container,
      className
    )}>
      <div className="text-center">
        {loading ? (
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        ) : (
          <ImageIcon className={cn(
            'text-muted-foreground mx-auto mb-2',
            currentSize.icon
          )} />
        )}
        <p className={cn('text-muted-foreground', currentSize.text)}>
          {text}
        </p>
      </div>
    </div>
  )
}
