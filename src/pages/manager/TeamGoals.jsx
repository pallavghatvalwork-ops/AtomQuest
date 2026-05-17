import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Check, X, RotateCcw, Pencil, FileCheck, Save } from 'lucide-react'
import { relativeTime, formatDate } from '../../utils/helpers'
import toast, { Toaster } from 'react-hot-toast'

export default function TeamGoals() {
  const { user } = useAuth()
  const { goals, users, approveGoal, rejectGoal, returnForRework, updateGoal } = useGoals()

  const teamMembers = users.filter(u => u.manager_id === user.id)
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]?.id || '')
  const [filter, setFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [commentModal, setCommentModal] = useState(null) // { goalId, action }
  const [comment, setComment] = useState('')

  const memberGoals = goals.filter(g => g.employee_id === selectedMember)
  const filteredGoals = filter === 'All' ? memberGoals : memberGoals.filter(g => g.status === filter)
  const activeFilters = ['All', ...new Set(memberGoals.map(g => g.status))]

  const handleApprove = (goalId) => {
    approveGoal(goalId, user)
    toast.success('Goal approved!')
  }

  const openCommentModal = (goalId, action) => {
    setCommentModal({ goalId, action })
    setComment('')
  }

  const handleCommentSubmit = () => {
    if (!comment.trim()) { toast.error('Comment is required.'); return }
    if (commentModal.action === 'reject') {
      rejectGoal(commentModal.goalId, comment, user)
      toast.success('Goal rejected.')
    } else {
      returnForRework(commentModal.goalId, comment, user)
      toast.success('Goal returned for rework.')
    }
    setCommentModal(null)
    setComment('')
  }

  const startEdit = (goal) => {
    setEditingId(goal.id)
    setEditValues({ target: goal.target, weightage: goal.weightage })
  }

  const saveEdit = (goalId) => {
    updateGoal(goalId, {
      target: Number(editValues.target),
      weightage: Number(editValues.weightage),
    }, user)
    setEditingId(null)
    toast.success('Goal updated.')
  }

  const selectedMemberData = teamMembers.find(m => m.id === selectedMember)

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div>
        <h1 className="page-title">Team Goals</h1>
        <p className="page-subtitle">Review, edit, and approve your team&apos;s goals</p>
      </div>

      {/* Team Member Tabs */}
      <div className="flex flex-wrap gap-2">
        {teamMembers.map(m => (
          <button
            key={m.id}
            onClick={() => { setSelectedMember(m.id); setFilter('All') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors
              ${selectedMember === m.id
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">
              {m.name.split(' ').map(n => n[0]).join('')}
            </div>
            {m.name}
            {goals.filter(g => g.employee_id === m.id && g.status === 'Pending Approval').length > 0 && (
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {teamMembers.length === 0 ? (
        <EmptyState icon={FileCheck} title="No team members" description="You don't have any direct reports assigned." />
      ) : (
        <>
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-pill ${filter === f ? 'filter-pill-active' : 'filter-pill-inactive'}`}
              >
                {f} {f !== 'All' && `(${memberGoals.filter(g => g.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Goals Table */}
          {filteredGoals.length === 0 ? (
            <EmptyState
              icon={FileCheck}
              title={`No ${filter === 'All' ? '' : filter.toLowerCase() + ' '}goals`}
              description={`${selectedMemberData?.name || 'This member'} has no ${filter === 'All' ? '' : filter.toLowerCase() + ' '}goals.`}
            />
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Goal</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Thrust Area</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Target</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Weightage</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Deadline</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Updated</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredGoals.map(goal => (
                      <tr key={goal.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 max-w-xs truncate">{goal.title}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">{goal.thrust_area}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {editingId === goal.id ? (
                            <input
                              type="number" className="input-field w-20 text-center"
                              value={editValues.target} onChange={(e) => setEditValues(v => ({ ...v, target: e.target.value }))}
                            />
                          ) : (
                            <span className="font-medium">{goal.target}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {editingId === goal.id ? (
                            <input
                              type="number" className="input-field w-20 text-center"
                              value={editValues.weightage} onChange={(e) => setEditValues(v => ({ ...v, weightage: e.target.value }))}
                            />
                          ) : (
                            <span className="font-medium">{goal.weightage}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-400">{formatDate(goal.deadline)}</td>
                        <td className="px-4 py-3 text-center"><StatusBadge status={goal.status} size="sm" /></td>
                        <td className="px-4 py-3 text-center text-xs text-gray-400">{relativeTime(goal.updated_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {goal.status === 'Pending Approval' && (
                              <>
                                {editingId === goal.id ? (
                                  <button onClick={() => saveEdit(goal.id)} className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600" title="Save">
                                    <Save size={15} />
                                  </button>
                                ) : (
                                  <button onClick={() => startEdit(goal)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400" title="Edit">
                                    <Pencil size={15} />
                                  </button>
                                )}
                                <button onClick={() => handleApprove(goal.id)} className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600" title="Approve">
                                  <Check size={15} />
                                </button>
                                <button onClick={() => openCommentModal(goal.id, 'reject')} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Reject">
                                  <X size={15} />
                                </button>
                                <button onClick={() => openCommentModal(goal.id, 'return')} className="p-1.5 rounded hover:bg-orange-50 text-orange-500" title="Return for Rework">
                                  <RotateCcw size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Comment Modal for Reject / Return */}
      <Modal
        isOpen={!!commentModal}
        onClose={() => setCommentModal(null)}
        title={commentModal?.action === 'reject' ? 'Reject Goal' : 'Return for Rework'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {commentModal?.action === 'reject'
              ? 'Please provide a reason for rejecting this goal. This comment will be visible to the employee.'
              : 'Please provide feedback for what needs to be reworked. This comment will be visible to the employee.'
            }
          </p>
          <textarea
            className="input-field" rows={3}
            placeholder="Enter your comment (required)..."
            value={comment} onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setCommentModal(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
              className={commentModal?.action === 'reject' ? 'btn-danger' : 'btn-primary'}
            >
              {commentModal?.action === 'reject' ? 'Reject' : 'Return for Rework'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
