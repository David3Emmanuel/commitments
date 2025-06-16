import React from 'react'
import type { Note } from '~/lib/types'
import { Button } from '~/components/ui'
import { useModal } from '~/components/ui/Modal'

interface NoteListProps {
  notes: Note[]
  onEditNote?: (noteId: string) => void
  onDeleteNote?: (noteId: string) => void
}

export default function NoteList({
  notes,
  onEditNote,
  onDeleteNote,
}: NoteListProps) {
  const modal = useModal()

  if (notes.length === 0) {
    return (
      <p className='text-gray-500 dark:text-gray-400 text-center py-6'>
        No notes added yet. Add notes during reviews to track your progress over
        time.
      </p>
    )
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
      {sortedNotes.map((note) => (
        <li key={note.id} className='py-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                  clipRule='evenodd'
                />
              </svg>
              {new Date(note.timestamp).toLocaleString()}
            </div>

            <div className='flex items-center gap-2'>
              {onEditNote && (
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    onEditNote(note.id)
                  }}
                  title='Edit note'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                    </svg>
                  }
                />
              )}

              {onDeleteNote && (
                <Button
                  variant='danger'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    modal
                      .showConfirmModal(
                        'Delete Note',
                        'Are you sure you want to delete this note?',
                        'Delete',
                        'Cancel',
                      )
                      .then((confirmed) => {
                        if (confirmed) {
                          onDeleteNote(note.id)
                        }
                      })
                  }}
                  title='Delete note'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  }
                />
              )}
            </div>
          </div>

          <p className='text-gray-800 dark:text-gray-200 whitespace-pre-line'>
            {note.content}
          </p>
        </li>
      ))}
    </ul>
  )
}
