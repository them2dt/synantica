'use client'
import { formatEventDate } from '@/lib/utils/date-formatting'

import { EventCard } from './event-card'

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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-4 font-medium text-slate-500">Event</th>
                <th className="p-4 font-medium text-slate-500">Date Range</th>
                <th className="p-4 font-medium text-slate-500">Location</th>
                <th className="p-4 font-medium text-slate-500">Type</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  <td className="p-4">
                    <div className="font-medium text-slate-950">{event.name}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{event.description}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {formatEventDate(event.fromDate, 'table')} - {formatEventDate(event.toDate, 'table')}
                  </td>
                  <td className="p-4 text-slate-600 truncate max-w-[150px]">{event.location}</td>
                  <td className="p-4">
                    <span className="capitalize px-2 py-1 bg-slate-100 text-slate-600 text-xs">{event.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap">
          {events.map((event) => (
            <div key={event.id} className="w-full md:w-1/2 border-b border-r border-slate-200 p-0 last:border-r-0 md:even:border-r-0">
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
        <div className="flex justify-center px-6 py-6">
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
        <div className="text-center px-6 py-12">
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
