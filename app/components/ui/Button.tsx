import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'link' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  fullWidth?: boolean
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'flex items-center rounded-md focus:outline-none transition-colors'
  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    secondary:
      'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    link: 'text-gray-600 hover:text-blue-600 transition-colors',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
  }

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const widthStyles = fullWidth ? 'w-full' : ''

  const combinedStyles = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]}
    ${widthStyles}
    ${className}
  `.trim()

  return (
    <button className={combinedStyles} {...props}>
      {icon && (
        <span className={`inline-flex items-center ${children ? 'mr-2' : ''}`}>
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}

export default Button
