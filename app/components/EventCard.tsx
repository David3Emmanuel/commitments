import React from 'react'
import type { Event } from '~/lib/types'

interface EventCardProps {
  event: Event
  onClick: (event: Event) => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const formatEventTime = (event: Event): string => {
    if (event.isAllDay) {
      return 'All day'
    }
    return event.time
  }

  return (
    <div
      className='p-2 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
      onClick={() => onClick(event)}
    >
      <div className='flex justify-between'>
        <div className='flex-1'>
          <h3 className='font-medium'>{event.title}</h3>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {new Date(event.date).toLocaleDateString()} •{' '}
            {formatEventTime(event)}
          </div>
          {event.location && (
            <div className='text-sm mt-1'>📍 {event.location}</div>
          )}
          {event.schedule && (
            <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              🔁 Repeats {event.schedule}
              {event.endOn &&
                ` until ${new Date(event.endOn).toLocaleDateString()}`}
            </div>
          )}
        </div>
        <div>
          {new Date(event.date) >= today && (
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'>
              {new Date(event.date).toLocaleDateString() ===
              today.toLocaleDateString()
                ? 'Today'
                : 'Upcoming'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
