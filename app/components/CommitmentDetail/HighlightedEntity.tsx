import type { TimeBasedEntity } from '~/lib/detailFunctions'
import { getHighlightStyles, type HighlightType } from './CommitmentDetails'

interface HighlightedEntityProps {
  entity: TimeBasedEntity
  highlightType: HighlightType
  formatDateWithTime: (entity: TimeBasedEntity) => string
  onEntityClick: (entity: TimeBasedEntity) => void
  canNavigate: boolean
}

export function HighlightedEntity({
  entity,
  highlightType,
  formatDateWithTime,
  onEntityClick,
  canNavigate,
}: HighlightedEntityProps) {
  const styles = getHighlightStyles(highlightType)
  const isClickable = canNavigate && entity.type !== 'review'

  return (
    <div
      className={`p-4 rounded-lg mb-2 ${styles.background} ${
        isClickable ? 'cursor-pointer hover:bg-opacity-90' : ''
      }`}
      onClick={() => isClickable && onEntityClick(entity)}
    >
      <h3 className='font-medium mb-1 flex items-center'>
        <span className={`mr-2 ${styles.text}`}>{styles.icon}</span>
        <span className='text-gray-800 dark:text-gray-200'>{entity.title}</span>
      </h3>
      <p className={`text-sm ${styles.text}`}>
        Due: {formatDateWithTime(entity)}
        {isClickable && <span className='ml-2 underline'>Click to view</span>}
      </p>
    </div>
  )
}
