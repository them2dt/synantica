'use client'

import { useState, useEffect, useCallback } from 'react'
import { EventsTable } from '@/components/admin/events-table'
import { Event } from '@/types/event'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * EventsManagementPage - Main admin page for event management
 */
export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/events')
      if (!response.ok) throw new Error('Failed to load events')
      const data = await response.json()
      setEvents(data.events || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const handleAddEvent = useCallback(async (eventData: Partial<Event>) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })
      if (!response.ok) throw new Error('Failed to add event')
      const newEvent = await response.json()
      loadEvents()
      return newEvent
    } catch (err) {
      console.error('Error adding event:', err)
      return null
    }
  }, [loadEvents])

  const handleUpdateEvent = useCallback(async (id: string, eventData: Partial<Event>) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })
      if (!response.ok) throw new Error('Failed to update event')
      const updatedEvent = await response.json()
      loadEvents();
      return updatedEvent
    } catch (err) {
      console.error('Error updating event:', err)
      return null
    }
  }, [loadEvents])

  const handleDeleteEvent = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete event')
      return true
    } catch (err) {
      console.error('Error deleting event:', err)
      return false
    }
  }, [])

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl text-slate-950 mb-2">Error Loading Events</h2>
        <p className="text-slate-500 mb-4">{error}</p>
        <Button onClick={loadEvents}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen py-10 px-6 bg-slate-50">
      <div className="flex-shrink-0 mb-6 max-w-[1100px] w-full mx-auto">
        <h1 className="text-3xl text-slate-950">Events Management</h1>
        <p className="text-slate-500 mt-2">Add, edit, and manage all events. Click on any row to edit.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-none h-8 w-8 border-b-2 border-slate-950"></div>
        </div>
      ) : (
        <div className="max-w-[1100px] w-full mx-auto">
          <EventsTable
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      )}
    </div>
  )
}
