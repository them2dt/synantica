'use client'

import { Calendar, MapPin, Users } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { Event } from '@/types/event'

export function EventDetailsSection({ event }: { event: Event }) {
    return (
        <CardContent className="p-0">
            <div className="flex flex-wrap gap-3 sm:gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {event.location}
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    Organized by {event.organizer}
                </div>
                {event.fromAge && event.toAge && (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        Ages {event.fromAge}-{event.toAge}
                    </div>
                )}
            </div>
        </CardContent>
    )
}
