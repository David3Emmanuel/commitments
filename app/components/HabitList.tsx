import type { Habit, HabitTarget } from '~/lib/types'
import useSort from '~/lib/hooks/useSort'
import HabitListItem from './HabitListItem'

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
