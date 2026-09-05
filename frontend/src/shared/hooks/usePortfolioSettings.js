import { useState, useEffect, useCallback } from 'react'
import { getSettings } from '../services/settingsService'
import { usePublicSocket } from '../context/PublicSocketContext'

export function usePortfolioSettings() {
  const { on } = usePublicSocket()
  const [settings, setSettings] = useState({
    projectsPerPage: 6,
    certificatesPerPage: 6,
    enableAnalytics: true,
    enableContactForm: true,
  })
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    let cancelled = false
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
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const cleanup = fetchSettings()
    return cleanup
  }, [fetchSettings])

  useEffect(() => {
    const cleanup = on('settings:updated', (data) => {
      if (data.type === 'portfolio' && data.settings) {
        setSettings({
          projectsPerPage: data.settings.projectsPerPage ?? 6,
          certificatesPerPage: data.settings.certificatesPerPage ?? 6,
          enableAnalytics: data.settings.enableAnalytics ?? true,
          enableContactForm: data.settings.enableContactForm ?? true,
        })
      }
    })
    return cleanup
  }, [on])

  return { settings, loading }
}
