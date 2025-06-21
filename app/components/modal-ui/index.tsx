import { useState, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { TextModalInput, type TextModalInputProps } from './text'
import { DateModalInput, type DateModalInputProps } from './date'
import { DropdownModalInput, type DropdownModalInputProps } from './dropdown'
import { ConfirmModalInput, type ConfirmModalInputProps } from './confirm'

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

export { Modal } from './Modal'
