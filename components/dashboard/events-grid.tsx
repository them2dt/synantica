'use client'

import { formatEventDate } from '@/lib/utils/date-formatting'
import { EventCard } from './event-card'
import { Event, EventDirectory } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import { InlineSpinner } from '@/components/ui/loading'
import { GraduationCap } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

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
  void selectedType;
  void eventTypes;

  return (
    <div className="space-y-6">
      {/* Events Grid/List */}
      {isListView ? (
        <>
          {/* Desktop table — hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4 border-r border-slate-200">
                    <ThemedText variant="xs" color="muted" className="uppercase block">Event</ThemedText>
                  </th>
                  <th className="p-4 border-r border-slate-200">
                    <ThemedText variant="xs" color="muted" className="uppercase block">Date Range</ThemedText>
                  </th>
                  <th className="p-4 border-r border-slate-200">
                    <ThemedText variant="xs" color="muted" className="uppercase block">Location</ThemedText>
                  </th>
                  <th className="p-4">
                    <ThemedText variant="xs" color="muted" className="uppercase block">Type</ThemedText>
                  </th>
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
                      <ThemedText variant="base" className="font-medium block">{event.name}</ThemedText>
                      <ThemedText variant="xs" color="muted" className="truncate max-w-[200px] block">{event.description}</ThemedText>
                    </td>
                    <td className="p-4">
                      <ThemedText variant="sm" color="secondary">
                        {formatEventDate(event.fromDate, 'table')} - {formatEventDate(event.toDate, 'table')}
                      </ThemedText>
                    </td>
                    <td className="p-4">
                      <ThemedText variant="sm" color="secondary" className="truncate max-w-[150px]">
                        {event.location}
                      </ThemedText>
                    </td>
                    <td className="p-4">
                      <ThemedText variant="xs" color="muted" className="capitalize px-2 py-1 bg-slate-100">{event.type}</ThemedText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list — shown only on mobile */}
          <div className="md:hidden divide-y divide-slate-100">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onLearnMore={onEventClick}
                variant="list"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-row flex-wrap">
          {events.map((event) => (
            <div key={event.id} className="w-full sm:w-1/2 border-b border-r border-slate-200 p-0 sm:even:border-r-0 last:border-r-0">
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
        <EmptyState
          icon={GraduationCap}
          title="No events found"
          description="Try adjusting your search or filter criteria"
        />
      )}
    </div>
  )
}
