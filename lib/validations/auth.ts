/**
 * Authentication validation schemas using Zod
 * Provides type-safe validation for all authentication forms
 * Now uses centralized common validation schemas
 */

import { z } from 'zod'
import {
  commonSchemas,
  validationHelpers,
  confirmPasswordSchema,
} from './common'

// Re-export common schemas for backward compatibility
export const emailSchema = commonSchemas.signIn.shape.email;
export const passwordSchema = commonSchemas.signUp.shape.password;

/**
 * Authentication form validation schemas
 * Now using centralized common validation schemas
 */
// Basic sign up schema used by the simplified sign up form
// Includes only the fields present in the current form
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Export the full schema with additional fields for future use
export const fullSignUpSchema = commonSchemas.signUp;
export const signInSchema = commonSchemas.signIn;
export const forgotPasswordSchema = commonSchemas.forgotPassword;
export const updatePasswordSchema = commonSchemas.resetPassword;
export const changePasswordSchema = commonSchemas.changePassword;
export const changeEmailSchema = commonSchemas.changeEmail;

/**
 * TypeScript types derived from schemas
 * Using types from common validation schemas
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
 * Using centralized common validation helpers
 */
export const authValidation = {
  /**
   * Validates email format
   */
  isValidEmail: validationHelpers.isValidEmail,

  /**
   * Validates password strength
   */
  isValidPassword: validationHelpers.isValidPassword,

  /**
   * Gets password validation errors
   */
  getPasswordErrors: validationHelpers.getPasswordErrors,
};

// Note: passwordUpdateSchema has been replaced by commonSchemas.resetPassword
// Use commonSchemas.resetPassword instead for new implementations
