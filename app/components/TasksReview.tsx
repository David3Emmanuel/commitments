import React from 'react'
import type { Task } from '~/lib/types'

interface TasksReviewProps {
  tasks: Task[]
  taskCompletionStatus: Record<string, boolean>
  handleTaskToggle: (taskId: string) => void
}

const TasksReview: React.FC<TasksReviewProps> = ({
  tasks,
  taskCompletionStatus,
  handleTaskToggle,
}) => {
  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
        Update Tasks
      </h2>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        Check off any tasks you've completed since your last review.
      </p>

      {tasks.length === 0 ? (
        <div className='text-center py-6'>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>
            No tasks added to this commitment yet.
          </p>
        </div>
      ) : (
        <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
          {tasks.map((task) => (
            <li
              key={task.id}
              className='py-3 flex items-center justify-between'
            >
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={taskCompletionStatus[task.id] || false}
                  onChange={() => handleTaskToggle(task.id)}
                  className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <span
                  className={`ml-3 text-sm ${
                    taskCompletionStatus[task.id]
                      ? 'text-gray-400 dark:text-gray-500 line-through'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {task.title}
                </span>
              </div>{' '}
              {task.dueAt && (
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  Due: {new Date(task.dueAt).toLocaleDateString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TasksReview
