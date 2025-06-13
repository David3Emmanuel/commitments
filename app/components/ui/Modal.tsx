import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import TextInput from './TextInput'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

interface ModalInputProps {
  title: string
  placeholder?: string
  initialValue?: string
  onSubmit: (value: string) => void
  onCancel: () => void
}

interface ModalContextType {
  showModal: (
    title: string,
    placeholder?: string,
    initialValue?: string,
  ) => Promise<string | null>
}

const ModalContext = React.createContext<ModalContextType>({
  showModal: () => Promise.resolve(null),
})

export const useModal = () => React.useContext(ModalContext)

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalProps, setModalProps] = useState<ModalInputProps | null>(null)

  const showModal = (
    title: string,
    placeholder?: string,
    initialValue?: string,
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setModalProps({
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

  return (
    <ModalContext.Provider value={{ showModal }}>
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

const ModalInput: React.FC<ModalInputProps> = ({
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

export default Modal
