'use client'

import { EventCard, type Event } from './event-card'

export type { Event }

/**
 * Props for the events grid component
 */
interface EventsGridProps {
  events: Event[]
  selectedCategory: string
  categories: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>
  onEventClick: (event: Event) => void
  isListView?: boolean
}

/**
 * Events grid component displaying filtered events
 */
export function EventsGrid({ events, selectedCategory, categories, onEventClick, isListView = false }: EventsGridProps) {
  const categoryLabel = selectedCategory === "all" 
    ? "All Events" 
    : categories.find((c) => c.value === selectedCategory)?.label || "All Events"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-2">
          {categoryLabel}
        </h2>
        <p className="text-muted-foreground">
          {events.length} event{events.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Events Grid/List */}
      <div className={isListView ? "space-y-4" : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onLearnMore={onEventClick}
            variant={isListView ? "list" : "grid"}
          />
        ))}
      </div>

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
