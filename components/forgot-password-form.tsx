'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useToast } from '@/components/ui/toast'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()
  const { error: toastError, success: toastSuccess } = useToast()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true)
    
    // Get the current URL to construct the redirect path
    const redirectURL = new URL('/auth/update-password', window.location.origin).toString();

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: redirectURL,
    })

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
        <h2 className="text-xl font-semibold">Check your inbox</h2>
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
