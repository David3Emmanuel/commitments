import { useMemo } from 'react'
import type { Task } from '~/lib/types'

export function useTaskCompletion(tasks: Task[]) {
  // Calculate task completion percentage
  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.completed).length
    return Math.round((completedTasks / tasks.length) * 100)
  }, [tasks])

  // Get counts
  const completedCount = useMemo(() => {
    return tasks.filter((task) => task.completed).length
  }, [tasks])

  const totalCount = tasks.length

  // Toggle task completion
  const toggleTask = (tasks: Task[], taskId: string): Task[] => {
    return tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    )
  }

  return {
    completionPercentage,
    completedCount,
    totalCount,
    toggleTask,
  }
}
