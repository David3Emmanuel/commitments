import { useState, useEffect } from 'react'
import { useCommitments } from '~/lib/contexts/CommitmentContext'
import { useDate } from '~/lib/hooks/useDate'
import type { Habit, Commitment, HabitTarget } from '~/lib/types'

interface HabitDetails {
  habit: Habit | null
  commitment: Commitment | null
  isLoading: boolean
  error: string | null
  toggleHabit: (date: Date, value?: HabitTarget) => void
  isCompletedForDate: (date: Date) => boolean
  calculateStreak: () => number
  canToggleDate: (date: Date) => boolean
  isHabitActive: () => boolean
  getValueForDate: (date: Date) => HabitTarget | undefined
}

type HabitInput = string | Habit

export function useHabitDetails(habitInput: HabitInput): HabitDetails {
  const [habit, setHabit] = useState<Habit | null>(null)
  const [parentCommitment, setParentCommitment] = useState<Commitment | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)
  const { commitments, isLoading, updateCommitment } = useCommitments()
  const { isSameDay, getStartOfDay, getNow, isToday } = useDate()

  useEffect(() => {
    if (isLoading) {
      return
    }

    // If habitInput is a Habit object, use it directly
    if (typeof habitInput !== 'string') {
      setHabit(habitInput)

      // Find parent commitment for the habit
      const foundCommitment =
        commitments.find((commitment) =>
          commitment.subItems.habits.some((h) => h.id === habitInput.id),
        ) || null

      setParentCommitment(foundCommitment)
      setError(null)
      return
    }

    // Otherwise, habitInput is an ID string
    const habitId = habitInput
    if (!habitId) {
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
  }, [habitInput, commitments, isLoading])

  const toggleHabit = (date: Date, value?: HabitTarget) => {
    if (!habit || !parentCommitment) return

    // Create a copy of the history record
    const updatedHistory = { ...habit.history }

    // Format the date to use as key (YYYY-MM-DD format)
    const dateStr = date.toISOString().split('T')[0]

    // Check if this date exists in the history
    const existingEntry = Object.entries(updatedHistory).find(([key, entry]) =>
      isSameDay(new Date(entry.date), date),
    )

    if (existingEntry) {
      // If it exists, remove it
      delete updatedHistory[existingEntry[0]]
    } else {
      // Determine the appropriate value based on habit target type
      let habitValue: HabitTarget = null

      if (value !== undefined) {
        // If a value was explicitly provided, use it
        habitValue = value
      } else {
        // Otherwise use the habit's target value based on its type
        if (typeof habit.target === 'number') {
          habitValue = habit.target
        } else if (Array.isArray(habit.target)) {
          habitValue = [...habit.target] // Use a copy of the checklist
        } else {
          habitValue = null // Default is null for simple completion
        }
      }

      // Add the entry as completed
      updatedHistory[dateStr] = {
        date,
        value: habitValue,
        completed: true,
      }
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
          h.id === habit.id ? updatedHabit : h,
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
    return Object.values(habit.history).some(
      (entry) => isSameDay(new Date(entry.date), date) && entry.completed,
    )
  }

  const canToggleDate = (date: Date): boolean => {
    if (!habit) return false

    // Can only toggle today based on the day start hour setting
    return isToday(date)
  }

  const calculateStreak = (): number => {
    if (
      !habit ||
      habit.schedule !== 'daily' ||
      Object.keys(habit.history).length === 0
    )
      return 0

    // Get all completed entries and sort dates in descending order
    const sortedDates = Object.values(habit.history)
      .filter((entry) => entry.completed)
      .map((entry) => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime())

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

  const isHabitActive = (): boolean => {
    if (!habit) return false

    const today = getNow()
    const startOn = habit.startOn ? new Date(habit.startOn) : null
    const endOn = habit.endOn ? new Date(habit.endOn) : null

    const hasStarted = startOn ? today >= startOn : true
    const hasEnded = endOn ? today > endOn : false

    return hasStarted && !hasEnded
  }

  const getValueForDate = (date: Date): HabitTarget | undefined => {
    if (!habit) return undefined

    // Find entry for the given date
    const entry = Object.values(habit.history).find((entry) =>
      isSameDay(new Date(entry.date), date),
    )

    if (!entry) return undefined

    // Return the appropriate value based on type
    return entry.value
  }

  return {
    habit,
    commitment: parentCommitment,
    isLoading,
    error,
    toggleHabit,
    isCompletedForDate,
    calculateStreak,
    canToggleDate,
    isHabitActive,
    getValueForDate,
  }
}
