import { useMemo } from 'react'
import type { Habit } from '~/lib/types'

export function useHabitTracking(habits: Habit[]) {
  // Get habits with recent activity (last 30 days)
  const recentlyActiveHabits = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return habits.filter((habit) => {
      const historyEntries = Object.values(habit.history)
      if (historyEntries.length === 0) return false

      // Check if the most recent history entry is within the last 30 days
      const dates = historyEntries
        .filter((entry) => entry.completed)
        .map((entry) => new Date(entry.date))

      if (dates.length === 0) return false

      const mostRecent = new Date(
        Math.max(...dates.map((date) => date.getTime())),
      )

      return mostRecent >= thirtyDaysAgo
    })
  }, [habits])

  // Calculate streak for daily habits (consecutive days)
  const calculateStreak = (habit: Habit): number => {
    if (habit.schedule !== 'daily' || Object.keys(habit.history).length === 0)
      return 0

    // Get all completed entries and sort dates in descending order
    const sortedDates = Object.values(habit.history)
      .filter((entry) => entry.completed)
      .map((entry) => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime())

    let streak = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if most recent date is today or yesterday
    const mostRecent = new Date(sortedDates[0])
    mostRecent.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (mostRecent < yesterday) {
      // Streak is broken if most recent date is before yesterday
      return 0
    }

    // Count consecutive days
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = new Date(sortedDates[i])
      currentDate.setHours(0, 0, 0, 0)

      const prevDate = new Date(sortedDates[i + 1])
      prevDate.setHours(0, 0, 0, 0)

      const dayDiff = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  return {
    recentlyActiveHabits,
    calculateStreak,
    totalHabits: habits.length,
  }
}
