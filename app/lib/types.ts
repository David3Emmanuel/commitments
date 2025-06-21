export interface Task {
  id: string
  title: string
  dueAt?: Date | null
  completed: boolean
}

export type HabitTarget = number | string[] | null

export interface Habit<Target = HabitTarget> {
  id: string
  title: string
  schedule: 'daily' | 'weekly' | 'monthly'
  target?: Target
  history: Record<string, HabitHistoryEntry<Target>>
  startOn: Date
  endOn?: Date | null
}

export interface HabitHistoryEntry<Target = HabitTarget> {
  date: Date
  value: Target
  completed: boolean
}

export interface Note {
  id: string
  content: string
  timestamp: Date
}

export interface Event {
  id: string
  title: string
  date: Date
  time: string
  location?: string
  description?: string
  reminderTime?: Date
  isAllDay: boolean
  schedule?: 'daily' | 'weekly' | 'monthly'
  endOn?: Date | null // Only relevant for recurring events
}

export interface Commitment {
  id: string
  title: string
  description: string
  createdAt: Date
  reviewFrequency: {
    type: 'interval' | 'custom'
    intervalDays?: number
    customCron?: string
  }
  firstReviewDate?: Date | null
  lastReviewedAt: Date | null
  subItems: {
    tasks: Task[]
    habits: Habit[]
  }
  notes: Note[]
  events: Event[]
  status: 'active' | 'archived'
}

export interface Settings {
  dayStartHour: number // Hour (0-23) that represents the start of a new day
}
