import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Commitment } from '~/lib/types'
import ReviewProgress from '~/components/ReviewProgress'
import TasksReview from '~/components/TasksReview'
import HabitsReview from '~/components/HabitsReview'
import NotesReview from '~/components/NotesReview'
import ReviewComplete from '~/components/ReviewComplete'
import ReviewFooter from '~/components/ReviewFooter'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  BackButton,
} from '~/components/ui'

export default function ReviewCommitment() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<
    'tasks' | 'habits' | 'notes' | 'complete'
  >('tasks')
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
    if (!id) return

    // Load commitment from localStorage
    const loadCommitment = () => {
      setIsLoading(true)
      setError(null)

      try {
        const storedCommitments = localStorage.getItem('commitments')
        if (storedCommitments) {
          const commitments: Commitment[] = JSON.parse(
            storedCommitments,
            (key, value) => {
              if (
                key === 'createdAt' ||
                key === 'lastReviewedAt' ||
                key === 'dueAt' ||
                key === 'timestamp'
              ) {
                return value ? new Date(value) : null
              }
              if (key === 'history' && Array.isArray(value)) {
                return value.map((date) => new Date(date))
              }
              return value
            },
          )

          const foundCommitment = commitments.find(
            (c: Commitment) => c.id === id,
          )
          if (foundCommitment) {
            setCommitment(foundCommitment)

            // Initialize task completion status based on current state
            const initialTaskStatus: Record<string, boolean> = {}
            foundCommitment.subItems.tasks.forEach((task) => {
              initialTaskStatus[task.id] = task.completed
            })
            setTaskCompletionStatus(initialTaskStatus)

            // Initialize habit check-ins to false
            const initialHabitCheckIns: Record<string, boolean> = {}
            foundCommitment.subItems.habits.forEach((habit) => {
              initialHabitCheckIns[habit.id] = false
            })
            setHabitCheckIns(initialHabitCheckIns)
          } else {
            setError('Commitment not found')
          }
        } else {
          setError('No commitments found')
        }
      } catch (error) {
        console.error('Failed to load commitment:', error)
        setError('Failed to load commitment data')
      } finally {
        setIsLoading(false)
      }
    }

    loadCommitment()
  }, [id])

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
    }))

    // Update habit histories with check-ins
    const updatedHabits = commitment.subItems.habits.map((habit) => {
      const newHistory = [...habit.history]

      if (habitCheckIns[habit.id]) {
        // Add today's date to history if checked in
        newHistory.push(new Date())
      }

      return {
        ...habit,
        history: newHistory,
      }
    })

    // Create a new note if content is provided
    const updatedNotes = [...commitment.notes]
    if (noteContent.trim()) {
      updatedNotes.push({
        id: `note-${Date.now()}`,
        content: noteContent,
        timestamp: new Date(),
      })
    }

    // Create updated commitment
    const updatedCommitment = {
      ...commitment,
      lastReviewedAt: new Date(),
      subItems: {
        tasks: updatedTasks,
        habits: updatedHabits,
      },
      notes: updatedNotes,
    }

    // Save to localStorage
    try {
      const existingCommitments = localStorage.getItem('commitments')
      if (!existingCommitments) {
        throw new Error('No commitments found')
      }

      let commitments = JSON.parse(existingCommitments)
      commitments = commitments.map((c: Commitment) =>
        c.id === id ? updatedCommitment : c,
      )

      localStorage.setItem('commitments', JSON.stringify(commitments))

      // Navigate back to the commitment detail page
      navigate(`/commitments/${id}`)
    } catch (error) {
      console.error('Failed to save review:', error)
      setError('Failed to save review. Please try again.')
    }

    setCurrentStep('complete')
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500'>Loading commitment details...</p>
        </div>
      </div>
    )
  }

  if (error || !commitment) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 dark:bg-red-900 p-6 rounded-lg'>
          <h2 className='text-xl font-medium text-red-800 dark:text-red-200 mb-2'>
            Error
          </h2>
          <p className='text-red-600 dark:text-red-300'>
            {error || 'Commitment not found'}
          </p>{' '}
          <Button
            onClick={() => navigate('/')}
            variant='primary'
            className='mt-4 bg-red-600 hover:bg-red-700'
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='mb-8'>
        <BackButton onClick={() => navigate(`/commitments/${id}`)}>
          Back to Commitment
        </BackButton>
      </div>{' '}
      <Card>
        <CardHeader>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Review: {commitment.title}
          </h1>
          <p className='text-gray-600 dark:text-gray-300 mt-2'>
            Let's check in on your progress and update this commitment.
          </p>
        </CardHeader>
        {/* Progress indicator */}
        <ReviewProgress currentStep={currentStep} />
        {/* Step content */}
        <CardContent>
          {currentStep === 'tasks' && (
            <TasksReview
              tasks={commitment.subItems.tasks}
              taskCompletionStatus={taskCompletionStatus}
              handleTaskToggle={handleTaskToggle}
            />
          )}
          {currentStep === 'habits' && (
            <HabitsReview
              habits={commitment.subItems.habits}
              habitCheckIns={habitCheckIns}
              handleHabitToggle={handleHabitToggle}
            />
          )}
          {currentStep === 'notes' && (
            <NotesReview
              noteContent={noteContent}
              setNoteContent={setNoteContent}
            />
          )}
          {currentStep === 'complete' && (
            <ReviewComplete onReturn={() => navigate(`/commitments/${id}`)} />
          )}
        </CardContent>
        {/* Footer actions */}
        {currentStep !== 'complete' && (
          <CardFooter>
            <ReviewFooter
              currentStep={currentStep}
              onCancel={() => navigate(`/commitments/${id}`)}
              onNext={handleNextStep}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
