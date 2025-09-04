'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, ArrowUpDown, ArrowUp, ArrowDown, Type, Tag, FileText, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/types/event'

/**
 * Props for the events table component
 */
interface EventsTableProps {
  events: Event[]
  onEventClick: (event: Event) => void
  sortBy: string
  onSortChange: (value: string) => void
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc'

/**
 * Events table component with sortable columns
 */
export function EventsTable({ events, onEventClick, sortBy, onSortChange }: EventsTableProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-2">
                <Type className="w-4 h-4" />
                <span>Event</span>
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-2">
                <Clock className="w-4 h-4" />
                <span>Time</span>
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-2">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-2">
                <Tag className="w-4 h-4" />
                <span>Category</span>
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-2">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground border-r border-border">
              <div className="flex items-center justify-start gap-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground">
              <div className="flex items-center justify-start gap-2">
                <Target className="w-4 h-4" />
                <span>Action</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b hover:bg-muted/50 transition-colors">
              {/* Event Name */}
              <td className="p-3 border-r border-border">
                <div className="font-medium text-foreground">{event.title}</div>
              </td>

              {/* Date */}
              <td className="p-3 border-r border-border">
                <div className="text-sm">{formatDate(event.date)}</div>
              </td>

              {/* Time */}
              <td className="p-3 border-r border-border">
                <div className="text-sm">{event.time}</div>
              </td>

              {/* Location */}
              <td className="p-3 border-r border-border">
                <div className="text-sm">{event.location}</div>
              </td>


              {/* Category */}
              <td className="p-3 border-r border-border">
                <Badge
                  variant={event.category === "hackathon" ? "default" : "secondary"}
                  className="capitalize text-xs"
                >
                  {event.category}
                </Badge>
              </td>

              {/* Description */}
              <td className="p-3 max-w-xs border-r border-border">
                <div className="text-sm text-muted-foreground truncate">
                  {event.description}
                </div>
              </td>

              {/* Tags */}
              <td className="p-3 border-r border-border">
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </td>

              {/* Action */}
              <td className="p-3">
                <Button 
                  size="sm" 
                  onClick={() => onEventClick(event)}
                  className="h-8"
                >
                  Learn More
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
