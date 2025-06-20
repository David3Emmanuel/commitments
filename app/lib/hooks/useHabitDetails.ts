import { useState, useEffect } from 'react'
import { useCommitments } from '~/lib/contexts/CommitmentContext'
import { useDate } from '~/lib/hooks/useDate'
import type { Habit, Commitment } from '~/lib/types'

interface HabitDetails {
  habit: Habit | null
  commitment: Commitment | null
  isLoading: boolean
  error: string | null
  toggleHabit: (date: Date) => void
  isCompletedForDate: (date: Date) => boolean
  calculateStreak: () => number
}

export function useHabitDetails(habitId: string): HabitDetails {
  const [habit, setHabit] = useState<Habit | null>(null)
  const [parentCommitment, setParentCommitment] = useState<Commitment | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)
  const { commitments, isLoading, updateCommitment } = useCommitments()
  const { isSameDay, getStartOfDay, getNow } = useDate()

  useEffect(() => {
    if (!habitId || isLoading) {
      return
    }

    // Find the habit and its parent commitment
    let foundHabit: Habit | null = null
    let foundCommitment: Commitment | null = null

    for (const commitment of commitments) {
      const matchingHabit = commitment.subItems.habits.find(
        (h) => h.id === habitId,
      )
      if (matchingHabit) {
        foundHabit = matchingHabit
        foundCommitment = commitment
        break
      }
    }

    if (foundHabit && foundCommitment) {
      setHabit(foundHabit)
      setParentCommitment(foundCommitment)
      setError(null)
    } else {
      setHabit(null)
      setParentCommitment(null)
      setError('Habit not found')
    }
  }, [habitId, commitments, isLoading])
  const toggleHabit = (date: Date) => {
    if (!habit || !parentCommitment) return

    // Create a copy of the history array
    const updatedHistory = [...habit.history]

    // Check if this date is already in the history using isSameDay to respect user's day start setting
    const existingIndex = updatedHistory.findIndex((d) =>
      isSameDay(new Date(d), date),
    )

    // If it exists, remove it; otherwise add it
    if (existingIndex >= 0) {
      updatedHistory.splice(existingIndex, 1)
    } else {
      updatedHistory.push(date)
    }

    const updatedHabit = {
      ...habit,
      history: updatedHistory,
    }

    const updatedCommitment = {
      ...parentCommitment,
      subItems: {
        ...parentCommitment.subItems,
        habits: parentCommitment.subItems.habits.map((h) =>
          h.id === habitId ? updatedHabit : h,
        ),
      },
    }

    updateCommitment(updatedCommitment)
    setHabit(updatedHabit)
    setParentCommitment(updatedCommitment)
  }
  const isCompletedForDate = (date: Date): boolean => {
    if (!habit) return false

    // Use isSameDay to respect user's day start hour setting
    return habit.history.some((d) => isSameDay(new Date(d), date))
  }
  const calculateStreak = (): number => {
    if (!habit || habit.schedule !== 'daily' || habit.history.length === 0)
      return 0

    // Sort history dates in descending order
    const sortedDates = [...habit.history]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => new Date(date))

    let streak = 1
    const today = getStartOfDay() // Use getStartOfDay to respect user's day start setting

    // Check if most recent date is today or yesterday
    const mostRecent = new Date(sortedDates[0])

    // Create yesterday based on user's day start settings
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Instead of direct comparison, use isSameDay or find if mostRecent is between today and yesterday
    if (!isSameDay(mostRecent, today) && !isSameDay(mostRecent, yesterday)) {
      // Streak is broken if most recent date is before yesterday
      return 0
    }

    // Count consecutive days
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = new Date(sortedDates[i])
      const prevDate = new Date(sortedDates[i + 1])

      // Check if dates are consecutive using our adjusted comparison
      const currentStartOfDay = getStartOfDay(currentDate)
      const prevStartOfDay = getStartOfDay(prevDate)

      // Calculate the difference in days
      const dayDiff = Math.round(
        (currentStartOfDay.getTime() - prevStartOfDay.getTime()) /
          (1000 * 60 * 60 * 24),
      )

      if (dayDiff === 1) {
        streak++
      } else {
        break // Streak is broken
      }
    }

    return streak
  }

  return {
    habit,
    commitment: parentCommitment,
    isLoading,
    error,
    toggleHabit,
    isCompletedForDate,
    calculateStreak,
  }
}
