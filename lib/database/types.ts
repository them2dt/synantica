/**
 * Database types for Supabase integration
 */

export interface DatabaseEvent {
  id: string
  name: string
  description: string
  from_date: string
  to_date: string
  location: string
  country: string
  organizer: string
  from_age?: number
  to_age?: number
  youtube_link?: string
  links: string[]
  type: string
  fields: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface DatabaseEventCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DatabaseTag {
  id: string
  name: string
  slug: string
  color?: string
  usage_count: number
  created_at: string
  updated_at: string
}

export interface DatabaseEventWithRelations extends DatabaseEvent {
  event_categories?: DatabaseEventCategory
  event_tags?: Array<{
    tags: DatabaseTag
  }>
}

export interface SearchEventResult {
  event_id: string
  name: string
  description: string
  type: string
  fields: string[]
  from_age?: number
  to_age?: number
  country: string
  from_date: string
  to_date: string
  location: string
  average_rating: number
  relevance_score: number
}

export interface PopularEventResult {
  event_id: string
  name: string
  type: string
  view_count: number
  average_rating: number
}

export interface EventStatsResult {
  total_registrations: number
  total_views: number
  average_rating: number
  total_reviews: number
}

export interface EventRow {
  id: string
  name: string
  description: string
  from_date: string
  to_date: string
  location: string
  country: string
  organizer: string
  from_age?: number
  to_age?: number
  type: string
  fields: string[]
  status: string
}
