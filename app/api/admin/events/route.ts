import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/admin/events - Get all events
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated (you might want to add admin role check)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    // Transform database field names to frontend field names
    const transformedEvents = (events || []).map((event: any) => ({
      id: event.id,
      name: event.name,
      description: event.description || '',
      fromDate: event.from_date,
      toDate: event.to_date,
      location: event.location,
      country: event.country,
      organizer: event.organizer,
      fromAge: event.from_age || undefined,
      toAge: event.to_age || undefined,
      youtubeLink: event.youtube_link || undefined,
      links: event.links || [],
      type: event.type,
      fields: event.fields || [],
      status: event.status || 'draft',
      createdAt: event.created_at || new Date().toISOString(),
      updatedAt: event.updated_at || new Date().toISOString()
    }))

    return NextResponse.json({ events: transformedEvents })
  } catch (error) {
    console.error('Error in GET /api/admin/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      fromDate,
      toDate,
      location,
      country,
      organizer,
      fromAge,
      toAge,
      youtubeLink,
      links,
      type,
      fields,
      status
    } = body

    // Validate required fields
    if (!name || !description || !fromDate || !toDate || !location || !country || !organizer || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        name,
        description,
        from_date: fromDate,
        to_date: toDate,
        location,
        country,
        organizer,
        from_age: fromAge ? parseInt(fromAge) : null,
        to_age: toAge ? parseInt(toAge) : null,
        youtube_link: youtubeLink || null,
        links: links || [],
        type,
        fields: fields || [],
        status: status || 'draft'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }

    // Transform database field names to frontend field names
    const transformedEvent = {
      id: event.id,
      name: event.name,
      description: event.description || '',
      fromDate: event.from_date,
      toDate: event.to_date,
      location: event.location,
      country: event.country,
      organizer: event.organizer,
      fromAge: event.from_age || undefined,
      toAge: event.to_age || undefined,
      youtubeLink: event.youtube_link || undefined,
      links: event.links || [],
      type: event.type,
      fields: event.fields || [],
      status: event.status || 'draft',
      createdAt: event.created_at || new Date().toISOString(),
      updatedAt: event.updated_at || new Date().toISOString()
    }

    return NextResponse.json({ event: transformedEvent }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
