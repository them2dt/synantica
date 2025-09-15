/**
 * Event-related types and interfaces
 */

/**
 * Event status enum
 */
export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

/**
 * Event registration status
 */
export enum RegistrationStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  FULL = 'full',
  CANCELLED = 'cancelled'
}

/**
 * Main Event interface
 * Based on the current usage and the event detail page requirements
 */
export interface Event {
  // Core identification
  id: string
  title: string
  description: string
  shortDescription?: string
  
  // Categorization
  category: string
  tags: string[]
  field: string
  minAge?: number
  maxAge?: number
  region: string
  
  // Date and time
  date: string
  time: string
  endDate?: string
  endTime?: string
  
  // Multi-day event support
  isMultiDay?: boolean
  duration?: number // Duration in days
  recurringPattern?: 'none' | 'daily' | 'weekly' | 'monthly'
  recurringEndDate?: string
  eventSchedule?: Array<{
    date: string
    startTime: string
    endTime: string
    title?: string
    description?: string
    location?: string
  }>
  
  // Location
  location: string
  venueDetails?: string
  isVirtual?: boolean
  virtualLink?: string
  
  
  // Pricing
  isFree: boolean
  price?: number
  currency?: string
  
  
  // Status and metadata
  status: EventStatus
  isFeatured?: boolean
  isVerified?: boolean
  
  // Additional information
  organizer: string
  organizerId?: string
  requirements?: string[]
  prizes?: string[]
  externalLinks?: string[]
  
  // Resources and links
  supportPdfs?: Array<{ name: string; url: string }>
  organizationHomepage?: string
  youtubeVideos?: string[]
  alumniContactEmail?: string
  
  // Analytics
  viewCount?: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
}


/**
 * Event review interface
 */
export interface EventReview {
  id: string
  eventId: string
  userId: string
  rating: number // 1-5 stars
  title?: string
  comment?: string
  isVerified: boolean
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Event filter options
 */
export interface EventFilters {
  search?: string
  category?: string
  field?: string
  minAge?: number
  maxAge?: number
  region?: string
  dateFrom?: string
  dateTo?: string
  isFree?: boolean
  status?: EventStatus
  limit?: number
  offset?: number
}

/**
 * Event sort options
 */
export type EventSortBy = 
  | 'date-asc' 
  | 'date-desc' 
  | 'title-asc' 
  | 'title-desc' 
  | 'age-asc'
  | 'age-desc'
  | 'created-asc'
  | 'created-desc'

/**
 * Event view mode
 */
export type EventViewMode = 'grid' | 'list'

/**
 * Optimized Event interface for directory/listing views
 * Contains only essential fields for performance and reduced payload size
 */
export interface EventDirectory {
  // Core identification
  id: string
  title: string
  description?: string
  shortDescription?: string

  // Categorization (simplified)
  category: string
  field: string
  tags: string[]

  // Age and region filters
  minAge?: number
  maxAge?: number
  region: string

  // Date and time
  date: string
  time: string
  endDate?: string
  endTime?: string

  // Location (simplified)
  location: string
  isVirtual?: boolean

  // Pricing
  isFree: boolean

  // Status
  status: EventStatus
  isFeatured?: boolean

  // Organizer (simplified)
  organizer: string

  // Analytics
  viewCount?: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * Event form data for creating/editing events
 */
export interface EventFormData {
  title: string
  description: string
  shortDescription?: string
  field: string
  category: string
  tags: string[]
  minAge?: number
  maxAge?: number
  region: string
  date: string
  time: string
  endDate?: string
  endTime?: string
  isMultiDay?: boolean
  duration?: number
  recurringPattern?: 'none' | 'daily' | 'weekly' | 'monthly'
  recurringEndDate?: string
  eventSchedule?: Array<{
    date: string
    startTime: string
    endTime: string
    title?: string
    description?: string
    location?: string
  }>
  location: string
  venueDetails?: string
  isVirtual?: boolean
  virtualLink?: string
  registrationRequired: boolean
  registrationDeadline?: string
  isFree: boolean
  price?: number
  currency?: string
  requirements?: string[]
  prizes?: string[]
  externalLinks?: string[]
}
