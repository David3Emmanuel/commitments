import type { Task } from '~/lib/types'
import TaskList from '~/components/TaskList'
import Button from '~/components/ui/Button'

interface CommitmentTasksProps {
  tasks: Task[]
  onTaskToggle: (taskId: string) => void
  onAddTask: () => void
  onEditTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function CommitmentTasks({
  tasks,
  onTaskToggle,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: CommitmentTasksProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Tasks
        </h2>
        <Button
          variant='primary'
          size='sm'
          onClick={onAddTask}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
          }
        >
          Add Task
        </Button>{' '}
      </div>

      <TaskList
        tasks={tasks}
        onTaskToggle={onTaskToggle}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  )
}
