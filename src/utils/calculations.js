import { clamp } from './helpers'

// ===== PROGRESS CALCULATION =====

/**
 * Calculate progress based on UoM type
 * MIN: higher is better → achievement / target
 * MAX: lower is better → target / achievement
 * TIMELINE: completion date vs deadline
 * ZERO: achievement = 0 → 100%, else 0%
 */
export function calculateProgress(uom, achievement, target, deadline = null) {
  const a = Number(achievement) || 0
  const t = Number(target) || 1

  switch (uom) {
    case 'Percentage':
    case 'Count':
    case 'Currency':
    case 'Score':
      // MIN type: higher is better
      return clamp(Math.round((a / t) * 100), 0, 100)

    case 'Days':
      // MAX type: lower is better (e.g., reduce turnaround time)
      if (a === 0) return 0
      return clamp(Math.round((t / a) * 100), 0, 100)

    default:
      return clamp(Math.round((a / t) * 100), 0, 100)
  }
}

/**
 * Calculate overall weighted progress across all goals
 */
export function calculateOverallProgress(goals, checkIns) {
  if (!goals || goals.length === 0) return 0

  let totalWeightedProgress = 0
  let totalWeightage = 0

  goals.forEach((goal) => {
    const w = Number(goal.weightage) || 0
    const goalCheckIns = checkIns.filter((c) => c.goal_id === goal.id)
    const latestCheckIn = goalCheckIns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]

    if (latestCheckIn) {
      const progress = calculateProgress(goal.uom, latestCheckIn.achievement, goal.target, goal.deadline)
      totalWeightedProgress += progress * (w / 100)
    }
    totalWeightage += w
  })

  if (totalWeightage === 0) return 0
  return Math.round(totalWeightedProgress)
}

/**
 * Get progress color based on percentage
 */
export function getProgressColor(progress) {
  if (progress >= 75) return 'bg-emerald-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-amber-500'
  return 'bg-red-500'
}

/**
 * Get progress label
 */
export function getProgressLabel(progress) {
  if (progress >= 100) return 'Completed'
  if (progress >= 75) return 'On Track'
  if (progress >= 50) return 'In Progress'
  if (progress >= 25) return 'Needs Attention'
  return 'At Risk'
}
