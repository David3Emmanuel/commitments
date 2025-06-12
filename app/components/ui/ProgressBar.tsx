import React from 'react'

interface ProgressBarProps {
  progress: number // 0 to 100
  color?: string
  height?: string
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-green-500',
  height = 'h-1',
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div
      className={`${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full ${color}`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar
