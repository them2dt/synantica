/**
 * Admin-specific route protection utilities
 * 
 * This module provides functions to identify admin routes and verify admin user permissions.
 * It supports multiple admin verification methods for flexibility.
 */

/**
 * List of admin routes that require special protection
 * 
 * @constant {string[]} ADMIN_ROUTES
 * @description Routes that should only be accessible to admin users
 */
export const ADMIN_ROUTES = ["/admin"];

/**
 * Checks if a given pathname is an admin route
 * 
 * @param {string} pathname - The pathname to check (e.g., "/admin", "/admin/events")
 * @returns {boolean} True if the pathname is an admin route, false otherwise
 * 
 * @example
 * ```typescript
 * isAdminRoute("/admin") // true
 * isAdminRoute("/admin/events") // true
 * isAdminRoute("/dashboard") // false
 * ```
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Verifies if a user has admin privileges
 * 
 * This function supports multiple admin verification methods:
 * 1. User metadata role check
 * 2. Email-based admin list (recommended for simple setups)
 * 3. Database group membership (for complex setups)
 * 
 * @param {any} user - The Supabase user object
 * @returns {boolean} True if the user has admin privileges, false otherwise
 * 
 * @example
 * ```typescript
 * const user = await supabase.auth.getUser()
 * if (isAdminUser(user.data.user)) {
 *   // User is an admin
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAdminUser(user: any): boolean {
  // Option 1: Check user metadata for admin role
  if (user?.user_metadata?.role === 'admin') {
    return true;
  }
  
  // Option 2: Check user email against admin list (recommended)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (adminEmails.includes(user?.email)) {
    return true;
  }
  
  // Option 3: Check if user is in admin group (if using Supabase groups)
  // This would require additional database queries
  
  return false;
}
