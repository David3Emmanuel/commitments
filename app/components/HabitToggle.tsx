import { useHabitDetails } from '~/lib/hooks/useHabitDetails'
import { useDate } from '~/lib/hooks/useDate'
import type { Habit } from '~/lib/types'

export function HabitToggle({
  habit,
  onToggle,
}: {
  habit: Habit
  onToggle: (habitId: string, date: Date) => void
}) {
  const { getNow, isSameDay } = useDate()
  const { isHabitActive } = useHabitDetails(habit)
  const today = getNow()

  // Check if habit was tracked today, respecting user's day start hour setting
  const isTrackedToday = habit.history.some((date) => {
    return isSameDay(new Date(date), today)
  })

  // If habit is not active, return a disabled button
  if (!isHabitActive()) {
    return (
      <button
        disabled
        aria-disabled='true'
        className='relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
        title='Habit not active for today'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={() => onToggle(habit.id, today)}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300
        ${
          isTrackedToday
            ? 'scale-110 bg-green-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      title={isTrackedToday ? 'Tracked today' : 'Track habit'}
    >
      {isTrackedToday ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 animate-scale-in'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
            clipRule='evenodd'
          />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 text-gray-500 dark:text-gray-300'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
          />
        </svg>
      )}
    </button>
  )
}
