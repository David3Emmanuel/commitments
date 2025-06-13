import React from 'react'
import type { Task } from '~/lib/types'
import { Checkbox } from '~/components/ui'

interface TaskListProps {
  tasks: Task[]
  onTaskToggle: (taskId: string) => void
}

export default function TaskList({ tasks, onTaskToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className='text-gray-500 dark:text-gray-400 text-center py-6'>
        No tasks added yet. Add a task to break down your commitment into
        manageable steps.
      </p>
    )
  }

  return (
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
      {tasks.map((task) => (
        <li key={task.id} className='py-3 flex items-center justify-between'>
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
          </div>{' '}
          {task.dueAt && (
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Due: {new Date(task.dueAt).toLocaleDateString()}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
