import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, Building2 } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { getInitials } from '../../utils/helpers'

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleBadgeMap = {
    employee: 'On Track',
    manager: 'Approved',
    admin: 'Locked',
  }

  return (
    <div className="sticky top-0 z-30">
      {/* Enterprise Demo Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center py-1.5 px-4">
        <div className="flex items-center justify-center gap-2 text-xs font-medium">
          <Building2 size={13} />
          <span>Enterprise Demo Environment — AtomQuest v1.0</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-medium text-gray-500 hidden sm:block">
            Goal Setting & Tracking Portal
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.department}</p>
            </div>
            <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
              {getInitials(user?.name)}
            </div>
            <StatusBadge status={user?.role === 'admin' ? 'Admin' : user?.role === 'manager' ? 'Manager' : 'Employee'} size="sm" />
          </div>
          <button onClick={handleLogout} className="btn-ghost text-gray-400 hover:text-red-500 p-2" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>
    </div>
  )
}
