import { useState, useCallback, useMemo } from 'react'

const ALLOWED_FAVICON_FORMATS = ['ico', 'webp', 'png']
const MAX_FAVICON_KB = 50
const RECOMMENDED_DESC_MIN = 120
const RECOMMENDED_DESC_MAX = 160

export function useBrandingValidation() {
  const [faviconErrors, setFaviconErrors] = useState([])
  const [logoSvgErrors, setLogoSvgErrors] = useState([])

  const validateFavicon = useCallback((file) => {
    const errors = []

    if (!file) return []

    const ext = file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_FAVICON_FORMATS.includes(ext)) {
      errors.push(`Format must be one of: ${ALLOWED_FAVICON_FORMATS.join(', ')} (got .${ext})`)
    }

    const sizeKB = file.size / 1024
    if (sizeKB > MAX_FAVICON_KB) {
      errors.push(`File size ${sizeKB.toFixed(1)}KB exceeds ${MAX_FAVICON_KB}KB limit`)
    }

    // Check aspect ratio via FileReader + Image
    if (file.type.startsWith('image/')) {
      const img = new Image()
      const url = URL.createObjectURL(file)
      const promise = new Promise((resolve) => {
        img.onload = () => {
          URL.revokeObjectURL(url)
          if (img.width !== img.height) {
            errors.push(`Aspect ratio must be 1:1 (got ${img.width}×${img.height})`)
          }
          resolve(errors)
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          resolve(errors)
        }
        img.src = url
      })
      setFaviconErrors(errors)
      return promise
    }

    setFaviconErrors(errors)
    return errors
  }, [])

  const validateLogoSvg = useCallback((value) => {
    const errors = []

    // If it's a File, check content
    if (value instanceof File) {
      const ext = value.name.split('.').pop().toLowerCase()
      if (ext !== 'svg') {
        const name = value.name.toLowerCase()
        if (name.includes('.svg')) {
          // accept it
        } else {
          errors.push('Portfolio logo should be an SVG for optimal rendering')
        }
      }
    } else if (typeof value === 'string' && value.length > 0) {
      // URL-based logo — just warn
      const isSvg = value.toLowerCase().includes('.svg') || value.includes('image/svg+xml')
      if (!isSvg) {
        errors.push('Consider using an SVG logo for transparency support')
      }
    }

    setLogoSvgErrors(errors)
    return errors
  }, [])

  const validateDescription = useCallback((text) => {
    const len = text?.length || 0
    const warnings = []

    if (len < RECOMMENDED_DESC_MIN && len > 0) {
      warnings.push(`Meta-description is ${len} chars — aim for ${RECOMMENDED_DESC_MIN}–${RECOMMENDED_DESC_MAX} for optimal SEO`)
    } else if (len > RECOMMENDED_DESC_MAX) {
      warnings.push(`Meta-description is ${len} chars — search engines may truncate beyond ${RECOMMENDED_DESC_MAX}`)
    } else if (len === 0) {
      warnings.push('Meta-description is empty — search engines will auto-generate a snippet')
    }

    return { length: len, warnings, inOptimalRange: len >= RECOMMENDED_DESC_MIN && len <= RECOMMENDED_DESC_MAX }
  }, [])

  const faviconWarnings = useMemo(() => faviconErrors, [faviconErrors])
  const logoSvgWarnings = useMemo(() => logoSvgErrors, [logoSvgErrors])

  return {
    validateFavicon,
    validateLogoSvg,
    validateDescription,
    faviconErrors: faviconWarnings,
    logoSvgErrors: logoSvgWarnings,
    RECOMMENDED_DESC_MIN,
    RECOMMENDED_DESC_MAX,
    MAX_FAVICON_KB,
    ALLOWED_FAVICON_FORMATS,
  }
}
