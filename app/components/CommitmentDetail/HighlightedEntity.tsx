import type { TimeBasedEntity } from '~/lib/detailFunctions'
import { Link } from 'react-router'
import { getHighlightStyles, type HighlightType } from './CommitmentDetails'

interface HighlightedEntityProps {
  entity: TimeBasedEntity
  highlightType: HighlightType
  formatDateWithTime: (entity: TimeBasedEntity) => string
  onEntityClick: (entity: TimeBasedEntity) => void
  canNavigate: boolean
  commitmentId: string
}

export function HighlightedEntity({
  entity,
  highlightType,
  formatDateWithTime,
  onEntityClick,
  canNavigate,
  commitmentId,
}: HighlightedEntityProps) {
  const styles = getHighlightStyles(highlightType)
  const isReview = entity.type === 'review'

  if (isReview) {
    return (
      <Link
        to={`/commitments/${commitmentId}/review`}
        className={`block p-4 rounded-lg mb-2 ${styles.background} cursor-pointer hover:bg-opacity-90`}
      >
        <h3 className='font-medium mb-1 flex items-center'>
          <span className={`mr-2 ${styles.text}`}>{styles.icon}</span>
          <span className='text-gray-800 dark:text-gray-200'>
            {entity.title}
          </span>
        </h3>
        <p className={`text-sm ${styles.text}`}>
          Due: {formatDateWithTime(entity)}
          <span className='ml-2 underline'>Click to review</span>
        </p>
      </Link>
    )
  }

  return (
    <div
      className={`p-4 rounded-lg mb-2 ${styles.background} ${
        canNavigate ? 'cursor-pointer hover:bg-opacity-90' : ''
      }`}
      onClick={() => canNavigate && onEntityClick(entity)}
    >
      <h3 className='font-medium mb-1 flex items-center'>
        <span className={`mr-2 ${styles.text}`}>{styles.icon}</span>
        <span className='text-gray-800 dark:text-gray-200'>{entity.title}</span>
      </h3>
      <p className={`text-sm ${styles.text}`}>
        Due: {formatDateWithTime(entity)}
        {canNavigate && <span className='ml-2 underline'>Click to view</span>}
      </p>
    </div>
  )
}
