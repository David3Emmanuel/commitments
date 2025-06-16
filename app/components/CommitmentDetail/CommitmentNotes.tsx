import React from 'react'
import type { Note } from '~/lib/types'
import NoteList from '~/components/NoteList'
import { Button } from '~/components/ui'

interface CommitmentNotesProps {
  notes: Note[]
  onAddNote: () => void
  onEditNote?: (noteId: string) => void
  onDeleteNote?: (noteId: string) => void
}

export default function CommitmentNotes({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: CommitmentNotesProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Notes & Progress
        </h2>
        <Button
          variant='primary'
          size='sm'
          onClick={onAddNote}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
          }
        >
          Add Note
        </Button>
      </div>

      <NoteList
        notes={notes}
        onEditNote={onEditNote}
        onDeleteNote={onDeleteNote}
      />
    </div>
  )
}
