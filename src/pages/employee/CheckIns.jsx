import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { QUARTERS, CHECKIN_STATUSES } from '../../utils/constants'
import { calculateProgress } from '../../utils/calculations'
import EmptyState from '../../components/ui/EmptyState'
import StatusBadge from '../../components/ui/StatusBadge'
import ProgressBar from '../../components/ui/ProgressBar'
import { ClipboardCheck, Save } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function CheckIns() {
  const { user } = useAuth()
  const { goals, checkIns, addCheckIn } = useGoals()
  const [selectedQuarter, setSelectedQuarter] = useState('Q2')

  const myGoals = goals.filter(g =>
    g.employee_id === user.id && (g.status === 'Approved' || g.status === 'Locked')
  )

  const [formData, setFormData] = useState({})

  const getExistingCheckIn = (goalId, quarter) => {
    return checkIns.find(c => c.goal_id === goalId && c.quarter === quarter)
  }

  const handleChange = (goalId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [goalId]: { ...(prev[goalId] || {}), [field]: value },
    }))
  }

  const handleSave = (goalId) => {
    const data = formData[goalId]
    if (!data?.achievement && data?.achievement !== 0) {
      toast.error('Please enter an achievement value.')
      return
    }
    const goal = myGoals.find(g => g.id === goalId)
    const progress = calculateProgress(goal.uom, data.achievement, goal.target, goal.deadline)

    addCheckIn({
      goal_id: goalId,
      quarter: selectedQuarter,
      achievement: Number(data.achievement),
      progress,
      status: data.status || 'On Track',
      comment: data.comment || '',
    }, user)

    setFormData(prev => ({ ...prev, [goalId]: {} }))
    toast.success(`${selectedQuarter} check-in saved!`)
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div>
        <h1 className="page-title">Quarterly Check-ins</h1>
        <p className="page-subtitle">Update progress for your approved goals</p>
      </div>

      {/* Quarter Selector */}
      <div className="flex gap-2">
        {QUARTERS.map(q => (
          <button
            key={q}
            onClick={() => setSelectedQuarter(q)}
            className={`filter-pill ${selectedQuarter === q ? 'filter-pill-active' : 'filter-pill-inactive'}`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Check-in Cards */}
      {myGoals.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No approved goals"
          description="Only approved or locked goals can have check-ins. Submit your goals for approval first."
        />
      ) : (
        <div className="space-y-4">
          {myGoals.map(goal => {
            const existing = getExistingCheckIn(goal.id, selectedQuarter)
            const current = formData[goal.id] || {}
            const progress = existing?.progress || 0

            return (
              <div key={goal.id} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>Target: {goal.target} {goal.uom}</span>
                      <span>Weightage: {goal.weightage}%</span>
                      <StatusBadge status={goal.status} size="sm" />
                    </div>
                  </div>
                  <ProgressBar value={progress} className="w-24" size="sm" showLabel={false} />
                </div>

                {existing ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">✅ {selectedQuarter} Check-in Submitted</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Achievement</span>
                        <p className="font-medium">{existing.achievement}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Progress</span>
                        <p className="font-medium">{existing.progress}%</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Status</span>
                        <p><StatusBadge status={existing.status} size="sm" /></p>
                      </div>
                    </div>
                    {existing.comment && (
                      <p className="text-sm text-gray-500 mt-3 italic">"{existing.comment}"</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="label">Achievement</label>
                      <input
                        type="number" className="input-field"
                        placeholder={`Target: ${goal.target}`}
                        value={current.achievement || ''}
                        onChange={(e) => handleChange(goal.id, 'achievement', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select
                        className="select-field"
                        value={current.status || 'On Track'}
                        onChange={(e) => handleChange(goal.id, 'status', e.target.value)}
                      >
                        {CHECKIN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Comment</label>
                      <input
                        type="text" className="input-field" placeholder="Add comment..."
                        value={current.comment || ''}
                        onChange={(e) => handleChange(goal.id, 'comment', e.target.value)}
                      />
                    </div>
                    <button onClick={() => handleSave(goal.id)} className="btn-primary">
                      <Save size={16} /> Save
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
