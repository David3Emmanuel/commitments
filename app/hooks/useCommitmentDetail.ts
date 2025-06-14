import { useState, useEffect } from 'react'
import { useCommitments } from '~/contexts/CommitmentContext'
import { useModal } from '~/components/ui'
import type { Commitment, Task, Habit } from '~/lib/types'

export function useCommitmentDetail(id: string | undefined) {
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { showTextModal, showDateModal, showDropdownModal } = useModal()
  const {
    getCommitment,
    updateCommitment,
    isLoading,
    error: contextError,
  } = useCommitments()

  useEffect(() => {
    if (!id) return
    if (isLoading) {
      setCommitment(null)
      setError(null)
      return
    }

    const foundCommitment = getCommitment(id)
    if (foundCommitment) {
      setCommitment(foundCommitment)
    } else {
      setError('Commitment not found')
    }
  }, [id, getCommitment, isLoading])

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

  const handleEditTask = async (taskId: string) => {
    if (!commitment) return

    const task = commitment.subItems.tasks.find((t) => t.id === taskId)
    if (!task) return

    const editedTaskTitle = await showTextModal(
      'Edit task title:',
      'Task title',
      task.title,
    )
    if (!editedTaskTitle) return

    // Use date modal with current date as default, or keep existing date
    const currentDueDate = task.dueAt
      ? new Date(task.dueAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    const dueDateStr = await showDateModal(
      'Select due date (optional - click Cancel for no due date):',
      currentDueDate,
    )

    const updatedTasks = commitment.subItems.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            title: editedTaskTitle,
            dueAt: dueDateStr ? new Date(dueDateStr) : null,
          }
        : t,
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

  const handleDeleteTask = (taskId: string) => {
    if (!commitment) return

    const updatedTasks = commitment.subItems.tasks.filter(
      (task) => task.id !== taskId,
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

    const newTaskTitle = await showTextModal('Enter task title:', 'Task title')
    if (!newTaskTitle) return

    // Use date modal with today's date as default, but allow cancellation
    const today = new Date().toISOString().split('T')[0]
    const dueDateStr = await showDateModal(
      'Select due date (optional - click Cancel for no due date):',
      today,
    )

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      dueAt: dueDateStr ? new Date(dueDateStr) : null,
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

    const newHabitTitle = await showTextModal(
      'Enter habit title:',
      'Habit title',
    )
    if (!newHabitTitle) return

    const scheduleOptions = [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ]

    const schedule = await showDropdownModal(
      'Select habit frequency',
      scheduleOptions,
      'weekly',
    )

    if (!schedule) return

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

    const noteContent = await showTextModal(
      'Enter note content:',
      'Note content',
    )
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
    handleEditTask,
    handleDeleteTask,
  }
}
