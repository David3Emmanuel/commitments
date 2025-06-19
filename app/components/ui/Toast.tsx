import { useState, useEffect, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
})

export const useToast = () => useContext(ToastContext)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<
    Array<{ id: string; props: ToastProps }>
  >([])

  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration = 3000,
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, props: { message, type, duration } }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
            {toasts.map(({ id, props }) => (
              <Toast key={id} {...props} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type]

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded shadow-md flex justify-between items-center transition-all`}
    >
      <span>{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className='ml-4 text-white hover:text-gray-200'
      >
        &times;
      </button>
    </div>
  )
}

export default Toast
