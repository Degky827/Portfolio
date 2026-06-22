import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { logPortfolioVisit } from '../services/api'
import { getSettings } from '../services/settingsService'

function getVisitorId() {
  let id = localStorage.getItem('portfolio_visitor_id')
  if (!id) {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    id = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem('portfolio_visitor_id', id)
  }
  return id
}

export function usePageTracking(viewerName) {
  const lastPage = useRef('')
  const location = useLocation()
  const analyticsEnabled = useRef(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { settings } = await getSettings()
        if (settings?.enableAnalytics !== undefined) {
          analyticsEnabled.current = settings.enableAnalytics
        }
      } catch {
        // default to enabled
      }
    })()
  }, [])

  useEffect(() => {
    if (!analyticsEnabled.current) return
    if (location.pathname.startsWith('/admin') || location.pathname === '/login') return
    if (lastPage.current === location.pathname) return

    lastPage.current = location.pathname
    const visitorId = getVisitorId()

    const params = new URLSearchParams(window.location.search)
    logPortfolioVisit({
      viewerName: viewerName || 'Anonymous',
      page: location.pathname,
      referrer: document.referrer || 'Direct',
      visitorId,
      src: params.get('src') || undefined,
    })
  }, [viewerName, location.pathname])
}
