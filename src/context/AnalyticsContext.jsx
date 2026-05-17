import { createContext, useContext, useMemo } from 'react'
import { useGoals } from './GoalContext'
import { CHART_COLORS } from '../utils/constants'

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children }) {
  const { goals, checkIns, users } = useGoals()

  // QoQ Performance Trends — memoized
  const qoqData = useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
    return quarters.map(q => {
      const qCheckIns = checkIns.filter(c => c.quarter === q)
      const avgProgress = qCheckIns.length > 0
        ? Math.round(qCheckIns.reduce((s, c) => s + (c.progress || 0), 0) / qCheckIns.length)
        : 0

      // Group by department
      const deptProgress = {}
      qCheckIns.forEach(ci => {
        const goal = goals.find(g => g.id === ci.goal_id)
        if (goal) {
          const dept = goal.department || 'Other'
          if (!deptProgress[dept]) deptProgress[dept] = { total: 0, count: 0 }
          deptProgress[dept].total += ci.progress || 0
          deptProgress[dept].count += 1
        }
      })

      const result = { quarter: q, overall: avgProgress }
      Object.keys(deptProgress).forEach(dept => {
        result[dept] = Math.round(deptProgress[dept].total / deptProgress[dept].count)
      })
      return result
    })
  }, [goals, checkIns])

  // Goal Completion Status breakdown — memoized
  const completionData = useMemo(() => {
    const statusCounts = {}
    goals.forEach(g => {
      statusCounts[g.status] = (statusCounts[g.status] || 0) + 1
    })
    return Object.entries(statusCounts).map(([name, value], i) => ({
      name, value, color: [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.purple, CHART_COLORS.slate][i % 6]
    }))
  }, [goals])

  // Department comparison — memoized
  const departmentData = useMemo(() => {
    const depts = {}
    goals.forEach(g => {
      const dept = g.department || 'Other'
      if (!depts[dept]) depts[dept] = { total: 0, approved: 0, locked: 0, completed: 0 }
      depts[dept].total += 1
      if (g.status === 'Approved') depts[dept].approved += 1
      if (g.status === 'Locked') depts[dept].locked += 1
      if (g.status === 'Approved' || g.status === 'Locked') depts[dept].completed += 1
    })
    return Object.entries(depts).map(([dept, data]) => ({
      department: dept,
      total: data.total,
      completed: data.completed,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }))
  }, [goals])

  // Summary stats — memoized
  const summaryStats = useMemo(() => {
    const totalGoals = goals.length
    const approved = goals.filter(g => g.status === 'Approved').length
    const locked = goals.filter(g => g.status === 'Locked').length
    const pending = goals.filter(g => g.status === 'Pending Approval').length
    const rejected = goals.filter(g => g.status === 'Rejected').length
    const draft = goals.filter(g => g.status === 'Draft').length
    const employees = users.filter(u => u.role === 'employee').length
    const completionRate = totalGoals > 0 ? Math.round(((approved + locked) / totalGoals) * 100) : 0
    return { totalGoals, approved, locked, pending, rejected, draft, employees, completionRate }
  }, [goals, users])

  return (
    <AnalyticsContext.Provider value={{ qoqData, completionData, departmentData, summaryStats }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) throw new Error('useAnalytics must be used within AnalyticsProvider')
  return context
}
