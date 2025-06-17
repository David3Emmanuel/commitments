import React from 'react'
import type { Task } from '~/lib/types'
import { Checkbox, Button } from '~/components/ui'
import { useModal } from '~/components/ui/Modal'
import {
  compareTasksByUrgency,
  getTaskUrgency,
  getUrgencyClass,
} from '~/lib/sort'

interface TaskListProps {
  tasks: Task[]
  onTaskToggle: (taskId: string) => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
}

export default function TaskList({
  tasks,
  onTaskToggle,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  const modal = useModal()
  if (tasks.length === 0) {
    return (
      <p className='text-gray-500 dark:text-gray-400 text-center py-6'>
        No tasks added yet. Add a task to break down your commitment into
        manageable steps.
      </p>
    )
  }

  // Sort tasks by urgency using the utility function
  const sortedTasks = [...tasks].sort(compareTasksByUrgency)

  return (
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
      {sortedTasks.map((task) => {
        // Get urgency class from utility
        const urgencyClass = getUrgencyClass(getTaskUrgency(task))

        return (
          <li
            key={task.id}
            className={`py-3 flex items-center justify-between ${urgencyClass}`}
          >
            <div className='flex items-center'>
              <Checkbox
                checked={task.completed}
                onChange={() => onTaskToggle(task.id)}
                labelClassName={`${
                  task.completed
                    ? 'text-gray-400 dark:text-gray-500 line-through'
                    : 'text-gray-800 dark:text-gray-200'
                }`}
                label={task.title}
              />
            </div>

            <div className='flex items-center gap-2'>
              {task.dueAt && (
                <div className='text-xs text-gray-500 dark:text-gray-400 mr-2'>
                  Due: {new Date(task.dueAt).toLocaleDateString()}
                </div>
              )}

              {onEditTask && (
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    onEditTask(task.id)
                  }}
                  title='Edit task'
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

              {onDeleteTask && (
                <Button
                  variant='danger'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    modal
                      .showConfirmModal(
                        'Delete Task',
                        'Are you sure you want to delete this task?',
                        'Delete',
                        'Cancel',
                      )
                      .then((confirmed) => {
                        if (confirmed) {
                          onDeleteTask(task.id)
                        }
                      })
                  }}
                  title='Delete task'
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
          </li>
        )
      })}
    </ul>
  )
}
