import React from 'react'
import type { Commitment } from '~/lib/types'
import {
  getNextReviewDate,
  isReviewDue,
  getReviewFrequencyText,
} from '~/lib/detailFunctions'

interface CommitmentDetailsProps {
  commitment: Commitment
  formatDate: (date: Date | null) => string
}

export default function CommitmentDetails({
  commitment,
  formatDate,
}: CommitmentDetailsProps) {
  return (
    <div className='space-y-6'>
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
