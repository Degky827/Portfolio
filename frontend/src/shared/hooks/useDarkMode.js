import { useState, useEffect, useCallback } from 'react'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    // If user explicitly toggled before, honor their choice
    const userChoice = localStorage.getItem('darkModeUserChoice')
    if (userChoice !== null) return JSON.parse(userChoice)
    // Otherwise, start with system preference (will be overridden by backend if available)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [loaded, setLoaded] = useState(false)

  // On first load: fetch backend setting and use it as default
  useEffect(() => {
    const userChoice = localStorage.getItem('darkModeUserChoice')
    if (userChoice !== null) {
      setLoaded(true)
      return
    }

    import('../services/api').then(({ default: api }) => {
      api.get('/settings/appearance')
        .then(({ data }) => {
          if (data?.appearance?.mode) {
            const mode = data.appearance.mode
            const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
            setDarkMode(isDark)
          }
          setLoaded(true)
        })
        .catch(() => setLoaded(true))
    })
  }, [])

  // Apply dark class and persist
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Toggle: user explicitly chose, so persist their choice
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('darkModeUserChoice', JSON.stringify(next))
      return next
    })
  }, [])

  // Reset: clear user choice, fall back to backend default
  const resetDarkMode = useCallback(() => {
    localStorage.removeItem('darkModeUserChoice')
    import('../services/api').then(({ default: api }) => {
      api.get('/settings/appearance')
        .then(({ data }) => {
          if (data?.appearance?.mode) {
            const mode = data.appearance.mode
            const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
            setDarkMode(isDark)
          }
        })
        .catch(() => {})
    })
  }, [])

  return [darkMode, toggleDarkMode, resetDarkMode]
}
