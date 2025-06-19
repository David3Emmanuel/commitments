import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import TextInput from './TextInput'
import Select from './Select'

// Modal prop types
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

// Common props for all modal input types
interface BaseModalInputProps {
  title: string
  onCancel: () => void
}

// Text input modal props
interface TextModalInputProps extends BaseModalInputProps {
  type: 'text'
  placeholder?: string
  initialValue?: string
  onSubmit: (value: string) => void
}

// Date input modal props
interface DateModalInputProps extends BaseModalInputProps {
  type: 'date'
  initialValue?: string
  onSubmit: (value: string) => void
}

// Dropdown modal props
interface DropdownModalInputProps extends BaseModalInputProps {
  type: 'dropdown'
  options: { value: string; label: string }[]
  initialValue?: string
  onSubmit: (value: string) => void
}

// Confirm modal props
interface ConfirmModalInputProps extends BaseModalInputProps {
  type: 'confirm'
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onSubmit: (confirmed: boolean) => void
}

// Union type of all modal input props
type ModalInputProps =
  | TextModalInputProps
  | DateModalInputProps
  | DropdownModalInputProps
  | ConfirmModalInputProps

// Context for showing modals
interface ModalContextType {
  showTextModal: (
    title: string,
    placeholder?: string,
    initialValue?: string,
  ) => Promise<string | null>
  showDateModal: (
    title: string,
    initialValue?: string,
  ) => Promise<string | null>
  showDropdownModal: (
    title: string,
    options: { value: string; label: string }[],
    initialValue?: string,
  ) => Promise<string | null>
  showConfirmModal: (
    title: string,
    message: string,
    confirmLabel?: string,
    cancelLabel?: string,
  ) => Promise<boolean>
  // For backwards compatibility
  showModal: (
    title: string,
    placeholder?: string,
    initialValue?: string,
  ) => Promise<string | null>
}

const ModalContext = createContext<ModalContextType>({
  showTextModal: () => Promise.resolve(null),
  showDateModal: () => Promise.resolve(null),
  showDropdownModal: () => Promise.resolve(null),
  showConfirmModal: () => Promise.resolve(false),
  showModal: () => Promise.resolve(null),
})

export const useModal = () => useContext(ModalContext)

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalProps, setModalProps] = useState<ModalInputProps | null>(null)

  const showTextModal = (
    title: string,
    placeholder?: string,
    initialValue?: string,
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setModalProps({
        type: 'text',
        title,
        placeholder,
        initialValue,
        onSubmit: (value) => {
          setModalProps(null)
          resolve(value)
        },
        onCancel: () => {
          setModalProps(null)
          resolve(null)
        },
      })
    })
  }

  const showDateModal = (
    title: string,
    initialValue?: string,
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setModalProps({
        type: 'date',
        title,
        initialValue,
        onSubmit: (value) => {
          setModalProps(null)
          resolve(value)
        },
        onCancel: () => {
          setModalProps(null)
          resolve(null)
        },
      })
    })
  }

  const showDropdownModal = (
    title: string,
    options: { value: string; label: string }[],
    initialValue?: string,
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setModalProps({
        type: 'dropdown',
        title,
        options,
        initialValue,
        onSubmit: (value) => {
          setModalProps(null)
          resolve(value)
        },
        onCancel: () => {
          setModalProps(null)
          resolve(null)
        },
      })
    })
  }

  const showConfirmModal = (
    title: string,
    message: string,
    confirmLabel: string = 'Yes',
    cancelLabel: string = 'No',
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalProps({
        type: 'confirm',
        title,
        message,
        confirmLabel,
        cancelLabel,
        onSubmit: (confirmed) => {
          setModalProps(null)
          resolve(confirmed)
        },
        onCancel: () => {
          setModalProps(null)
          resolve(false)
        },
      })
    })
  }

  // For backwards compatibility with existing code
  const showModal = (
    title: string,
    placeholder?: string,
    initialValue?: string,
  ): Promise<string | null> => {
    return showTextModal(title, placeholder, initialValue)
  }
  return (
    <ModalContext.Provider
      value={{
        showTextModal,
        showDateModal,
        showDropdownModal,
        showConfirmModal,
        showModal,
      }}
    >
      {children}
      {modalProps &&
        typeof document !== 'undefined' &&
        createPortal(<ModalInput {...modalProps} />, document.body)}
    </ModalContext.Provider>
  )
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      // Focus trap
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
          return
        }

        if (e.key !== 'Tab' || !modalRef.current) return

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }

      // Focus first focusable element in modal
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) as HTMLElement
          if (focusable) focusable.focus()
        }
      }, 10)

      document.addEventListener('keydown', handleTabKey)
      return () => {
        document.removeEventListener('keydown', handleTabKey)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    // Animation wrapper
    <div className='fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'>
      {/* Backdrop with improved opacity */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal container with animation and improved styling */}
      <div
        ref={modalRef}
        className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-10 w-full max-w-md mx-4
                  overflow-hidden transform transition-all duration-300 ease-in-out
                  dark:text-gray-100 animate-modalFadeIn'
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
            <h3
              className='text-xl font-semibold text-gray-800 dark:text-gray-100'
              id='modal-title'
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1'
              aria-label='Close modal'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        )}
        <div className='p-6 text-gray-700 dark:text-gray-300'>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

const TextModalInput: React.FC<TextModalInputProps> = ({
  title,
  placeholder,
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
    <Modal isOpen={true} onClose={onCancel} title={title}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <TextInput
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className='w-full'
          autoFocus
          aria-label={placeholder || 'Input value'}
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

const DateModalInput: React.FC<DateModalInputProps> = ({
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
    <Modal isOpen={true} onClose={onCancel} title={title}>
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

const DropdownModalInput: React.FC<DropdownModalInputProps> = ({
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
    <Modal isOpen={true} onClose={onCancel} title={title}>
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

const ConfirmModalInput: React.FC<ConfirmModalInputProps> = ({
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
    <Modal isOpen={true} onClose={onCancel} title={title}>
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

// Unified modal input component that renders the appropriate modal type
const ModalInput: React.FC<ModalInputProps> = (props) => {
  switch (props.type) {
    case 'text':
      return <TextModalInput {...props} />
    case 'date':
      return <DateModalInput {...props} />
    case 'dropdown':
      return <DropdownModalInput {...props} />
    case 'confirm':
      return <ConfirmModalInput {...props} />
  }
}

export default Modal
