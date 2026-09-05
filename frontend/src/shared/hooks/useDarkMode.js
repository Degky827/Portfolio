import { useState, useEffect, useCallback } from 'react'
import { usePublicSocket } from '../context/PublicSocketContext'

export function useDarkMode() {
  const { on } = usePublicSocket()

  const [darkMode, setDarkMode] = useState(() => {
    const userChoice = localStorage.getItem('darkModeUserChoice')
    if (userChoice !== null) return JSON.parse(userChoice)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [loaded, setLoaded] = useState(false)

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

  useEffect(() => {
    const cleanup = on('settings:updated', (data) => {
      if (data.type === 'appearance' && data.mode) {
        const userChoice = localStorage.getItem('darkModeUserChoice')
        if (userChoice !== null) return
        const isDark = data.mode === 'dark' || (data.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        setDarkMode(isDark)
      }
    })
    return cleanup
  }, [on])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('darkModeUserChoice', JSON.stringify(next))
      return next
    })
  }, [])

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
