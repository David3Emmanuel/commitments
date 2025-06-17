import type { Commitment, Event, Habit, Task } from './types'

export const getNextReviewDate = (commitment: Commitment): Date => {
  // Use either last review date or today's date as the base
  const baseDate = commitment.lastReviewedAt
    ? new Date(commitment.lastReviewedAt)
    : new Date()
  const nextReview = new Date(baseDate)

  // Calculate the interval based on review frequency
  let intervalDays = 7 // Default to weekly

  if (
    commitment.reviewFrequency.type === 'interval' &&
    commitment.reviewFrequency.intervalDays
  ) {
    intervalDays = commitment.reviewFrequency.intervalDays
  }

  // Add the interval to the base date
  nextReview.setDate(nextReview.getDate() + intervalDays)

  return nextReview
}

export const isReviewDue = (commitment: Commitment): boolean => {
  const nextReviewDate = getNextReviewDate(commitment)
  return nextReviewDate <= new Date()
}

export const getReviewFrequencyText = (commitment: Commitment): string => {
  if (
    commitment.reviewFrequency.type === 'interval' &&
    commitment.reviewFrequency.intervalDays
  ) {
    const days = commitment.reviewFrequency.intervalDays
    if (days === 1) return 'Daily'
    if (days === 7) return 'Weekly'
    if (days === 14) return 'Every two weeks'
    if (days === 30) return 'Monthly'
    if (days === 90) return 'Quarterly'
    return `Every ${days} days`
  }
  return 'Custom schedule'
}

export interface TimeBasedEntity {
  id: string
  title: string
  date: Date
  type: 'event' | 'task' | 'habit' | 'review'
  originalEntity: Event | Task | Habit | { id: string; title: string }
}

/**
 * Gets all time-based entities from a commitment, sorted by urgency (closest date first)
 * Includes: events, tasks with deadlines, upcoming habits, and next review date
 *
 * @param commitment The commitment to extract time-based entities from
 * @returns Array of time-based entities sorted by urgency (closest date first)
 */
export const getTimeBasedEntitiesByUrgency = (
  commitment: Commitment,
): TimeBasedEntity[] => {
  const timeBasedEntities: TimeBasedEntity[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // Add events
  commitment.events.forEach((event) => {
    if (event.schedule) {
      // For recurring events, use the next occurrence
      const nextDate = getNextEventDate(event, today)
      if (nextDate) {
        timeBasedEntities.push({
          id: event.id,
          title: event.title,
          date: nextDate,
          type: 'event',
          originalEntity: event,
        })
      }
    } else {
      // For one-time events
      timeBasedEntities.push({
        id: event.id,
        title: event.title,
        date: new Date(event.date),
        type: 'event',
        originalEntity: event,
      })
    }
  })

  // Add tasks with deadlines
  commitment.subItems.tasks
    .filter((task) => task.dueAt && !task.completed)
    .forEach((task) => {
      timeBasedEntities.push({
        id: task.id,
        title: task.title,
        date: new Date(task.dueAt!),
        type: 'task',
        originalEntity: task,
      })
    })

  // Add habits
  commitment.subItems.habits.forEach((habit) => {
    const nextDate = getNextHabitDate(habit, today)

    if (nextDate) {
      timeBasedEntities.push({
        id: habit.id,
        title: habit.title,
        date: nextDate,
        type: 'habit',
        originalEntity: habit,
      })
    }
  })

  // Add next review
  const nextReviewDate = getNextReviewDate(commitment)
  timeBasedEntities.push({
    id: `${commitment.id}-review`,
    title: `Review: ${commitment.title}`,
    date: nextReviewDate,
    type: 'review',
    originalEntity: { id: commitment.id, title: `Review ${commitment.title}` },
  })

  // Sort by date (closest first)
  return timeBasedEntities.sort((a, b) => a.date.getTime() - b.date.getTime())
}

/**
 * Helper function to determine when a habit is next due
 * @returns Date object representing the next due date, or null if there is no valid next date
 */
export const getNextHabitDate = (habit: Habit, fromDate: Date): Date | null => {
  const today = new Date(fromDate)
  today.setHours(0, 0, 0, 0)

  // Check if habit has not yet started or has already ended
  if (habit.startOn && new Date(habit.startOn) > today) {
    // Habit hasn't started yet, return start date
    return new Date(habit.startOn)
  }

  if (habit.endOn && new Date(habit.endOn) < today) {
    // Habit has already ended, return null instead of today
    return null
  }

  // Habit always has a schedule, so no need to check for its existence

  // Convert history dates to start of day for comparison
  const completedDates = habit.history.map((date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  })

  const isCompletedToday = completedDates.includes(today.getTime())

  // Calculate next date based on schedule
  const nextDate = new Date(today)

  switch (habit.schedule) {
    case 'daily':
      // If not completed today, it's due today
      if (!isCompletedToday) {
        return nextDate
      }
      // Otherwise due tomorrow
      nextDate.setDate(nextDate.getDate() + 1)

      // Check if this would go past the end date
      if (habit.endOn && nextDate > new Date(habit.endOn)) {
        return null
      }

      return nextDate

    case 'weekly':
      // If not completed in the current week, it's due today
      const startOfWeek = new Date(today)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // Sunday is 0
      startOfWeek.setHours(0, 0, 0, 0)

      const hasCompletedThisWeek = habit.history.some((date) => {
        const d = new Date(date)
        return d >= startOfWeek && d <= today
      })

      if (!hasCompletedThisWeek) {
        return nextDate
      }

      // Due next week, same day
      nextDate.setDate(nextDate.getDate() + (7 - nextDate.getDay()))

      // Check if this would go past the end date
      if (habit.endOn && nextDate > new Date(habit.endOn)) {
        return null
      }

      return nextDate

    case 'monthly':
      // If not completed in the current month, it's due today
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      const hasCompletedThisMonth = habit.history.some((date) => {
        const d = new Date(date)
        return d >= startOfMonth && d <= today
      })

      if (!hasCompletedThisMonth) {
        return nextDate
      }

      // Due next month, same day of month or last day if overflow
      nextDate.setMonth(nextDate.getMonth() + 1)

      // Check if this would go past the end date
      if (habit.endOn && nextDate > new Date(habit.endOn)) {
        return null
      }

      return nextDate

    default:
      // Unknown schedule type
      return null
  }
}

/**
 * Helper function to determine the next occurrence of a recurring event
 */
export const getNextEventDate = (event: Event, fromDate: Date): Date | null => {
  const today = new Date(fromDate)
  today.setHours(0, 0, 0, 0)

  // If it's not a recurring event or if it has an end date that's already passed
  if (!event.schedule || (event.endOn && new Date(event.endOn) < today)) {
    return null
  }

  // The event's original date
  const eventDate = new Date(event.date)
  eventDate.setHours(0, 0, 0, 0)

  // If the original date is in the future, return that
  if (eventDate >= today) {
    return eventDate
  }

  // Calculate next occurrence based on schedule
  const nextDate = new Date(eventDate)
  let currentDate = new Date(nextDate)

  // Find the next occurrence after today
  switch (event.schedule) {
    case 'daily':
      // Calculate how many days to add to reach or exceed today
      const daysDiff = Math.ceil(
        (today.getTime() - eventDate.getTime()) / (24 * 60 * 60 * 1000),
      )
      nextDate.setDate(nextDate.getDate() + daysDiff)
      break

    case 'weekly':
      // Move forward a week at a time until we reach or exceed today
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 7)
      }
      nextDate.setTime(currentDate.getTime())
      break

    case 'monthly':
      // Move forward a month at a time until we reach or exceed today
      while (currentDate < today) {
        const targetMonth = currentDate.getMonth() + 1
        const targetYear =
          currentDate.getFullYear() + (targetMonth === 12 ? 1 : 0)
        const normalizedMonth = targetMonth % 12

        // Handle month changes and day-of-month issues
        currentDate.setFullYear(targetYear, normalizedMonth, 1)

        // Try to maintain the same day of month, but handle shorter months
        const targetDay = Math.min(
          eventDate.getDate(),
          new Date(targetYear, normalizedMonth + 1, 0).getDate(), // Last day of target month
        )
        currentDate.setDate(targetDay)
      }
      nextDate.setTime(currentDate.getTime())
      break
  }

  // Check if the next date exceeds the end date
  if (event.endOn && nextDate > new Date(event.endOn)) {
    return null
  }

  return nextDate
}

/**
 * Gets highlighted time-based entities from a commitment based on their urgency and type
 *
 * Rules:
 * - Events: Highlight if coming soon (today or tomorrow) or if reminder time has passed
 * - Tasks/Habits/Reviews: Show ALL items with missed deadlines (red) and ALL that should be attended to today (orange)
 * - If no highlighted items, show the most urgent one in normal color
 *
 * Highlight types:
 * - urgent (red): Missed deadlines or events with passed reminder times
 * - upcoming (orange): Due today or events happening today/tomorrow
 * - normal (blue): Default highlighting for the most urgent item when no other highlights exist
 *
 * @param commitment The commitment to extract highlighted entities from
 * @returns Array of groups, each containing highlighted time-based entities with metadata about their urgency
 */
export const getHighlightedTimeBasedEntities = (
  commitment: Commitment,
): {
  entities: TimeBasedEntity[]
  highlightType: 'urgent' | 'upcoming' | 'normal'
}[] => {
  const timeBasedEntities = getTimeBasedEntitiesByUrgency(commitment)
  const highlightedEntities: {
    entities: TimeBasedEntity[]
    highlightType: 'urgent' | 'upcoming' | 'normal'
  }[] = []

  // Get current date values for comparison
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Process events first - highlight if coming soon or reminder has passed
  const eventEntities = timeBasedEntities.filter(
    (entity) => entity.type === 'event',
  )
  const urgentEvents: TimeBasedEntity[] = []
  const upcomingEvents: TimeBasedEntity[] = []

  eventEntities.forEach((event) => {
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)
    const originalEvent = event.originalEntity as Event // Check if event is today or tomorrow
    if (
      eventDate.getTime() === today.getTime() ||
      eventDate.getTime() === tomorrow.getTime()
    ) {
      upcomingEvents.push(event)
    }
    // Check if reminder time has passed but event hasn't happened yet
    else if (originalEvent.reminderTime) {
      const reminderTime = new Date(originalEvent.reminderTime)
      if (reminderTime <= now && eventDate >= today) {
        urgentEvents.push(event)
      }
    }
  })

  if (urgentEvents.length > 0) {
    highlightedEntities.push({
      entities: urgentEvents,
      highlightType: 'urgent',
    })
  }
  if (upcomingEvents.length > 0) {
    highlightedEntities.push({
      entities: upcomingEvents,
      highlightType: 'upcoming',
    })
  }

  // Process tasks, habits, and reviews
  const otherEntities = timeBasedEntities.filter(
    (entity) => entity.type !== 'event',
  )
  const missedDeadlines: TimeBasedEntity[] = []
  const dueToday: TimeBasedEntity[] = []

  otherEntities.forEach((entity) => {
    const entityDate = new Date(entity.date)
    entityDate.setHours(0, 0, 0, 0)

    // Missed deadlines (past due dates) - show in red
    if (entityDate < today) {
      missedDeadlines.push(entity)
    }
    // Due today - show in orange
    else if (entityDate.getTime() === today.getTime()) {
      dueToday.push(entity)
    }
  })

  if (missedDeadlines.length > 0) {
    highlightedEntities.push({
      entities: missedDeadlines,
      highlightType: 'urgent',
    })
  }
  if (dueToday.length > 0) {
    highlightedEntities.push({ entities: dueToday, highlightType: 'upcoming' })
  }
  // Show all urgent and upcoming tasks/habits/reviews first
  // Then, if no highlighted entities, show most urgent one
  if (highlightedEntities.length === 0 && timeBasedEntities.length > 0) {
    // Just grab the most urgent entity (should already be sorted by date)
    highlightedEntities.push({
      entities: [timeBasedEntities[0]],
      highlightType: 'normal',
    })
  }

  // Make sure we sort the groups by urgency (urgent first, then upcoming, then normal)
  highlightedEntities.sort((a, b) => {
    const priorityOrder = { urgent: 0, upcoming: 1, normal: 2 }
    return priorityOrder[a.highlightType] - priorityOrder[b.highlightType]
  })

  return highlightedEntities
}
