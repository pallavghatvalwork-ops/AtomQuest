import { useState, useEffect } from 'react'
import { THRUST_AREAS, UOM_OPTIONS } from '../../utils/constants'
import { validateGoalForm } from '../../utils/validation'

export default function GoalForm({ initialData, onSubmit, onCancel, isSharedGoal = false }) {
  const [form, setForm] = useState({
    title: '', description: '', thrust_area: '', uom: '', target: '', weightage: '', deadline: '',
    ...initialData,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) setForm(prev => ({ ...prev, ...initialData }))
  }, [initialData])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateGoalForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit({
      ...form,
      target: Number(form.target),
      weightage: Number(form.weightage),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="label">Goal Title</label>
        <input
          type="text" className="input-field" placeholder="e.g., Increase SLA compliance by 15%"
          value={form.title} onChange={(e) => handleChange('title', e.target.value)}
          disabled={isSharedGoal}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          className="input-field" rows={3} placeholder="Describe the goal, expected outcomes, and success criteria..."
          value={form.description} onChange={(e) => handleChange('description', e.target.value)}
          disabled={isSharedGoal}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Thrust Area + UoM Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Thrust Area</label>
          <select
            className="select-field" value={form.thrust_area}
            onChange={(e) => handleChange('thrust_area', e.target.value)}
            disabled={isSharedGoal}
          >
            <option value="">Select thrust area</option>
            {THRUST_AREAS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.thrust_area && <p className="text-xs text-red-500 mt-1">{errors.thrust_area}</p>}
        </div>
        <div>
          <label className="label">Unit of Measurement</label>
          <select
            className="select-field" value={form.uom}
            onChange={(e) => handleChange('uom', e.target.value)}
            disabled={isSharedGoal}
          >
            <option value="">Select UoM</option>
            {UOM_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
          {errors.uom && <p className="text-xs text-red-500 mt-1">{errors.uom}</p>}
        </div>
      </div>

      {/* Target + Weightage + Deadline Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Target</label>
          <input
            type="number" className="input-field" placeholder="e.g., 95"
            value={form.target} onChange={(e) => handleChange('target', e.target.value)}
            disabled={isSharedGoal}
          />
          {errors.target && <p className="text-xs text-red-500 mt-1">{errors.target}</p>}
        </div>
        <div>
          <label className="label">Weightage (%)</label>
          <input
            type="number" className="input-field" placeholder="Min 10%"
            min="10" max="100"
            value={form.weightage} onChange={(e) => handleChange('weightage', e.target.value)}
          />
          {errors.weightage && <p className="text-xs text-red-500 mt-1">{errors.weightage}</p>}
        </div>
        <div>
          <label className="label">Deadline</label>
          <input
            type="date" className="input-field"
            value={form.deadline} onChange={(e) => handleChange('deadline', e.target.value)}
            disabled={isSharedGoal}
          />
          {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">
          {initialData?.id ? 'Update Goal' : 'Create Goal'}
        </button>
      </div>
    </form>
  )
}
