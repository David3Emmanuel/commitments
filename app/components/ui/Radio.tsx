import React from 'react'

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  labelClassName?: string
}

const Radio: React.FC<RadioProps> = ({
  label,
  className = '',
  labelClassName = '',
  ...props
}) => {
  return (
    <div className='flex items-center'>
      <input
        type='radio'
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${className}`}
        {...props}
      />
      {label && (
        <label
          htmlFor={props.id}
          className={`ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default Radio
