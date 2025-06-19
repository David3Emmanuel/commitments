import type { Habit } from '~/lib/types'
import { Checkbox } from '~/components/ui'

interface HabitsReviewProps {
  habits: Habit[]
  habitCheckIns: Record<string, boolean>
  handleHabitToggle: (habitId: string) => void
}

const HabitsReview: React.FC<HabitsReviewProps> = ({
  habits,
  habitCheckIns,
  handleHabitToggle,
}) => {
  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
        Check In Habits
      </h2>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        Mark the habits you've maintained since your last review.
      </p>

      {habits.length === 0 ? (
        <div className='text-center py-6'>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>
            No habits added to this commitment yet.
          </p>
        </div>
      ) : (
        <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
          {habits.map((habit) => (
            <li key={habit.id} className='py-4'>
              <div className='flex items-start'>
                <Checkbox
                  checked={habitCheckIns[habit.id] || false}
                  onChange={() => handleHabitToggle(habit.id)}
                />
                <div className='ml-3 flex flex-col'>
                  <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                    {habit.title}
                  </span>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {habit.schedule} · {habit.history.length} previous check-ins
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HabitsReview
