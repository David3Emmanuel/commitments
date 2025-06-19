import { Button } from '~/components/ui'

interface ReviewCompleteProps {
  onReturn: () => void
}

const ReviewComplete: React.FC<ReviewCompleteProps> = ({ onReturn }) => {
  return (
    <div className='text-center py-6'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-16 w-16 text-green-500 mx-auto mb-4'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
          clipRule='evenodd'
        />
      </svg>
      <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
        Review Complete!
      </h2>
      <p className='text-gray-600 dark:text-gray-300 mb-6'>
        Your progress has been saved successfully.
      </p>
      <Button variant='primary' onClick={onReturn}>
        Return to Commitment
      </Button>
    </div>
  )
}

export default ReviewComplete
