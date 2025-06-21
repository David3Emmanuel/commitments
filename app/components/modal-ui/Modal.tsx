import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Modal prop types
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
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
