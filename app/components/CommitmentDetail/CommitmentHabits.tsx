import React from 'react'
import type { Habit } from '~/lib/types'
import HabitList from '~/components/HabitList'

interface CommitmentHabitsProps {
  habits: Habit[]
  onAddHabit: () => void
}

export default function CommitmentHabits({
  habits,
  onAddHabit,
}: CommitmentHabitsProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Habits
        </h2>
        <button
          onClick={onAddHabit}
          className='px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center text-sm'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 mr-1'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg>
          Add Habit
        </button>
      </div>

      <HabitList habits={habits} />
    </div>
  )
}
