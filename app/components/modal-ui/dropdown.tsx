import { useState } from 'react'
import Button from '../ui/Button'
import type BaseModalInputProps from './base-props'
import { Modal } from './Modal'
import Select from '../ui/Select'

// Dropdown modal props
export interface DropdownModalInputProps extends BaseModalInputProps {
  type: 'dropdown'
  options: { value: string; label: string }[]
  initialValue?: string
  onSubmit: (value: string) => void
}

export const DropdownModalInput: React.FC<DropdownModalInputProps> = ({
  title,
  options,
  initialValue = '',
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
  }

  return (
    <Modal isOpen onClose={onCancel} title={title}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='w-full'
          options={options}
          autoFocus
        />
        <div className='flex justify-end gap-3 mt-6'>
          <Button
            variant='secondary'
            type='button'
            onClick={onCancel}
            className='px-4 py-2'
          >
            Cancel
          </Button>
          <Button type='submit' className='px-4 py-2'>
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  )
}
