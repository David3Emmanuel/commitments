import type { Event, Habit, Task, Commitment } from './types'
import { getNextHabitDate, getNextReviewDate } from './detailFunctions'
import { getStartOfDay, isSameDay, getTomorrow } from './dateUtils'

/**
 * Urgency levels for tasks, habits and events
 */
export type UrgencyLevel = 'urgent' | 'upcoming' | 'tomorrow' | 'normal'

/**
 * Determines the urgency level of a task
 *
 * @param task The task to evaluate
 * @returns The urgency level of the task
 */
export const getTaskUrgency = (task: Task): UrgencyLevel => {
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
export const getHabitUrgency = (habit: Habit): UrgencyLevel => {
  const today = getStartOfDay()
  const nextDueDate = getNextHabitDate(habit, today)
  const tomorrow = getTomorrow()

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
export const getEventUrgency = (event: Event): UrgencyLevel => {
  const today = getStartOfDay()
  const tomorrow = getTomorrow()
  const eventDate = new Date(event.date)
  eventDate.setHours(0, 0, 0, 0)
  const now = new Date()

  // Event with passed reminder but not yet happened
  if (
    event.reminderTime &&
    new Date(event.reminderTime) <= now &&
    eventDate >= today
  ) {
    return 'urgent'
  }

  if (isSameDay(eventDate, today)) return 'upcoming'
  if (isSameDay(eventDate, tomorrow)) return 'tomorrow'
  return 'normal'
}

/**
 * Gets CSS class name for urgency level styling
 *
 * @param urgency The urgency level
 * @returns CSS class name for the urgency level
 */
export const getUrgencyClass = (urgency: UrgencyLevel): string => {
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
export const compareTasksByUrgency = (a: Task, b: Task): number => {
  // Always put completed tasks at the bottom
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1
  }

  // Get urgency levels
  const aUrgency = getTaskUrgency(a)
  const bUrgency = getTaskUrgency(b)

  // Define priority order for urgency levels
  const urgencyOrder: Record<UrgencyLevel, number> = {
    urgent: 0,
    upcoming: 1,
    tomorrow: 2,
    normal: 3,
  }

  // Compare by urgency level
  if (aUrgency !== bUrgency) {
    return urgencyOrder[aUrgency] - urgencyOrder[bUrgency]
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
export const compareHabitsByUrgency = (a: Habit, b: Habit): number => {
  const today = getStartOfDay()

  // Get urgency levels
  const aUrgency = getHabitUrgency(a)
  const bUrgency = getHabitUrgency(b)

  // Define priority order for urgency levels
  const urgencyOrder: Record<UrgencyLevel, number> = {
    urgent: 0,
    upcoming: 1,
    tomorrow: 2,
    normal: 3,
  }

  // Compare by urgency level
  if (aUrgency !== bUrgency) {
    return urgencyOrder[aUrgency] - urgencyOrder[bUrgency]
  }

  const aNextDate = getNextHabitDate(a, today)
  const bNextDate = getNextHabitDate(b, today)

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
 */
export const compareEventsByUrgency = (
  a: Event,
  b: Event,
  isPastView: boolean,
): number => {
  // For past events, most recent first
  if (isPastView) {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }

  // Get urgency levels
  const aUrgency = getEventUrgency(a)
  const bUrgency = getEventUrgency(b)

  // Define priority order for urgency levels
  const urgencyOrder: Record<UrgencyLevel, number> = {
    urgent: 0,
    upcoming: 1,
    tomorrow: 2,
    normal: 3,
  }

  // Compare by urgency level
  if (aUrgency !== bUrgency) {
    return urgencyOrder[aUrgency] - urgencyOrder[bUrgency]
  }

  // Otherwise sort by date (closest first)
  return new Date(a.date).getTime() - new Date(b.date).getTime()
}

/**
 * Determines the urgency level of a commitment
 * based on its most urgent items (tasks, habits, events) and review schedule
 *
 * @param commitment The commitment to evaluate
 * @returns The urgency level of the commitment
 */
export const getCommitmentUrgency = (commitment: Commitment): UrgencyLevel => {
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
  const allUrgencies = [...taskUrgencies, ...habitUrgencies, ...eventUrgencies]

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
export const isReviewOverdue = (commitment: Commitment): boolean => {
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
export const compareCommitmentsByUrgency = (
  a: Commitment,
  b: Commitment,
): number => {
  // Get urgency levels
  const aUrgency = getCommitmentUrgency(a)
  const bUrgency = getCommitmentUrgency(b)

  // Define priority order for urgency levels
  const urgencyOrder: Record<UrgencyLevel, number> = {
    urgent: 0,
    upcoming: 1,
    tomorrow: 2,
    normal: 3,
  }

  // Compare by urgency level
  if (aUrgency !== bUrgency) {
    return urgencyOrder[aUrgency] - urgencyOrder[bUrgency]
  }

  // If same urgency, check if any has an overdue review
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
