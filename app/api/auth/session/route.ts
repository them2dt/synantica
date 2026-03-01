import { NextResponse } from 'next/server'
import { buildSessionCookie, getSessionCookieOptions } from '@/lib/server/auth/session'

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      // Clear cookie if no token
      const response = NextResponse.json({ status: 'success' }, { status: 200 })
      response.cookies.delete('session')
      return response
    }

    const sessionCookie = await buildSessionCookie(idToken)
    const options = getSessionCookieOptions()

    const response = NextResponse.json({ status: 'success' }, { status: 200 })
    response.cookies.set({ ...options, value: sessionCookie })
    return response
  } catch (error) {
    console.error('Session creation error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'success' }, { status: 200 })
  response.cookies.delete('session')
  return response
}
