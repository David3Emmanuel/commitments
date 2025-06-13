import { useParams } from 'react-router'
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
import { useReviewProcess } from '~/hooks/useReviewProcess'

export default function ReviewCommitment() {
  const { id } = useParams<{ id: string }>()
  const {
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
  } = useReviewProcess(id || '')

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
            onClick={() => (window.location.href = '/')}
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
      {' '}
      <div className='mb-8'>
        <BackButton onClick={cancelReview}>Back to Commitment</BackButton>
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
        <ReviewProgress currentStep={currentStep} />
        <CardContent>
          {currentStep === 'tasks' && (
            <TasksReview
              tasks={commitment.subItems.tasks}
              taskCompletionStatus={taskCompletionStatus}
              handleTaskToggle={handleTaskToggle}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
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
          )}{' '}
          {currentStep === 'complete' && (
            <ReviewComplete onReturn={cancelReview} />
          )}
        </CardContent>
        {currentStep !== 'complete' && (
          <CardFooter>
            {' '}
            <ReviewFooter
              currentStep={currentStep}
              onCancel={cancelReview}
              onNext={handleNextStep}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
