'use client'

import { EventCard } from './event-card'
import { EventsTable } from './events-table'
import { Event, EventDirectory } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'
import { Button } from '@/components/ui/button'
import { InlineSpinner } from '@/components/ui/loading'

/**
 * Props for the events grid component
 */
interface EventsGridProps {
  events: Event[] | EventDirectory[]
  selectedType: string
  eventTypes: CategoryWithIcon[]
  onEventClick: (event: Event | EventDirectory) => void
  isListView?: boolean
  sortBy?: string
  onSortChange?: (value: string) => void
  showLoadMore?: boolean
  onLoadMore?: () => void
  loadingMore?: boolean
  hasMore?: boolean
}

/**
 * Events grid component displaying filtered events
 */
export function EventsGrid({
  events,
  selectedType,
  eventTypes,
  onEventClick,
  isListView = false,
  sortBy = 'date-asc',
  onSortChange = () => { },
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  hasMore = true
}: EventsGridProps) {
  // selectedType and eventTypes are used for future filtering enhancements
  // Suppress unused parameter warnings for now
  void selectedType;
  void eventTypes;

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
        <div className="grid gap-6 grid-cols-2">
          {events.map((event) => (
            <div key={event.id}>
              <EventCard
                event={event}
                onLearnMore={onEventClick}
                variant="grid"
              />
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {showLoadMore && hasMore && events.length > 0 && (
        <div className="flex justify-center py-6">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            {loadingMore ? (
              <>
                <InlineSpinner className="mr-2" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500 mb-4">
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
