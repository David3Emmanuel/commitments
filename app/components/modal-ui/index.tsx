import { useState, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { TextModalInput, type TextModalInputProps } from './text'
import { DateModalInput, type DateModalInputProps } from './date'
import { DropdownModalInput, type DropdownModalInputProps } from './dropdown'
import { ConfirmModalInput, type ConfirmModalInputProps } from './confirm'
import { NumericModalInput, type NumericModalInputProps } from './numeric'
import { ChecklistModalInput, type ChecklistModalInputProps } from './checklist'

// Union type of all modal input props
type ModalInputProps =
  | TextModalInputProps
  | DateModalInputProps
  | DropdownModalInputProps
  | ConfirmModalInputProps
  | NumericModalInputProps
  | ChecklistModalInputProps

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
  showNumericModal: (
    title: string,
    options?: {
      placeholder?: string
      initialValue?: string
      min?: number
      max?: number
      step?: number
      allowDecimal?: boolean
    },
  ) => Promise<number | null>
  showConfirmModal: (
    title: string,
    message: string,
    confirmLabel?: string,
    cancelLabel?: string,
  ) => Promise<boolean>
  showChecklistModal: (
    title: string,
    options?: string[],
    initialValues?: string[],
    allowNewItems?: boolean,
  ) => Promise<string[] | null>
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
  showNumericModal: () => Promise.resolve(null),
  showConfirmModal: () => Promise.resolve(false),
  showChecklistModal: () => Promise.resolve(null),
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

  const showNumericModal = (
    title: string,
    options: {
      placeholder?: string
      initialValue?: string
      min?: number
      max?: number
      step?: number
      allowDecimal?: boolean
    } = {},
  ): Promise<number | null> => {
    return new Promise((resolve) => {
      setModalProps({
        type: 'numeric',
        title,
        placeholder: options.placeholder,
        initialValue: options.initialValue,
        min: options.min,
        max: options.max,
        step: options.step,
        allowDecimal: options.allowDecimal,
        onSubmit: (value) => {
          setModalProps(null)
          resolve(options.allowDecimal ? parseFloat(value) : parseInt(value))
        },
        onCancel: () => {
          setModalProps(null)
          resolve(null)
        },
      })
    })
  }

  const showChecklistModal = (
    title: string,
    options?: string[],
    initialValues?: string[],
    allowNewItems?: boolean,
  ): Promise<string[]> => {
    return new Promise((resolve) => {
      setModalProps({
        type: 'checklist',
        title,
        options,
        initialValues,
        allowNewItems,
        onSubmit: (value) => {
          setModalProps(null)
          resolve(value)
        },
        onCancel: () => {
          setModalProps(null)
          resolve([])
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
        showNumericModal,
        showChecklistModal,
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
    case 'numeric':
      return <NumericModalInput {...props} />
    case 'checklist':
      return <ChecklistModalInput {...props} />
  }
}

export { Modal } from './Modal'
