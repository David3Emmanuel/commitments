import React, { forwardRef } from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  icon?: React.ReactNode
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helper, id, className = '', icon, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            {label}
          </label>
        )}
        <div className='relative'>
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              {icon}
            </div>
          )}
          <input
            id={id}
            className={`block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 ${
              icon ? 'pl-10' : 'px-3'
            } pr-3 ${className}`}
            ref={ref}
            {...props}
          />
        </div>
        {helper && (
          <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            {helper}
          </p>
        )}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'

export default TextInput
