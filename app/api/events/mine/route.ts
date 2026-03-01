import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth/require'
import { listUserEvents } from '@/lib/server/services/events-service'

export async function GET() {
  try {
    const { user, response } = await requireUser()

    if (response) {
      return response
    }

    const events = await listUserEvents(user.uid)
    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error in GET /api/events/mine:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
