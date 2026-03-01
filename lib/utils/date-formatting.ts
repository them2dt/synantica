/**
 * Centralized date and time formatting utilities
 * Provides consistent formatting across the application
 */

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
        // Use consistent formatting to avoid hydration issues
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const weekday = weekdays[date.getDay()]
        const month = months[date.getMonth()]
        const day = date.getDate()
        return `${weekday}, ${month} ${day}`

      case 'medium':
        // Use consistent formatting to avoid hydration issues
        const weekdaysLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const weekdayLong = weekdaysLong[date.getDay()]
        const monthLong = monthsLong[date.getMonth()]
        const dayLong = date.getDate()
        return `${weekdayLong}, ${monthLong} ${dayLong}`



      case 'table':
        // Use consistent formatting to avoid hydration issues
        const dayTable = date.getDate().toString().padStart(2, '0')
        const monthTable = (date.getMonth() + 1).toString().padStart(2, '0')
        const yearTable = date.getFullYear()
        return `${dayTable}.${monthTable}.${yearTable}`

      default:
        // Use consistent formatting to avoid hydration issues
        const weekdaysDefault = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const monthsDefault = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const weekdayDefault = weekdaysDefault[date.getDay()]
        const monthDefault = monthsDefault[date.getMonth()]
        const dayDefault = date.getDate()
        return `${weekdayDefault}, ${monthDefault} ${dayDefault}`
    }
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Date formatting error'
  }
}


