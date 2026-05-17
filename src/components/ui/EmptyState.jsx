import { InboxIcon } from 'lucide-react'

export default function EmptyState({ icon: Icon = InboxIcon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="p-4 bg-gray-50 rounded-full mb-4">
        <Icon size={32} className="text-gray-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-600 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary mt-4 text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
