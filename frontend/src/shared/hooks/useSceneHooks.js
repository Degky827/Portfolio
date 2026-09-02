import { useState, useEffect } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}

export function useDarkModeScene() {
  const [dark, setDark] = useState(() => {
    if (typeof document === 'undefined') return true
    if (document.documentElement.classList.contains('dark')) return true
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      try { return JSON.parse(saved) } catch { /* ignore */ }
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => {
      setDark(el.classList.contains('dark'))
    })
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return dark
}
