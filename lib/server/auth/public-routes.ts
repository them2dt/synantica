import 'server-only'

// Helper utilities for determining which routes are publicly accessible.
// A route is public if the pathname exactly matches or begins with one of
// the prefixes defined in PUBLIC_ROUTES.
const PUBLIC_ROUTES = [
  '/',
  '/events',
  '/dashboard',
  '/profile',
  '/test-og',
  '/api/auth/session',
]

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}
