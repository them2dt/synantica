/**
 * Common validation schemas and utilities
 * Consolidates duplicate validation patterns across the application
 */

import { z } from 'zod'
import { sanitizeEmail, sanitizePassword } from '@/lib/utils/sanitization'

/**
 * Common validation constants
 */
export const VALIDATION_CONSTANTS = {
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
} as const

/**
 * Reusable email validation schema
 */
export const emailSchema = z
  .string()
  .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, 'Email is required')
  .email('Please enter a valid email address')
  .max(VALIDATION_CONSTANTS.EMAIL_MAX_LENGTH, 'Email is too long')
  .transform((val) => sanitizeEmail(val))

/**
 * Reusable password validation schema
 */
export const passwordSchema = z
  .string()
  .min(VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters')
  .max(VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  .transform((val) => sanitizePassword(val))

/**
 * Reusable confirm password schema
 */
export const confirmPasswordSchema = z
  .string()
  .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, 'Please confirm your password')
  .transform((val) => sanitizePassword(val))

/**
 * Reusable name validation schema
 */
export const nameSchema = z
  .string()
  .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, 'Name is required')
  .max(VALIDATION_CONSTANTS.NAME_MAX_LENGTH, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

/**
 * Reusable phone validation schema
 */
export const phoneSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
    message: 'Please enter a valid phone number',
  })

/**
 * Reusable URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''))

/**
 * Common form validation schemas
 */
export const commonSchemas = {
  /**
   * Sign in form schema
   */
  signIn: z.object({
    email: emailSchema,
    password: z
      .string()
      .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, 'Password is required')
      .transform((val) => sanitizePassword(val)),
    keepSignedIn: z.boolean().default(true),
  }),

  /**
   * Sign up form schema
   */
  signUp: z
    .object({
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      firstName: nameSchema.optional(),
      lastName: nameSchema.optional(),
      phone: phoneSchema,
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),

  /**
   * Forgot password form schema
   */
  forgotPassword: z.object({
    email: emailSchema,
  }),

  /**
   * Reset password form schema
   */
  resetPassword: z
    .object({
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      token: z.string().min(1, 'Reset token is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),

  /**
   * Change password form schema
   */
  changePassword: z
    .object({
      currentPassword: z
        .string()
        .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, 'Current password is required')
        .transform((val) => sanitizePassword(val)),
      newPassword: passwordSchema,
      confirmNewPassword: confirmPasswordSchema,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "New passwords don't match",
      path: ['confirmNewPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ['newPassword'],
    }),

  /**
   * Change email form schema
   */
  changeEmail: z.object({
    newEmail: emailSchema,
    password: z
      .string()
      .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, 'Password is required to change email')
      .transform((val) => sanitizePassword(val)),
  }),

  /**
   * Update profile form schema
   */
  updateProfile: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    phone: phoneSchema,
    website: urlSchema,
  }),

  /**
   * Contact form schema
   */
  contact: z.object({
    name: nameSchema,
    email: emailSchema,
    subject: z
      .string()
      .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, 'Subject is required')
      .max(200, 'Subject is too long'),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(2000, 'Message is too long'),
  }),
} as const

/**
 * TypeScript types derived from schemas
 */
export type SignInFormData = z.infer<typeof commonSchemas.signIn>
export type SignUpFormData = z.infer<typeof commonSchemas.signUp>
export type ForgotPasswordFormData = z.infer<typeof commonSchemas.forgotPassword>
export type ResetPasswordFormData = z.infer<typeof commonSchemas.resetPassword>
export type ChangePasswordFormData = z.infer<typeof commonSchemas.changePassword>
export type ChangeEmailFormData = z.infer<typeof commonSchemas.changeEmail>
export type UpdateProfileFormData = z.infer<typeof commonSchemas.updateProfile>
export type ContactFormData = z.infer<typeof commonSchemas.contact>

/**
 * Validation helpers
 */
export const validationHelpers = {
  /**
   * Check if password meets requirements
   */
  isValidPassword: (password: string): boolean => {
    try {
      passwordSchema.parse(password)
      return true
    } catch {
      return false
    }
  },

  /**
   * Get password validation errors
   */
  getPasswordErrors: (password: string): string[] => {
    const errors: string[] = []

    if (password.length < VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
    }
    if (password.length > VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH) {
      errors.push(`Password must be less than ${VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH} characters`)
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return errors
  },

  /**
   * Check if email is valid format
   */
  isValidEmail: (email: string): boolean => {
    try {
      emailSchema.parse(email)
      return true
    } catch {
      return false
    }
  },

  /**
   * Validate form data and return errors
   */
  validateForm: <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: z.ZodError } => {
    try {
      const validData = schema.parse(data)
      return { success: true, data: validData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error }
      }
      return { success: false }
    }
  },
}

/**
 * Default form values for common forms
 */
export const defaultFormValues = {
  signIn: {
    email: '',
    password: '',
    keepSignedIn: true,
  },
  signUp: {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptTerms: false,
  },
  forgotPassword: {
    email: '',
  },
  resetPassword: {
    password: '',
    confirmPassword: '',
    token: '',
  },
  changePassword: {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  },
  changeEmail: {
    newEmail: '',
    password: '',
  },
  updateProfile: {
    firstName: '',
    lastName: '',
    phone: '',
    website: '',
  },
  contact: {
    name: '',
    email: '',
    subject: '',
    message: '',
  },
} as const

/**
 * Form field configurations for consistent UI
 */
export const formFieldConfig = {
  email: {
    type: 'email' as const,
    placeholder: 'Enter your email address',
    autoComplete: 'email',
  },
  password: {
    type: 'password' as const,
    placeholder: 'Enter your password',
    autoComplete: 'current-password',
  },
  newPassword: {
    type: 'password' as const,
    placeholder: 'Enter your new password',
    autoComplete: 'new-password',
  },
  confirmPassword: {
    type: 'password' as const,
    placeholder: 'Confirm your password',
    autoComplete: 'new-password',
  },
  firstName: {
    type: 'text' as const,
    placeholder: 'Enter your first name',
    autoComplete: 'given-name',
  },
  lastName: {
    type: 'text' as const,
    placeholder: 'Enter your last name',
    autoComplete: 'family-name',
  },
  phone: {
    type: 'tel' as const,
    placeholder: 'Enter your phone number',
    autoComplete: 'tel',
  },
  website: {
    type: 'url' as const,
    placeholder: 'https://your-website.com',
    autoComplete: 'url',
  },
} as const
