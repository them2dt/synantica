'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/types/event'

interface UseAdminEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  createEvent: (eventData: Partial<Event>) => Promise<Event | null>
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<Event | null>
  deleteEvent: (id: string) => Promise<boolean>
  refetch: () => Promise<void>
}

export function useAdminEvents(): UseAdminEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/events')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: Partial<Event>): Promise<Event | null> => {
    try {
      setError(null)
      
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create event')
      }
      
      const data = await response.json()
      const newEvent = data.event
      
      // Add to local state
      setEvents(prev => [newEvent, ...prev])
      
      return newEvent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating event:', err)
      return null
    }
  }

  const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event | null> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update event')
      }
      
      const data = await response.json()
      const updatedEvent = data.event
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ))
      
      return updatedEvent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating event:', err)
      return null
    }
  }

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete event')
      }
      
      // Remove from local state
      setEvents(prev => prev.filter(event => event.id !== id))
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error deleting event:', err)
      return false
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  }
}
