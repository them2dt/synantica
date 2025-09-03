import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Props for the FormField component
 */
interface FormFieldProps {
  /** The label for the field */
  label: string
  /** The input element */
  children: ReactNode
  /** Error message to display */
  error?: string
  /** Help text to display below the field */
  helpText?: string
  /** Whether the field is required */
  required?: boolean
  /** Additional CSS classes */
  className?: string
  /** HTML id for the field */
  id?: string
}

/**
 * Reusable FormField component
 * Provides consistent form field layout with label, input, error, and help text
 */
export function FormField({
  label,
  children,
  error,
  helpText,
  required = false,
  className,
  id
}: FormFieldProps) {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={fieldId} 
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div>
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  )
}
