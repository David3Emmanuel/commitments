import React from 'react'
import { useDate } from '~/lib/hooks/useDate'
import { useModal } from '~/components/modal-ui'
import type { HabitTarget } from '~/lib/types'

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

interface HabitCalendarProps {
  isCompletedForDate: (date: Date) => boolean
  toggleHabit: (date: Date, value?: HabitTarget) => void
  canToggleDate: (date: Date) => boolean
  getValueForDate?: (date: Date) => HabitTarget | undefined
  habitTarget?: HabitTarget
}

export function HabitCalendar({
  isCompletedForDate,
  toggleHabit,
  canToggleDate,
  getValueForDate,
  habitTarget,
}: HabitCalendarProps) {
  const { getNow, isSameDay } = useDate()
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const modal = useModal()

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = getNow()

  // Generate all days for the current month view
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    const dayOfWeek = firstDayOfMonth.getDay()

    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Previous month days to fill the first week
    const daysFromPreviousMonth = dayOfWeek
    const previousMonth = new Date(year, month, 0)
    const daysInPreviousMonth = previousMonth.getDate()

    const days: CalendarDay[] = []

    // Add days from previous month
    for (
      let i = daysInPreviousMonth - daysFromPreviousMonth + 1;
      i <= daysInPreviousMonth;
      i++
    ) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        isToday: false,
      })
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
      })
    }

    // Add days from next month to complete the grid (always show 6 weeks)
    const totalDaysNeeded = 42 // 6 weeks * 7 days
    const remainingDays = totalDaysNeeded - days.length

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    )
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    )
  }

  // Go to current month
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  // Handle clicking on a calendar day
  const handleDayClick = async (date: Date) => {
    // If target is null or undefined, simple toggle
    if (habitTarget === null || habitTarget === undefined) {
      toggleHabit(date)
      return
    } // For numeric targets
    if (typeof habitTarget === 'number') {
      const value = await modal.showNumericModal('Enter value for this day:', {
        placeholder: 'Value',
        initialValue: habitTarget.toString(),
        min: 0,
        allowDecimal: true,
      })

      if (value) {
        const numValue = parseFloat(value)
        if (!isNaN(numValue)) {
          toggleHabit(date, numValue)
        }
      }
    }
    // For string array targets
    else if (Array.isArray(habitTarget)) {
      const options = habitTarget.map((item) => ({
        value: item,
        label: item,
      }))

      const selectedValue = await modal.showDropdownModal(
        'Select value for this day:',
        options,
        habitTarget[0],
      )

      if (selectedValue) {
        toggleHabit(date, [selectedValue])
      }
    }
  }

  // Format habit value for display
  const formatHabitValue = (value: HabitTarget | undefined): string => {
    if (value === undefined || value === null) return '✓'
    if (typeof value === 'number') return value.toString()
    if (Array.isArray(value)) return value.join(', ')
    return '✓'
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long' })
  const year = currentMonth.getFullYear()

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors max-w-96 mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
          Habit Calendar
        </h2>
        <div className='flex space-x-2'>
          <button
            onClick={goToPreviousMonth}
            className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            aria-label='Previous month'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-gray-600 dark:text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <button
            onClick={goToCurrentMonth}
            className='px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/50 transition-colors'
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            aria-label='Next month'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-gray-600 dark:text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      </div>
      <div className='text-center mb-4'>
        <h3 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
          {monthName} {year}
        </h3>
      </div>
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className='text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2'
          >
            {day}
          </div>
        ))}
      </div>{' '}
      <div className='grid grid-cols-7 gap-1'>
        {calendarDays.map((day, index) => {
          const canToggle = canToggleDate(day.date)
          return (
            <button
              key={index}
              onClick={canToggle ? () => handleDayClick(day.date) : undefined}
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
        })}
      </div>
    </div>
  )
}
