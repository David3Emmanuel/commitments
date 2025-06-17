import { useState } from 'react'
import { Link } from 'react-router'
import type { Route } from './+types/dashboard'
import { CommitmentCard } from '~/components/CommitmentCard'
import { Button, Tabs } from '~/components/ui'
import { SearchCommitments } from '~/components/SearchCommitments'
import { useCommitments } from '~/contexts/CommitmentContext'
import { compareCommitmentsByUrgency } from '~/lib/sort'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard | Commitment Manager' },
    { name: 'description', content: 'Manage your long-term commitments' },
  ]
}

export default function Dashboard() {
  const { isLoading, getActiveCommitments, getArchivedCommitments } =
    useCommitments()
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active')
  // Get commitments and sort by urgency
  const filteredCommitments = (
    viewMode === 'active' ? getActiveCommitments() : getArchivedCommitments()
  ).sort(compareCommitmentsByUrgency)

  const renderCommitments = () => {
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
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
          Commitments Dashboard
        </h1>
        <Link to='/commitments/new'>
          <Button variant='primary' className='max-sm:hidden'>
            New Commitment
          </Button>
          <Button variant='primary' className='sm:hidden'>
            New
          </Button>
        </Link>
      </div>

      <div className='mb-6'>
        <SearchCommitments className='mb-4' />
      </div>

      <div className='flex justify-center mb-6'>
        <Tabs
          tabs={[
            { id: 'active', label: 'Active' },
            { id: 'archived', label: 'Archived' },
          ]}
          activeTab={viewMode}
          onTabChange={(tab) => setViewMode(tab as 'active' | 'archived')}
          className='inline-flex rounded-md shadow-sm'
        />
      </div>

      {renderCommitments()}
    </div>
  )
}

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
