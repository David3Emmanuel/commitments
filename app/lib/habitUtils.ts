import type { Habit } from './types'

export const isHabitActive = (habit: Habit): boolean => {
  const today = new Date()
  const startOn = habit.startOn ? new Date(habit.startOn) : null
  const endOn = habit.endOn ? new Date(habit.endOn) : null

  const hasStarted = startOn ? today >= startOn : true
  const hasEnded = endOn ? today > endOn : false

  return hasStarted && !hasEnded
}
