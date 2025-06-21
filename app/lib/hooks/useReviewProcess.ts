import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useCommitments } from '~/lib/contexts/CommitmentContext'
import type { Commitment, Task, Habit } from '~/lib/types'
import { useModal } from '~/components/modal-ui'

type ReviewStep = 'tasks' | 'habits' | 'notes' | 'complete'

export function useReviewProcess(commitmentId: string) {
  const navigate = useNavigate()
  const { getCommitment, updateCommitment } = useCommitments()
  const modal = useModal()

  const [currentStep, setCurrentStep] = useState<ReviewStep>('tasks')
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [taskCompletionStatus, setTaskCompletionStatus] = useState<
    Record<string, boolean>
  >({})
  const [habitCheckIns, setHabitCheckIns] = useState<Record<string, boolean>>(
    {},
  )
  const [noteContent, setNoteContent] = useState<string>('')

  useEffect(() => {
    if (!commitmentId) return

    setIsLoading(true)
    setError(null)

    try {
      const loadedCommitment = getCommitment(commitmentId)

      if (loadedCommitment) {
        setCommitment(loadedCommitment)

        // Initialize task completion status from current tasks
        const initialTaskStatus: Record<string, boolean> = {}
        loadedCommitment.subItems.tasks.forEach((task) => {
          initialTaskStatus[task.id] = task.completed
        })
        setTaskCompletionStatus(initialTaskStatus)

        // Initialize habit check-ins (all unselected initially)
        const initialHabitStatus: Record<string, boolean> = {}
        loadedCommitment.subItems.habits.forEach((habit) => {
          initialHabitStatus[habit.id] = false
        })
        setHabitCheckIns(initialHabitStatus)
      } else {
        setError('Commitment not found')
      }
    } catch (e) {
      console.error('Failed to load commitment:', e)
      setError('Failed to load commitment data')
    } finally {
      setIsLoading(false)
    }
  }, [commitmentId, getCommitment])

  const handleTaskToggle = (taskId: string) => {
    setTaskCompletionStatus((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  const handleEditTask = (taskId: string) => {
    if (!commitment) return

    const task = commitment.subItems.tasks.find((t) => t.id === taskId)
    if (!task) return

    const newTitle = prompt('Edit task title:', task.title)
    if (!newTitle || newTitle === task.title) return // No change

    // Update the task in our commitment
    const updatedTasks = commitment.subItems.tasks.map((t) =>
      t.id === taskId ? { ...t, title: newTitle } : t,
    )

    // Update the local commitment state
    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        tasks: updatedTasks,
      },
    }

    setCommitment(updatedCommitment)
  }

  const handleDeleteTask = (taskId: string) => {
    if (!commitment) return

    modal
      .showConfirmModal(
        'Delete Task',
        'Are you sure you want to delete this task?',
        'Delete',
        'Cancel',
      )
      .then((confirmed) => {
        if (!confirmed) return

        if (!commitment) return

        // Remove the task from the list
        const updatedTasks = commitment.subItems.tasks.filter(
          (task) => task.id !== taskId,
        )

        // Update the local commitment state
        const updatedCommitment = {
          ...commitment,
          subItems: {
            ...commitment.subItems,
            tasks: updatedTasks,
          },
        }

        setCommitment(updatedCommitment)

        // Also remove from task completion status
        setTaskCompletionStatus((prev) => {
          const updated = { ...prev }
          delete updated[taskId]
          return updated
        })
      })
  }

  const handleHabitToggle = (habitId: string) => {
    setHabitCheckIns((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }))
  }

  const handleNextStep = () => {
    if (!commitment) return

    if (currentStep === 'tasks') {
      setCurrentStep('habits')
    } else if (currentStep === 'habits') {
      setCurrentStep('notes')
    } else if (currentStep === 'notes') {
      completeReview()
    }
  }

  const completeReview = () => {
    if (!commitment) return

    // Update tasks completion status
    const updatedTasks = commitment.subItems.tasks.map((task) => ({
      ...task,
      completed: taskCompletionStatus[task.id] || false,
    })) // Update habit histories with check-ins
    const updatedHabits = commitment.subItems.habits.map((habit) => {
      if (habitCheckIns[habit.id]) {
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0]

        // Create a new history entry for today
        return {
          ...habit,
          history: {
            ...habit.history,
            [dateStr]: {
              date: today,
              value: habit.target || null,
              completed: true,
            },
          },
        }
      }
      return habit
    })

    // Create a new note if content is provided
    const updatedNotes = [...commitment.notes]
    if (noteContent.trim()) {
      updatedNotes.push({
        id: `note-${Date.now()}`,
        content: noteContent.trim(),
        timestamp: new Date(),
      })
    }

    // Complete the review
    const updatedCommitment = {
      ...commitment,
      lastReviewedAt: new Date(),
      subItems: {
        tasks: updatedTasks,
        habits: updatedHabits,
      },
      notes: updatedNotes,
    }

    try {
      // Save the updated commitment
      updateCommitment(updatedCommitment)
      setCurrentStep('complete')
    } catch (error) {
      console.error('Failed to save review:', error)
      setError('Failed to save review. Please try again.')
    }
  }

  const cancelReview = () => {
    navigate(`/commitments/${commitmentId}`)
  }

  return {
    currentStep,
    commitment,
    isLoading,
    error,
    taskCompletionStatus,
    habitCheckIns,
    noteContent,
    setNoteContent,
    handleTaskToggle,
    handleEditTask,
    handleDeleteTask,
    handleHabitToggle,
    handleNextStep,
    cancelReview,
  }
}
