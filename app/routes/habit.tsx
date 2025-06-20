import { Link, useParams } from 'react-router'
import { useHabitDetails } from '~/lib/hooks/useHabitDetails'
import { useDate } from '~/lib/hooks/useDate'
import type { Habit } from '~/lib/types'
import { BackButton } from '~/components/ui'
import { HabitCalendar } from '~/components/HabitCalendar'

export default function Habit() {
  const { id } = useParams<{ id: string }>()
  const {
    habit,
    commitment,
    isLoading,
    error,
    toggleHabit,
    isCompletedForDate,
    calculateStreak,
  } = useHabitDetails(id || '')
  const { getNow } = useDate()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-pulse text-lg dark:text-gray-200'>
          Loading habit details...
        </div>
      </div>
    )
  }

  if (error || !habit || !commitment) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <div className='bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded shadow-md'>
          <p className='font-bold'>Error</p>
          <p>{error || 'Habit not found'}</p>
        </div>
      </div>
    )
  }

  const startDate = new Date(habit.startOn).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const endDate = habit.endOn
    ? new Date(habit.endOn).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const streak = calculateStreak()

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <Link className='my-6' to={`/commitments/${commitment.id}`}>
        <BackButton />
      </Link>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors'>
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-800 p-6 text-white'>
          <h1 className='text-3xl font-bold'>{habit.title}</h1>
          <Link
            className='mt-2 text-blue-100 dark:text-blue-200'
            to={`/commitments/${commitment.id}`}
          >
            Part of: {commitment.title}
          </Link>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors'>
              <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3'>
                Schedule
              </h2>
              <p className='text-gray-600 dark:text-gray-300'>
                {habit.schedule}
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors'>
              <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3'>
                Timeline
              </h2>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center'>
                  <div className='w-8 h-8 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                      Started
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {startDate}
                    </p>
                  </div>
                </div>

                {endDate && (
                  <div className='flex items-center'>
                    <div className='w-8 h-8 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center text-white'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                        Ends
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {endDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-8 transition-colors'>
            <div className='flex flex-col sm:flex-row justify-between items-center'>
              <div className='mb-4 sm:mb-0'>
                <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200'>
                  Current Streak
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  Keep up the good work!
                </p>
              </div>
              <div className='flex items-center justify-center w-24 h-24 bg-white dark:bg-gray-700 rounded-full shadow-inner border-4 border-blue-500 dark:border-blue-400 transition-colors'>
                <div className='text-center'>
                  <span className='block text-3xl font-bold text-blue-600 dark:text-blue-400'>
                    {streak}
                  </span>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center'>
            <h2 className='text-xl font-semibold mb-4 text-center dark:text-gray-200'>
              Today's Progress
            </h2>
            <button
              onClick={() => toggleHabit(getNow())}
              className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all transform hover:scale-105 ${
                isCompletedForDate(getNow())
                  ? 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200'
              }`}
            >
              {isCompletedForDate(getNow()) ? (
                <div className='flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Completed Today
                </div>
              ) : (
                'Mark as Complete'
              )}
            </button>
          </div>

          <div className='mt-8'>
            <HabitCalendar
              isCompletedForDate={isCompletedForDate}
              toggleHabit={toggleHabit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
