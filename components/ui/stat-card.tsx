import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Props for the StatCard component
 */
interface StatCardProps {
  /** The main value to display */
  value: string | number
  /** The label/description for the stat */
  label: string
  /** Optional icon to display */
  icon?: LucideIcon
  /** Color variant for the icon background */
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  /** Additional CSS classes */
  className?: string
  /** Whether to show the icon */
  showIcon?: boolean
  /** Custom content to display below the stat */
  children?: ReactNode
}

/**
 * Reusable StatCard component
 * Displays statistics with consistent styling and optional icons
 */
export function StatCard({
  value,
  label,
  icon: Icon,
  iconColor = 'blue',
  className,
  showIcon = true,
  children
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100',
    gray: 'text-gray-600 bg-gray-100'
  }

  return (
    <Card className={cn('text-center', className)}>
      <CardContent className="p-6">
        {showIcon && Icon && (
          <div className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto',
            colorClasses[iconColor]
          )}>
            <Icon className="w-7 h-7" />
          </div>
        )}
        
        <div className="text-4xl font-bold mb-2">
          {value}
        </div>
        
        <p className="text-muted-foreground text-base">
          {label}
        </p>
        
        {children}
      </CardContent>
    </Card>
  )
}
