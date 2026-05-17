import { createContext, useContext, useState, useCallback } from 'react'
import { SEED_GOALS, SEED_CHECKINS, SEED_AUDIT_LOGS, SEED_ACTIVITY, SEED_SHARED_GOALS, DEMO_USERS } from '../data/mockData'
import { generateId } from '../utils/helpers'

const GoalContext = createContext(null)

function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch { return fallback }
}

function saveState(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function GoalProvider({ children }) {
  const [goals, setGoals] = useState(() => loadState('atomquest_goals', SEED_GOALS))
  const [checkIns, setCheckIns] = useState(() => loadState('atomquest_checkins', SEED_CHECKINS))
  const [auditLogs, setAuditLogs] = useState(() => loadState('atomquest_audit', SEED_AUDIT_LOGS))
  const [activity, setActivity] = useState(() => loadState('atomquest_activity', SEED_ACTIVITY))
  const [sharedGoals, setSharedGoals] = useState(() => loadState('atomquest_shared_goals', SEED_SHARED_GOALS))

  const persist = useCallback((goalsData, checkInsData, auditData, activityData, sharedData) => {
    if (goalsData !== undefined) saveState('atomquest_goals', goalsData)
    if (checkInsData !== undefined) saveState('atomquest_checkins', checkInsData)
    if (auditData !== undefined) saveState('atomquest_audit', auditData)
    if (activityData !== undefined) saveState('atomquest_activity', activityData)
    if (sharedData !== undefined) saveState('atomquest_shared_goals', sharedData)
  }, [])

  const addAuditLog = useCallback((action, details, user) => {
    const entry = {
      id: generateId(), action, details,
      changed_by: user.id, changed_by_name: user.name,
      created_at: new Date().toISOString(),
    }
    setAuditLogs(prev => { const next = [entry, ...prev]; saveState('atomquest_audit', next); return next })
    return entry
  }, [])

  const addActivityItem = useCallback((text, role) => {
    const icons = { employee: '🟢', manager: '🔵', admin: '🟡' }
    const item = { id: generateId(), text, role, timestamp: new Date().toISOString(), icon: icons[role] || '⚪' }
    setActivity(prev => { const next = [item, ...prev]; saveState('atomquest_activity', next); return next })
  }, [])

  // ===== GOAL CRUD =====
  const addGoal = useCallback((goalData, user) => {
    const goal = {
      ...goalData, id: generateId(), employee_id: user.id,
      department: user.department, status: 'Draft', locked: false, shared_goal_id: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    setGoals(prev => { const next = [...prev, goal]; saveState('atomquest_goals', next); return next })
    addAuditLog('Goal Created', `${user.name} created goal "${goal.title}"`, user)
    addActivityItem(`${user.name} created goal "${goal.title}"`, user.role)
    return goal
  }, [addAuditLog, addActivityItem])

  const updateGoal = useCallback((goalId, updates, user) => {
    setGoals(prev => {
      const next = prev.map(g => g.id === goalId ? { ...g, ...updates, updated_at: new Date().toISOString() } : g)
      saveState('atomquest_goals', next)
      return next
    })
    addAuditLog('Goal Updated', `${user.name} updated goal`, user)
    addActivityItem(`${user.name} updated a goal`, user.role)
  }, [addAuditLog, addActivityItem])

  const deleteGoal = useCallback((goalId, user) => {
    setGoals(prev => {
      const goal = prev.find(g => g.id === goalId)
      const next = prev.filter(g => g.id !== goalId)
      saveState('atomquest_goals', next)
      if (goal) {
        addAuditLog('Goal Deleted', `${user.name} deleted goal "${goal.title}"`, user)
        addActivityItem(`${user.name} deleted goal "${goal.title}"`, user.role)
      }
      return next
    })
  }, [addAuditLog, addActivityItem])

  // ===== SUBMISSION =====
  const submitGoals = useCallback((employeeId, user) => {
    setGoals(prev => {
      const next = prev.map(g =>
        g.employee_id === employeeId && g.status === 'Draft'
          ? { ...g, status: 'Pending Approval', updated_at: new Date().toISOString() }
          : g
      )
      saveState('atomquest_goals', next)
      return next
    })
    addAuditLog('Goal Submitted', `${user.name} submitted goals for approval`, user)
    addActivityItem(`${user.name} submitted goals for approval`, user.role)
  }, [addAuditLog, addActivityItem])

  // ===== APPROVAL WORKFLOW =====
  const approveGoal = useCallback((goalId, user) => {
    setGoals(prev => {
      const next = prev.map(g =>
        g.id === goalId ? { ...g, status: 'Approved', locked: true, updated_at: new Date().toISOString() } : g
      )
      saveState('atomquest_goals', next)
      const goal = prev.find(g => g.id === goalId)
      if (goal) {
        const emp = DEMO_USERS.find(u => u.id === goal.employee_id)
        addAuditLog('Goal Approved', `${user.name} approved "${goal.title}" for ${emp?.name || 'employee'}`, user)
        addActivityItem(`${user.name} approved "${goal.title}"`, user.role)
      }
      return next
    })
  }, [addAuditLog, addActivityItem])

  const rejectGoal = useCallback((goalId, comment, user) => {
    setGoals(prev => {
      const next = prev.map(g =>
        g.id === goalId ? { ...g, status: 'Rejected', updated_at: new Date().toISOString() } : g
      )
      saveState('atomquest_goals', next)
      const goal = prev.find(g => g.id === goalId)
      if (goal) {
        addAuditLog('Goal Rejected', `${user.name} rejected "${goal.title}" — ${comment}`, user)
        addActivityItem(`${user.name} rejected "${goal.title}"`, user.role)
      }
      return next
    })
  }, [addAuditLog, addActivityItem])

  const returnForRework = useCallback((goalId, comment, user) => {
    setGoals(prev => {
      const next = prev.map(g =>
        g.id === goalId ? { ...g, status: 'Returned For Rework', updated_at: new Date().toISOString() } : g
      )
      saveState('atomquest_goals', next)
      const goal = prev.find(g => g.id === goalId)
      if (goal) {
        addAuditLog('Goal Returned', `${user.name} returned "${goal.title}" for rework — ${comment}`, user)
        addActivityItem(`${user.name} returned "${goal.title}" for rework`, user.role)
      }
      return next
    })
  }, [addAuditLog, addActivityItem])

  // ===== LOCK/UNLOCK =====
  const unlockGoal = useCallback((goalId, user) => {
    setGoals(prev => {
      const next = prev.map(g =>
        g.id === goalId ? { ...g, status: 'Draft', locked: false, updated_at: new Date().toISOString() } : g
      )
      saveState('atomquest_goals', next)
      const goal = prev.find(g => g.id === goalId)
      if (goal) {
        const emp = DEMO_USERS.find(u => u.id === goal.employee_id)
        addAuditLog('Goal Unlocked', `${user.name} unlocked "${goal.title}" for ${emp?.name || 'employee'}`, user)
        addActivityItem(`${user.name} unlocked goal for ${emp?.name || 'employee'}`, user.role)
      }
      return next
    })
  }, [addAuditLog, addActivityItem])

  // ===== CHECK-INS =====
  const addCheckIn = useCallback((checkInData, user) => {
    const checkIn = {
      ...checkInData, id: generateId(),
      created_at: new Date().toISOString(),
    }
    setCheckIns(prev => { const next = [...prev, checkIn]; saveState('atomquest_checkins', next); return next })
    const goal = goals.find(g => g.id === checkInData.goal_id)
    addAuditLog('Check-in Submitted', `${user.name} submitted ${checkInData.quarter} check-in for "${goal?.title || 'goal'}"`, user)
    addActivityItem(`${user.name} submitted ${checkInData.quarter} check-in`, user.role)
    return checkIn
  }, [goals, addAuditLog, addActivityItem])

  const updateCheckIn = useCallback((checkInId, updates, user) => {
    setCheckIns(prev => {
      const next = prev.map(c => c.id === checkInId ? { ...c, ...updates } : c)
      saveState('atomquest_checkins', next)
      return next
    })
  }, [])

  // ===== SHARED GOALS =====
  const addSharedGoal = useCallback((sharedGoalData, user) => {
    const sg = { ...sharedGoalData, id: generateId(), created_at: new Date().toISOString() }
    setSharedGoals(prev => { const next = [...prev, sg]; saveState('atomquest_shared_goals', next); return next })
    addAuditLog('Shared Goal Created', `${user.name} created shared goal "${sg.title}"`, user)
    addActivityItem(`${user.name} created shared goal "${sg.title}"`, user.role)
    return sg
  }, [addAuditLog, addActivityItem])

  const pushSharedGoal = useCallback((sharedGoalId, employeeIds, user) => {
    const sg = sharedGoals.find(s => s.id === sharedGoalId)
    if (!sg) return

    const newGoals = employeeIds.map(empId => {
      const emp = DEMO_USERS.find(u => u.id === empId)
      return {
        id: generateId(), employee_id: empId, title: sg.title,
        description: `Shared departmental KPI: ${sg.title}`,
        thrust_area: 'Operational Excellence', uom: 'Score', target: sg.target, weightage: 10,
        department: emp?.department || '', deadline: '2026-12-31',
        status: 'Draft', locked: false, shared_goal_id: sharedGoalId,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }
    })

    setGoals(prev => { const next = [...prev, ...newGoals]; saveState('atomquest_goals', next); return next })
    addAuditLog('Shared Goal Pushed', `${user.name} pushed "${sg.title}" to ${employeeIds.length} employees`, user)
    addActivityItem(`${user.name} pushed shared goal to ${employeeIds.length} employees`, user.role)
  }, [sharedGoals, addAuditLog, addActivityItem])

  const users = DEMO_USERS

  return (
    <GoalContext.Provider value={{
      goals, checkIns, auditLogs, activity, sharedGoals, users,
      addGoal, updateGoal, deleteGoal, submitGoals,
      approveGoal, rejectGoal, returnForRework, unlockGoal,
      addCheckIn, updateCheckIn,
      addSharedGoal, pushSharedGoal,
    }}>
      {children}
    </GoalContext.Provider>
  )
}

export function useGoals() {
  const context = useContext(GoalContext)
  if (!context) throw new Error('useGoals must be used within GoalProvider')
  return context
}
