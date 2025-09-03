'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/lib/hooks'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import type { AuthFormData, AuthFormProps, AuthMessage } from '@/lib/types'

/**
 * Validation schema for authentication forms
 */
const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type AuthFormData = z.infer<typeof authSchema>

/**
 * Authentication form component
 * Handles both sign in and sign up functionality
 */
export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<AuthMessage | null>(null)
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  
  const { signIn, signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  /**
   * Handle form submission for both sign in and sign up
   */
  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(data.email, data.password)
        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ type: 'success', text: 'Successfully signed in!' })
        }
      } else {
        const { error } = await signUp(data.email, data.password, {
          full_name: data.email.split('@')[0], // Default name from email
        })
        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Check your email for the confirmation link!' 
          })
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Switch between sign in and sign up modes
   */
  const handleModeChange = () => {
    reset()
    setMessage(null)
    onModeChange(mode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-header-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="student@university.edu"
              className="font-mono"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-mono">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-header-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="font-mono pr-10"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 font-mono">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="text-sm font-header-medium">
              Confirm Password
            </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="font-mono pr-10"
                  {...register('confirmPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 font-mono">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-md text-sm font-mono ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Keep Signed In & Forgot Password (Sign In Only) */}
          {mode === 'signin' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keep-signed-in"
                  checked={keepSignedIn}
                  onCheckedChange={setKeepSignedIn}
                />
                <label
                  htmlFor="keep-signed-in"
                  className="text-sm font-header-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me signed in
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline font-content"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-mono h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'signin' ? 'Log In' : 'Create Account'
            )}
          </Button>

          {/* Mode Toggle */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground font-content">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={handleModeChange}
                className="text-primary hover:underline font-header-medium"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>
    </div>
  )
}
