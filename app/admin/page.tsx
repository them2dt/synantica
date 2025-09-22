'use client'

import { useState, useEffect, useCallback } from 'react'
import { AGGridEventsTable } from '@/components/ui/ag-grid-events-table'
import { Event } from '@/types/event'
import { AlertCircle } from 'lucide-react'

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
      // No need to manually update state, AG-Grid will get the new row
      loadEvents() // Reload to get the new event with its ID from the DB
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
      // The grid handles the visual update, but we can reload to ensure consistency
      // For performance, we might just update the row in-place in a real app
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
      // No need to manually update state, AG-Grid will remove the row
      return true
    } catch (err) {
      console.error('Error deleting event:', err)
      return false
    }
  }, [])

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Events</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadEvents}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] px-5">
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
        <p className="text-gray-600">Add, edit, and manage all events using the grid below.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <AGGridEventsTable
          events={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}
    </div>
  )
}


