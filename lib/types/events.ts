/**
 * Event category type
 */
export type EventCategory = 
  | 'hackathon' 
  | 'social' 
  | 'workshop' 
  | 'competition' 
  | 'study' 
  | 'wellness'

/**
 * Event file interface
 */
export interface EventFile {
  name: string
  type: string
  url: string
}

/**
 * Event interface
 */
export interface Event {
  id: number
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  category: EventCategory
  attendees: number
  maxAttendees: number
  image: string
  tags: string[]
  files: EventFile[]
}

/**
 * Category interface with icon
 */
export interface Category {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}
