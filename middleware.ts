import { NextResponse, type NextRequest } from 'next/server'
import { isPublicRoute } from '@/lib/server/auth/public-routes'

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie && !isPublicRoute(request.nextUrl.pathname)) {
    // No user detected on a protected route; redirect to the login page.
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/og|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
