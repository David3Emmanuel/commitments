import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import type { Route } from './+types/dashboard'
import type { Commitment } from '~/lib/types'
import { CommitmentCard } from '~/components/CommitmentCard'
import { Button, Tabs } from '~/components/ui'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard | Commitment Manager' },
    { name: 'description', content: 'Manage your long-term commitments' },
  ]
}

export default function Dashboard() {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active')

  useEffect(() => {
    // In MVP we're using localStorage, so load data from there
    const loadCommitments = () => {
      setIsLoading(true)
      try {
        const storedCommitments = localStorage.getItem('commitments')
        if (storedCommitments) {
          // We need to manually convert string dates back to Date objects
          const parsed = JSON.parse(storedCommitments, (key, value) => {
            if (
              key === 'createdAt' ||
              key === 'lastReviewedAt' ||
              key === 'dueAt' ||
              key === 'timestamp'
            ) {
              return value ? new Date(value) : null
            }
            if (key === 'history' && Array.isArray(value)) {
              return value.map((date) => new Date(date))
            }
            return value
          })
          setCommitments(parsed)
        } else {
          setCommitments([])
        }
      } catch (error) {
        console.error('Failed to load commitments:', error)
        setCommitments([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCommitments()
  }, [])

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Commitments Dashboard
        </h1>
        <Link to='/commitments/new'>
          <Button variant='primary'>New Commitment</Button>
        </Link>
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

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500 dark:text-gray-400'>
            Loading your commitments...
          </p>
        </div>
      ) : commitments.filter((c) => c.status === viewMode).length === 0 ? (
        <div className='rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center'>
          <h2 className='text-xl font-medium text-gray-700 dark:text-gray-300 mb-4'>
            {viewMode === 'active'
              ? 'No active commitments yet'
              : 'No archived commitments yet'}
          </h2>
          <p className='text-gray-500 dark:text-gray-400 mb-6'>
            {viewMode === 'active'
              ? 'Create your first commitment to start tracking your long-term goals!'
              : 'When you archive commitments, they will appear here.'}
          </p>
          {viewMode === 'active' && (
            <Link to='/commitments/new'>
              <Button variant='primary'>Create Your First Commitment</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {commitments
            .filter((c) => c.status === viewMode)
            .map((commitment) => (
              <CommitmentCard key={commitment.id} commitment={commitment} />
            ))}
        </div>
      )}
    </div>
  )
}
