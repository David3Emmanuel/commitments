type StepType = 'tasks' | 'habits' | 'notes' | 'complete'

interface ReviewProgressProps {
  currentStep: StepType
}

const ReviewProgress: React.FC<ReviewProgressProps> = ({ currentStep }) => {
  return (
    <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
      <div className='flex items-center justify-between mb-2 overflow-x-auto'>
        <div className='flex items-center'>
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep === 'tasks' ||
              currentStep === 'habits' ||
              currentStep === 'notes' ||
              currentStep === 'complete'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            1
          </span>
          <div className='ml-4'>
            <p
              className={`text-sm font-medium ${
                currentStep === 'tasks'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Tasks
            </p>
          </div>
        </div>

        <div className='flex-1 h-0.5 mx-4 bg-gray-200 dark:bg-gray-700'></div>

        <div className='flex items-center'>
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep === 'habits' ||
              currentStep === 'notes' ||
              currentStep === 'complete'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            2
          </span>
          <div className='ml-4'>
            <p
              className={`text-sm font-medium ${
                currentStep === 'habits'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Habits
            </p>
          </div>
        </div>

        <div className='flex-1 h-0.5 mx-4 bg-gray-200 dark:bg-gray-700'></div>

        <div className='flex items-center'>
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep === 'notes' || currentStep === 'complete'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            3
          </span>
          <div className='ml-4'>
            <p
              className={`text-sm font-medium ${
                currentStep === 'notes'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Notes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewProgress
