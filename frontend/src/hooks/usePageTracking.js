import { useEffect, useRef } from 'react'
import { logPortfolioVisit } from '../services/api'

export function usePageTracking(viewerName) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    logPortfolioVisit(viewerName || 'Anonymous Portfolio Viewer')
  }, [viewerName])
}
