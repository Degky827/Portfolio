import { useState, useEffect } from 'react'
import { getSettings } from '../services/settingsService'

export function usePortfolioSettings() {
  const [settings, setSettings] = useState({
    projectsPerPage: 6,
    certificatesPerPage: 6,
    enableAnalytics: true,
    enableContactForm: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { settings: s } = await getSettings()
        if (cancelled || !s) return
        setSettings({
          projectsPerPage: s.projectsPerPage ?? 6,
          certificatesPerPage: s.certificatesPerPage ?? 6,
          enableAnalytics: s.enableAnalytics ?? true,
          enableContactForm: s.enableContactForm ?? true,
        })
      } catch {
        // keep defaults
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return { settings, loading }
}
