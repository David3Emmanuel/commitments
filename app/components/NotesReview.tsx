import { TextArea } from '~/components/ui'

interface NotesReviewProps {
  noteContent: string
  setNoteContent: React.Dispatch<React.SetStateAction<string>>
}

const NotesReview: React.FC<NotesReviewProps> = ({
  noteContent,
  setNoteContent,
}) => {
  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
        Add Progress Notes
      </h2>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        Reflect on your progress. What's working well? What challenges are you
        facing?
      </p>

      <TextArea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        rows={6}
        placeholder='Write your thoughts, progress, or challenges here...'
      />
    </div>
  )
}

export default NotesReview
