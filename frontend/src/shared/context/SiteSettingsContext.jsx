import { createContext, useContext, useState, useEffect } from 'react'
import { getSiteSettings } from '../services/siteSettingsService'

const SiteSettingsContext = createContext(null)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await getSiteSettings()
        if (!cancelled) setSettings(res.settings || {})
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  function updateSettings(newSettings) {
    setSettings(newSettings)
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return ctx
}
