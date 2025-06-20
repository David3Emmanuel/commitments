import type { Event, Habit, Task, Commitment } from '../types'
import {
  getNextHabitDate,
  getNextReviewDate,
  getNextEventDate,
  getTimeBasedEntitiesByUrgency,
} from '../details'
import { useDate } from './useDate'

/**
 * Urgency levels for tasks, habits and events
 */
export type UrgencyLevel = 'urgent' | 'upcoming' | 'tomorrow' | 'normal'

/**
 * Priority order for urgency levels (lower number = higher priority)
 */
export const URGENCY_ORDER: Record<UrgencyLevel, number> = {
  urgent: 0,
  upcoming: 1,
  tomorrow: 2,
  normal: 3,
}

export default function useSort() {
  const { getStartOfDay, isSameDay, getTomorrow } = useDate()

  /**
   * Determines the urgency level of a task
   *
   * @param task The task to evaluate
   * @returns The urgency level of the task
   */
  const getTaskUrgency = (task: Task): UrgencyLevel => {
    if (task.completed) return 'normal'
    if (!task.dueAt) return 'normal'

    const dueDate = new Date(task.dueAt)
    const today = getStartOfDay()
    const tomorrow = getTomorrow()

    if (dueDate < today) return 'urgent'
    if (isSameDay(dueDate, today)) return 'upcoming'
    if (isSameDay(dueDate, tomorrow)) return 'tomorrow'
    return 'normal'
  }

  /**
   * Determines the urgency level of a habit
   *
   * @param habit The habit to evaluate
   * @returns The urgency level of the habit
   */
  const getHabitUrgency = (habit: Habit): UrgencyLevel => {
    const today = getStartOfDay()

    // Check if habit is active based on startOn and endOn dates
    const startOn = habit.startOn ? new Date(habit.startOn) : null
    const endOn = habit.endOn ? new Date(habit.endOn) : null

    // If habit hasn't started yet or has already ended, mark as normal
    if ((startOn && today < startOn) || (endOn && today > endOn)) {
      return 'normal'
    }

    const nextDueDate = getNextHabitDate(habit, today)
    const tomorrow = getTomorrow()

    if (!nextDueDate) return 'normal'
    if (nextDueDate < today) return 'urgent'
    if (isSameDay(nextDueDate, today)) return 'upcoming'
    if (isSameDay(nextDueDate, tomorrow)) return 'tomorrow'
    return 'normal'
  }

  /**
   * Determines the urgency level of an event
   *
   * @param event The event to evaluate
   * @returns The urgency level of the event
   */
  const getEventUrgency = (event: Event): UrgencyLevel => {
    const today = getStartOfDay()
    const tomorrow = getTomorrow()
    const now = new Date()

    let relevantDate: Date

    // For recurring events, get the next occurrence date
    if (event.schedule) {
      const nextDate = getNextEventDate(event, today)
      if (!nextDate) return 'normal' // No future occurrences
      relevantDate = nextDate
    } else {
      // For non-recurring events, use the original date
      relevantDate = new Date(event.date)
    }

    relevantDate.setHours(0, 0, 0, 0)

    // Event with passed reminder but not yet happened
    if (
      event.reminderTime &&
      new Date(event.reminderTime) <= now &&
      relevantDate >= today
    ) {
      return 'urgent'
    }

    if (isSameDay(relevantDate, today)) return 'upcoming'
    if (isSameDay(relevantDate, tomorrow)) return 'tomorrow'
    return 'normal'
  }

  /**
   * Gets CSS class name for urgency level styling
   *
   * @param urgency The urgency level
   * @returns CSS class name for the urgency level
   */
  const getUrgencyClass = (urgency: UrgencyLevel): string => {
    switch (urgency) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 pl-2'
      case 'upcoming':
        return 'border-l-4 border-l-orange-400 pl-2'
      case 'tomorrow':
        return 'border-l-4 border-l-yellow-300 pl-2'
      default:
        return ''
    }
  }

  /**
   * Compares two tasks by urgency and due date
   *
   * @param a First task
   * @param b Second task
   * @returns Comparison result (-1, 0, or 1)
   */
  const compareTasksByUrgency = (a: Task, b: Task): number => {
    // Always put completed tasks at the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Get urgency levels
    const aUrgency = getTaskUrgency(a)
    const bUrgency = getTaskUrgency(b)

    // Compare by urgency level
    if (aUrgency !== bUrgency) {
      return URGENCY_ORDER[aUrgency] - URGENCY_ORDER[bUrgency]
    }

    // If both have due dates, sort by earliest
    if (a.dueAt && b.dueAt) {
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    }

    // Tasks with deadlines come before those without
    if (a.dueAt && !b.dueAt) return -1
    if (!a.dueAt && b.dueAt) return 1

    // Otherwise keep original order
    return 0
  }

  /**
   * Compares two habits by urgency and schedule
   *
   * @param a First habit
   * @param b Second habit
   * @returns Comparison result (-1, 0, or 1)
   */
  const compareHabitsByUrgency = (a: Habit, b: Habit): number => {
    const today = getStartOfDay()

    // Check if habits are active based on startOn and endOn dates
    const aStartOn = a.startOn ? new Date(a.startOn) : null
    const aEndOn = a.endOn ? new Date(a.endOn) : null
    const bStartOn = b.startOn ? new Date(b.startOn) : null
    const bEndOn = b.endOn ? new Date(b.endOn) : null

    const aIsActive =
      (!aStartOn || today >= aStartOn) && (!aEndOn || today <= aEndOn)
    const bIsActive =
      (!bStartOn || today >= bStartOn) && (!bEndOn || today <= bEndOn)

    // Active habits should come before inactive ones
    if (aIsActive !== bIsActive) {
      return aIsActive ? -1 : 1
    }

    // If both are inactive, habits that haven't started yet should come before ones that have ended
    if (!aIsActive && !bIsActive) {
      const aHasntStarted = aStartOn && today < aStartOn
      const bHasntStarted = bStartOn && today < bStartOn

      if (aHasntStarted !== bHasntStarted) {
        return aHasntStarted ? -1 : 1
      }

      // Sort by start date (upcoming soonest first)
      if (aHasntStarted && bHasntStarted && aStartOn && bStartOn) {
        return aStartOn.getTime() - bStartOn.getTime()
      }

      // For ended habits, sort by end date (most recently ended first)
      if (aEndOn && bEndOn) {
        return bEndOn.getTime() - aEndOn.getTime()
      }
    }

    // Get urgency levels
    const aUrgency = getHabitUrgency(a)
    const bUrgency = getHabitUrgency(b)

    // Compare by urgency level
    if (aUrgency !== bUrgency) {
      return URGENCY_ORDER[aUrgency] - URGENCY_ORDER[bUrgency]
    }

    const aNextDate = getNextHabitDate(a, today)
    const bNextDate = getNextHabitDate(b, today)

    // Handle null dates - habits with no next date go at the bottom
    if (!aNextDate && !bNextDate) return 0
    if (!aNextDate) return 1 // a goes after b
    if (!bNextDate) return -1 // a goes before b

    // If both are due on the same day, sort by frequency (daily before weekly before monthly)
    if (isSameDay(aNextDate, bNextDate)) {
      const frequencyOrder: Record<string, number> = {
        daily: 0,
        weekly: 1,
        monthly: 2,
      }
      return frequencyOrder[a.schedule] - frequencyOrder[b.schedule]
    }

    // Otherwise sort by next due date
    return aNextDate.getTime() - bNextDate.getTime()
  }

  /**
   * Compares two events by urgency and schedule
   *
   * @param a First event
   * @param b Second event
   * @param isPastView Whether we're viewing past events
   * @returns Comparison result (-1, 0, or 1)
   */ /**
   * Gets the relevant date for an event (next occurrence for recurring events)
   *
   * @param event The event to get relevant date for
   * @param referenceDate The reference date to calculate from (usually today)
   * @returns The relevant date for the event
   */
  const getRelevantEventDate = (
    event: Event,
    referenceDate?: Date,
  ): Date | null => {
    const fromDate = referenceDate || getStartOfDay()

    if (event.schedule) {
      return getNextEventDate(event, fromDate)
    }
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate
  }
  const compareEventsByUrgency = (
    a: Event,
    b: Event,
    isPastView: boolean,
  ): number => {
    const today = getStartOfDay()
    const aDate = getRelevantEventDate(a, today) || new Date(a.date)
    const bDate = getRelevantEventDate(b, today) || new Date(b.date)

    // For past events, most recent first
    if (isPastView) {
      return bDate.getTime() - aDate.getTime()
    }

    // Get urgency levels
    const aUrgency = getEventUrgency(a)
    const bUrgency = getEventUrgency(b)

    // Compare by urgency level
    if (aUrgency !== bUrgency) {
      return URGENCY_ORDER[aUrgency] - URGENCY_ORDER[bUrgency]
    }

    // Otherwise sort by date (closest first)
    return aDate.getTime() - bDate.getTime()
  }

  /**
   * Determines the urgency level of a commitment
   * based on its most urgent items (tasks, habits, events) and review schedule
   *
   * @param commitment The commitment to evaluate
   * @returns The urgency level of the commitment
   */
  const getCommitmentUrgency = (commitment: Commitment): UrgencyLevel => {
    // Check if review is due
    const isReviewDue = isReviewOverdue(commitment)

    if (isReviewDue) {
      return 'urgent'
    }

    // Check all tasks
    const taskUrgencies = commitment.subItems.tasks.map(getTaskUrgency)

    // Check all habits
    const habitUrgencies = commitment.subItems.habits.map(getHabitUrgency)

    // Check all events
    const eventUrgencies = commitment.events.map(getEventUrgency)

    // Combine all urgencies
    const allUrgencies = [
      ...taskUrgencies,
      ...habitUrgencies,
      ...eventUrgencies,
    ]

    // Get the most urgent level
    if (allUrgencies.includes('urgent')) return 'urgent'
    if (allUrgencies.includes('upcoming')) return 'upcoming'
    if (allUrgencies.includes('tomorrow')) return 'tomorrow'

    return 'normal'
  }

  /**
   * Checks if a commitment's review is overdue
   *
   * @param commitment The commitment to check
   * @returns Whether the review is overdue
   */
  const isReviewOverdue = (commitment: Commitment): boolean => {
    const nextReview = getNextReviewDate(commitment)
    return nextReview <= new Date()
  }

  /**
   * Compares two commitments by urgency
   *
   * @param a First commitment
   * @param b Second commitment
   * @returns Comparison result (-1, 0, or 1)
   */
  const compareCommitmentsByUrgency = (
    a: Commitment,
    b: Commitment,
  ): number => {
    // Get urgency levels
    const aUrgency = getCommitmentUrgency(a)
    const bUrgency = getCommitmentUrgency(b)

    // Compare by urgency level
    if (aUrgency !== bUrgency) {
      return URGENCY_ORDER[aUrgency] - URGENCY_ORDER[bUrgency]
    }

    // Get the most urgent dates for both commitments
    const aMostUrgentDate = getMostUrgentDate(a)
    const bMostUrgentDate = getMostUrgentDate(b)

    // If both have urgent dates, compare those dates (closest first)
    if (aMostUrgentDate && bMostUrgentDate) {
      return aMostUrgentDate.getTime() - bMostUrgentDate.getTime()
    }

    // If only one has an urgent date, that one comes first
    if (aMostUrgentDate) return -1
    if (bMostUrgentDate) return 1

    // If no urgent dates, check if any has an overdue review
    const aReviewDue = isReviewOverdue(a)
    const bReviewDue = isReviewOverdue(b)

    if (aReviewDue !== bReviewDue) {
      return aReviewDue ? -1 : 1
    }

    // Otherwise sort by the date (most recently updated first)
    if (a.lastReviewedAt && b.lastReviewedAt) {
      return (
        new Date(b.lastReviewedAt).getTime() -
        new Date(a.lastReviewedAt).getTime()
      )
    }

    return 0
  }

  /**
   * Gets the date of the most urgent item in a commitment
   *
   * @param commitment The commitment
   * @returns The date of the most urgent item or null if no items
   */
  const getMostUrgentDate = (commitment: Commitment): Date | null => {
    const timeBasedEntities = getTimeBasedEntitiesByUrgency(commitment)

    if (timeBasedEntities.length === 0) return null
    return timeBasedEntities[0].date
  }
  return {
    getTaskUrgency,
    getHabitUrgency,
    getEventUrgency,
    getUrgencyClass,
    compareTasksByUrgency,
    compareHabitsByUrgency,
    compareEventsByUrgency,
    getCommitmentUrgency,
    isReviewOverdue,
    compareCommitmentsByUrgency,
    getMostUrgentDate,
    getRelevantEventDate,
  }
}
