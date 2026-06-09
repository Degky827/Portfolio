import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const setAuth = useCallback((newToken, newUser, rememberMe) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true')
    } else {
      localStorage.removeItem('rememberMe')
    }
    setToken(newToken)
    setUser(newUser)
  }, [])

  const setUserData = useCallback((newUser) => {
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('rememberMe')
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = useMemo(() => !!token, [token])
  const userRole = useMemo(() => user?.role || null, [user])

  const hasRole = useCallback(
    (...roles) => {
      if (!userRole) return false
      return roles.includes(userRole)
    },
    [userRole],
  )

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      userRole,
      setAuth,
      setUserData,
      logout,
      hasRole,
    }),
    [user, token, isAuthenticated, userRole, setAuth, setUserData, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
