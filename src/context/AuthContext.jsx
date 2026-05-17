import { createContext, useContext, useState, useEffect } from 'react'
import { DEMO_USERS } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('atomquest_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      // Only store safe metadata — no password
      const { password, ...safeUser } = user
      localStorage.setItem('atomquest_user', JSON.stringify(safeUser))
    } else {
      localStorage.removeItem('atomquest_user')
    }
  }, [user])

  const login = (email, password) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (!found) {
      return { success: false, message: 'Invalid email or password.' }
    }
    // Strip password before storing
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    return { success: true, user: safeUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('atomquest_user')
    localStorage.removeItem('atomquest_goals')
    localStorage.removeItem('atomquest_checkins')
    localStorage.removeItem('atomquest_audit')
    localStorage.removeItem('atomquest_activity')
    localStorage.removeItem('atomquest_shared_goals')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
