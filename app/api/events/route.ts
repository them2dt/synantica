import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth/require'
import { createEvent } from '@/lib/server/services/events-service'
import { validateCreateEventInput } from '@/lib/server/validators/events'

export async function POST(request: NextRequest) {
  try {
    const { user, response } = await requireUser()

    if (response) {
      return response
    }

    const body = await request.json()
    const validation = validateCreateEventInput(body as Record<string, unknown>)

    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const event = await createEvent(user, validation.data!)
    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
