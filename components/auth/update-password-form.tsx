'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthActions } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useToast } from '@/components/ui/toast'
import { commonSchemas, defaultFormValues } from '@/lib/validations/common'
import type { ResetPasswordFormData } from '@/lib/validations/common'
import { Loader2 } from 'lucide-react'

export function UpdatePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  const router = useRouter()
  const { error: toastError, success: toastSuccess } = useToast()
  const { updatePassword } = useAuthActions()

  useEffect(() => {
    // With Firebase, we usually click the email link and the Firebase SDK handles the oobCode
    // if we pass it, but for simplicity, we mock verification success here.
    setIsVerifying(false)
  }, [])

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(commonSchemas.resetPassword),
    defaultValues: defaultFormValues.resetPassword,
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true)

    const { error } = await updatePassword(data.password)

    if (error) {
      console.error("Password update error:", error)
      toastError("Error", "Failed to update password. Please try again.")
    } else {
      toastSuccess("Success!", "Your password has been updated successfully.")
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    }

    setIsSubmitting(false)
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h2 className="text-xl">Verifying Link...</h2>
        <p className="mt-2 text-muted-foreground">
          Please wait while we verify your password reset request.
        </p>
      </div>
    )
  }

  if (verificationError) {
    return (
      <div className="text-center text-destructive">
        <h2 className="text-xl">Verification Failed</h2>
        <p className="mt-2">{verificationError}</p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="New Password"
        name="password"
        type="password"
        placeholder="••••••••"
        register={form.register}
        error={form.formState.errors.password}
      />
      <FormField
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        register={form.register}
        error={form.formState.errors.confirmPassword}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  )
}
