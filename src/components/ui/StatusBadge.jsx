import { STATUS_COLORS } from '../../utils/constants'

export default function StatusBadge({ status, size = 'md' }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['Draft']
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
      {status}
    </span>
  )
}
