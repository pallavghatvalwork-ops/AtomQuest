// ===== GOAL VALIDATION RULES =====

const MAX_GOALS = 8
const MIN_WEIGHTAGE = 10

export function validateGoalCount(goals) {
  if (goals.length >= MAX_GOALS) {
    return { valid: false, message: `Maximum ${MAX_GOALS} goals allowed. You currently have ${goals.length}.` }
  }
  return { valid: true }
}

export function validateWeightage(weightage) {
  const w = Number(weightage)
  if (isNaN(w) || w < MIN_WEIGHTAGE) {
    return { valid: false, message: `Minimum weightage per goal is ${MIN_WEIGHTAGE}%.` }
  }
  if (w > 100) {
    return { valid: false, message: 'Weightage cannot exceed 100%.' }
  }
  return { valid: true }
}

export function validateTotalWeightage(goals) {
  const total = goals.reduce((sum, g) => sum + Number(g.weightage || 0), 0)
  if (total !== 100) {
    return { valid: false, message: `Total weightage must equal 100%. Current total: ${total}%.`, total }
  }
  return { valid: true, total }
}

export function validateGoalForm(formData) {
  const errors = {}
  if (!formData.title?.trim()) errors.title = 'Title is required.'
  if (!formData.description?.trim()) errors.description = 'Description is required.'
  if (!formData.thrust_area) errors.thrust_area = 'Thrust area is required.'
  if (!formData.uom) errors.uom = 'Unit of measurement is required.'
  if (!formData.target || Number(formData.target) <= 0) errors.target = 'Target must be greater than 0.'
  if (!formData.weightage || Number(formData.weightage) < MIN_WEIGHTAGE) errors.weightage = `Minimum weightage is ${MIN_WEIGHTAGE}%.`
  if (Number(formData.weightage) > 100) errors.weightage = 'Weightage cannot exceed 100%.'
  if (!formData.deadline) errors.deadline = 'Deadline is required.'
  return errors
}

export function getValidationErrors(goals) {
  const errors = []
  const countCheck = validateGoalCount(goals)
  if (!countCheck.valid) errors.push(countCheck.message)
  
  const totalCheck = validateTotalWeightage(goals)
  if (!totalCheck.valid) errors.push(totalCheck.message)
  
  goals.forEach((g) => {
    const wCheck = validateWeightage(g.weightage)
    if (!wCheck.valid) errors.push(`"${g.title}": ${wCheck.message}`)
  })
  
  return errors
}

export function canSubmitGoals(goals) {
  if (goals.length === 0) return { valid: false, message: 'No goals to submit.' }
  const totalCheck = validateTotalWeightage(goals)
  if (!totalCheck.valid) return totalCheck
  return { valid: true }
}
