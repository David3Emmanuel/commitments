import type { Habit, HabitTarget } from '~/lib/types'
import { Link } from 'react-router'
import { Badge, Button } from '~/components/ui'
import { useModal } from '~/components/ui/Modal'
import { HabitToggle } from '~/components/HabitToggle'
import useSort from '~/lib/hooks/useSort'
import { useHabitDetails } from '~/lib/hooks/useHabitDetails'

interface HabitListProps {
  habits: Habit[]
  onHabitToggle?: (habitId: string, date: Date, value?: HabitTarget) => void
  onEditHabit?: (habitId: string) => void
  onDeleteHabit?: (habitId: string) => void
}

export default function HabitList({
  habits,
  onHabitToggle,
  onEditHabit,
  onDeleteHabit,
}: HabitListProps) {
  const { compareHabitsByUrgency } = useSort()

  if (habits.length === 0) {
    return (
      <p className='py-6 text-center text-gray-500 dark:text-gray-400'>
        No habits added yet. Add recurring habits to build consistency with your
        commitment.
      </p>
    )
  }

  const sortedHabits = [...habits].sort(compareHabitsByUrgency)

  return (
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
      {sortedHabits.map((habit) => (
        <HabitListItem
          habit={habit}
          key={habit.id}
          onDeleteHabit={onDeleteHabit}
          onEditHabit={onEditHabit}
          onHabitToggle={onHabitToggle}
        />
      ))}
    </ul>
  )
}

// Format date for display, returning a friendly message if null
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString()
}

function HabitListItem({
  habit,
  onDeleteHabit,
  onEditHabit,
  onHabitToggle,
}: {
  habit: Habit
  onEditHabit?: (habitId: string) => void
  onDeleteHabit?: (habitId: string) => void
  onHabitToggle?: (habitId: string, date: Date, value?: HabitTarget) => void
}) {
  const modal = useModal()
  const { getHabitUrgency, getUrgencyClass } = useSort()

  // Get urgency class from utility
  const urgencyClass = getUrgencyClass(getHabitUrgency(habit))
  const { isHabitActive } = useHabitDetails(habit)
  const isActive = isHabitActive()

  return (
    <li key={habit.id} className={`py-4 ${urgencyClass}`}>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-gray-800 dark:text-gray-200'>
          <Link
            to={`/habit/${habit.id}`}
            className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            {habit.title}
            {!isActive && (
              <span className='ml-2 text-xs text-gray-400'>(Inactive)</span>
            )}
          </Link>
        </h3>
        <div className='flex items-center gap-2'>
          <Badge variant='primary'>{habit.schedule}</Badge>

          {onHabitToggle && isActive && (
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
        <div className='text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4'>
          <span>{Object.keys(habit.history).length} check-ins recorded</span>
          <span>Start: {formatDate(habit.startOn)}</span>
          {habit.endOn && <span>End: {formatDate(habit.endOn)}</span>}
        </div>
        <div className='mt-1 flex flex-wrap gap-1'>
          {Object.values(habit.history)
            .filter((entry) => entry.completed)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 5)
            .map((entry, i) => (
              <Badge key={i} variant='default'>
                {new Date(entry.date).toLocaleDateString()}
              </Badge>
            ))}
          {Object.keys(habit.history).length > 5 && (
            <Link to={`/habit/${habit.id}`}>
              <Badge variant='primary'>View all...</Badge>
            </Link>
          )}
        </div>
        <div className='mt-2 text-xs'>
          <Link
            to={`/habit/${habit.id}`}
            className='text-blue-600 dark:text-blue-400 hover:underline flex items-center'
          >
            <span>View habit details</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3 w-3 ml-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </Link>
        </div>
      </div>
    </li>
  )
}
