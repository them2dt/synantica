/**
 * User roles and permissions system
 * Defines roles and their capabilities in the platform
 */

export type UserRole = 'admin' | 'student';

/**
 * User interface with role information
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Role permissions configuration
 */
export const ROLE_PERMISSIONS = {
  admin: {
    canCreateEvents: true,
    canEditEvents: true,
    canDeleteEvents: true,
    canViewAllEvents: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canRegisterForEvents: true,
    canViewDashboard: true,
  },
  student: {
    canCreateEvents: false,
    canEditEvents: false,
    canDeleteEvents: false,
    canViewAllEvents: true,
    canManageUsers: false,
    canViewAnalytics: false,
    canRegisterForEvents: true,
    canViewDashboard: true,
  },
} as const;

/**
 * Check if a user has a specific permission
 * @param user - The user object
 * @param permission - The permission to check
 * @returns boolean indicating if user has permission
 */
export function hasPermission(user: User | null, permission: keyof typeof ROLE_PERMISSIONS.admin): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role][permission];
}

/**
 * Check if a user is an admin
 * @param user - The user object
 * @returns boolean indicating if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

/**
 * Check if a user is a student
 * @param user - The user object
 * @returns boolean indicating if user is student
 */
export function isStudent(user: User | null): boolean {
  return user?.role === 'student';
}

/**
 * Get user role display name
 * @param role - The user role
 * @returns formatted role name
 */
export function getRoleDisplayName(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Get all available roles
 * @returns array of available roles
 */
export function getAvailableRoles(): UserRole[] {
  return ['admin', 'student'];
}
