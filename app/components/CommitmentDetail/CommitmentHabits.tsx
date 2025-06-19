import type { Habit } from '~/lib/types'
import HabitList from '~/components/HabitList'
import { Button } from '~/components/ui'

interface CommitmentHabitsProps {
  habits: Habit[]
  onAddHabit: () => void
  onEditHabit?: (habitId: string) => void
  onDeleteHabit?: (habitId: string) => void
  onHabitToggle?: (habitId: string, date: Date) => void
}

export default function CommitmentHabits({
  habits,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onHabitToggle,
}: CommitmentHabitsProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Habits
        </h2>
        <Button
          variant='primary'
          size='sm'
          onClick={onAddHabit}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
          }
        >
          Add Habit
        </Button>
      </div>

      <HabitList
        habits={habits}
        onEditHabit={onEditHabit}
        onDeleteHabit={onDeleteHabit}
        onHabitToggle={onHabitToggle}
      />
    </div>
  )
}
