/**
 * Admin user verification utilities
 */

/**
 * Verifies if a user has admin privileges
 *
 * @param {any} user - The authenticated user object
 * @returns {boolean} True if the user has admin privileges, false otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAdminUser(user: any): boolean {
  if (!user) return false;

  // Check user custom claims for admin role
  if (user?.role === 'admin') {
    return true;
  }

  // Check user email against admin list (recommended)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (adminEmails.includes(user?.email)) {
    return true;
  }

  return false;
}
