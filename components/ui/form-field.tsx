'use client'

import { Input, type InputProps } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { type UseFormRegister, type FieldError, type Path, type FieldValues } from 'react-hook-form'

interface FormFieldProps<TFormValues extends FieldValues> extends Omit<InputProps, 'name'> {
  label: string
  name: Path<TFormValues>
  register: UseFormRegister<TFormValues>
  error?: FieldError
}

export function FormField<TFormValues extends FieldValues>({ 
  label, 
  name, 
  register, 
  error, 
  className,
  ...props 
}: FormFieldProps<TFormValues>) {
  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      <Label htmlFor={name}>
        {label}
      </Label>
      <Input
        id={name}
        aria-invalid={error ? "true" : "false"}
        {...register(name)}
        {...props}
      />
      {error && <p className="text-sm text-destructive mt-1">{error.message}</p>}
    </div>
  )
}
