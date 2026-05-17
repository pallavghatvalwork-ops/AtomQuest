import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GoalProvider } from './context/GoalContext'
import { AnalyticsProvider } from './context/AnalyticsContext'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import GoalsList from './pages/employee/GoalsList'
import CheckIns from './pages/employee/CheckIns'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import TeamGoals from './pages/manager/TeamGoals'
import AdminDashboard from './pages/admin/AdminDashboard'
import AuditLog from './pages/admin/AuditLog'
import Analytics from './pages/Analytics'
import SharedGoals from './pages/SharedGoals'

function RootRedirect() {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const redirectMap = { employee: '/employee', manager: '/manager', admin: '/admin' }
  return <Navigate to={redirectMap[user.role] || '/employee'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Employee Routes */}
      <Route element={<AppLayout allowedRoles={['employee']} />}>
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/goals" element={<GoalsList />} />
        <Route path="/employee/checkins" element={<CheckIns />} />
      </Route>

      {/* Manager Routes */}
      <Route element={<AppLayout allowedRoles={['manager']} />}>
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/team-goals" element={<TeamGoals />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AppLayout allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/audit-log" element={<AuditLog />} />
      </Route>

      {/* Shared Routes (all authenticated roles) */}
      <Route element={<AppLayout allowedRoles={['employee', 'manager', 'admin']} />}>
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/shared-goals" element={<SharedGoals />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <GoalProvider>
        <AnalyticsProvider>
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style: { fontSize: '14px', borderRadius: '8px' },
          }} />
          <AppRoutes />
        </AnalyticsProvider>
      </GoalProvider>
    </AuthProvider>
  )
}
