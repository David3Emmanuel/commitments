import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react'
import type { Settings } from '~/lib/types'

interface SettingsContextType {
  settings: Settings
  isLoading: boolean
  error: string | null
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
}

// Default settings
const defaultSettings: Settings = {
  dayStartHour: 0, // Default to midnight (12am)
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    setIsLoading(true)
    setError(null)

    try {
      const storedSettings = localStorage.getItem('settings')
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings)
        setSettings({
          ...defaultSettings, // Ensure all fields have at least default values
          ...parsedSettings,
        })
      } else {
        // No settings found, use defaults
        setSettings(defaultSettings)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError('Failed to load settings')
      setSettings(defaultSettings)
    } finally {
      setIsLoading(false)
    }
  }

  const saveToLocalStorage = (updatedSettings: Settings) => {
    try {
      localStorage.setItem('settings', JSON.stringify(updatedSettings))
    } catch (err) {
      console.error('Failed to save settings:', err)
      setError('Failed to save settings')
    }
  }

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      saveToLocalStorage(updated)
      return updated
    })
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    saveToLocalStorage(defaultSettings)
  }

  const value = {
    settings,
    isLoading,
    error,
    updateSettings,
    resetSettings,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
