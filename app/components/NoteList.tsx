import React from 'react'
import type { Note } from '~/lib/types'

interface NoteListProps {
  notes: Note[]
}

export default function NoteList({ notes }: NoteListProps) {
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
          <div className='flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2'>
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
          <p className='text-gray-800 dark:text-gray-200 whitespace-pre-line'>
            {note.content}
          </p>
        </li>
      ))}
    </ul>
  )
}
