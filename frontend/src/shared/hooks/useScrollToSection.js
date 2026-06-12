import { useCallback } from 'react'

export function useScrollToSection() {
  const scrollToSection = useCallback((hash) => {
    const id = hash.replace('#', '').replace('/', '') || 'home'
    const target = document.getElementById(id)
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [])

  return scrollToSection
}
