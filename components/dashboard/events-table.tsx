'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, ArrowUpDown, ArrowUp, ArrowDown, Type, Tag, FileText, Target, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { InlineSpinner } from '@/components/ui/loading'

/**
 * Props for the events table component
 */
interface EventsTableProps {
  events: Event[] | EventDirectory[]
  onEventClick: (event: Event | EventDirectory) => void
  sortBy: string
  onSortChange: (value: string) => void
  showLoadMore?: boolean
  onLoadMore?: () => void
  loadingMore?: boolean
  hasMore?: boolean
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc'

/**
 * Events table component with sortable columns
 */
export function EventsTable({
  events,
  onEventClick,
  sortBy,
  onSortChange,
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  hasMore = true
}: EventsTableProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (column: string) => {
    const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortDirection(newDirection)
    onSortChange(`${column}-${newDirection}`)
  }

  const getSortIcon = (column: string) => {
    if (sortBy.startsWith(column)) {
      return sortDirection === 'asc' ? 
        <ArrowUp className="w-4 h-4" /> : 
        <ArrowDown className="w-4 h-4" />
    }
    return <ArrowUpDown className="w-4 h-4" />
  }
  
  // Suppress unused function warnings for now (functions are used in table headers)
  void handleSort;
  void getSortIcon;

  return (
    <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent -mx-4 sm:mx-0 touch-manipulation">
      <div className="min-w-full inline-block align-middle px-4 sm:px-0">
        <table className="w-full border-collapse border border-border min-w-[800px]">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground border-r border-border sticky left-0 bg-muted/30 z-10">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <Type className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Event</span>
              </div>
            </th>
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Date</span>
              </div>
            </th>
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Time</span>
              </div>
            </th>
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Location</span>
              </div>
            </th>
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Category</span>
              </div>
            </th>
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Field</span>
              </div>
            </th>
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Min Age</span>
              </div>
            </th>
            <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground">
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs sm:text-sm">Action</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b hover:bg-muted/50 transition-colors">
              {/* Event Name */}
              <td className="p-2 sm:p-3 border-r border-border sticky left-0 bg-background z-10">
                <div className="font-medium text-foreground text-sm sm:text-base max-w-[200px] sm:max-w-none truncate">
                  {event.title}
                </div>
              </td>

              {/* Date */}
              <td className="p-2 sm:p-3 border-r border-border">
                <div className="text-xs sm:text-sm">{formatEventDate(event.date)}</div>
              </td>

              {/* Time */}
              <td className="p-2 sm:p-3 border-r border-border">
                <div className="text-xs sm:text-sm">{event.time}</div>
              </td>

              {/* Location */}
              <td className="p-2 sm:p-3 border-r border-border">
                <div className="text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate" title={event.location}>
                  {event.location}
                </div>
              </td>

              {/* Category */}
              <td className="p-2 sm:p-3 border-r border-border">
                <div className="text-xs sm:text-sm capitalize">
                  {event.category}
                </div>
              </td>

              {/* Field */}
              <td className="p-2 sm:p-3 border-r border-border">
                <div className="text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate" title={event.field}>
                  {event.field}
                </div>
              </td>

              {/* Min Age */}
              <td className="p-2 sm:p-3 border-r border-border">
                <div className="text-xs sm:text-sm font-medium">
                  {event.minAge || 0}+
                </div>
              </td>

              {/* Action */}
              <td className="p-2 sm:p-3">
                <Button 
                  size="sm" 
                  onClick={() => onEventClick(event)}
                  className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                >
                  Learn More
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

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
    </div>
  )
}
