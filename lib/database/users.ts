/**
 * Database service for user operations
 * Handles user profile management and role queries
 */

import { createClient } from '@/lib/supabase/server'
import { User, UserRole } from '@/lib/auth/roles'

/**
 * Get user profile from database
 * @param userId - The user ID
 * @returns User profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role as UserRole,
    name: data.full_name,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

/**
 * Update user role (admin only)
 * @param userId - The user ID to update
 * @param role - The new role
 * @returns Success status
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error)
    return false
  }

  return true
}

/**
 * Get all users (admin only)
 * @returns Array of users
 */
export async function getAllUsers(): Promise<User[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data.map(user => ({
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    name: user.full_name,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }))
}

/**
 * Create or update user profile
 * @param userId - The user ID
 * @param userData - User data to insert/update
 * @returns Success status
 */
export async function upsertUserProfile(userId: string, userData: {
  email: string
  full_name?: string
  role?: UserRole
  university?: string
  major?: string
  year?: string
}): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      ...userData,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error upserting user profile:', error)
    return false
  }

  return true
}

/**
 * Check if user is admin
 * @param userId - The user ID
 * @returns Boolean indicating if user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserProfile(userId)
  return user?.role === 'admin'
}
