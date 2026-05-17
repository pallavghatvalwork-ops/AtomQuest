import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { useAnalytics } from '../../context/AnalyticsContext'
import { Users, Target, TrendingUp, Lock, Unlock } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import ActivityFeed from '../../components/ActivityFeed'
import StatusBadge from '../../components/ui/StatusBadge'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { goals, users, auditLogs, activity, unlockGoal } = useGoals()
  const { summaryStats, departmentData } = useAnalytics()
  const navigate = useNavigate()

  const lockedGoals = goals.filter(g => g.status === 'Locked' || (g.locked && g.status === 'Approved'))

  const handleUnlock = (goalId) => {
    unlockGoal(goalId, user)
    toast.success('Goal unlocked.')
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Organization-wide performance overview</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/audit-log')} className="btn-secondary">
            View Audit Log
          </button>
          <button onClick={() => navigate('/analytics')} className="btn-primary">
            <TrendingUp size={16} /> Analytics
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Employees" value={summaryStats.employees} sublabel="Across all departments" color="primary" />
        <StatCard icon={Target} label="Total Goals" value={summaryStats.totalGoals} sublabel={`${summaryStats.pending} pending`} color="info" />
        <StatCard icon={TrendingUp} label="Completion Rate" value={`${summaryStats.completionRate}%`} sublabel="Approved + Locked" color="success" />
        <StatCard icon={Lock} label="Locked Goals" value={summaryStats.locked} sublabel="Currently locked" color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Department Progress</h3>
          </div>
          <div className="card-body space-y-4">
            {departmentData.map(dept => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-xs text-gray-400">{dept.completed}/{dept.total} goals · {dept.completionRate}%</span>
                </div>
                <ProgressBar value={dept.completionRate} showLabel={false} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed items={activity.slice(0, 8)} maxItems={8} />
      </div>

      {/* Locked Goals — Quick Unlock */}
      {lockedGoals.length > 0 && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Locked Goals</h3>
            <span className="text-xs text-gray-400">{lockedGoals.length} goals</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Goal</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Employee</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Department</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lockedGoals.slice(0, 10).map(goal => {
                  const emp = users.find(u => u.id === goal.employee_id)
                  return (
                    <tr key={goal.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{goal.title}</td>
                      <td className="px-4 py-3 text-gray-500">{emp?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{goal.department}</td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={goal.status} size="sm" /></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleUnlock(goal.id)} className="btn-ghost text-primary-600 hover:text-primary-700">
                          <Unlock size={15} /> Unlock
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Audit Log Preview */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Audit Log</h3>
          <button onClick={() => navigate('/admin/audit-log')} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Details</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">By</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {auditLogs.slice(0, 5).map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2">
                    <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">{log.action}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-500 max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-2 text-gray-700 font-medium">{log.changed_by_name}</td>
                  <td className="px-4 py-2 text-gray-400 text-xs">{new Date(log.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
