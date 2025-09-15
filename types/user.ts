/**
 * User-related types and interfaces
 */

/**
 * User role enum
 */
export enum UserRole {
  STUDENT = 'student',
  ORGANIZER = 'organizer',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

/**
 * User profile interface
 * Extends Supabase auth.users with additional profile information
 */
export interface UserProfile {
  id: string
  email: string
  fullName?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  bio?: string
  
  // Academic information
  university?: string
  major?: string
  graduationYear?: number
  
  // Age information
  birthYear?: number
  dateOfBirth?: string
  
  // Social links
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
  
  // Location
  location?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * User settings interface
 */
export interface UserSettings {
  userId: string
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  eventReminders: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
  createdAt: string
  updatedAt: string
}

/**
 * User role assignment
 */
export interface UserRoleAssignment {
  id: string
  userId: string
  role: UserRole
  grantedBy: string
  grantedAt: string
  expiresAt?: string
  isActive: boolean
}

/**
 * User interests (for recommendations)
 */
export interface UserInterest {
  userId: string
  tagId: string
  interestLevel: number // 1-5 scale
  createdAt: string
  updatedAt: string
}

/**
 * User authentication state
 */
export interface AuthUser {
  id: string
  email: string
  emailConfirmed: boolean
  createdAt: string
  lastSignInAt?: string
}

/**
 * User form data for profile updates
 */
export interface UserProfileFormData {
  fullName?: string
  firstName?: string
  lastName?: string
  bio?: string
  university?: string
  major?: string
  graduationYear?: number
  birthYear?: number
  dateOfBirth?: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
  location?: string
}

/**
 * User settings form data
 */
export interface UserSettingsFormData {
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  eventReminders: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
}
