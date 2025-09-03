'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Props for the quick stats component
 */
interface QuickStatsProps {
  totalEvents: number
  thisWeekEvents: number
  totalAttendees: number
}

/**
 * Quick stats sidebar component showing event statistics
 */
export function QuickStats({ totalEvents, thisWeekEvents, totalAttendees }: QuickStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-primary">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Events</span>
          <span className="font-medium">{totalEvents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">This Week</span>
          <span className="font-medium">{thisWeekEvents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Attendees</span>
          <span className="font-medium text-primary">{totalAttendees}</span>
        </div>
      </CardContent>
    </Card>
  )
}
