import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const ThemeContext = createContext(null)

function getStoredTheme() {
  try {
    return localStorage.getItem('admin-theme') || 'system'
  } catch {
    return 'system'
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem('admin-theme', theme)
  } catch { /* noop */ }
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved) {
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme)

  const resolved = theme === 'system' ? getSystemTheme() : theme

  useEffect(() => {
    applyTheme(resolved)
  }, [resolved])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((t) => {
    setThemeState(t)
    storeTheme(t)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        import('../../shared/services/api').then((mod) => {
          mod.default.patch('/auth/me', { theme: t }).catch(() => {})
        })
      }
      import('../../shared/services/api').then((mod) => {
        mod.default.patch('/settings/appearance', { mode: t }).catch(() => {})
      })
    } catch { /* background save; non-critical */ }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [setTheme, resolved])

  const value = useMemo(
    () => ({ theme, setTheme, resolved, toggleTheme }),
    [theme, setTheme, resolved, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
