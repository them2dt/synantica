import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminUser } from '@/lib/supabase/admin-routes'

// GET /api/admin/events - Get all events
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Use admin client for elevated permissions and to bypass RLS
    const adminSupabase = createAdminClient()
    const { data: events, error } = await adminSupabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    // Transform database field names to frontend field names
    const transformedEvents = (events || []).map((event: Record<string, unknown>) => ({
      id: event.id as string,
      name: event.name as string,
      description: (event.description as string) || '',
      fromDate: event.from_date as string,
      toDate: event.to_date as string,
      location: event.location as string,
      country: event.country as string,
      organizer: event.organizer as string,
      fromAge: (event.from_age as number) || undefined,
      toAge: (event.to_age as number) || undefined,
      youtubeLink: (event.youtube_link as string) || undefined,
      links: (event.links as string[]) || [],
      type: event.type as string,
      fields: (event.fields as string[]) || [],
      status: (event.status as string) || 'draft',
      createdAt: (event.created_at as string) || new Date().toISOString(),
      updatedAt: (event.updated_at as string) || new Date().toISOString()
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
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
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

    // Use admin client for elevated permissions
    const adminSupabase = createAdminClient()
    const { data: event, error } = await adminSupabase
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
      id: event.id as string,
      name: event.name as string,
      description: (event.description as string) || '',
      fromDate: event.from_date as string,
      toDate: event.to_date as string,
      location: event.location as string,
      country: event.country as string,
      organizer: event.organizer as string,
      fromAge: (event.from_age as number) || undefined,
      toAge: (event.to_age as number) || undefined,
      youtubeLink: (event.youtube_link as string) || undefined,
      links: (event.links as string[]) || [],
      type: event.type as string,
      fields: (event.fields as string[]) || [],
      status: (event.status as string) || 'draft',
      createdAt: (event.created_at as string) || new Date().toISOString(),
      updatedAt: (event.updated_at as string) || new Date().toISOString()
    }

    return NextResponse.json({ event: transformedEvent }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
