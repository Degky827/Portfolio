import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { getSiteSettings } from '../services/siteSettingsService'
import { usePublicSocket } from './PublicSocketContext'

const SiteSettingsContext = createContext(null)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { on } = usePublicSocket()

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getSiteSettings()
      const s = res.settings || {}
      setSettings(s)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    const cleanup1 = on('site-settings:updated', () => fetchSettings())
    const cleanup2 = on('home-content:updated', () => fetchSettings())
    const cleanup3 = on('navbar-settings:updated', () => fetchSettings())
    const cleanup4 = on('footer:updated', () => fetchSettings())
    return () => { cleanup1(); cleanup2(); cleanup3(); cleanup4() }
  }, [on, fetchSettings])

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings)
  }, [])

  const value = useMemo(() => ({
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: fetchSettings,
  }), [settings, loading, error, updateSettings, fetchSettings])

  return (
    <SiteSettingsContext.Provider value={value}>
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
