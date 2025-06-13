import { useState, useEffect } from 'react'
import { useCommitments } from '~/contexts/CommitmentContext'
import { useModal } from '~/components/ui'
import type { Commitment, Task, Habit } from '~/lib/types'

export function useCommitmentDetail(id: string | undefined) {
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { showModal } = useModal()
  const {
    getCommitment,
    updateCommitment,
    isLoading,
    error: contextError,
  } = useCommitments()

  useEffect(() => {
    if (!id) return

    const foundCommitment = getCommitment(id)
    if (foundCommitment) {
      setCommitment(foundCommitment)
    } else {
      setError('Commitment not found')
    }
  }, [id, getCommitment])

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString()
  }

  const handleTaskToggle = (taskId: string) => {
    if (!commitment) return

    const updatedTasks = commitment.subItems.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    )

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        tasks: updatedTasks,
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }
  const handleAddTask = async () => {
    if (!commitment) return

    const newTaskTitle = await showModal('Enter task title:', 'Task title')
    if (!newTaskTitle) return

    const dueDateStr = await showModal(
      'Enter due date (YYYY-MM-DD), leave empty for no due date:',
      'YYYY-MM-DD',
    )

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      dueAt: dueDateStr ? new Date(dueDateStr) : new Date(),
      completed: false,
    }

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        tasks: [...commitment.subItems.tasks, newTask],
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }
  const handleAddHabit = async () => {
    if (!commitment) return

    const newHabitTitle = await showModal('Enter habit title:', 'Habit title')
    if (!newHabitTitle) return

    const scheduleOptions = ['daily', 'weekly', 'monthly']
    const scheduleIndex = await showModal(
      'Choose schedule type (enter number):\n1. Daily\n2. Weekly\n3. Monthly',
      'Enter 1, 2, or 3',
    )
    const schedule = scheduleOptions[Number(scheduleIndex) - 1] || 'weekly'

    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: newHabitTitle,
      schedule: schedule as 'daily' | 'weekly' | 'monthly',
      history: [],
    }

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        habits: [...commitment.subItems.habits, newHabit],
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }
  const handleAddNote = async () => {
    if (!commitment) return

    const noteContent = await showModal('Enter note content:', 'Note content')
    if (!noteContent) return

    const newNote = {
      id: `note-${Date.now()}`,
      content: noteContent,
      timestamp: new Date(),
    }

    const updatedCommitment = {
      ...commitment,
      notes: [...commitment.notes, newNote],
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleArchiveToggle = () => {
    if (!commitment) return

    const newStatus = commitment.status === 'active' ? 'archived' : 'active'
    const updatedCommitment: Commitment = { ...commitment, status: newStatus }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  return {
    commitment,
    isLoading,
    error,
    contextError,
    formatDate,
    handleTaskToggle,
    handleAddTask,
    handleAddHabit,
    handleAddNote,
    handleArchiveToggle,
  }
}
