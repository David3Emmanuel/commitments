import { useState, useEffect } from 'react'
import { useCommitments } from '~/lib/contexts/CommitmentContext'
import type { HabitTarget } from '~/lib/types'
import { useModal } from '~/components/ui'
import type { Commitment, Task, Habit, Note } from '~/lib/types'

export function useCommitmentDetail(id: string | undefined) {
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { showTextModal, showDateModal, showDropdownModal } = useModal()
  const {
    getCommitment,
    updateCommitment,
    isLoading,
    error: contextError,
  } = useCommitments()

  useEffect(() => {
    if (!id) return
    if (isLoading) {
      setCommitment(null)
      setError(null)
      return
    }

    const foundCommitment = getCommitment(id)
    if (foundCommitment) {
      setCommitment(foundCommitment)
    } else {
      setError('Commitment not found')
    }
  }, [id, getCommitment, isLoading])

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString()
  }

  const handleTaskToggle = (taskId: string) => {
    if (!commitment) return

    const updatedTasks = commitment.subItems.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    )

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        tasks: updatedTasks,
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleEditTask = async (taskId: string) => {
    if (!commitment) return

    const task = commitment.subItems.tasks.find((t) => t.id === taskId)
    if (!task) return

    const editedTaskTitle = await showTextModal(
      'Edit task title:',
      'Task title',
      task.title,
    )
    if (!editedTaskTitle) return

    // Use date modal with current date as default, or keep existing date
    const currentDueDate = task.dueAt
      ? new Date(task.dueAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    const dueDateStr = await showDateModal(
      'Select due date (optional - click Cancel for no due date):',
      currentDueDate,
    )

    const updatedTasks = commitment.subItems.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            title: editedTaskTitle,
            dueAt: dueDateStr ? new Date(dueDateStr) : null,
          }
        : t,
    )

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        tasks: updatedTasks,
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleDeleteTask = (taskId: string) => {
    if (!commitment) return

    const updatedTasks = commitment.subItems.tasks.filter(
      (task) => task.id !== taskId,
    )

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        tasks: updatedTasks,
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleAddTask = async () => {
    if (!commitment) return

    const newTaskTitle = await showTextModal('Enter task title:', 'Task title')
    if (!newTaskTitle) return

    // Use date modal with today's date as default, but allow cancellation
    const today = new Date().toISOString().split('T')[0]
    const dueDateStr = await showDateModal(
      'Select due date (optional - click Cancel for no due date):',
      today,
    )

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      dueAt: dueDateStr ? new Date(dueDateStr) : null,
      completed: false,
    }

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        tasks: [...commitment.subItems.tasks, newTask],
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleAddHabit = async () => {
    if (!commitment) return

    const newHabitTitle = await showTextModal(
      'Enter habit title:',
      'Habit title',
    )
    if (!newHabitTitle) return

    const scheduleOptions = [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ]

    const schedule = await showDropdownModal(
      'Select habit frequency',
      scheduleOptions,
      'weekly',
    )

    if (!schedule) return

    // Get start date with today's date as default
    const today = new Date().toISOString().split('T')[0]
    const startDateStr = await showDateModal(
      'When do you want to start this habit?',
      today,
    )

    if (!startDateStr) return

    // Get optional end date
    const endDateStr = await showDateModal(
      'When do you want to end this habit? (Optional - click Cancel for no end date)',
      '',
    )

    // Get target type
    const targetTypeOptions = [
      { value: 'none', label: 'None (simple completion)' },
      { value: 'number', label: 'Number (e.g., minutes, repetitions)' },
      { value: 'checklist', label: 'Checklist (multiple items)' },
    ]

    const targetType = await showDropdownModal(
      'What type of target do you want to set?',
      targetTypeOptions,
      'none',
    )

    if (!targetType) return

    // Initialize target based on selected type
    let target: HabitTarget = null

    if (targetType === 'number') {
      const numberTarget = await showTextModal(
        'Enter your target number:',
        'Target (number)',
        '1',
      )
      if (numberTarget) {
        target = Number(numberTarget)
      }
    } else if (targetType === 'checklist') {
      let items: string[] = []
      let addingItems = true

      while (addingItems) {
        const item = await showTextModal(
          'Add checklist item (Cancel to finish):',
          'Checklist item',
        )

        if (item) {
          items.push(item)
        } else {
          addingItems = false
        }
      }

      if (items.length > 0) {
        target = items
      }
    }

    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: newHabitTitle,
      schedule: schedule as 'daily' | 'weekly' | 'monthly',
      target: target,
      history: {}, // Empty history record
      startOn: new Date(startDateStr),
      endOn: endDateStr ? new Date(endDateStr) : null,
    }

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        habits: [...commitment.subItems.habits, newHabit],
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleEditHabit = async (habitId: string) => {
    if (!commitment) return

    const habit = commitment.subItems.habits.find((h) => h.id === habitId)
    if (!habit) return

    const editedHabitTitle = await showTextModal(
      'Edit habit title:',
      'Habit title',
      habit.title,
    )
    if (!editedHabitTitle) return

    const scheduleOptions = [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ]

    const schedule = await showDropdownModal(
      'Select habit frequency',
      scheduleOptions,
      habit.schedule,
    )

    if (!schedule) return

    // Edit start date
    const currentStartDate = habit.startOn
      ? new Date(habit.startOn).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    const startDateStr = await showDateModal(
      'When do you want to start this habit?',
      currentStartDate,
    )

    if (!startDateStr) return

    // Edit optional end date
    const currentEndDate = habit.endOn
      ? new Date(habit.endOn).toISOString().split('T')[0]
      : ''

    const endDateStr = await showDateModal(
      'When do you want to end this habit? (Optional - click Cancel for no end date)',
      currentEndDate,
    )

    // Handle editing target value while maintaining target type
    let updatedTarget = habit.target

    // Determine the target type based on existing target
    if (typeof habit.target === 'number') {
      const numberTarget = await showTextModal(
        'Edit your target number:',
        'Target (number)',
        habit.target.toString(),
      )
      if (numberTarget) {
        updatedTarget = Number(numberTarget)
      }
    } else if (Array.isArray(habit.target)) {
      // Edit checklist items
      let items = [...habit.target]

      // Show current items and option to add/remove
      const editOption = await showDropdownModal(
        'Edit checklist:',
        [
          { value: 'keep', label: 'Keep current items' },
          { value: 'edit', label: 'Edit items' },
        ],
        'keep',
      )

      if (editOption === 'edit') {
        // First show current items
        let message = 'Current items:\n'
        items.forEach((item, index) => {
          message += `${index + 1}. ${item}\n`
        })
        await showTextModal(message, 'Current checklist', '')

        // Then handle editing
        let editingItems = true
        while (editingItems) {
          const action = await showDropdownModal(
            'Checklist actions:',
            [
              { value: 'add', label: 'Add new item' },
              { value: 'remove', label: 'Remove an item' },
              { value: 'done', label: 'Finish editing' },
            ],
            'add',
          )

          if (action === 'add') {
            const newItem = await showTextModal(
              'Add checklist item:',
              'New item',
            )
            if (newItem) {
              items.push(newItem)
            }
          } else if (action === 'remove' && items.length > 0) {
            const options = items.map((item, index) => ({
              value: index.toString(),
              label: item,
            }))

            const indexToRemove = await showDropdownModal(
              'Select item to remove:',
              options,
              '0',
            )

            if (indexToRemove !== null) {
              items.splice(Number(indexToRemove), 1)
            }
          } else if (action === 'done' || action === null) {
            editingItems = false
          }
        }

        updatedTarget = items
      }
    }

    const updatedHabits = commitment.subItems.habits.map((h) =>
      h.id === habitId
        ? {
            ...h,
            title: editedHabitTitle,
            schedule: schedule as 'daily' | 'weekly' | 'monthly',
            startOn: new Date(startDateStr),
            endOn: endDateStr ? new Date(endDateStr) : null,
            target: updatedTarget,
          }
        : h,
    )

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        habits: updatedHabits,
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleDeleteHabit = (habitId: string) => {
    if (!commitment) return

    const updatedHabits = commitment.subItems.habits.filter(
      (habit) => habit.id !== habitId,
    )

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        habits: updatedHabits,
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleHabitToggle = (
    habitId: string,
    date: Date,
    value?: HabitTarget,
  ) => {
    if (!commitment) return

    const habit = commitment.subItems.habits.find((h) => h.id === habitId)
    if (!habit) return

    // Create a copy of the history record
    const updatedHistory = { ...habit.history }

    // Format the date to use as key (YYYY-MM-DD format)
    const dateStr = date.toISOString().split('T')[0]

    // Check if this date is already in the history
    if (updatedHistory[dateStr]) {
      // If it exists, remove it
      delete updatedHistory[dateStr]
    } else {
      // Determine the appropriate value based on habit target type
      let habitValue: HabitTarget = null

      if (value !== undefined) {
        // If a value was explicitly provided, use it
        habitValue = value
      } else {
        // Otherwise use the habit's target value based on its type
        if (typeof habit.target === 'number') {
          habitValue = habit.target
        } else if (Array.isArray(habit.target)) {
          habitValue = [...habit.target] // Use a copy of the checklist
        } else {
          habitValue = null // Default is null for simple completion
        }
      }

      // Add the entry as completed
      updatedHistory[dateStr] = {
        date: date,
        value: habitValue,
        completed: true,
      }
    }

    const updatedHabits = commitment.subItems.habits.map((h) =>
      h.id === habitId
        ? {
            ...h,
            history: updatedHistory,
          }
        : h,
    )

    const updatedCommitment = {
      ...commitment,
      subItems: {
        ...commitment.subItems,
        habits: updatedHabits,
      },
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleAddNote = async () => {
    if (!commitment) return

    const noteContent = await showTextModal(
      'Enter note content:',
      'Note content',
    )
    if (!noteContent) return

    const newNote = {
      id: `note-${Date.now()}`,
      content: noteContent,
      timestamp: new Date(),
    }

    const updatedCommitment = {
      ...commitment,
      notes: [...commitment.notes, newNote],
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleEditNote = async (noteId: string) => {
    if (!commitment) return

    const note = commitment.notes.find((n) => n.id === noteId)
    if (!note) return

    const editedNoteContent = await showTextModal(
      'Edit note content:',
      'Note content',
      note.content,
    )
    if (!editedNoteContent) return

    const updatedNotes = commitment.notes.map((n) =>
      n.id === noteId
        ? {
            ...n,
            content: editedNoteContent,
            // Note: we're not updating timestamp on edit, keeping original timestamp
          }
        : n,
    )

    const updatedCommitment = {
      ...commitment,
      notes: updatedNotes,
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleDeleteNote = (noteId: string) => {
    if (!commitment) return

    const updatedNotes = commitment.notes.filter((note) => note.id !== noteId)

    const updatedCommitment = {
      ...commitment,
      notes: updatedNotes,
    }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  const handleArchiveToggle = () => {
    if (!commitment) return

    const newStatus = commitment.status === 'active' ? 'archived' : 'active'
    const updatedCommitment: Commitment = { ...commitment, status: newStatus }

    updateCommitment(updatedCommitment)
    setCommitment(updatedCommitment)
  }

  return {
    commitment,
    isLoading,
    error,
    contextError,
    formatDate,
    handleTaskToggle,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleAddHabit,
    handleEditHabit,
    handleDeleteHabit,
    handleHabitToggle,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleArchiveToggle,
  }
}
