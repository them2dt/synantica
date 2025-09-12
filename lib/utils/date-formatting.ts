/**
 * Centralized date and time formatting utilities
 * Provides consistent formatting across the application
 */

/**
 * Date format options for different use cases
 */
export type DateFormat =
  | 'short'      // "Mon, Jan 1" - for cards and tables
  | 'medium'     // "Monday, January 1" - for detailed views
  | 'long'       // "Monday, January 1, 2024" - for profiles
  | 'full'       // "Monday, January 1, 2024 at 2:30 PM" - for complete info
  | 'date-only'  // "1/1/2024" - simple date format

/**
 * Time format options
 */
export type TimeFormat =
  | 'short'      // "2:30 PM"
  | 'medium'     // "2:30:45 PM"
  | '24h'       // "14:30"

/**
 * Formats a date string according to the specified format
 * @param dateString - ISO date string or Date object
 * @param format - Desired date format
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatEventDate('2024-01-15T10:30:00Z', 'short')    // "Mon, Jan 15"
 * formatEventDate('2024-01-15T10:30:00Z', 'long')     // "Monday, January 15, 2024"
 * formatEventDate('2024-01-15T10:30:00Z', 'full')     // "Monday, January 15, 2024 at 10:30 AM"
 * ```
 */
export function formatEventDate(
  dateString: string | Date | null | undefined,
  format: DateFormat = 'short'
): string {
  if (!dateString) return 'Date not available'

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }

    switch (format) {
      case 'short':
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })

      case 'medium':
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })

      case 'long':
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })

      case 'full':
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })

      case 'date-only':
        return date.toLocaleDateString("en-US")

      default:
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
    }
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Date formatting error'
  }
}

/**
 * Formats a time string according to the specified format
 * @param timeString - Time string (HH:MM or HH:MM:SS)
 * @param format - Desired time format
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * formatEventTime('14:30:00', 'short')    // "2:30 PM"
 * formatEventTime('14:30:00', '24h')      // "14:30"
 * ```
 */
export function formatEventTime(
  timeString: string | null | undefined,
  format: TimeFormat = 'short'
): string {
  if (!timeString) return 'Time not available'

  try {
    // Handle both HH:MM and HH:MM:SS formats
    const [hours, minutes] = timeString.split(':')
    const hour24 = parseInt(hours, 10)
    const minute = parseInt(minutes, 10)

    if (isNaN(hour24) || isNaN(minute)) {
      return 'Invalid time'
    }

    switch (format) {
      case 'short':
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
        const ampm = hour24 >= 12 ? 'PM' : 'AM'
        return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`

      case 'medium':
        const hour12Med = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
        const ampmMed = hour24 >= 12 ? 'PM' : 'AM'
        return `${hour12Med}:${minute.toString().padStart(2, '0')}:00 ${ampmMed}`

      case '24h':
        return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

      default:
        return formatEventTime(timeString, 'short')
    }
  } catch (error) {
    console.warn('Error formatting time:', error)
    return 'Time formatting error'
  }
}

/**
 * Formats both date and time together
 * @param dateString - Date string
 * @param timeString - Time string
 * @param dateFormat - Date format to use
 * @param timeFormat - Time format to use
 * @returns Formatted date and time string
 *
 * @example
 * ```typescript
 * formatEventDateTime('2024-01-15', '14:30:00', 'short', 'short')
 * // "Mon, Jan 15 at 2:30 PM"
 * ```
 */
export function formatEventDateTime(
  dateString: string | Date | null | undefined,
  timeString: string | null | undefined,
  dateFormat: DateFormat = 'short',
  timeFormat: TimeFormat = 'short'
): string {
  const date = formatEventDate(dateString, dateFormat)
  const time = formatEventTime(timeString, timeFormat)

  if (date.includes('not available') || date.includes('error')) {
    return date
  }

  if (time.includes('not available') || time.includes('error')) {
    return date
  }

  return `${date} at ${time}`
}

/**
 * Checks if a date is in the past
 * @param dateString - Date string to check
 * @returns True if the date is in the past
 */
export function isDateInPast(dateString: string | Date | null | undefined): boolean {
  if (!dateString) return false

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const now = new Date()

    // Compare dates (ignore time for day-level comparison)
    return date < new Date(now.getFullYear(), now.getMonth(), now.getDate())
  } catch (error) {
    console.warn('Error checking date:', error)
    return false
  }
}

/**
 * Checks if a date is today
 * @param dateString - Date string to check
 * @returns True if the date is today
 */
export function isDateToday(dateString: string | Date | null | undefined): boolean {
  if (!dateString) return false

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const today = new Date()

    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate()
  } catch (error) {
    console.warn('Error checking date:', error)
    return false
  }
}

/**
 * Gets relative time description (e.g., "in 3 days", "2 days ago")
 * @param dateString - Date string to compare
 * @returns Relative time description
 */
export function getRelativeTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'Date not available'

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 1) return `In ${diffDays} days`
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`

    return formatEventDate(date, 'short')
  } catch (error) {
    console.warn('Error calculating relative time:', error)
    return formatEventDate(dateString, 'short')
  }
}

/**
 * Legacy function for backward compatibility with existing event cards
 * @deprecated Use formatEventDate with 'short' format instead
 */
export function formatDate(dateString: string): string {
  return formatEventDate(dateString, 'short')
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use formatEventDate with 'long' format instead
 */
export function formatDateLong(dateString: string): string {
  return formatEventDate(dateString, 'long')
}
