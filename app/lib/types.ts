export type Task = {
  id: string
  title: string
  dueAt?: Date | null
  completed: boolean
}

export type Habit = {
  id: string
  title: string
  schedule: 'daily' | 'weekly' | 'monthly'
  history: Date[]
}

export type Note = {
  id: string
  content: string
  timestamp: Date
}

export type Event = {
  id: string
  title: string
  date: Date
  time: string
  location?: string
  description?: string
  reminderTime?: Date
  isAllDay: boolean
}

export type Commitment = {
  id: string
  title: string
  description: string
  createdAt: Date
  reviewFrequency: {
    type: 'interval' | 'custom'
    intervalDays?: number
    customCron?: string
  }
  lastReviewedAt: Date | null
  subItems: {
    tasks: Task[]
    habits: Habit[]
  }
  notes: Note[]
  events: Event[]
  status: 'active' | 'archived'
}
