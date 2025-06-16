import React from 'react'
import { Link } from 'react-router'
import type { Commitment } from '~/lib/types'
import { isReviewDue } from '~/lib/detailFunctions'

interface CommitmentHeaderProps {
  commitment: Commitment
  formatDate: (date: Date | null) => string
  handleArchiveToggle: () => void
}

export default function CommitmentHeader({
  commitment,
  formatDate,
  handleArchiveToggle,
}: CommitmentHeaderProps) {
  return (
    <div className='p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
              {commitment.title}
            </h1>
            <span
              className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                commitment.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {commitment.status === 'active' ? 'Active' : 'Archived'}
            </span>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Created on {formatDate(commitment.createdAt)}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Link
            to={`/commitments/${commitment.id}/edit`}
            className='px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3 w-3 sm:h-4 sm:w-4 mr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
              <path
                fillRule='evenodd'
                d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                clipRule='evenodd'
              />
            </svg>
            Edit
          </Link>
          {isReviewDue(commitment) && (
            <Link
              to={`/commitments/${commitment.id}/review`}
              className='px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-3 w-3 sm:h-4 sm:w-4 mr-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z'
                  clipRule='evenodd'
                />
              </svg>
              Review Now
            </Link>
          )}
          <button
            onClick={handleArchiveToggle}
            className='px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center'
          >
            {commitment.status === 'active' ? (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-3 w-3 sm:h-4 sm:w-4 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' />
                  <path
                    fillRule='evenodd'
                    d='M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='sm:inline'>Archive</span>
              </>
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-3 w-3 sm:h-4 sm:w-4 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' />
                  <path
                    fillRule='evenodd'
                    d='M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='sm:inline'>Unarchive</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
