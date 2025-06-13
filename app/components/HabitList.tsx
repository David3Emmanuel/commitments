import React from 'react'
import type { Habit } from '~/lib/types'
import { Badge } from '~/components/ui'

interface HabitListProps {
  habits: Habit[]
}

export default function HabitList({ habits }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <p className='text-gray-500 dark:text-gray-400 text-center py-6'>
        No habits added yet. Add recurring habits to build consistency with your
        commitment.
      </p>
    )
  }

  return (
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
      {habits.map((habit) => (
        <li key={habit.id} className='py-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-gray-800 dark:text-gray-200'>
              {habit.title}
            </h3>
            <Badge variant='primary'>{habit.schedule}</Badge>
          </div>
          <div className='mt-2'>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {habit.history.length} check-ins recorded
            </p>
            <div className='mt-1 flex flex-wrap gap-1'>
              {habit.history.slice(-5).map((date, i) => (
                <Badge key={i} variant='default'>
                  {new Date(date).toLocaleDateString()}
                </Badge>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
