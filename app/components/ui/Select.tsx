interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options?: { value: string | number; label: string }[]
  helper?: string
}

const Select: React.FC<SelectProps> = ({
  label,
  helper,
  id,
  options = [],
  className = '',
  children,
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
      <select
        id={id}
        className={`block rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 ${className}`}
        {...props}
      >
        {options.length > 0
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      {helper && (
        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
          {helper}
        </p>
      )}
    </div>
  )
}

export default Select
