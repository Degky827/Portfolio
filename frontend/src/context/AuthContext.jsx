import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { getMe } from '../services/authService'

const AUTH_FLAG = 'opencode_auth'

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
  const [cookieAuth, setCookieAuth] = useState(() => localStorage.getItem(AUTH_FLAG) === 'true')

  const setAuth = useCallback((newToken, newUser, rememberMe) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem(AUTH_FLAG, 'true')
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true')
    } else {
      localStorage.removeItem('rememberMe')
    }
    setToken(newToken)
    setUser(newUser)
    setCookieAuth(true)
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
    localStorage.removeItem(AUTH_FLAG)
    setToken(null)
    setUser(null)
    setCookieAuth(false)
  }, [])

  const isAuthenticated = useMemo(() => !!(token || cookieAuth), [token, cookieAuth])
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
      cookieAuth,
    }),
    [user, token, isAuthenticated, userRole, setAuth, setUserData, logout, hasRole, cookieAuth],
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
