import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Google Analytics 4 setup - Replace G-XXXXXXXXXX with your actual Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'

export default function Analytics() {
  useEffect(() => {
    // Load Google Analytics script
    const loadAnalytics = () => {
      if (typeof window === 'undefined' || window.gtag) return

      // Create and append gtag script
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(script1)

      // Initialize gtag
      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_path: window.location.pathname,
          send_page_view: true
        });
      `
      document.head.appendChild(script2)
    }

    // Only load in production
    if (import.meta.env.PROD && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      loadAnalytics()
    }
  }, [])

  // Track page views on route change (for SPA)
  const location = useLocation?.() || null
  useEffect(() => {
    if (import.meta.env.PROD && window.gtag && location) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search
      })
    }
  }, [location])

  return null
}

// Web Vitals Performance Monitoring
export function reportWebVitals() {
  if (typeof window !== 'undefined' && import.meta.env.PROD) {
    import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
      getCLS(sendToAnalytics)
      getFID(sendToAnalytics)
      getLCP(sendToAnalytics)
      getFCP(sendToAnalytics)
      getTTFB(sendToAnalytics)
    }).catch(() => {
      // Silently fail if web-vitals is not installed
    })
  }
}

function sendToAnalytics({ name, delta, id }) {
  if (window.gtag) {
    window.gtag('event', name, {
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      metric_id: id,
      metric_value: delta,
      metric_delta: delta
    })
  }
}
