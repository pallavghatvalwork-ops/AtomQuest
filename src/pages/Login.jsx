import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Target, Mail, Lock, User, Shield, Users } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const demoAccounts = [
  { email: 'emp@demo.com', role: 'Employee', icon: User, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { email: 'mgr@demo.com', role: 'Manager', icon: Users, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { email: 'admin@demo.com', role: 'Admin', icon: Shield, color: 'bg-purple-50 text-purple-700 border-purple-200' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (isAuthenticated && user) {
    const redirectMap = { employee: '/employee', manager: '/manager', admin: '/admin' }
    navigate(redirectMap[user.role] || '/employee', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate network delay
    await new Promise(r => setTimeout(r, 400))

    const result = login(email, password)
    setLoading(false)

    if (result.success) {
      toast.success(`Welcome, ${result.user.name}!`)
      const redirectMap = { employee: '/employee', manager: '/manager', admin: '/admin' }
      setTimeout(() => navigate(redirectMap[result.user.role] || '/employee'), 300)
    } else {
      toast.error(result.message)
    }
  }

  const fillCredentials = (demoEmail) => {
    setEmail(demoEmail)
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-right" />

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur">
            <Target size={28} className="text-white" />
          </div>
          <span className="text-3xl font-bold">AtomQuest</span>
        </div>
        <h2 className="text-4xl font-bold leading-tight mb-4">
          Goal Setting &<br />Tracking Portal
        </h2>
        <p className="text-primary-200 text-lg leading-relaxed max-w-md">
          Align employee objectives with organizational strategy. Track progress, manage approvals, and drive performance across your enterprise.
        </p>
        <div className="mt-12 flex gap-6">
          <div>
            <p className="text-3xl font-bold">500+</p>
            <p className="text-primary-300 text-sm">Goals Tracked</p>
          </div>
          <div>
            <p className="text-3xl font-bold">98%</p>
            <p className="text-primary-300 text-sm">Approval Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold">4.8</p>
            <p className="text-primary-300 text-sm">Avg. Rating</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Target size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">AtomQuest</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
          <p className="text-sm text-gray-500 mb-8">Enter your credentials to access the portal</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-email"
                  type="email" className="input-field pl-10" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-password"
                  type="password" className="input-field pl-10" placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Quick Access — Demo Accounts</p>
            <div className="space-y-2">
              {demoAccounts.map(({ email: dEmail, role, icon: Icon, color }) => (
                <button
                  key={dEmail}
                  onClick={() => fillCredentials(dEmail)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 hover:shadow-sm ${color}`}
                >
                  <Icon size={16} />
                  <span className="flex-1 text-left">{role}</span>
                  <span className="text-xs opacity-70">{dEmail}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Password for all accounts: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">demo123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
