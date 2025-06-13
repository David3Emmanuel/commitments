import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import type { Commitment } from '~/lib/types'
import TaskList from '~/components/TaskList'
import HabitList from '~/components/HabitList'
import NoteList from '~/components/NoteList'
import NavigationTabs from '~/components/NavigationTabs'
import { useCommitments } from '~/contexts/CommitmentContext'
import {
  getNextReviewDate,
  isReviewDue,
  getReviewFrequencyText,
} from '~/lib/detailFunctions'
import {
  BackButton,
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
} from '~/components/ui'

export default function CommitmentDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [activeTab, setActiveTab] = useState<
    'details' | 'tasks' | 'habits' | 'notes'
  >('details')
  const {
    getCommitment,
    updateCommitment,
    isLoading,
    error: contextError,
  } = useCommitments()
  const [error, setError] = useState<string | null>(null)

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
  const handleAddTask = () => {
    if (!commitment) return

    const newTaskTitle = prompt('Enter task title:')
    if (!newTaskTitle) return

    const dueDateStr = prompt(
      'Enter due date (YYYY-MM-DD), leave empty for no due date:',
    )

    const newTask = {
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
  const handleAddHabit = () => {
    if (!commitment) return

    const newHabitTitle = prompt('Enter habit title:')
    if (!newHabitTitle) return

    const scheduleOptions = ['daily', 'weekly', 'monthly']
    const scheduleIndex = prompt(
      `Choose schedule type (enter number):\n1. Daily\n2. Weekly\n3. Monthly`,
    )
    const schedule = scheduleOptions[Number(scheduleIndex) - 1] || 'weekly'

    const newHabit = {
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
  const handleAddNote = () => {
    if (!commitment) return

    const noteContent = prompt('Enter note content:')
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
  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500'>Loading commitment details...</p>
        </div>
      </div>
    )
  }
  if (error || contextError || !commitment) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 dark:bg-red-900 p-6 rounded-lg'>
          <h2 className='text-xl font-medium text-red-800 dark:text-red-200 mb-2'>
            Error
          </h2>
          <p className='text-red-600 dark:text-red-300'>
            {error || contextError || 'Commitment not found'}
          </p>
          <Button
            onClick={() => navigate('/')}
            className='mt-4'
            variant='primary'
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      {' '}
      <div className='mb-6'>
        <BackButton onClick={() => navigate('/')}>Back to Dashboard</BackButton>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
        {/* Header */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='flex items-center'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {commitment.title}
                </h1>
                <span
                  className={`ml-4 text-sm px-2 py-1 rounded-full ${
                    commitment.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {commitment.status === 'active' ? 'Active' : 'Archived'}
                </span>
              </div>
              <p className='text-gray-500 dark:text-gray-400 mt-1'>
                Created on {formatDate(commitment.createdAt)}
              </p>
            </div>

            <div className='flex space-x-3'>
              <Link
                to={`/commitments/${commitment.id}/edit`}
                className='px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
                  <path
                    fillRule='evenodd'
                    d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                    clipRule='evenodd'
                  />
                </svg>
                Edit
              </Link>

              {isReviewDue(commitment) && (
                <Link
                  to={`/commitments/${commitment.id}/review`}
                  className='px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Review Now
                </Link>
              )}

              <button
                onClick={handleArchiveToggle}
                className='px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center'
              >
                {commitment.status === 'active' ? (
                  <>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' />
                      <path
                        fillRule='evenodd'
                        d='M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Archive
                  </>
                ) : (
                  <>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' />
                      <path
                        fillRule='evenodd'
                        d='M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Unarchive
                  </>
                )}
              </button>
            </div>
          </div>
        </div>{' '}
        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          commitment={commitment}
        />
        {/* Content */}
        <div className='p-6'>
          {activeTab === 'details' && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                  Description
                </h3>
                <p className='text-gray-600 dark:text-gray-300 whitespace-pre-line'>
                  {commitment.description || 'No description provided.'}
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
                    Review Frequency
                  </h3>
                  <p className='text-gray-800 dark:text-gray-200'>
                    {getReviewFrequencyText(commitment)}
                  </p>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
                    Last Reviewed
                  </h3>
                  <p className='text-gray-800 dark:text-gray-200'>
                    {formatDate(commitment.lastReviewedAt)}
                  </p>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
                    Next Review Due
                  </h3>
                  <p
                    className={`${
                      isReviewDue(commitment)
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {formatDate(getNextReviewDate(commitment))}
                    {isReviewDue(commitment) && ' (due now)'}
                  </p>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
                    Status
                  </h3>
                  <p className='text-gray-800 dark:text-gray-200'>
                    {commitment.status === 'active' ? 'Active' : 'Archived'}
                  </p>
                </div>
              </div>
            </div>
          )}{' '}
          {activeTab === 'tasks' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Tasks
                </h2>
                <button
                  onClick={handleAddTask}
                  className='px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center text-sm'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Add Task
                </button>
              </div>

              <TaskList
                tasks={commitment.subItems.tasks}
                onTaskToggle={handleTaskToggle}
              />
            </div>
          )}{' '}
          {activeTab === 'habits' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Habits
                </h2>
                <button
                  onClick={handleAddHabit}
                  className='px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center text-sm'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Add Habit
                </button>
              </div>

              <HabitList habits={commitment.subItems.habits} />
            </div>
          )}{' '}
          {activeTab === 'notes' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Notes & Progress
                </h2>
                <button
                  onClick={handleAddNote}
                  className='px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center text-sm'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Add Note
                </button>
              </div>

              <NoteList notes={commitment.notes} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
