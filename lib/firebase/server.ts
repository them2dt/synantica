import { cookies } from 'next/headers';
import { adminAuth } from './admin';

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;

        if (!sessionCookie) return null;

        try {
            const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
            return decodedClaims;
        } catch {
            // If adminAuth fails because there's no service account (local dev),
            // we can attempt a dummy decode if we used idToken as a fallback in the API route.
            // But verifySessionCookie will fail for an idToken.
            // For a robust dev check, we would verify the idToken instead.
            try {
                const decodedToken = await adminAuth.verifyIdToken(sessionCookie, true);
                return decodedToken;
            } catch {
                return null;
            }
        }
    } catch {
        return null;
    }
}
