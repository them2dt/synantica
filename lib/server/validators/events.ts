import 'server-only'

export interface CreateEventInput {
  name: string
  description: string
  fromDate: string
  toDate: string
  location: string
  country: string
  organizer: string
  fromAge: number | null
  toAge: number | null
  youtubeLink: string | null
  links: string[]
  type: string
  fields: string[]
}

interface ValidationResult {
  data?: CreateEventInput
  error?: string
}

function parseOptionalInt(value: unknown, min: number, max: number): number | null | 'invalid' {
  if (value === undefined || value === null || value === '') return null
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10)
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return 'invalid'
  return parsed
}

export function validateCreateEventInput(payload: Record<string, unknown>): ValidationResult {
  const {
    name,
    description,
    fromDate,
    toDate,
    location,
    country,
    organizer,
    fromAge,
    toAge,
    youtubeLink,
    links,
    type,
    fields,
  } = payload

  if (typeof name !== 'string' || name.length < 1 || name.length > 200) {
    return { error: 'Event name must be between 1 and 200 characters' }
  }
  if (typeof description !== 'string' || description.length < 1 || description.length > 5000) {
    return { error: 'Description must be between 1 and 5000 characters' }
  }
  if (typeof organizer !== 'string' || organizer.length < 1 || organizer.length > 200) {
    return { error: 'Organizer must be between 1 and 200 characters' }
  }
  if (typeof location !== 'string' || location.length < 1 || location.length > 200) {
    return { error: 'Location must be between 1 and 200 characters' }
  }
  if (typeof country !== 'string' || country.length < 1 || country.length > 100) {
    return { error: 'Country must be between 1 and 100 characters' }
  }
  if (typeof fromDate !== 'string' || typeof toDate !== 'string') {
    return { error: 'Invalid date format for fromDate or toDate' }
  }
  if (!fromDate || Number.isNaN(Date.parse(fromDate)) || !toDate || Number.isNaN(Date.parse(toDate))) {
    return { error: 'Invalid date format for fromDate or toDate' }
  }
  if (new Date(fromDate) > new Date(toDate)) {
    return { error: 'fromDate must be on or before toDate' }
  }

  const parsedFromAge = parseOptionalInt(fromAge, 0, 100)
  if (parsedFromAge === 'invalid') {
    return { error: 'fromAge must be an integer between 0 and 100' }
  }

  const parsedToAge = parseOptionalInt(toAge, 0, 100)
  if (parsedToAge === 'invalid') {
    return { error: 'toAge must be an integer between 0 and 100' }
  }

  if (parsedFromAge !== null && parsedToAge !== null && parsedFromAge > parsedToAge) {
    return { error: 'fromAge must be less than or equal to toAge' }
  }

  let normalizedYoutube: string | null = null
  if (youtubeLink !== undefined && youtubeLink !== null && youtubeLink !== '') {
    if (typeof youtubeLink !== 'string' || youtubeLink.length > 500) {
      return { error: 'youtubeLink must be at most 500 characters' }
    }
    normalizedYoutube = youtubeLink
  }

  const normalizedLinks: string[] = []
  if (links !== undefined && links !== null) {
    if (!Array.isArray(links) || links.length > 10) {
      return { error: 'links must be an array of at most 10 strings, each at most 500 characters' }
    }
    for (const link of links) {
      if (typeof link !== 'string' || link.length > 500) {
        return { error: 'links must be an array of at most 10 strings, each at most 500 characters' }
      }
      normalizedLinks.push(link)
    }
  }

  const normalizedFields: string[] = []
  if (fields !== undefined && fields !== null) {
    if (!Array.isArray(fields) || fields.length > 20) {
      return { error: 'fields must be an array of at most 20 items' }
    }
    for (const field of fields) {
      if (typeof field !== 'string') {
        return { error: 'fields must be an array of strings' }
      }
      normalizedFields.push(field)
    }
  }

  if (typeof type !== 'string' || !type) {
    return { error: 'Missing required fields' }
  }

  return {
    data: {
      name,
      description,
      fromDate,
      toDate,
      location,
      country,
      organizer,
      fromAge: parsedFromAge,
      toAge: parsedToAge,
      youtubeLink: normalizedYoutube,
      links: normalizedLinks,
      type,
      fields: normalizedFields,
    },
  }
}
