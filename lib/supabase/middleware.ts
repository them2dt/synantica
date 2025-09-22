import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { isPublicRoute } from "./public-routes";
import { isAdminRoute } from "./admin-routes";

// Edge Runtime compatible admin check
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAdminUserEdge(user: any): boolean {
  // Check user metadata for admin role
  if (user?.user_metadata?.role === 'admin') {
    return true;
  }
  
  // Check user email against admin list (recommended)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (adminEmails.includes(user?.email as string)) {
    return true;
  }
  
  return false;
}

/**
 * Updates the user session and handles route protection
 * 
 * This middleware function runs on every request and:
 * 1. Creates a Supabase client for session management
 * 2. Checks if the user is authenticated
 * 3. Redirects unauthenticated users to login for protected routes
 * 4. Redirects non-admin users away from admin routes
 * 5. Maintains session state across requests
 * 
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} The response with updated session
 * 
 * @security
 * - Protects all non-public routes
 * - Enforces admin access control
 * - Maintains secure session handling
 * 
 * @example
 * ```typescript
 * // This is automatically called by Next.js middleware
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 * ```
 */
export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user && !isPublicRoute(request.nextUrl.pathname)) {
    // No user detected on a protected route; redirect to the login page.
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Additional admin route protection
  if (user && isAdminRoute(request.nextUrl.pathname)) {
    if (!isAdminUserEdge(user)) {
      // User is authenticated but not an admin; redirect to dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
