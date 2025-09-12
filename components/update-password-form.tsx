'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useToast } from '@/components/ui/toast'
import { commonSchemas, defaultFormValues } from '@/lib/validations/common'
import type { ResetPasswordFormData } from '@/lib/validations/common'
import { Loader2 } from 'lucide-react'

export function UpdatePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { error: toastError, success: toastSuccess } = useToast()

  useEffect(() => {
    const exchangeCodeForSession = async (code: string) => {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Code exchange error:', error)
        setVerificationError('The password reset link is invalid or has expired. Please request a new one.')
        toastError('Invalid Link', 'This reset link is no longer valid.')
        // Redirect back to forgot password page after a delay
        setTimeout(() => {
          router.push('/auth/forgot-password')
        }, 3000)
      }
      setIsVerifying(false)
    }

    const code = searchParams.get('code')
    if (code) {
      exchangeCodeForSession(code)
    } else {
      setVerificationError('No password reset code found in the URL. Please use the link from your email.')
      setIsVerifying(false)
    }
  }, [searchParams, router, supabase, toastError])

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(commonSchemas.resetPassword),
    defaultValues: defaultFormValues.resetPassword,
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true)
    
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

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
        <h2 className="text-xl font-semibold">Verifying Link...</h2>
        <p className="mt-2 text-muted-foreground">
          Please wait while we verify your password reset request.
        </p>
      </div>
    )
  }

  if (verificationError) {
    return (
      <div className="text-center text-destructive">
        <h2 className="text-xl font-semibold">Verification Failed</h2>
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
