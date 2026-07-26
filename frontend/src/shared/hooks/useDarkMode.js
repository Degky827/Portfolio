import { useState, useEffect, useRef, useCallback } from 'react'

export function useDarkMode() {
  const userHasToggled = useRef(false)
  const apiCalled = useRef(false)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (userHasToggled.current || apiCalled.current) return
    apiCalled.current = true

    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return

    import('../services/api').then(({ default: api }) => {
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
    })
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
