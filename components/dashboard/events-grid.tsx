'use client'

import { EventCard } from './event-card'
import { EventsTable } from './events-table'
import { Event } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'

/**
 * Props for the events grid component
 */
interface EventsGridProps {
  events: Event[]
  selectedCategory: string
  categories: CategoryWithIcon[]
  onEventClick: (event: Event) => void
  isListView?: boolean
  sortBy?: string
  onSortChange?: (value: string) => void
}

/**
 * Events grid component displaying filtered events
 */
export function EventsGrid({ events, selectedCategory, categories, onEventClick, isListView = false, sortBy = 'date-asc', onSortChange = () => {} }: EventsGridProps) {
  // selectedCategory and categories are used for future filtering enhancements
  // Suppress unused parameter warnings for now
  void selectedCategory;
  void categories;

  return (
    <div className="space-y-6">
      {/* Events Grid/List */}
      {isListView ? (
        <EventsTable
          events={events}
          onEventClick={onEventClick}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onLearnMore={onEventClick}
              variant="grid"
            />
          ))}
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <div className="w-12 h-12 mx-auto mb-4 opacity-50">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-lg">No events found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}
    </div>
  )
}
