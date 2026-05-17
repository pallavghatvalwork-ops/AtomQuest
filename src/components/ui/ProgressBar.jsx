import { getProgressColor } from '../../utils/calculations'

export default function ProgressBar({ value, showLabel = true, size = 'md', className = '' }) {
  const percent = Math.min(Math.max(value || 0, 0), 100)
  const sizeClasses = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'
  const colorClass = getProgressColor(percent)

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-500">Progress</span>
          <span className="text-xs font-semibold text-gray-700">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeClasses}`}>
        <div
          className={`${colorClass} ${sizeClasses} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  )
}
