import type { Commitment } from '~/lib/types'
import type { TimeBasedEntity } from '~/lib/detailFunctions'
import {
  getNextReviewDate,
  isReviewDue,
  getReviewFrequencyText,
  getHighlightedTimeBasedEntities,
} from '~/lib/detailFunctions'
import type { TabType } from '~/hooks/useTabNavigation'

interface CommitmentDetailsProps {
  commitment: Commitment
  formatDate: (date: Date | null) => string
  onNavigateToTab?: (tab: TabType) => void
}

export default function CommitmentDetails({
  commitment,
  formatDate,
  onNavigateToTab,
}: CommitmentDetailsProps) {
  // Get highlighted entities
  const highlightedEntitiesGroups = getHighlightedTimeBasedEntities(commitment)

  // Helper function to format the date for display with time if available
  const formatDateWithTime = (entity: TimeBasedEntity) => {
    const date = formatDate(entity.date)
    if (entity.type === 'event' && 'time' in entity.originalEntity) {
      return `${date} at ${entity.originalEntity.time}`
    }
    return date
  }
  // Handle click on entity to navigate to the appropriate tab
  const handleEntityClick = (entity: TimeBasedEntity) => {
    if (!onNavigateToTab) return

    switch (entity.type) {
      case 'task':
        onNavigateToTab('tasks')
        break
      case 'habit':
        onNavigateToTab('habits')
        break
      case 'event':
        onNavigateToTab('events')
        break
      case 'review':
        // Stay on details tab for review
        break
    }
  }

  // Helper function to get styles based on highlight type
  const getHighlightStyles = (
    highlightType: 'urgent' | 'upcoming' | 'normal',
  ) => {
    switch (highlightType) {
      case 'urgent':
        return {
          background: 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500',
          text: 'text-red-600 dark:text-red-400',
          icon: '⚠️ Urgent',
        }
      case 'upcoming':
        return {
          background:
            'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500',
          text: 'text-yellow-600 dark:text-yellow-400',
          icon: '⏰ Upcoming',
        }
      case 'normal':
        return {
          background:
            'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500',
          text: 'text-blue-600 dark:text-blue-400',
          icon: '📅 Next Up',
        }
    }
  }
  return (
    <div className='space-y-6'>
      {/* Entity Highlight Banners */}
      {highlightedEntitiesGroups.map((group, groupIndex) => (
        <div key={groupIndex} className='space-y-2'>
          {group.entities.map((entity) => (
            <div
              key={entity.id}
              className={`p-4 rounded-lg mb-2 ${
                getHighlightStyles(group.highlightType).background
              } ${
                onNavigateToTab && entity.type !== 'review'
                  ? 'cursor-pointer hover:bg-opacity-90'
                  : ''
              }`}
              onClick={() => {
                if (onNavigateToTab && entity) {
                  handleEntityClick(entity)
                }
              }}
            >
              <h3 className='font-medium mb-1 flex items-center'>
                <span
                  className={`mr-2 ${
                    getHighlightStyles(group.highlightType).text
                  }`}
                >
                  {getHighlightStyles(group.highlightType).icon}
                </span>
                <span className='text-gray-800 dark:text-gray-200'>
                  {entity.title}
                </span>
              </h3>
              <p
                className={`text-sm ${
                  getHighlightStyles(group.highlightType).text
                }`}
              >
                Due: {formatDateWithTime(entity)}
                {onNavigateToTab && entity.type !== 'review' && (
                  <span className='ml-2 underline'>Click to view</span>
                )}
              </p>
            </div>
          ))}
        </div>
      ))}

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
  )
}
