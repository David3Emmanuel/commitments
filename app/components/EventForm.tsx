import React, { useState, useEffect } from 'react'
import type { Event } from '~/lib/types'
import { Button, Modal, TextInput, TextArea, Select } from './ui'

interface EventFormProps {
  event?: Event
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
}

export function EventForm({ event, isOpen, onClose, onSave }: EventFormProps) {
  const isEditing = Boolean(event?.id)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isAllDay, setIsAllDay] = useState(false)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [hasReminder, setHasReminder] = useState(false)
  const [reminderDays, setReminderDays] = useState('1')

  // Initialize form when event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDate(formatDateForInput(new Date(event.date)))
      setTime(event.time || '')
      setIsAllDay(event.isAllDay)
      setLocation(event.location || '')
      setDescription(event.description || '')
      setHasReminder(Boolean(event.reminderTime))

      if (event.reminderTime) {
        const daysDiff = Math.round(
          (new Date(event.date).getTime() -
            new Date(event.reminderTime).getTime()) /
            (24 * 60 * 60 * 1000),
        ).toString()
        setReminderDays(daysDiff)
      }
    } else {
      // Default values for new event
      const now = new Date()
      setTitle('')
      setDate(formatDateForInput(now))
      setTime(formatTimeForInput(now))
      setIsAllDay(false)
      setLocation('')
      setDescription('')
      setHasReminder(false)
      setReminderDays('1')
    }
  }, [event])

  // Helper to format date for input
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Helper to format time for input
  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const eventDate = new Date(date)
    let reminderTime: Date | undefined

    if (hasReminder) {
      reminderTime = new Date(date)
      reminderTime.setDate(reminderTime.getDate() - parseInt(reminderDays, 10))
    }

    const newEvent: Event = {
      id: event?.id || crypto.randomUUID(),
      title,
      date: eventDate,
      time: isAllDay ? '' : time,
      isAllDay,
      ...(location ? { location } : {}),
      ...(description ? { description } : {}),
      ...(reminderTime ? { reminderTime } : {}),
    }

    onSave(newEvent)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Event' : 'Add New Event'}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Event Title
          </label>
          <TextInput
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder='Enter event title'
            className='mt-1 w-full'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Date
            </label>
            <TextInput
              type='date'
              id='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className='mt-1 w-full'
            />
          </div>

          <div>
            <div className='flex justify-between'>
              <label
                htmlFor='time'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Time
              </label>
              <label className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                <input
                  type='checkbox'
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className='mr-2'
                />
                All day
              </label>
            </div>
            <TextInput
              type='time'
              id='time'
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isAllDay}
              required={!isAllDay}
              className='mt-1 w-full'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='location'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Location (optional)
          </label>
          <TextInput
            id='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Enter location'
            className='mt-1 w-full'
          />
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Description (optional)
          </label>
          <TextArea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Add description'
            rows={3}
            className='mt-1 w-full'
          />
        </div>

        <div className='flex items-center'>
          <input
            type='checkbox'
            id='hasReminder'
            checked={hasReminder}
            onChange={(e) => setHasReminder(e.target.checked)}
            className='mr-2'
          />
          <label
            htmlFor='hasReminder'
            className='text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Set reminder
          </label>
        </div>

        {hasReminder && (
          <div className='flex items-center space-x-2'>
            <Select
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              className='w-24'
            >
              <option value='0'>0 days</option>
              <option value='1'>1 day</option>
              <option value='2'>2 days</option>
              <option value='3'>3 days</option>
              <option value='5'>5 days</option>
              <option value='7'>1 week</option>
              <option value='14'>2 weeks</option>
            </Select>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              before event
            </span>
          </div>
        )}

        <div className='flex justify-end space-x-3 pt-4'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' variant='primary'>
            {isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
