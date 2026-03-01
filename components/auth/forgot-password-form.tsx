'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthActions } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useToast } from '@/components/ui/toast'

import { commonSchemas, defaultFormValues } from '@/lib/validations/common'

type ForgotPasswordFormValues = z.infer<typeof commonSchemas.forgotPassword>

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { error: toastError, success: toastSuccess } = useToast()
  const { resetPassword } = useAuthActions()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(commonSchemas.forgotPassword),
    defaultValues: defaultFormValues.forgotPassword,
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true)

    // Firebase sends an email with a link to reset password.
    const { error } = await resetPassword(data.email)

    if (error) {
      toastError("Error", "Could not send password reset email. Please try again.")
    } else {
      toastSuccess("Check your email", "A password reset link has been sent to your email address.")
      setIsSuccess(true)
    }

    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <h2 className="text-xl">Check your inbox</h2>
        <p className="mt-2 text-muted-foreground">
          A password reset link has been sent to your email address. Please follow the instructions in the email to reset your password.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        register={form.register}
        error={form.formState.errors.email}
        autoComplete="email"
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  )
}
