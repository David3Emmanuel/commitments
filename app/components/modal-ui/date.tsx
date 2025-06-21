import { useEffect, useRef, useState } from 'react'
import type BaseModalInputProps from './base-props'
import { Modal } from './Modal'
import TextInput from '../ui/TextInput'
import Button from '../ui/Button'

// Date input modal props
export interface DateModalInputProps extends BaseModalInputProps {
  type: 'date'
  initialValue?: string
  onSubmit: (value: string) => void
}

export const DateModalInput: React.FC<DateModalInputProps> = ({
  title,
  initialValue = '',
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
  }

  // Focus the input when the modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <Modal isOpen onClose={onCancel} title={title}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <TextInput
          ref={inputRef}
          type='date'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='w-full'
          autoFocus
          aria-label='Date input'
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
