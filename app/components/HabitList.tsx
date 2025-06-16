import React from 'react'
import type { Habit } from '~/lib/types'
import { Badge, Button } from '~/components/ui'
import { useModal } from '~/components/ui/Modal'
import { HabitToggle } from './HabitToggle'

interface HabitListProps {
  habits: Habit[]
  onHabitToggle?: (habitId: string, date: Date) => void
  onEditHabit?: (habitId: string) => void
  onDeleteHabit?: (habitId: string) => void
}

export default function HabitList({
  habits,
  onHabitToggle,
  onEditHabit,
  onDeleteHabit,
}: HabitListProps) {
  const modal = useModal()

  if (habits.length === 0) {
    return (
      <p className='py-6 text-center text-gray-500 dark:text-gray-400'>
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
            <div className='flex items-center gap-2'>
              <Badge variant='primary'>{habit.schedule}</Badge>

              {onHabitToggle && (
                <HabitToggle habit={habit} onToggle={onHabitToggle} />
              )}

              {onEditHabit && (
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    onEditHabit(habit.id)
                  }}
                  title='Edit habit'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                    </svg>
                  }
                />
              )}

              {onDeleteHabit && (
                <Button
                  variant='danger'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    modal
                      .showConfirmModal(
                        'Delete Habit',
                        'Are you sure you want to delete this habit? All tracking history will be lost.',
                        'Delete',
                        'Cancel',
                      )
                      .then((confirmed) => {
                        if (confirmed) {
                          onDeleteHabit(habit.id)
                        }
                      })
                  }}
                  title='Delete habit'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  }
                />
              )}
            </div>
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
