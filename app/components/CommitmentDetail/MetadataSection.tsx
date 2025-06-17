import {
  isReviewDue,
  getReviewFrequencyText,
  getNextReviewDate,
} from '~/lib/details'
import type { Commitment } from '~/lib/types'

export function MetadataSection({
  commitment,
  formatDate,
}: MetadataSectionProps) {
  const isReviewDueNow = isReviewDue(commitment)
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <MetadataItem
        label='Review Frequency'
        value={getReviewFrequencyText(commitment)}
      />
      <MetadataItem
        label='Last Reviewed'
        value={formatDate(commitment.lastReviewedAt)}
      />
      <MetadataItem
        label='Next Review Due'
        value={
          <>
            {formatDate(getNextReviewDate(commitment))}
            {isReviewDueNow && ' (due now)'}
          </>
        }
        isHighlighted={isReviewDueNow}
      />
      <MetadataItem
        label='Status'
        value={commitment.status === 'active' ? 'Active' : 'Archived'}
      />
    </div>
  )
} // Metadata Section Component

export interface MetadataSectionProps {
  commitment: Commitment
  formatDate: (date: Date | null) => string
}

// Metadata Item Component
interface MetadataItemProps {
  label: string
  value: string | React.ReactNode
  isHighlighted?: boolean
}

function MetadataItem({ label, value, isHighlighted }: MetadataItemProps) {
  return (
    <div>
      <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
        {label}
      </h3>
      <p
        className={`${
          isHighlighted
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
