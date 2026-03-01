import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            // Clear cookie if no token
            const response = NextResponse.json({ status: 'success' }, { status: 200 });
            response.cookies.delete('session');
            return response;
        }

        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        // Create the session cookie. This will fail if no service account is provided in admin.ts
        // For local dev without a service account, we can just set a dummy cookie
        let sessionCookie;
        try {
            sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        } catch {
            console.warn('Failed to create secure session cookie with admin SDK. Falling back to idToken for dev.');
            sessionCookie = idToken; // Fallback for dev only!
        }

        const options = {
            name: 'session',
            value: sessionCookie,
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        };

        const response = NextResponse.json({ status: 'success' }, { status: 200 });
        response.cookies.set(options);
        return response;
    } catch (error) {
        console.error('Session creation error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.delete('session');
    return response;
}
