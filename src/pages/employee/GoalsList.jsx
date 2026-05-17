import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { Plus, Send, Pencil, Trash2, Lock, Target } from 'lucide-react'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import GoalForm from '../../components/goals/GoalForm'
import { EDITABLE_STATUSES, GOAL_STATUSES } from '../../utils/constants'
import { validateGoalCount, canSubmitGoals, validateTotalWeightage } from '../../utils/validation'
import { relativeTime, formatDate } from '../../utils/helpers'
import toast, { Toaster } from 'react-hot-toast'

export default function GoalsList() {
  const { user } = useAuth()
  const { goals, addGoal, updateGoal, deleteGoal, submitGoals } = useGoals()
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [filter, setFilter] = useState('All')

  const myGoals = goals.filter(g => g.employee_id === user.id)
  const totalWeightage = myGoals.reduce((s, g) => s + Number(g.weightage || 0), 0)
  const draftGoals = myGoals.filter(g => g.status === 'Draft')

  const filteredGoals = filter === 'All' ? myGoals : myGoals.filter(g => g.status === filter)
  const activeFilters = ['All', ...new Set(myGoals.map(g => g.status))]

  const handleCreate = (formData) => {
    const countCheck = validateGoalCount(myGoals)
    if (!countCheck.valid) { toast.error(countCheck.message); return }
    addGoal(formData, user)
    setShowForm(false)
    toast.success('Goal created successfully!')
  }

  const handleUpdate = (formData) => {
    updateGoal(editingGoal.id, formData, user)
    setEditingGoal(null)
    toast.success('Goal updated successfully!')
  }

  const handleDelete = (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId, user)
      toast.success('Goal deleted.')
    }
  }

  const handleSubmitAll = () => {
    const check = canSubmitGoals(draftGoals)
    if (!check.valid) { toast.error(check.message); return }
    // Check total weightage of ALL goals (not just draft)
    const totalCheck = validateTotalWeightage(myGoals)
    if (!totalCheck.valid) { toast.error(totalCheck.message); return }
    submitGoals(user.id, user)
    toast.success('Goals submitted for approval!')
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Goals</h1>
          <p className="page-subtitle">{myGoals.length} goals · {totalWeightage}% total weightage</p>
        </div>
        <div className="flex gap-3">
          {draftGoals.length > 0 && (
            <button onClick={handleSubmitAll} className="btn-success">
              <Send size={16} /> Submit for Approval
            </button>
          )}
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> Create Goal
          </button>
        </div>
      </div>

      {/* Weightage Tracker */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Total Weightage</span>
          <span className={`text-sm font-bold ${totalWeightage === 100 ? 'text-emerald-600' : totalWeightage > 100 ? 'text-red-600' : 'text-amber-600'}`}>
            {totalWeightage}% / 100%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${totalWeightage === 100 ? 'bg-emerald-500' : totalWeightage > 100 ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{ width: `${Math.min(totalWeightage, 100)}%` }}
          ></div>
        </div>
        {totalWeightage !== 100 && (
          <p className="text-xs text-red-500 mt-2">
            ⚠ Total weightage must equal exactly 100% before submitting.
            {totalWeightage < 100 ? ` Add ${100 - totalWeightage}% more.` : ` Remove ${totalWeightage - 100}%.`}
          </p>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-pill ${filter === f ? 'filter-pill-active' : 'filter-pill-inactive'}`}
          >
            {f} {f !== 'All' && `(${myGoals.filter(g => g.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals found"
          description={filter === 'All' ? "Start by creating your first goal." : `No goals with status "${filter}".`}
          actionLabel={filter === 'All' ? 'Create Goal' : undefined}
          onAction={filter === 'All' ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredGoals.map(goal => {
            const canEdit = EDITABLE_STATUSES.includes(goal.status) && !goal.locked
            return (
              <div key={goal.id} className="card p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                      {goal.locked && <Lock size={14} className="text-slate-400" />}
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{goal.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                      <span className="bg-gray-50 px-2 py-0.5 rounded">{goal.thrust_area}</span>
                      <span>Target: <span className="font-medium text-gray-600">{goal.target} {goal.uom}</span></span>
                      <span>Weightage: <span className="font-medium text-gray-600">{goal.weightage}%</span></span>
                      {goal.deadline && <span>Deadline: <span className="font-medium text-gray-600">{formatDate(goal.deadline)}</span></span>}
                      <span>Updated {relativeTime(goal.updated_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={goal.status} />
                    {canEdit && (
                      <>
                        <button onClick={() => setEditingGoal(goal)} className="btn-ghost p-2" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(goal.id)} className="btn-ghost p-2 text-red-400 hover:text-red-600" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New Goal" size="lg">
        <GoalForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingGoal} onClose={() => setEditingGoal(null)} title="Edit Goal" size="lg">
        {editingGoal && (
          <GoalForm
            initialData={editingGoal}
            isSharedGoal={!!editingGoal.shared_goal_id}
            onSubmit={handleUpdate}
            onCancel={() => setEditingGoal(null)}
          />
        )}
      </Modal>
    </div>
  )
}
