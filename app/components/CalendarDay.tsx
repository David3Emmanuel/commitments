export interface ICalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

interface CalendarDayProps {
  day: ICalendarDay
  isCompletedForDate: (date: Date) => boolean
  toggleHabit: (date: Date, value?: number | string[] | null) => void
  canToggleDate: (date: Date) => boolean
  getValueForDate?: (date: Date) => number | string[] | null
  formatHabitValue: (value: number | string[] | null) => string
}

export function CalendarDay({
  day,
  isCompletedForDate,
  toggleHabit,
  canToggleDate,
  getValueForDate,
  formatHabitValue,
}: CalendarDayProps) {
  {
    const canToggle = canToggleDate(day.date)
    return (
      <button
        onClick={canToggle ? () => toggleHabit(day.date) : undefined}
        disabled={!canToggle}
        className={`
                aspect-square flex flex-col items-center justify-center rounded-full text-sm p-1
                ${
                  canToggle
                    ? 'transition-all transform hover:scale-110'
                    : 'cursor-default'
                }
                ${
                  !day.isCurrentMonth
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-800 dark:text-gray-200'
                } 
                ${day.isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                ${
                  isCompletedForDate(day.date)
                    ? canToggle
                      ? 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700'
                      : 'bg-green-500/80 text-white dark:bg-green-600/80' // Non-toggleable but completed
                    : day.isCurrentMonth
                    ? canToggle
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      : ''
                    : canToggle
                    ? 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    : ''
                }
              `}
      >
        <span>{day.date.getDate()}</span>
        {isCompletedForDate(day.date) && getValueForDate && (
          <span className='text-xs mt-1'>
            {formatHabitValue(getValueForDate(day.date))}
          </span>
        )}
      </button>
    )
  }
}
