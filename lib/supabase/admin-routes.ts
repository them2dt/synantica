// Admin-specific route protection utilities
export const ADMIN_ROUTES = ["/admin"];

export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Admin role check - you can customize this based on your user schema
export function isAdminUser(user: any): boolean {
  // Option 1: Check user metadata for admin role
  if (user?.user_metadata?.role === 'admin') {
    return true;
  }
  
  // Option 2: Check user email against admin list
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (adminEmails.includes(user?.email)) {
    return true;
  }
  
  // Option 3: Check if user is in admin group (if using Supabase groups)
  // This would require additional database queries
  
  return false;
}
