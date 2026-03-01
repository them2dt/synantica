import { Event } from '@/types/event'

export interface EventWithDetails extends Event {
  category_name: string
  average_rating: number
  tags: string[]
  support_pdfs?: Array<{ name: string; url: string }>
  organization_homepage?: string
  youtube_videos?: string[]
  alumni_contact_email?: string
}

export interface EventRow {
  id: string
  name?: string
  description?: string
  from_date?: string
  to_date?: string
  location?: string
  country?: string
  organizer?: string
  from_age?: number | null
  to_age?: number | null
  youtube_link?: string | null
  links?: string[]
  type?: string
  fields?: string[]
  status?: string
  created_at?: string
  updated_at?: string
}
