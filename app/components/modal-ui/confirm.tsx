import Button from '../ui/Button'
import type BaseModalInputProps from './base-props'
import { Modal } from './Modal'

// Confirm modal props
export interface ConfirmModalInputProps extends BaseModalInputProps {
  type: 'confirm'
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onSubmit: (confirmed: boolean) => void
}

export const ConfirmModalInput: React.FC<ConfirmModalInputProps> = ({
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onSubmit,
  onCancel,
}) => {
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    onSubmit(true)
  }

  return (
    <Modal isOpen onClose={onCancel} title={title}>
      <div className='space-y-4'>
        <p className='text-gray-700 dark:text-gray-300'>{message}</p>
        <div className='flex justify-end gap-3 mt-6'>
          <Button
            variant='secondary'
            type='button'
            onClick={onCancel}
            className='px-4 py-2'
          >
            {cancelLabel}
          </Button>
          <Button
            variant='primary'
            type='button'
            onClick={handleConfirm}
            className='px-4 py-2'
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
