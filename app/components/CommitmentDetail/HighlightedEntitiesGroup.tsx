import type { TimeBasedEntity } from '~/lib/detailFunctions'
import { HighlightedEntity } from './HighlightedEntity'
import type { HighlightType } from './CommitmentDetails'

interface HighlightedEntitiesGroupProps {
  group: { highlightType: HighlightType; entities: TimeBasedEntity[] }
  formatDateWithTime: (entity: TimeBasedEntity) => string
  onEntityClick: (entity: TimeBasedEntity) => void
  canNavigate: boolean
}

export function HighlightedEntitiesGroup({
  group,
  formatDateWithTime,
  onEntityClick,
  canNavigate,
}: HighlightedEntitiesGroupProps) {
  return (
    <div className='space-y-2'>
      {group.entities.map((entity) => (
        <HighlightedEntity
          key={entity.id}
          entity={entity}
          highlightType={group.highlightType}
          formatDateWithTime={formatDateWithTime}
          onEntityClick={onEntityClick}
          canNavigate={canNavigate}
        />
      ))}
    </div>
  )
}
