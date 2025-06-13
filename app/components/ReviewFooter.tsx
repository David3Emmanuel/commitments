import React from 'react'
import { Button } from '~/components/ui'

interface ReviewFooterProps {
  currentStep: 'tasks' | 'habits' | 'notes' | 'complete'
  onCancel: () => void
  onNext: () => void
}

const ReviewFooter: React.FC<ReviewFooterProps> = ({
  currentStep,
  onCancel,
  onNext,
}) => {
  return (
    <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between'>
      <Button variant='secondary' onClick={onCancel}>
        Cancel
      </Button>

      <Button variant='primary' onClick={onNext}>
        {currentStep === 'notes' ? 'Complete Review' : 'Next Step'}
      </Button>
    </div>
  )
}

export default ReviewFooter
