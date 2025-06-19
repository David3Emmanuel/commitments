interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  labelClassName?: string
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  labelClassName = '',
  ...props
}) => {
  return (
    <div className='flex items-center'>
      <input
        type='checkbox'
        className={`h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
        {...props}
      />
      {label && (
        <span className={`ml-3 text-sm ${labelClassName}`}>{label}</span>
      )}
    </div>
  )
}

export default Checkbox
