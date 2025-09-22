import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/admin/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
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

    return NextResponse.json({ event: transformedEvent })
  } catch (error) {
    console.error('Error in GET /api/admin/events/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      .update({
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
        status: status || 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
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

    return NextResponse.json({ event: transformedEvent })
  } catch (error) {
    console.error('Error in PUT /api/admin/events/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting event:', error)
      return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/events/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
