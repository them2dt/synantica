/**
 * Authentication validation schemas using Zod
 * Provides type-safe validation for all authentication forms
 */

import { z } from 'zod';
import { sanitizeEmail, sanitizePassword } from '@/lib/utils/sanitization';

/**
 * Base email validation schema
 * Validates email format and sanitizes input
 */
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long')
  .transform((val) => sanitizeEmail(val));

/**
 * Base password validation schema
 * Validates password strength and sanitizes input
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  .transform((val) => sanitizePassword(val));

/**
 * Sign-up form validation schema
 * Validates email, password, and confirm password
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .transform((val) => sanitizePassword(val)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.password.length >= 8, {
    message: 'Password must be at least 8 characters long',
    path: ['password'],
  });

/**
 * Sign-in form validation schema
 * Validates email and password for login
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long')
    .transform((val) => sanitizePassword(val)),
  keepSignedIn: z.boolean().default(true),
});

/**
 * Forgot password form validation schema
 * Validates email for password reset
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Update password form validation schema
 * Validates new password for password update
 */
export const updatePasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your new password')
    .transform((val) => sanitizePassword(val)),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Change password form validation schema
 * Validates current password and new password
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required')
    .transform((val) => sanitizePassword(val)),
  newPassword: passwordSchema,
  confirmNewPassword: z
    .string()
    .min(1, 'Please confirm your new password')
    .transform((val) => sanitizePassword(val)),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ['newPassword'],
});

/**
 * Change email form validation schema
 * Validates new email address
 */
export const changeEmailSchema = z.object({
  newEmail: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required to change email')
    .transform((val) => sanitizePassword(val)),
});

/**
 * TypeScript types derived from schemas
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

/**
 * Custom error messages for common validation scenarios
 */
export const authErrorMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
    tooLong: 'Email is too long',
  },
  password: {
    required: 'Password is required',
    tooShort: 'Password must be at least 8 characters',
    tooLong: 'Password is too long',
    noLowercase: 'Password must contain at least one lowercase letter',
    noUppercase: 'Password must contain at least one uppercase letter',
    noNumber: 'Password must contain at least one number',
    noSpecialChar: 'Password must contain at least one special character',
  },
  confirmPassword: {
    required: 'Please confirm your password',
    noMatch: "Passwords don't match",
  },
} as const;

/**
 * Validation helper functions
 */
export const authValidation = {
  /**
   * Validates email format
   */
  isValidEmail: (email: string): boolean => {
    try {
      emailSchema.parse(email);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validates password strength
   */
  isValidPassword: (password: string): boolean => {
    try {
      passwordSchema.parse(password);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Gets password validation errors
   */
  getPasswordErrors: (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push(authErrorMessages.password.tooShort);
    }
    if (password.length > 128) {
      errors.push(authErrorMessages.password.tooLong);
    }
    if (!/[a-z]/.test(password)) {
      errors.push(authErrorMessages.password.noLowercase);
    }
    if (!/[A-Z]/.test(password)) {
      errors.push(authErrorMessages.password.noUppercase);
    }
    if (!/[0-9]/.test(password)) {
      errors.push(authErrorMessages.password.noNumber);
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push(authErrorMessages.password.noSpecialChar);
    }
    
    return errors;
  },
};

export const passwordUpdateSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // path of error
});

export type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>
