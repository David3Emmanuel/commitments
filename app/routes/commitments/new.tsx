import { useState } from 'react'
import { useNavigate } from 'react-router'

import {
  BackButton,
  Button,
  TextInput,
  TextArea,
  Radio,
  Select,
  Card,
  CardContent,
  useToast,
} from '~/components/ui'

export default function NewCommitment() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reviewType, setReviewType] = useState<'interval' | 'custom'>(
    'interval',
  )
  const [intervalDays, setIntervalDays] = useState<number>(7)
  const [customCron, setCustomCron] = useState<string>('')
  const { showToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a unique ID
    const id = `commitment-${Date.now()}`

    const newCommitment = {
      id,
      title,
      description,
      createdAt: new Date(),
      reviewFrequency: {
        type: reviewType,
        ...(reviewType === 'interval' ? { intervalDays } : { customCron }),
      },
      lastReviewedAt: null,
      subItems: {
        tasks: [],
        habits: [],
      },
      notes: [],
      status: 'active' as const,
    }

    // Save to localStorage (for MVP)
    try {
      const existingCommitments = localStorage.getItem('commitments')
      let commitments = existingCommitments
        ? JSON.parse(existingCommitments)
        : []

      // Add the new commitment
      commitments.push(newCommitment)

      // Save back to localStorage
      localStorage.setItem('commitments', JSON.stringify(commitments))

      // Navigate to the dashboard
      navigate('/')
    } catch (error) {
      console.error('Failed to save commitment:', error)
      // Show an error toast notification
      showToast('Failed to save commitment. Please try again.', 'error')
    }
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='mb-8'>
        <BackButton onClick={() => navigate('/')}>Back to Dashboard</BackButton>
      </div>

      <Card>
        <CardContent>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
            Create New Commitment
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <TextInput
              id='title'
              label='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='What is this commitment about?'
              required
            />

            <TextArea
              id='description'
              label='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder='Add more details about this commitment...'
            />

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                Review Frequency
              </label>

              <div className='space-y-4'>
                <Radio
                  id='intervalReview'
                  name='reviewType'
                  value='interval'
                  checked={reviewType === 'interval'}
                  onChange={() => setReviewType('interval')}
                  label='Regular interval'
                />

                {reviewType === 'interval' && (
                  <div className='ml-7'>
                    <Select
                      value={intervalDays}
                      onChange={(e) => setIntervalDays(Number(e.target.value))}
                    >
                      <option value={1}>Daily</option>
                      <option value={7}>Weekly</option>
                      <option value={14}>Every two weeks</option>
                      <option value={30}>Monthly</option>
                      <option value={90}>Quarterly</option>
                    </Select>
                  </div>
                )}

                <Radio
                  id='customReview'
                  name='reviewType'
                  value='custom'
                  checked={reviewType === 'custom'}
                  onChange={() => setReviewType('custom')}
                  label='Custom schedule (advanced)'
                />

                {reviewType === 'custom' && (
                  <div className='ml-7'>
                    <TextInput
                      value={customCron}
                      onChange={(e) => setCustomCron(e.target.value)}
                      placeholder="Cron expression (e.g., '0 0 * * 1' for every Monday)"
                      helper='For advanced users. Uses cron syntax to define custom schedules.'
                    />
                  </div>
                )}
              </div>
            </div>

            <div className='flex items-center justify-end space-x-3 pt-4'>
              <Button
                type='button'
                variant='secondary'
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button type='submit' variant='primary'>
                Create Commitment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
