import type { Route } from './+types/settings'
import { Link } from 'react-router'
import { useSettings } from '~/lib/contexts/SettingsContext'
import { BackButton, Button, Card } from '~/components/ui'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Settings | Commitment Manager' },
    { name: 'description', content: 'Manage your settings and preferences' },
  ]
}

export default function Settings() {
  const { settings, updateSettings, resetSettings, isLoading } = useSettings()

  const handleDayStartChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const hour = parseInt(event.target.value, 10)
    updateSettings({ dayStartHour: hour })
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <p>Loading settings...</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Link to='/'>
          <BackButton>Back to Dashboard</BackButton>
        </Link>
      </div>

      <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
        Settings
      </h1>

      <Card className='mb-6 p-4'>
        <h2 className='text-xl font-semibold mb-4'>Day Start Time</h2>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>
          Choose what time of day you consider as the start of a new day. This
          affects how your habits and tasks are tracked.
        </p>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
          <label htmlFor='dayStartHour' className='font-medium'>
            Day starts at:
          </label>
          <select
            id='dayStartHour'
            value={settings.dayStartHour}
            onChange={handleDayStartChange}
            className='p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700'
          >
            {Array.from({ length: 24 }).map((_, i) => {
              // Format hour in 12-hour format
              const hour12 = i === 0 ? 12 : i > 12 ? i - 12 : i
              const amPm = i < 12 ? 'AM' : 'PM'
              return (
                <option key={i} value={i}>
                  {hour12}:00 {amPm}
                </option>
              )
            })}
          </select>
        </div>
      </Card>

      <div className='flex justify-end gap-4'>
        <Button variant='secondary' onClick={resetSettings}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
