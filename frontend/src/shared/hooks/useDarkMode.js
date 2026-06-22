import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const fetchAppearance = useCallback(() => {
    return api.get('/settings/appearance')
      .then(({ data }) => {
        if (data?.appearance?.mode) {
          const mode = data.appearance.mode
          const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          setDarkMode(isDark)
          return isDark
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchAppearance()

    const interval = setInterval(fetchAppearance, 10000)

    return () => clearInterval(interval)
  }, [fetchAppearance])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return [darkMode, setDarkMode]
}
