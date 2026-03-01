'use client'

import { useState } from 'react'
import {
  Calendar,
  MapPin,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Type,
  Tag,
  FileText,
  Users,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags'
import { InlineSpinner } from '@/components/ui/loading'

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

type SortDirection = 'asc' | 'desc'

export function EventsTable({
  events,
  onEventClick,
  sortBy,
  onSortChange,
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  hasMore = true,
}: EventsTableProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (column: string) => {
    const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortDirection(newDirection)
    onSortChange(`${column}-${newDirection}`)
  }

  const getSortIcon = (column: string) => {
    if (sortBy.startsWith(column)) {
      return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
    }
    return <ArrowUpDown className="w-4 h-4" />
  }

  void handleSort
  void getSortIcon

  return (
    <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent -mx-4">
      <div className="min-w-full inline-block align-middle px-4">
        <table className="w-full border-collapse border border-slate-200 min-w-[800px]">
          <thead>
            <tr className="border-b bg-slate-50/50">
              <th className="text-left p-3 text-slate-500 border-r border-slate-200 sticky left-0 bg-slate-50/50 z-10">
                <div className="flex items-center justify-start gap-2">
                  <Type className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">Event</span>
                </div>
              </th>
              <th className="text-left p-3 text-slate-500 border-r border-slate-200">
                <div className="flex items-center justify-start gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">Date Range</span>
                </div>
              </th>
              <th className="text-left p-3 text-slate-500 border-r border-slate-200">
                <div className="flex items-center justify-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">Location</span>
                </div>
              </th>
              <th className="text-left p-3 text-slate-500 border-r border-slate-200">
                <div className="flex items-center justify-start gap-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">Country</span>
                </div>
              </th>
              <th className="text-left p-3 text-slate-500 border-r border-slate-200">
                <div className="flex items-center justify-start gap-2">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">Type</span>
                </div>
              </th>
              <th className="text-left p-3 text-slate-500 border-r border-slate-200">
                <div className="flex items-center justify-start gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">Fields</span>
                </div>
              </th>
              <th className="text-left p-3 text-slate-500">
                <div className="flex items-center justify-start gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">Age Range</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-slate-100/40 transition-colors">
                <td className="p-3 border-r border-slate-200 sticky left-0 bg-slate-50 z-10">
                  <button
                    onClick={() => onEventClick(event)}
                    className="text-slate-950 text-base max-w-[200px] truncate text-left hover:text-slate-950 hover:underline transition-colors cursor-pointer"
                  >
                    {event.name}
                  </button>
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="text-sm">
                    {formatEventDate(event.fromDate, 'table')}-{formatEventDate(event.toDate, 'table')}
                  </div>
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="text-sm max-w-[120px] truncate" title={event.location}>
                    {event.location}
                  </div>
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{getCountryFlag(event.country)}</span>
                    <span className="truncate" title={getCountryDisplayName(event.country)}>
                      {getCountryDisplayName(event.country)}
                    </span>
                  </div>
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="text-sm capitalize">{event.type}</div>
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="text-sm max-w-[100px] truncate" title={event.fields.join(', ')}>
                    {event.fields.slice(0, 2).join(', ')}
                    {event.fields.length > 2 && '...'}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm">
                    {event.fromAge || 0}-{event.toAge || 99}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showLoadMore && hasMore && events.length > 0 && (
        <div className="flex justify-center py-6">
          <Button onClick={onLoadMore} disabled={loadingMore} variant="outline" size="lg" className="min-w-32">
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
