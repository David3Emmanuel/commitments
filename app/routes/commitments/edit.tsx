import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Commitment } from '~/lib/types'
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

export default function EditCommitment() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reviewType, setReviewType] = useState<'interval' | 'custom'>(
    'interval',
  )
  const [intervalDays, setIntervalDays] = useState<number>(7)
  const [customCron, setCustomCron] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [originalCommitment, setOriginalCommitment] =
    useState<Commitment | null>(null)

  useEffect(() => {
    if (!id) return

    // Load commitment from localStorage
    const loadCommitment = () => {
      setIsLoading(true)
      setError(null)

      try {
        const storedCommitments = localStorage.getItem('commitments')
        if (storedCommitments) {
          const commitments = JSON.parse(storedCommitments, (key, value) => {
            if (
              key === 'createdAt' ||
              key === 'lastReviewedAt' ||
              key === 'dueAt' ||
              key === 'timestamp'
            ) {
              return value ? new Date(value) : null
            }
            if (key === 'history' && Array.isArray(value)) {
              return value.map((date) => new Date(date))
            }
            return value
          })

          const foundCommitment = commitments.find(
            (c: Commitment) => c.id === id,
          )
          if (foundCommitment) {
            setOriginalCommitment(foundCommitment)
            setTitle(foundCommitment.title)
            setDescription(foundCommitment.description || '')
            setReviewType(foundCommitment.reviewFrequency.type)

            if (
              foundCommitment.reviewFrequency.type === 'interval' &&
              foundCommitment.reviewFrequency.intervalDays
            ) {
              setIntervalDays(foundCommitment.reviewFrequency.intervalDays)
            } else if (
              foundCommitment.reviewFrequency.type === 'custom' &&
              foundCommitment.reviewFrequency.customCron
            ) {
              setCustomCron(foundCommitment.reviewFrequency.customCron)
            }
          } else {
            setError('Commitment not found')
          }
        } else {
          setError('No commitments found')
        }
      } catch (error) {
        console.error('Failed to load commitment:', error)
        setError('Failed to load commitment data')
      } finally {
        setIsLoading(false)
      }
    }

    loadCommitment()
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!originalCommitment) {
      console.error('No original commitment to update')
      return
    }

    const updatedCommitment = {
      ...originalCommitment,
      title,
      description,
      reviewFrequency: {
        type: reviewType,
        ...(reviewType === 'interval' ? { intervalDays } : { customCron }),
      },
    }

    // Save to localStorage
    try {
      const existingCommitments = localStorage.getItem('commitments')
      if (!existingCommitments) {
        throw new Error('No commitments found')
      }

      let commitments = JSON.parse(existingCommitments)
      commitments = commitments.map((c: Commitment) =>
        c.id === id ? updatedCommitment : c,
      )
      localStorage.setItem('commitments', JSON.stringify(commitments))

      // Navigate back to the commitment detail page
      navigate(`/commitments/${id}`)
    } catch (error) {
      console.error('Failed to save updated commitment:', error)
      showToast('Failed to save commitment. Please try again.', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500'>Loading commitment details...</p>
        </div>
      </div>
    )
  }
  if (error || !originalCommitment) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 dark:bg-red-900 p-6 rounded-lg'>
          <h2 className='text-xl font-medium text-red-800 dark:text-red-200 mb-2'>
            Error
          </h2>
          <p className='text-red-600 dark:text-red-300'>
            {error || 'Commitment not found'}
          </p>
          <Button
            variant='primary'
            onClick={() => navigate('/')}
            className='mt-4 bg-red-600 hover:bg-red-700'
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='mb-8'>
        <BackButton onClick={() => navigate(`/commitments/${id}`)}>
          Back to Commitment
        </BackButton>
      </div>

      <Card>
        <CardContent>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
            Edit Commitment
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
                onClick={() => navigate(`/commitments/${id}`)}
              >
                Cancel
              </Button>
              <Button type='submit' variant='primary'>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
