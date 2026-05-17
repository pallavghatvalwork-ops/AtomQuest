import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { Users, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import ActivityFeed from '../../components/ActivityFeed'
import ProgressBar from '../../components/ui/ProgressBar'
import StatusBadge from '../../components/ui/StatusBadge'
import { calculateOverallProgress } from '../../utils/calculations'
import { useNavigate } from 'react-router-dom'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { goals, checkIns, activity, users } = useGoals()
  const navigate = useNavigate()

  const teamMembers = users.filter(u => u.manager_id === user.id)
  const teamGoals = goals.filter(g => teamMembers.some(m => m.id === g.employee_id))
  const pendingApprovals = teamGoals.filter(g => g.status === 'Pending Approval').length
  const approvedGoals = teamGoals.filter(g => g.status === 'Approved' || g.status === 'Locked').length
  const teamCompletion = teamGoals.length > 0 ? Math.round((approvedGoals / teamGoals.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Manager Dashboard</h1>
          <p className="page-subtitle">{user.department} team overview</p>
        </div>
        <button onClick={() => navigate('/manager/team-goals')} className="btn-primary">
          <Users size={16} /> Review Team Goals
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Team Members" value={teamMembers.length} sublabel={`${user.department}`} color="primary" />
        <StatCard icon={AlertCircle} label="Pending Approvals" value={pendingApprovals} sublabel="Needs your review" color="warning" />
        <StatCard icon={CheckCircle2} label="Team Completion" value={`${teamCompletion}%`} sublabel="Goals approved/locked" color="success" />
        <StatCard icon={TrendingUp} label="Total Team Goals" value={teamGoals.length} sublabel="Across all members" color="info" />
      </div>

      {/* Team Members Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Team Progress</h3>
          </div>
          <div className="card-body space-y-4">
            {teamMembers.map(member => {
              const memberGoals = goals.filter(g => g.employee_id === member.id)
              const progress = calculateOverallProgress(memberGoals, checkIns)
              const memberPending = memberGoals.filter(g => g.status === 'Pending Approval').length
              return (
                <div key={member.id} className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center text-xs font-semibold text-primary-700 flex-shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate">{member.name}</span>
                      <div className="flex items-center gap-2">
                        {memberPending > 0 && (
                          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{memberPending} pending</span>
                        )}
                        <span className="text-xs text-gray-400">{memberGoals.length} goals</span>
                      </div>
                    </div>
                    <ProgressBar value={progress} showLabel={false} size="sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <ActivityFeed items={activity.slice(0, 8)} maxItems={8} />
      </div>
    </div>
  )
}
