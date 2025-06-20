import type { Habit } from './types'
import { useDate } from '~/lib/hooks/useDate'

// Standard function for server-side (doesn't respect user settings)
export const isHabitActive = (habit: Habit): boolean => {
  const today = new Date()
  const startOn = habit.startOn ? new Date(habit.startOn) : null
  const endOn = habit.endOn ? new Date(habit.endOn) : null

  const hasStarted = startOn ? today >= startOn : true
  const hasEnded = endOn ? today > endOn : false

  return hasStarted && !hasEnded
}

// Hook version for client-side use that respects user's day start setting
export const useHabitActiveStatus = () => {
  const { getNow } = useDate()

  const isActive = (habit: Habit): boolean => {
    const today = getNow()
    const startOn = habit.startOn ? new Date(habit.startOn) : null
    const endOn = habit.endOn ? new Date(habit.endOn) : null

    const hasStarted = startOn ? today >= startOn : true
    const hasEnded = endOn ? today > endOn : false

    return hasStarted && !hasEnded
  }

  return { isActive }
}
