import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // With Firebase, email confirmation is usually handled purely on the client side using SDK functions 
  // like checkActionCode and applyActionCode.
  // The email template should be configured in Firebase to point to a client-side route, not an API route.
  // If this route is hit, we likely need to redirect the user to a client page that handles the action code.

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  if (mode && oobCode) {
    // For password resets:
    if (mode === 'resetPassword') {
      return NextResponse.redirect(new URL(`/auth/update-password?code=${oobCode}`, request.url));
    }
    // For email verification:
    // ...
  }

  // Fallback
  return NextResponse.redirect(new URL('/', request.url));
}
