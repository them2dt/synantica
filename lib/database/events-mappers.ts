import { Event, EventDirectory, EventFilters, EventStatus } from '@/types/event'
import type { EventRow, EventWithDetails } from './events-types'

const defaultTimestamp = () => new Date().toISOString()

const normalizeStatus = (status?: string): EventStatus => {
  switch ((status || '').toLowerCase()) {
    case EventStatus.DRAFT:
      return EventStatus.DRAFT
    case EventStatus.CANCELLED:
      return EventStatus.CANCELLED
    case EventStatus.PUBLISHED:
      return EventStatus.PUBLISHED
    case EventStatus.PENDING_REVIEW:
    case 'pending_review':
      return EventStatus.PENDING_REVIEW
    case EventStatus.REJECTED:
    case 'rejected':
      return EventStatus.REJECTED
    default:
      return EventStatus.PUBLISHED
  }
}

export function mapFirestoreDataToEventRow(id: string, data: Record<string, unknown>): EventRow {
  return { id, ...(data as Omit<EventRow, 'id'>) }
}

export function mapEventRowToEvent(row: EventRow): Event {
  return {
    id: row.id,
    name: row.name || '',
    description: row.description || '',
    fromDate: row.from_date || '',
    toDate: row.to_date || '',
    location: row.location || '',
    country: row.country || '',
    organizer: row.organizer || '',
    fromAge: row.from_age ?? undefined,
    toAge: row.to_age ?? undefined,
    youtubeLink: row.youtube_link ?? undefined,
    links: row.links || [],
    type: row.type || '',
    fields: row.fields || [],
    status: normalizeStatus(row.status),
    submittedBy: row.submitted_by,
    submittedByEmail: row.submitted_by_email,
    createdAt: row.created_at || defaultTimestamp(),
    updatedAt: row.updated_at || defaultTimestamp(),
  }
}

export function mapEventRowToEventDirectory(row: EventRow): EventDirectory {
  const base = mapEventRowToEvent(row)

  return {
    id: base.id,
    name: base.name,
    description: base.description,
    type: base.type,
    fields: base.fields,
    fromAge: base.fromAge,
    toAge: base.toAge,
    country: base.country,
    fromDate: base.fromDate,
    toDate: base.toDate,
    location: base.location,
    status: base.status,
    submittedBy: base.submittedBy,
    submittedByEmail: base.submittedByEmail,
    organizer: base.organizer,
    youtubeLink: base.youtubeLink,
    links: base.links,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
  }
}

export function mapEventRowToEventWithDetails(row: EventRow): EventWithDetails {
  const base = mapEventRowToEvent(row)

  return {
    ...base,
    category_name: base.type,
    average_rating: 0,
    tags: base.fields,
  }
}

export function applyEventFilters(rows: EventRow[], filters: EventFilters): EventRow[] {
  let filtered = rows

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter((event) =>
      (event.name && event.name.toLowerCase().includes(searchLower)) ||
      (event.description && event.description.toLowerCase().includes(searchLower)) ||
      (event.organizer && event.organizer.toLowerCase().includes(searchLower))
    )
  }

  if (filters.fields && filters.fields.length > 0) {
    filtered = filtered.filter((event) =>
      event.fields && filters.fields!.some((field) => event.fields!.includes(field))
    )
  }

  if (filters.fromAge !== undefined || filters.toAge !== undefined) {
    const minAge = filters.fromAge || 0
    const maxAge = filters.toAge || 99
    filtered = filtered.filter((event) =>
      (event.from_age || 0) <= maxAge && (event.to_age || 99) >= minAge
    )
  }

  if (filters.fromDate) {
    filtered = filtered.filter((event) => event.from_date && event.from_date >= filters.fromDate!)
  }

  if (filters.toDate) {
    filtered = filtered.filter((event) => event.to_date && event.to_date <= filters.toDate!)
  }

  if (filters.offset !== undefined) {
    const start = filters.offset
    const end = filters.limit ? start + filters.limit : undefined
    filtered = filtered.slice(start, end)
  }

  return filtered
}
