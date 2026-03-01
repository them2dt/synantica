/**
 * Event-related types and interfaces
 */

/**
 * Event status enum
 */
export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled'
}

/**
 * Main Event interface - Clean and simplified
 */
export interface Event {
  // Core identification
  id: string
  name: string
  description: string

  // Date range
  fromDate: string
  toDate: string

  // Location
  location: string
  country: string

  // Organizer
  organizer: string

  // Age range
  fromAge?: number
  toAge?: number

  // Media and links
  youtubeLink?: string
  links: string[]

  // Categorization
  type: string
  fields: string[]

  // Status
  status: EventStatus

  // Timestamps
  createdAt: string
  updatedAt: string
}



/**
 * Event filter options - Updated for new structure
 */
export interface EventFilters {
  search?: string
  type?: string
  fields?: string[]
  fromAge?: number
  toAge?: number
  country?: string
  fromDate?: string
  toDate?: string
  status?: EventStatus
  limit?: number
  offset?: number
}



/**
 * Optimized Event interface for directory/listing views
 * Contains only essential fields for performance and reduced payload size
 */
export interface EventDirectory {
  // Core identification
  id: string
  name: string
  description?: string

  // Categorization (simplified)
  type: string
  fields: string[]

  // Age and location filters
  fromAge?: number
  toAge?: number
  country: string

  // Date range
  fromDate: string
  toDate: string

  // Location (simplified)
  location: string

  // Status
  status: EventStatus

  // Organizer (simplified)
  organizer: string

  // Media and links
  youtubeLink?: string
  links: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
}
