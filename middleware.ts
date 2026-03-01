import { NextResponse, type NextRequest } from "next/server";
import { isPublicRoute } from "@/lib/firebase/public-routes";
import { isAdminRoute } from "@/lib/firebase/admin-routes";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie && !isPublicRoute(request.nextUrl.pathname)) {
    // No user detected on a protected route; redirect to the login page.
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Admin routing check: since parsing firebase-admin session manually requires
  // the admin SDK, which isn't available in Edge runtime, we either assume
  // non-admin here and do a deeper check in Server Components, or use a separate admin cookie.
  // For now, if it's an admin route, verify in the layout/page.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/og|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
