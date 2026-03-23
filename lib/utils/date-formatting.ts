/**
 * Centralized date and time formatting utilities
 * Provides consistent formatting across the application
 */

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 * Returns a human-readable relative label for an event's start/end dates.
 * Used on event cards to show urgency and status at a glance.
 */
export function getRelativeDateLabel(fromDate: string, toDate?: string): {
  label: string
  status: 'past' | 'ongoing' | 'upcoming-soon' | 'upcoming' | 'future'
} {
  if (!fromDate) return { label: '', status: 'future' }
  try {
    const now = new Date()
    const from = new Date(fromDate)
    const to = toDate ? new Date(toDate) : from
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const fromDay = new Date(from.getFullYear(), from.getMonth(), from.getDate())
    const toDay = new Date(to.getFullYear(), to.getMonth(), to.getDate())
    const diffDays = Math.round((fromDay.getTime() - today.getTime()) / 86400000)

    if (toDay < today) return { label: 'Past event', status: 'past' }
    if (fromDay <= today) return { label: 'Ongoing', status: 'ongoing' }
    if (diffDays === 0) return { label: 'Starts today', status: 'upcoming-soon' }
    if (diffDays === 1) return { label: 'Starts tomorrow', status: 'upcoming-soon' }
    if (diffDays <= 7) return { label: `Starts in ${diffDays} days`, status: 'upcoming-soon' }
    if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7)
      return { label: `In ${weeks} week${weeks > 1 ? 's' : ''}`, status: 'upcoming' }
    }
    return { label: '', status: 'future' }
  } catch {
    return { label: '', status: 'future' }
  }
}

/**
 * Date format options for different use cases
 */
type DateFormat =
  | 'short'      // "Mon, Jan 1" - for cards and tables
  | 'medium'     // "Monday, January 1" - for detailed views
  | 'table'      // "01.01.2024" - for table display


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
        return `${WEEKDAYS_SHORT[date.getDay()]}, ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`

      case 'medium':
        return `${WEEKDAYS_LONG[date.getDay()]}, ${MONTHS_LONG[date.getMonth()]} ${date.getDate()}`

      case 'table': {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
      }

      default:
        return `${WEEKDAYS_SHORT[date.getDay()]}, ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`
    }
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Date formatting error'
  }
}


