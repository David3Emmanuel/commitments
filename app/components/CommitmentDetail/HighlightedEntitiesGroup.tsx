import type { TimeBasedEntity } from '~/lib/details'
import { HighlightedEntity } from './HighlightedEntity'
import type { HighlightType } from './CommitmentDetails'

interface HighlightedEntitiesGroupProps {
  group: { highlightType: HighlightType; entities: TimeBasedEntity[] }
  formatDateWithTime: (entity: TimeBasedEntity) => string
  onEntityClick: (entity: TimeBasedEntity) => void
  canNavigate: boolean
  commitmentId: string
}

export function HighlightedEntitiesGroup({
  group,
  formatDateWithTime,
  onEntityClick,
  canNavigate,
  commitmentId,
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
          commitmentId={commitmentId}
        />
      ))}
    </div>
  )
}
