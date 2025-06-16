import { useState } from 'react'
import type { Commitment, Event } from '~/lib/types'
import { Button, Card } from './ui'
import { EventCard } from './EventCard'

interface EventListProps {
  commitment: Commitment
  onAddEvent: () => void
  onEditEvent: (event: Event) => void
}

export function EventList({
  commitment,
  onAddEvent,
  onEditEvent,
}: EventListProps) {
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const events = commitment.events || []

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)

    if (filter === 'upcoming') {
      return eventDate >= today
    } else {
      return eventDate < today
    }
  })
  // Sort by date (closest first for upcoming, most recent first for past)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return filter === 'past' ? dateB - dateA : dateA - dateB
  })

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='text-lg font-semibold'>Events ({events.length})</div>
        <Button variant='primary' size='sm' onClick={onAddEvent}>
          Add Event
        </Button>
      </div>
      <div className='flex space-x-2 mb-4'>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === 'upcoming'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === 'past'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === 'all'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>{' '}
      {sortedEvents.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          No {filter} events found
        </div>
      ) : (
        <div className='space-y-3'>
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={onEditEvent} />
          ))}
        </div>
      )}
    </div>
  )
}
