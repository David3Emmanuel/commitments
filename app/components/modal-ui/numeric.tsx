import React, { useState, useEffect, useRef } from 'react'
import { Modal } from './Modal'
import type BaseModalInputProps from './base-props'

export interface NumericModalInputProps extends BaseModalInputProps {
  type: 'numeric'
  initialValue?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  /** Whether to allow decimal values */
  allowDecimal?: boolean
  onSubmit: (value: string) => void
}

export const NumericModalInput: React.FC<NumericModalInputProps> = ({
  title,
  initialValue = '',
  placeholder = 'Enter a number',
  min,
  max,
  step = 1,
  allowDecimal = false,
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input when the modal opens
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Allow empty value for clearing input
    if (newValue === '') {
      setValue('')
      return
    }

    // Validate that the input is a valid number
    const numericRegex = allowDecimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/
    if (numericRegex.test(newValue)) {
      setValue(newValue)
    }
  }

  const handleSubmit = () => {
    // Don't submit empty values
    if (!value.trim()) {
      onCancel()
      return
    }

    // Validate against min/max if provided
    const numValue = parseFloat(value)
    if (
      (min !== undefined && numValue < min) ||
      (max !== undefined && numValue > max)
    ) {
      // Invalid value, don't submit
      return
    }

    onSubmit(value)
  }

  return (
    <Modal isOpen title={title} onClose={onCancel}>
      <div className='py-3 px-4'>
        <input
          ref={inputRef}
          type='text' // Using text type for better control over validation
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          inputMode={allowDecimal ? 'decimal' : 'numeric'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit()
            } else if (e.key === 'Escape') {
              onCancel()
            }
          }}
        />
        <div className='mt-4 flex justify-end'>
          <button
            className='mr-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100'
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            onClick={handleSubmit}
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  )
}
