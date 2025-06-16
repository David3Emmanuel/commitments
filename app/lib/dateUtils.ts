/**
 * Utility functions for date-related operations
 */

/**
 * Checks if two dates represent the same calendar day
 *
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @returns True if dates are on the same day, regardless of time
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Creates a Date object representing the start of the current day (midnight)
 *
 * @returns Date object with time set to 00:00:00
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  return startOfDay
}

/**
 * Gets tomorrow's date at midnight
 *
 * @returns Date object representing tomorrow at 00:00:00
 */
export const getTomorrow = (): Date => {
  const tomorrow = getStartOfDay()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}
