'use client'

import { useState, useEffect, useCallback } from 'react'
import { AGGridEventsTable } from '@/components/ui/ag-grid-events-table'
import { Event } from '@/types/event'
import { AlertCircle } from 'lucide-react'

/**
 * EventsManagementPage - Main admin page for event management
 * 
 * This page provides the primary interface for administrators to manage events.
 * It includes the AG-Grid table for CRUD operations and handles loading/error states.
 * 
 * @returns {JSX.Element} The rendered events management page
 * 
 * @features
 * - Event listing with AG-Grid table
 * - Add, edit, delete events
 * - Loading and error states
 * - Real-time data updates
 * 
 * @security
 * - Protected by admin middleware
 * - Requires admin authentication
 * - Uses admin API endpoints
 */
export default function EventsManagementPage() {
  /** Array of events to display in the admin table */
  const [events, setEvents] = useState<Event[]>([])
  /** Loading state for data fetching operations */
  const [loading, setLoading] = useState(true)
  /** Error message for failed operations */
  const [error, setError] = useState<string | null>(null)

  /**
   * Loads all events from the admin API
   * 
   * @async
   * @function loadEvents
   * @returns {Promise<void>}
   * 
   * @throws {Error} When API request fails
   * 
   * @example
   * ```typescript
   * await loadEvents()
   * ```
   */
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

  /**
   * Handles adding a new event via the admin API
   * 
   * @async
   * @function handleAddEvent
   * @param {Partial<Event>} eventData - The event data to create
   * @returns {Promise<Event | null>} The created event or null if failed
   * 
   * @throws {Error} When API request fails
   * 
   * @example
   * ```typescript
   * const newEvent = await handleAddEvent({
   *   name: 'New Event',
   *   description: 'Event description',
   *   fromDate: '2024-01-01',
   *   toDate: '2024-01-02'
   * })
   * ```
   */
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

  /**
   * Handles updating an existing event via the admin API
   * 
   * @async
   * @function handleUpdateEvent
   * @param {string} id - The ID of the event to update
   * @param {Partial<Event>} eventData - The updated event data
   * @returns {Promise<Event | null>} The updated event or null if failed
   * 
   * @throws {Error} When API request fails
   * 
   * @example
   * ```typescript
   * const updatedEvent = await handleUpdateEvent('event-id-123', {
   *   name: 'Updated Event Name',
   *   description: 'Updated description'
   * })
   * ```
   */
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

  /**
   * Handles deleting an event via the admin API
   * 
   * @async
   * @function handleDeleteEvent
   * @param {string} id - The ID of the event to delete
   * @returns {Promise<boolean>} True if deletion succeeded, false otherwise
   * 
   * @throws {Error} When API request fails
   * 
   * @example
   * ```typescript
   * const success = await handleDeleteEvent('event-id-123')
   * if (success) {
   *   console.log('Event deleted successfully')
   * }
   * ```
   */
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


