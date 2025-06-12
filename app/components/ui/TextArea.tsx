import React from 'react'

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helper?: string
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  helper,
  id,
  className = '',
  ...props
}) => {
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
      <textarea
        id={id}
        className={`block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 ${className}`}
        {...props}
      />
      {helper && (
        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
          {helper}
        </p>
      )}
    </div>
  )
}

export default TextArea
