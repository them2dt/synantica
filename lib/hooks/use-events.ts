import { useState, useEffect } from 'react'
import { MOCK_EVENTS, EVENT_CATEGORIES } from '@/lib/constants'
import type { Event, EventCategory } from '@/lib/types'

/**
 * Custom hook for managing events data and filtering
 * Provides event filtering, search, and state management
 */
export function useEvents() {
  const [events] = useState<Event[]>(MOCK_EVENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all')
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(MOCK_EVENTS)

  // Update filtered events when search term or category changes
  useEffect(() => {
    let filtered = events

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredEvents(filtered)
  }, [searchTerm, selectedCategory, events])

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }

  /**
   * Get total attendees across all events
   */
  const getTotalAttendees = () => {
    return events.reduce((sum, event) => sum + event.attendees, 0)
  }

  /**
   * Get events happening this week
   */
  const getThisWeekEvents = () => {
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= now && eventDate <= oneWeekFromNow
    }).length
  }

  return {
    events,
    filteredEvents,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
    getTotalAttendees,
    getThisWeekEvents,
    categories: EVENT_CATEGORIES,
  }
}
