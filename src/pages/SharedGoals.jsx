import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useGoals } from '../context/GoalContext'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { Share2, Plus, Send, Users } from 'lucide-react'
import { formatDate, relativeTime } from '../utils/helpers'
import toast, { Toaster } from 'react-hot-toast'

export default function SharedGoals() {
  const { user } = useAuth()
  const { sharedGoals, goals, users, addSharedGoal, pushSharedGoal } = useGoals()
  const [showCreate, setShowCreate] = useState(false)
  const [showPush, setShowPush] = useState(null) // sharedGoalId
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [form, setForm] = useState({ title: '', target: '', primary_owner: '' })

  const canManage = user.role === 'manager' || user.role === 'admin'
  const employees = users.filter(u => u.role === 'employee')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.target) {
      toast.error('Title and target are required.')
      return
    }
    addSharedGoal({
      title: form.title,
      target: Number(form.target),
      primary_owner: form.primary_owner || user.id,
    }, user)
    setShowCreate(false)
    setForm({ title: '', target: '', primary_owner: '' })
    toast.success('Shared goal created!')
  }

  const handlePush = () => {
    if (selectedEmployees.length === 0) {
      toast.error('Select at least one employee.')
      return
    }
    pushSharedGoal(showPush, selectedEmployees, user)
    setShowPush(null)
    setSelectedEmployees([])
    toast.success(`Goal pushed to ${selectedEmployees.length} employees!`)
  }

  const toggleEmployee = (empId) => {
    setSelectedEmployees(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    )
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Shared Goals</h1>
          <p className="page-subtitle">Departmental KPIs shared across teams</p>
        </div>
        {canManage && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16} /> Create Shared Goal
          </button>
        )}
      </div>

      {sharedGoals.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="No shared goals"
          description="Create shared departmental KPIs that can be pushed to multiple employees."
          actionLabel={canManage ? 'Create Shared Goal' : undefined}
          onAction={canManage ? () => setShowCreate(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedGoals.map(sg => {
            const linkedGoals = goals.filter(g => g.shared_goal_id === sg.id)
            const owner = users.find(u => u.id === sg.primary_owner)
            // Fetch-on-render sync: show latest achievement from primary owner's check-in
            return (
              <div key={sg.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{sg.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Target: <span className="font-medium text-gray-600">{sg.target}</span> · Owner: <span className="font-medium text-gray-600">{owner?.name || '—'}</span>
                    </p>
                  </div>
                  <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">Shared</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Users size={13} />
                  <span>{linkedGoals.length} employees linked</span>
                  <span>· Created {relativeTime(sg.created_at)}</span>
                </div>

                {canManage && (
                  <button
                    onClick={() => { setShowPush(sg.id); setSelectedEmployees([]) }}
                    className="btn-secondary text-xs w-full"
                  >
                    <Send size={14} /> Push to Employees
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Shared Goal" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Goal Title</label>
            <input type="text" className="input-field" placeholder="e.g., Achieve org-wide customer satisfaction score of 4.5/5"
              value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Target</label>
            <input type="number" className="input-field" placeholder="e.g., 4.5"
              value={form.target} onChange={(e) => setForm(f => ({ ...f, target: e.target.value }))} />
          </div>
          <div>
            <label className="label">Primary Owner</label>
            <select className="select-field" value={form.primary_owner} onChange={(e) => setForm(f => ({ ...f, primary_owner: e.target.value }))}>
              <option value="">Select owner</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Modal>

      {/* Push Modal */}
      <Modal isOpen={!!showPush} onClose={() => setShowPush(null)} title="Push to Employees" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select employees to receive this shared goal:</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {employees.map(emp => {
              const alreadyLinked = goals.some(g => g.shared_goal_id === showPush && g.employee_id === emp.id)
              return (
                <label key={emp.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedEmployees.includes(emp.id) ? 'bg-primary-50 border-primary-200' :
                  alreadyLinked ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' :
                  'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => !alreadyLinked && toggleEmployee(emp.id)}
                    disabled={alreadyLinked}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{emp.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{emp.department}</span>
                  {alreadyLinked && <span className="text-xs text-gray-400">(linked)</span>}
                </label>
              )
            })}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowPush(null)} className="btn-secondary">Cancel</button>
            <button onClick={handlePush} disabled={selectedEmployees.length === 0} className="btn-primary">
              Push to {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
