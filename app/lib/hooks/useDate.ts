import { useSettings } from '~/lib/contexts/SettingsContext'

/**
 * Hook that extends date utility functions to respect user's "start of day" setting
 *
 * @returns Extended date utility functions that incorporate dayStartHour setting
 */
export function useDate() {
  const { settings } = useSettings()
  const dayStartHour = settings.dayStartHour

  /**
   * Adjusts a date according to the user's dayStartHour setting
   *
   * @param date The date to adjust
   * @returns A new date adjusted by dayStartHour
   */
  const adjustDateByDayStart = (date: Date): Date => {
    if (dayStartHour === 0) return new Date(date) // No adjustment needed if day starts at midnight

    const adjustedDate = new Date(date)
    if (date.getHours() < dayStartHour) {
      // If current hour is before day start hour, this belongs to previous day
      adjustedDate.setDate(adjustedDate.getDate() - 1)
    }
    return adjustedDate
  }

  /**
   * Checks if two dates represent the same day, incorporating dayStartHour
   *
   * @param date1 First date to compare
   * @param date2 Second date to compare
   * @returns True if dates are on the same day according to dayStartHour
   */
  const isSameDay = (date1: Date, date2: Date): boolean => {
    const adjusted1 = adjustDateByDayStart(date1)
    const adjusted2 = adjustDateByDayStart(date2)

    return (
      adjusted1.getFullYear() === adjusted2.getFullYear() &&
      adjusted1.getMonth() === adjusted2.getMonth() &&
      adjusted1.getDate() === adjusted2.getDate()
    )
  }

  /**
   * Creates a Date object representing the start of the current day based on dayStartHour
   *
   * @param date Optional date to get start of day for (defaults to current date)
   * @returns Date object with time set to the configured start of day
   */
  const getStartOfDay = (date: Date = new Date()): Date => {
    const baseDate = new Date(date)

    // Set to midnight of the current calendar date
    const midnight = new Date(baseDate)
    midnight.setHours(0, 0, 0, 0)

    // Add the dayStartHour offset
    const startOfDay = new Date(midnight)
    startOfDay.setHours(dayStartHour, 0, 0, 0)

    // If current time is before dayStartHour, the "day" started yesterday
    if (baseDate.getHours() < dayStartHour) {
      startOfDay.setDate(startOfDay.getDate() - 1)
    }

    return startOfDay
  }

  /**
   * Gets tomorrow's date at the configured start of day hour
   *
   * @returns Date object representing tomorrow at the configured start hour
   */
  const getTomorrow = (): Date => {
    const today = getStartOfDay()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }

  /**
   * Determines if a date is today according to dayStartHour setting
   *
   * @param date Date to check
   * @returns True if the date is today according to dayStartHour
   */
  const isToday = (date: Date): boolean => {
    const now = new Date()
    return isSameDay(date, now)
  }

  /**
   * Gets current date/time adjusted for dayStartHour
   * Useful for "right now" calculations that should respect day boundaries
   *
   * @returns Current date/time with day boundary considerations
   */
  const getNow = (): Date => {
    return new Date()
  }

  return {
    isSameDay,
    getStartOfDay,
    getTomorrow,
    isToday,
    getNow,
    adjustDateByDayStart,
  }
}
