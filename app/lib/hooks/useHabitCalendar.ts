import { useState } from 'react'
import { useDate } from './useDate'
import { useModal } from '~/components/modal-ui'
import type { HabitTarget } from '~/lib/types'
import type { ICalendarDay } from '~/components/CalendarDay'

interface UseHabitCalendarProps {
  toggleHabit: (date: Date, value?: HabitTarget) => void
  habitTarget?: HabitTarget
}

interface UseHabitCalendarResult {
  currentMonth: Date
  daysOfWeek: string[]
  calendarDays: ICalendarDay[]
  handleDayClick: (date: Date) => Promise<void>
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToCurrentMonth: () => void
  monthName: string
  year: number
  formatHabitValue: (value: HabitTarget | undefined) => string
}

export function useHabitCalendar({
  toggleHabit,
  habitTarget,
}: UseHabitCalendarProps): UseHabitCalendarResult {
  const { getNow, isSameDay } = useDate()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const modal = useModal()

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = getNow()

  // Generate all days for the current month view
  const generateCalendarDays = (): ICalendarDay[] => {
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

    const days: ICalendarDay[] = []

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

  return {
    currentMonth,
    daysOfWeek,
    calendarDays,
    handleDayClick,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    monthName,
    year,
    formatHabitValue,
  }
}

// Export the type for reuse
export type { ICalendarDay as CalendarDay }
