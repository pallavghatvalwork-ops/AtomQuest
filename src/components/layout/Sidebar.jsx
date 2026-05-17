import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Target, ClipboardCheck, BarChart3,
  Users, FileCheck, ShieldCheck, ScrollText, Share2, X
} from 'lucide-react'

const navConfig = {
  employee: [
    { to: '/employee', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/employee/goals', icon: Target, label: 'My Goals' },
    { to: '/employee/checkins', icon: ClipboardCheck, label: 'Check-ins' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  ],
  manager: [
    { to: '/manager', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/manager/team-goals', icon: FileCheck, label: 'Team Goals' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/audit-log', icon: ScrollText, label: 'Audit Log' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
  ],
}

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const role = user?.role || 'employee'
  const links = navConfig[role] || navConfig.employee

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose}></div>
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Target size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AtomQuest</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <ShieldCheck size={16} className="text-gray-400" />
            <span className="text-xs text-gray-400">v1.0 Enterprise</span>
          </div>
        </div>
      </aside>
    </>
  )
}
