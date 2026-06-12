import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { logPortfolioVisit } from '../services/api'

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
  const tracked = useRef(false)
  const location = useLocation()

  useEffect(() => {
    if (tracked.current) return
    if (location.pathname.startsWith('/admin') || location.pathname === '/login') return

    tracked.current = true
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
