import React from 'react'
import type { Task } from '~/lib/types'

interface TasksReviewProps {
  tasks: Task[]
  taskCompletionStatus: Record<string, boolean>
  handleTaskToggle: (taskId: string) => void
  handleEditTask?: (taskId: string) => void
  handleDeleteTask?: (taskId: string) => void
}

const TasksReview: React.FC<TasksReviewProps> = ({
  tasks,
  taskCompletionStatus,
  handleTaskToggle,
  handleEditTask,
  handleDeleteTask,
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
                </span>{' '}
              </div>

              <div className='flex items-center gap-2'>
                {task.dueAt && (
                  <div className='text-xs text-gray-500 dark:text-gray-400 mr-2'>
                    Due: {new Date(task.dueAt).toLocaleDateString()}
                  </div>
                )}

                {handleEditTask && (
                  <button
                    onClick={() => handleEditTask(task.id)}
                    className='p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    title='Edit task'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                    </svg>
                  </button>
                )}

                {handleDeleteTask && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this task?',
                        )
                      ) {
                        handleDeleteTask(task.id)
                      }
                    }}
                    className='p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                    title='Delete task'
                  >
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
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TasksReview
