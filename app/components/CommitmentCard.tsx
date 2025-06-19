import { Link } from 'react-router'
import type { Commitment, Task } from '~/lib/types'
import { Badge, ProgressBar } from '~/components/ui'
import useSort, { type UrgencyLevel } from '~/lib/hooks/useSort'

interface CommitmentCardProps {
  commitment: Commitment
}

export function CommitmentCard({ commitment }: CommitmentCardProps) {
  const { getCommitmentUrgency, getUrgencyClass } = useSort()

  // Calculate next review date based on frequency
  const getNextReviewDate = (commitment: Commitment): Date => {
    if (!commitment.lastReviewedAt) {
      return new Date() // If never reviewed, it's due now
    }

    const lastReview = new Date(commitment.lastReviewedAt)
    const nextReview = new Date(lastReview)

    if (
      commitment.reviewFrequency.type === 'interval' &&
      commitment.reviewFrequency.intervalDays
    ) {
      nextReview.setDate(
        nextReview.getDate() + commitment.reviewFrequency.intervalDays,
      )
    } else {
      // For custom schedules, we'd need proper cron parsing
      // For now just default to weekly
      nextReview.setDate(nextReview.getDate() + 7)
    }

    return nextReview
  }

  // Check if a commitment review is overdue
  const isOverdue = (nextReviewDate: Date): boolean => {
    return nextReviewDate < new Date()
  }

  // Calculate completion percentage of tasks
  const getTaskCompletionPercentage = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.completed).length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const nextReviewDate = getNextReviewDate(commitment)
  const taskCompletion = getTaskCompletionPercentage(commitment.subItems.tasks)
  const overdueStatus = isOverdue(nextReviewDate)
  const urgency = getCommitmentUrgency(commitment)
  const urgencyClass = getUrgencyClass(urgency)

  // Get urgency label
  const getUrgencyLabel = (level: UrgencyLevel): string => {
    switch (level) {
      case 'urgent':
        return 'Urgent'
      case 'upcoming':
        return 'Due Today'
      case 'tomorrow':
        return 'Due Tomorrow'
      default:
        return overdueStatus ? 'Review Due' : 'On Track'
    }
  }

  return (
    <Link
      key={commitment.id}
      to={`/commitments/${commitment.id}`}
      className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow ${urgencyClass}`}
    >
      <div className='flex justify-between items-start mb-4'>
        <h2 className='text-xl font-medium text-gray-900 dark:text-white'>
          {commitment.title}
        </h2>
        <Badge
          variant={
            urgency === 'urgent' || overdueStatus
              ? 'danger'
              : urgency === 'upcoming'
              ? 'warning'
              : 'success'
          }
        >
          {getUrgencyLabel(urgency)}
        </Badge>
      </div>

      <p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-2'>
        {commitment.description || 'No description provided.'}
      </p>

      <div className='space-y-3'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500 dark:text-gray-400'>Next review:</span>
          <span className='font-medium text-gray-700 dark:text-gray-300'>
            {nextReviewDate.toLocaleDateString()}
          </span>
        </div>

        {commitment.subItems.tasks.length > 0 && (
          <div className='space-y-1'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500 dark:text-gray-400'>Tasks:</span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                {taskCompletion}% complete
              </span>
            </div>
            <ProgressBar progress={taskCompletion} />
          </div>
        )}

        <div className='flex justify-between text-sm'>
          <span className='text-gray-500 dark:text-gray-400'>Habits:</span>
          <span className='font-medium text-gray-700 dark:text-gray-300'>
            {commitment.subItems.habits.length}
          </span>
        </div>
      </div>
    </Link>
  )
}
