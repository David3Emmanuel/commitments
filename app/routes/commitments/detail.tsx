import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import NavigationTabs from '~/components/NavigationTabs'
import { useCommitmentDetail } from '~/lib/hooks/useCommitmentDetail'
import { type TabType } from '~/lib/hooks/useTabNavigation'
import {
  CommitmentHeader,
  CommitmentDetails,
  CommitmentTasks,
  CommitmentHabits,
  CommitmentNotes,
  CommitmentEvents,
} from '~/components/CommitmentDetail'
import { BackButton, Button } from '~/components/ui'
import { useCommitments } from '~/lib/contexts/CommitmentContext'

export default function CommitmentDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const {
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
    handleEditHabit,
    handleDeleteHabit,
    handleHabitToggle,
    handleEditNote,
    handleDeleteNote,
  } = useCommitmentDetail(id)
  const { loadCommitments } = useCommitments()

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500'>Loading commitment details...</p>
        </div>
      </div>
    )
  }
  if (!commitment) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg'>
          <h2 className='text-xl font-medium text-yellow-800 dark:text-yellow-200 mb-2'>
            Commitment Not Found
          </h2>
          <p className='text-yellow-600 dark:text-yellow-300'>
            The commitment you are looking for does not exist.
          </p>
          <Button
            onClick={() => {
              loadCommitments()
              navigate('/')
            }}
            className='mt-4'
            variant='primary'
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }
  if (error || contextError) {
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
      <div className='mb-6'>
        <BackButton onClick={() => navigate('/')}>Back to Dashboard</BackButton>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
        <CommitmentHeader
          commitment={commitment}
          formatDate={formatDate}
          handleArchiveToggle={handleArchiveToggle}
        />
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          commitment={commitment}
        />
        <div className='p-6'>
          {activeTab === 'details' && (
            <CommitmentDetails
              commitment={commitment}
              formatDate={formatDate}
              onNavigateToTab={setActiveTab}
            />
          )}
          {activeTab === 'tasks' && (
            <CommitmentTasks
              tasks={commitment.subItems.tasks}
              onTaskToggle={handleTaskToggle}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
          {activeTab === 'habits' && (
            <CommitmentHabits
              habits={commitment.subItems.habits}
              onAddHabit={handleAddHabit}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
              onHabitToggle={handleHabitToggle}
            />
          )}
          {activeTab === 'notes' && (
            <CommitmentNotes
              notes={commitment.notes}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          )}
          {activeTab === 'events' && (
            <CommitmentEvents commitment={commitment} />
          )}
        </div>
      </div>
    </div>
  )
}
