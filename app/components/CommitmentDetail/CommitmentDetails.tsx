import type { Commitment } from '~/lib/types'
import {
  type TimeBasedEntity,
  getHighlightedTimeBasedEntities,
} from '~/lib/details'
import type { TabType } from '~/lib/hooks/useTabNavigation'
import { HighlightedEntitiesGroup } from './HighlightedEntitiesGroup'
import { MetadataSection } from './MetadataSection'

interface CommitmentDetailsProps {
  commitment: Commitment
  formatDate: (date: Date | null) => string
  onNavigateToTab?: (tab: TabType) => void
}

export type HighlightType = 'urgent' | 'upcoming' | 'normal'

interface HighlightStyles {
  background: string
  text: string
  icon: string
}

export function getHighlightStyles(
  highlightType: HighlightType,
): HighlightStyles {
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
        background: 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        icon: '📅 Next Up',
      }
  }
}

// Description Component
interface DescriptionSectionProps {
  description: string | null | undefined
}

function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <div>
      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
        Description
      </h3>
      <p className='text-gray-600 dark:text-gray-300 whitespace-pre-line'>
        {description || 'No description provided.'}
      </p>
    </div>
  )
}

export default function CommitmentDetails({
  commitment,
  formatDate,
  onNavigateToTab,
}: CommitmentDetailsProps) {
  const highlightedEntitiesGroups = getHighlightedTimeBasedEntities(commitment)

  const formatDateWithTime = (entity: TimeBasedEntity) => {
    const date = formatDate(entity.date)
    if (entity.type === 'event' && 'time' in entity.originalEntity) {
      return `${date} at ${entity.originalEntity.time}`
    }
    return date
  }

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
        // Reviews are handled by the Link component in HighlightedEntity
        break
    }
  }

  return (
    <div className='space-y-6'>
      {highlightedEntitiesGroups.map((group, groupIndex) => (
        <HighlightedEntitiesGroup
          key={groupIndex}
          group={group}
          formatDateWithTime={formatDateWithTime}
          onEntityClick={handleEntityClick}
          canNavigate={!!onNavigateToTab}
          commitmentId={commitment.id}
        />
      ))}
      <DescriptionSection description={commitment.description} />
      <MetadataSection commitment={commitment} formatDate={formatDate} />
    </div>
  )
}
