import type { Commitment } from '~/lib/types'
import { CommitmentCard } from './CommitmentCard'
import { Link } from 'react-router'
import { Button } from './ui'

function NoCommitmentsMessage({
  viewMode,
}: {
  viewMode: 'active' | 'archived'
}) {
  return (
    <div className='text-center py-12'>
      <p className='text-gray-500 mb-4'>
        {viewMode === 'active'
          ? 'You have no active commitments'
          : 'You have no archived commitments'}
      </p>
      {viewMode === 'active' && (
        <Link to='/commitments/new'>
          <Button variant='primary'>Create Your First Commitment</Button>
        </Link>
      )}
    </div>
  )
}

export function CommitmentList({
  isLoading,
  filteredCommitments,
  viewMode,
}: {
  isLoading: boolean
  filteredCommitments: Commitment[]
  viewMode: 'active' | 'archived'
}) {
  if (isLoading) {
    return <div className='text-center py-12'>Loading commitments...</div>
  }

  if (filteredCommitments.length === 0)
    return <NoCommitmentsMessage viewMode={viewMode} />

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {filteredCommitments.map((commitment) => (
        <CommitmentCard key={commitment.id} commitment={commitment} />
      ))}
    </div>
  )
}
