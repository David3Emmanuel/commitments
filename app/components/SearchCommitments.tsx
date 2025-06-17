import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Commitment, Habit, Task, Note, Event } from '~/lib/types'
import { searchCommitments } from '~/lib/search'
import { TextInput } from './ui'
import { useCommitments } from '~/contexts/CommitmentContext'

interface SearchCommitmentsProps {
  className?: string
}

export function SearchCommitments({ className = '' }: SearchCommitmentsProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<
    ReturnType<typeof searchCommitments>
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const { commitments } = useCommitments()
  const navigate = useNavigate()

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)

    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results = searchCommitments(commitments, searchQuery)
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleResultClick = (commitmentId: string) => {
    navigate(`/commitments/${commitmentId}`)
  }

  return (
    <div className={`relative ${className}`}>
      <TextInput
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder='Search commitments...'
        className='w-full'
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-5 h-5 text-gray-400'
          >
            <path
              fillRule='evenodd'
              d='M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z'
              clipRule='evenodd'
            />
          </svg>
        }
      />
      {query.trim() && (
        <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto'>
          {isSearching ? (
            <div className='p-3 text-center text-gray-500'>Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className='p-3 text-center text-gray-500'>
              No results found
            </div>
          ) : (
            <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
              {searchResults.map((result) => {
                let title = ''
                let subtitle = ''

                switch (result.itemType) {
                  case 'commitment':
                    title = (result.item as Commitment).title
                    subtitle = 'Commitment'
                    break
                  case 'task':
                    title = (result.item as Task).title
                    subtitle = 'Task'
                    break
                  case 'habit':
                    title = (result.item as Habit).title
                    subtitle = 'Habit'
                    break
                  case 'note':
                    const item = result.item as Note
                    title =
                      item.content.substring(0, 60) +
                      (item.content.length > 60 ? '...' : '')
                    subtitle = 'Note'
                    break
                  case 'event':
                    title = (result.item as Event).title
                    subtitle = 'Event'
                    break
                }

                return (
                  <li
                    key={`${result.itemType}-${result.item.id}`}
                    className='p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                    onClick={() => handleResultClick(result.commitmentId)}
                  >
                    <div className='font-medium'>{title}</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center'>
                      <span className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs mr-2'>
                        {subtitle}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
