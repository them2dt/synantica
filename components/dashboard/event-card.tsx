'use client'

import { Calendar, Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { EventCardSkeleton } from '@/components/ui/loading'
import { motion } from 'framer-motion'

/**
 * Props for the event card component
 */
interface EventCardProps {
  event?: Event | EventDirectory
  onLearnMore: (event: Event | EventDirectory) => void
  variant?: 'grid' | 'list'
  loading?: boolean
}

/**
 * Event card component displaying event information
 */
export function EventCard({ event, onLearnMore, variant = 'grid', loading = false }: EventCardProps) {
  // Show skeleton when loading or no event data
  if (loading || !event) {
    return <EventCardSkeleton />
  }

  if (variant === 'list') {
    return (
      <motion.div whileHover={{ y: -4 }} className="h-full" transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex">
            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className="capitalize text-xs"
                    variant={event.category === "hackathon" ? "default" : "secondary"}
                  >
                    {event.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-balance text-primary mb-2">{event.title}</CardTitle>
                <CardDescription className="text-pretty text-sm mb-3 line-clamp-2">{event.description}</CardDescription>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-accent" />
                    {formatEventDate(event.date)}
                    <Clock className="w-4 h-4 ml-2 text-accent" />
                    {event.time}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    {event.location}
                  </div>


                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-accent">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-accent">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button 
                  size="sm" 
                  onClick={() => onLearnMore(event)}
                  className="w-fit"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full" transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge
              className="capitalize"
              variant={event.category === "hackathon" ? "default" : "secondary"}
              style={event.category === "hackathon" ? { backgroundColor: '#FF327D', color: 'white' } : {}}
            >
              {event.category}
            </Badge>
          </div>
          <CardTitle className="text-lg text-balance text-primary">{event.title}</CardTitle>
          <CardDescription className="text-pretty">{event.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 flex-grow">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-accent" />
            {formatEventDate(event.date)}
            <Clock className="w-4 h-4 ml-2 text-accent" />
            {event.time}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            {event.location}
          </div>


          <div className="flex flex-wrap gap-1">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-accent">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-0 mt-auto">
          <Button 
            className="w-full" 
            size="sm" 
            onClick={() => onLearnMore(event)}
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
