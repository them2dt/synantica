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
  
  // Date and time
  date: string
  time: string
  endDate?: string
  endTime?: string
  
  // Location
  location: string
  venueDetails?: string
  isVirtual?: boolean
  virtualLink?: string
  
  // Registration
  registrationRequired: boolean
  registrationDeadline?: string
  
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
  
  // Analytics
  viewCount?: number
  registrationCount?: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

/**
 * Event registration interface
 */
export interface EventRegistration {
  id: string
  eventId: string
  userId: string
  registrationDate: string
  status: 'registered' | 'cancelled' | 'attended' | 'no_show'
  checkInTime?: string
  checkOutTime?: string
  dietaryRestrictions?: string
  accessibilityNeeds?: string
  emergencyContact?: string
  notes?: string
  paymentStatus?: 'pending' | 'paid' | 'refunded'
  paymentAmount?: number
  paymentReference?: string
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
  date?: string
  subject?: string
  location?: string
  isFree?: boolean
  isVirtual?: boolean
  status?: EventStatus
}

/**
 * Event sort options
 */
export type EventSortBy = 
  | 'date-asc' 
  | 'date-desc' 
  | 'title-asc' 
  | 'title-desc' 
  | 'created-asc'
  | 'created-desc'

/**
 * Event view mode
 */
export type EventViewMode = 'grid' | 'list'

/**
 * Event form data for creating/editing events
 */
export interface EventFormData {
  title: string
  description: string
  shortDescription?: string
  category: string
  tags: string[]
  date: string
  time: string
  endDate?: string
  endTime?: string
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
