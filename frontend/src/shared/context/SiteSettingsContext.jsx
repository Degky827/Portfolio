import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { changeLanguageWithPersistence } from '../../i18n'
import { getSiteSettings } from '../services/siteSettingsService'

const SiteSettingsContext = createContext(null)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getSiteSettings()
      const s = res.settings || {}
      setSettings(s)
      if (!localStorage.getItem('i18n_user_choice') && s.defaultLanguage) {
        changeLanguageWithPersistence(s.defaultLanguage)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  function updateSettings(newSettings) {
    setSettings(newSettings)
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, updateSettings, refreshSettings: fetchSettings }}>
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
