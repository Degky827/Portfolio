import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../services/api'

export function useDarkMode() {
  const userHasToggled = useRef(false)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (userHasToggled.current) return

    api.get('/settings/appearance')
      .then(({ data }) => {
        if (userHasToggled.current) return
        if (data?.appearance?.mode) {
          const mode = data.appearance.mode
          const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          setDarkMode(isDark)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = useCallback(() => {
    userHasToggled.current = true
    setDarkMode((prev) => !prev)
  }, [])

  return [darkMode, toggleDarkMode]
}
