import { relativeTime, getInitials } from '../utils/helpers'
import EmptyState from './ui/EmptyState'
import { Activity } from 'lucide-react'

export default function ActivityFeed({ items = [], maxItems = 8, title = 'Recent Activity' }) {
  const displayed = items.slice(0, maxItems)

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Activity size={16} className="text-gray-400" />
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-50">
        {displayed.length === 0 ? (
          <EmptyState icon={Activity} title="No recent activity" description="Actions will appear here as they happen." />
        ) : (
          displayed.map((item) => {
            const nameParts = item.text.match(/^(\S+\s\S+)/)
            const name = nameParts ? nameParts[1] : 'User'
            return (
              <div key={item.id} className="flex items-start gap-3 px-6 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-500 mt-0.5 flex-shrink-0">
                  {getInitials(name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{item.icon} {item.text}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{relativeTime(item.timestamp)}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      item.role === 'manager' ? 'bg-blue-50 text-blue-600' :
                      item.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>{item.role}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
