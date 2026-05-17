import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import ActivityFeed from '../../components/ActivityFeed'
import { calculateOverallProgress } from '../../utils/calculations'
import { useNavigate } from 'react-router-dom'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const { goals, checkIns, activity } = useGoals()
  const navigate = useNavigate()

  const myGoals = goals.filter(g => g.employee_id === user.id)
  const approved = myGoals.filter(g => g.status === 'Approved' || g.status === 'Locked').length
  const pending = myGoals.filter(g => g.status === 'Pending Approval').length
  const draft = myGoals.filter(g => g.status === 'Draft' || g.status === 'Rejected' || g.status === 'Returned For Rework').length
  const overallProgress = calculateOverallProgress(myGoals, checkIns)

  // Filter activity to this employee
  const myActivity = activity.filter(a =>
    a.text.toLowerCase().includes(user.name.split(' ')[0].toLowerCase())
  ).slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="page-subtitle">Here&apos;s an overview of your goals and progress</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Total Goals" value={myGoals.length} sublabel={`${user.department} department`} color="primary" />
        <StatCard icon={CheckCircle2} label="Approved / Locked" value={approved} sublabel="Goals finalized" color="success" />
        <StatCard icon={Clock} label="Pending Approval" value={pending} sublabel="Awaiting manager review" color="warning" />
        <StatCard icon={TrendingUp} label="Overall Progress" value={`${overallProgress}%`} sublabel="Based on check-ins" color="info" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button onClick={() => navigate('/employee/goals')} className="btn-primary">
          <Target size={16} /> Manage Goals
        </button>
        <button onClick={() => navigate('/employee/checkins')} className="btn-secondary">
          <CheckCircle2 size={16} /> Submit Check-in
        </button>
      </div>

      {/* Progress + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Goal Progress</h3>
          </div>
          <div className="card-body space-y-4">
            {myGoals.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No goals created yet.</p>
            ) : (
              myGoals.slice(0, 5).map(goal => {
                const goalCheckIns = checkIns.filter(c => c.goal_id === goal.id)
                const latest = goalCheckIns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
                const progress = latest ? latest.progress : 0
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700 truncate pr-4">{goal.title}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{goal.weightage}%</span>
                    </div>
                    <ProgressBar value={progress} showLabel={false} size="sm" />
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed items={myActivity.length > 0 ? myActivity : activity.slice(0, 6)} maxItems={6} />
      </div>
    </div>
  )
}
