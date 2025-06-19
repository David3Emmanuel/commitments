import { useState } from 'react'
import { Link } from 'react-router'
import type { Route } from './+types/dashboard'
import { CommitmentList } from '~/components/CommitmentList'
import { Button, Tabs } from '~/components/ui'
import { SearchCommitments } from '~/components/SearchCommitments'
import { useCommitments } from '~/lib/contexts/CommitmentContext'
import useSort from '~/lib/hooks/useSort'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard | Commitment Manager' },
    { name: 'description', content: 'Manage your long-term commitments' },
  ]
}

export default function Dashboard() {
  const { compareCommitmentsByUrgency } = useSort()
  const { isLoading, getActiveCommitments, getArchivedCommitments } =
    useCommitments()
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active')
  // Get commitments and sort by urgency
  const filteredCommitments = (
    viewMode === 'active' ? getActiveCommitments() : getArchivedCommitments()
  ).sort(compareCommitmentsByUrgency)

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
          Commitments Dashboard
        </h1>
        <div className='flex items-center gap-2'>
          <Link to='/settings' className='mr-2'>
            <Button
              variant='secondary'
              className='max-sm:w-10 max-sm:h-10 max-sm:p-0 flex items-center justify-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='max-sm:hidden ml-1'>Settings</span>
            </Button>
          </Link>
          <Link to='/commitments/new'>
            <Button variant='primary' className='max-sm:hidden'>
              New Commitment
            </Button>
            <Button variant='primary' className='sm:hidden'>
              New
            </Button>
          </Link>
        </div>
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

      <CommitmentList
        isLoading={isLoading}
        filteredCommitments={filteredCommitments}
        viewMode={viewMode}
      />
    </div>
  )
}
