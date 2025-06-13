import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useCommitments } from '~/contexts/CommitmentContext'
import type { Commitment, Task, Habit } from '~/lib/types'

type ReviewStep = 'tasks' | 'habits' | 'notes' | 'complete'

export function useReviewProcess(commitmentId: string) {
  const navigate = useNavigate()
  const { getCommitment, updateCommitment } = useCommitments()

  const [currentStep, setCurrentStep] = useState<ReviewStep>('tasks')
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [taskCompletionStatus, setTaskCompletionStatus] = useState<
    Record<string, boolean>
  >({})
  const [habitCheckIns, setHabitCheckIns] = useState<Record<string, boolean>>(
    {},
  )
  const [noteContent, setNoteContent] = useState<string>('')

  useEffect(() => {
    if (!commitmentId) return

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
    }
  }, [commitmentId, getCommitment])

  const handleTaskToggle = (taskId: string) => {
    setTaskCompletionStatus((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
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
      // Save task completion state
      const updatedTasks = commitment.subItems.tasks.map((task) => ({
        ...task,
        completed: taskCompletionStatus[task.id] || false,
      }))

      const updatedCommitment = {
        ...commitment,
        subItems: {
          ...commitment.subItems,
          tasks: updatedTasks,
        },
      }

      setCommitment(updatedCommitment)
      setCurrentStep('habits')
    } else if (currentStep === 'habits') {
      // Update habit history for checked habits
      const updatedHabits = commitment.subItems.habits.map((habit) => {
        if (habitCheckIns[habit.id]) {
          return {
            ...habit,
            history: [...habit.history, new Date()],
          }
        }
        return habit
      })

      const updatedCommitment = {
        ...commitment,
        subItems: {
          ...commitment.subItems,
          habits: updatedHabits,
        },
      }

      setCommitment(updatedCommitment)
      setCurrentStep('notes')
    } else if (currentStep === 'notes') {
      // Add new note if content was entered
      let updatedNotes = [...commitment.notes]
      if (noteContent.trim()) {
        updatedNotes = [
          ...commitment.notes,
          {
            id: `note-${Date.now()}`,
            content: noteContent.trim(),
            timestamp: new Date(),
          },
        ]
      }

      // Complete the review
      const updatedCommitment = {
        ...commitment,
        notes: updatedNotes,
        lastReviewedAt: new Date(),
      }

      // Save the updated commitment
      updateCommitment(updatedCommitment)
      setCurrentStep('complete')
    }
  }

  const cancelReview = () => {
    navigate(`/commitments/${commitmentId}`)
  }

  return {
    currentStep,
    commitment,
    taskCompletionStatus,
    habitCheckIns,
    noteContent,
    setNoteContent,
    handleTaskToggle,
    handleHabitToggle,
    handleNextStep,
    cancelReview,
  }
}
