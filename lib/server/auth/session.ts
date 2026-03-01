import 'server-only'

import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/server/firebase/app'

const SESSION_COOKIE_NAME = 'session'
const SESSION_EXPIRES_MS = 60 * 60 * 24 * 5 * 1000 // 5 days

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: SESSION_EXPIRES_MS,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }
}

export async function buildSessionCookie(idToken: string) {
  try {
    return await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_MS })
  } catch {
    console.warn('Failed to create secure session cookie with admin SDK. Falling back to idToken for dev.')
    return idToken
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionCookie) return null

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
      return decodedClaims
    } catch {
      // If adminAuth fails because there's no service account (local dev),
      // we can attempt a dummy decode if we used idToken as a fallback in the API route.
      // But verifySessionCookie will fail for an idToken.
      // For a robust dev check, we would verify the idToken instead.
      try {
        const decodedToken = await adminAuth.verifyIdToken(sessionCookie, false)
        return decodedToken
      } catch {
        return null
      }
    }
  } catch {
    return null
  }
}
