import { useState } from 'react'
import type { Commitment, Event } from '~/lib/types'
import { EventList } from '../EventList'
import { EventForm } from '../EventForm'
import { useCommitments } from '~/lib/contexts/CommitmentContext'

interface CommitmentEventsProps {
  commitment: Commitment
}

export function CommitmentEvents({ commitment }: CommitmentEventsProps) {
  const { updateCommitment } = useCommitments()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined,
  )

  const handleAddEvent = () => {
    setSelectedEvent(undefined)
    setIsFormOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsFormOpen(true)
  }

  const handleSaveEvent = (event: Event) => {
    const isEditing = commitment.events?.some((e) => e.id === event.id)
    let updatedEvents: Event[]

    if (isEditing) {
      updatedEvents = (commitment.events || []).map((e) =>
        e.id === event.id ? event : e,
      )
    } else {
      updatedEvents = [...(commitment.events || []), event]
    }

    const updatedCommitment = {
      ...commitment,
      events: updatedEvents,
    }

    updateCommitment(updatedCommitment)
  }

  const eventsExist = commitment.events && commitment.events.length > 0

  return (
    <div className='mt-6'>
      <h2 className='text-xl font-semibold mb-4'>Events</h2>

      {eventsExist ? (
        <EventList
          commitment={commitment}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
        />
      ) : (
        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center'>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            No events have been added to this commitment yet.
          </p>
          <button
            onClick={handleAddEvent}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Add Your First Event
          </button>
        </div>
      )}

      <EventForm
        event={selectedEvent}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  )
}
