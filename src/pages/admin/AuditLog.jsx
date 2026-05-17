import { useState } from 'react'
import { useGoals } from '../../context/GoalContext'
import { relativeTime } from '../../utils/helpers'
import EmptyState from '../../components/ui/EmptyState'
import { ScrollText, Search } from 'lucide-react'

const ACTION_TYPES = ['All', 'Goal Created', 'Goal Approved', 'Goal Rejected', 'Goal Returned', 'Goal Submitted', 'Goal Locked', 'Goal Unlocked', 'Goal Updated', 'Goal Deleted', 'Check-in Submitted', 'Shared Goal Created', 'Shared Goal Pushed']

export default function AuditLog() {
  const { auditLogs } = useGoals()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = auditLogs
    .filter(log => filter === 'All' || log.action === filter)
    .filter(log =>
      !search ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.changed_by_name?.toLowerCase().includes(search.toLowerCase())
    )

  const activeFilters = ['All', ...new Set(auditLogs.map(l => l.action))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Audit Log</h1>
        <p className="page-subtitle">{auditLogs.length} total entries</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" className="input-field pl-9" placeholder="Search by name or details..."
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-pill ${filter === f ? 'filter-pill-active' : 'filter-pill-inactive'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={ScrollText} title="No audit records" description="No matching audit log entries found." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-40">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Details</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-36">Changed By</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-36">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.action.includes('Approved') ? 'bg-emerald-50 text-emerald-700' :
                        log.action.includes('Rejected') ? 'bg-red-50 text-red-700' :
                        log.action.includes('Returned') ? 'bg-orange-50 text-orange-700' :
                        log.action.includes('Unlocked') ? 'bg-purple-50 text-purple-700' :
                        log.action.includes('Submitted') || log.action.includes('Created') ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-600'
                      }`}>{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-md">
                      <p className="truncate">{log.details}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{log.changed_by_name}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{relativeTime(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
