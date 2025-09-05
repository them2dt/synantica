/**
 * Database types for Supabase integration
 */

export interface DatabaseEvent {
  id: string
  title: string
  description: string
  short_description?: string
  category_id?: string
  field: string
  min_age?: number
  max_age?: number
  region: string
  date: string
  time: string
  end_date?: string
  end_time?: string
  location: string
  venue_details?: string
  is_virtual: boolean
  virtual_link?: string
  registration_required: boolean
  registration_deadline?: string
  is_free: boolean
  price?: number
  currency: string
  status: string
  is_featured: boolean
  is_verified: boolean
  organizer_name: string
  organizer_id?: string
  requirements?: string[]
  prizes?: string[]
  external_links?: string[]
  support_pdfs?: Array<{ name: string; url: string }>
  organization_homepage?: string
  youtube_videos?: string[]
  alumni_contact_email?: string
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
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
  title: string
  description: string
  category_name: string
  field: string
  min_age?: number
  max_age?: number
  region: string
  date: string
  time: string
  location: string
  is_free: boolean
  average_rating: number
  relevance_score: number
}

export interface PopularEventResult {
  event_id: string
  title: string
  category_name: string
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
  title: string
  description: string
  field: string
  min_age?: number
  max_age?: number
  region: string
  date: string
  time: string
  location: string
  is_free: boolean
  event_categories?: {
    name: string
  } | null
}
