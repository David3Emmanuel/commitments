import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react'
import type { Commitment } from '~/lib/types'

interface CommitmentContextType {
  commitments: Commitment[]
  isLoading: boolean
  error: string | null
  loadCommitments: () => void
  getCommitment: (id: string) => Commitment | undefined
  saveCommitment: (commitment: Commitment) => void
  createCommitment: (commitment: Commitment) => void
  updateCommitment: (commitment: Commitment) => void
  deleteCommitment: (id: string) => void
  archiveCommitment: (id: string) => void
  getActiveCommitments: () => Commitment[]
  getArchivedCommitments: () => Commitment[]
}

const CommitmentContext = createContext<CommitmentContextType | undefined>(
  undefined,
)

// Helper function to convert legacy habit history
function convertLegacyHabitHistory(habit: any): any {
  // Type guard: check if habit.history is an array of dates or strings (legacy)
  if (
    Array.isArray(habit.history) &&
    (habit.history.length === 0 ||
      habit.history[0] instanceof Date ||
      typeof habit.history[0] === 'string')
  ) {
    const newHistory: Record<string, any> = {}

    habit.history.forEach((date: Date | string) => {
      const dateObj = date instanceof Date ? date : new Date(date)
      const dateKey = dateObj.toISOString().split('T')[0]
      newHistory[dateKey] = {
        date: dateObj,
        value: null, // Default value
        completed: true, // If it was in history, it was completed
      }
    })

    return {
      ...habit,
      target: habit.target ?? null, // Preserve target if exists, else null
      history: newHistory,
    }
  }
  return habit
}

export function CommitmentProvider({ children }: { children: ReactNode }) {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCommitments()
  }, [])
  const loadCommitments = () => {
    setIsLoading(true)
    setError(null)

    try {
      const storedCommitments = localStorage.getItem('commitments')
      if (storedCommitments) {
        // Convert string dates back to Date objects
        const parsed = JSON.parse(storedCommitments, (key, value) => {
          if (
            key === 'createdAt' ||
            key === 'lastReviewedAt' ||
            key === 'dueAt' ||
            key === 'timestamp' ||
            key === 'date' ||
            key === 'reminderTime' ||
            key === 'endOn' ||
            key === 'startOn'
          ) {
            return value ? new Date(value) : null
          }
          if (key === 'history' && Array.isArray(value)) {
            return value.map((date) => new Date(date))
          }
          return value
        })

        if (!Array.isArray(parsed)) {
          throw new Error('Invalid commitments data format')
        }

        // Convert and validate each commitment
        const validated: Commitment[] = parsed.map((commitment) => {
          // Ensure subItems exist with all required arrays
          const subItems = {
            tasks: commitment.subItems?.tasks || [],
            habits: commitment.subItems?.habits || [],
            events: commitment.subItems?.events || [],
          }

          // Handle backward compatibility for habits
          subItems.habits = subItems.habits.map(convertLegacyHabitHistory)

          return {
            ...commitment,
            subItems,
          }
        })

        setCommitments(validated)
      }
    } catch (err) {
      console.error('Failed to load commitments:', err)
      setError('Failed to load commitments')
    } finally {
      setIsLoading(false)
    }
  }

  const saveToLocalStorage = (updatedCommitments: Commitment[]) => {
    try {
      localStorage.setItem('commitments', JSON.stringify(updatedCommitments))
    } catch (err) {
      console.error('Failed to save commitments:', err)
      setError('Failed to save commitments')
    }
  }

  const getCommitment = (id: string) => {
    return commitments.find((c) => c.id === id)
  }

  const saveCommitment = (commitment: Commitment) => {
    setCommitments((prev) => {
      const index = prev.findIndex((c) => c.id === commitment.id)
      let updatedCommitments: Commitment[]

      if (index !== -1) {
        updatedCommitments = [...prev]
        updatedCommitments[index] = commitment
      } else {
        updatedCommitments = [...prev, commitment]
      }

      saveToLocalStorage(updatedCommitments)
      return updatedCommitments
    })
  }

  const createCommitment = (commitment: Commitment) => {
    setCommitments((prev) => {
      const updatedCommitments = [...prev, commitment]
      saveToLocalStorage(updatedCommitments)
      return updatedCommitments
    })
  }

  const updateCommitment = (commitment: Commitment) => {
    setCommitments((prev) => {
      const updatedCommitments = prev.map((c) =>
        c.id === commitment.id ? commitment : c,
      )
      saveToLocalStorage(updatedCommitments)
      return updatedCommitments
    })
  }

  const deleteCommitment = (id: string) => {
    setCommitments((prev) => {
      const updatedCommitments = prev.filter((c) => c.id !== id)
      saveToLocalStorage(updatedCommitments)
      return updatedCommitments
    })
  }

  const archiveCommitment = (id: string) => {
    setCommitments((prev) => {
      const updatedCommitments = prev.map((c) =>
        c.id === id ? { ...c, status: 'archived' as const } : c,
      )
      saveToLocalStorage(updatedCommitments)
      return updatedCommitments
    })
  }

  const getActiveCommitments = () => {
    return commitments.filter((c) => c.status === 'active')
  }

  const getArchivedCommitments = () => {
    return commitments.filter((c) => c.status === 'archived')
  }

  const value = {
    commitments,
    isLoading,
    error,
    loadCommitments,
    getCommitment,
    saveCommitment,
    createCommitment,
    updateCommitment,
    deleteCommitment,
    archiveCommitment,
    getActiveCommitments,
    getArchivedCommitments,
  }

  return (
    <CommitmentContext.Provider value={value}>
      {children}
    </CommitmentContext.Provider>
  )
}

export function useCommitments() {
  const context = useContext(CommitmentContext)
  if (context === undefined) {
    throw new Error('useCommitments must be used within a CommitmentProvider')
  }
  return context
}
