'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import Image from 'next/image'

/**
 * Event data interface
 */
export interface Event {
  id: string
  title: string
  description: string
  category: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  image?: string
  tags: string[]
}

/**
 * Props for the event card component
 */
interface EventCardProps {
  event: Event
  onLearnMore: (event: Event) => void
}

/**
 * Event card component displaying event information
 */
export function EventCard({ event, onLearnMore }: EventCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const attendancePercentage = (event.attendees / event.maxAttendees) * 100

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden bg-muted">
        {!imageError && event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <ImagePlaceholder 
            text="Event Image" 
            size="lg"
          />
        )}
        
        {imageLoading && !imageError && (
          <div className="absolute inset-0">
            <ImagePlaceholder 
              text="Loading..." 
              size="lg"
              loading={true}
            />
          </div>
        )}
        
        <Badge
          className="absolute top-3 left-3 capitalize"
          variant={event.category === "hackathon" ? "default" : "secondary"}
        >
          {event.category}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-lg text-balance text-primary">{event.title}</CardTitle>
        <CardDescription className="text-pretty">{event.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {formatDate(event.date)}
          <Clock className="w-4 h-4 ml-2" />
          {event.time}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {event.location}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>
            {event.attendees}/{event.maxAttendees} attending
          </span>
          <div className="flex-1 bg-muted rounded-full h-2 ml-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          size="sm" 
          onClick={() => onLearnMore(event)}
        >
          Learn More
        </Button>
      </CardFooter>
    </Card>
  )
}
