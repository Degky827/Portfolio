/**
 * Native client-side HTML and SVG sanitization using DOMParser.
 * Removes executable script tags, event handlers (on*), and javascript: schemes.
 */

export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return ''
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return rawHtml

  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHtml, 'text/html')

  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'link', 'base', 'form']
  dangerousTags.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove())
  })

  doc.querySelectorAll('*').forEach((el) => {
    for (let i = el.attributes.length - 1; i >= 0; i--) {
      const attr = el.attributes[i]
      const name = attr.name.toLowerCase()
      const val = attr.value.trim().toLowerCase()

      if (name.startsWith('on') || val.startsWith('javascript:') || val.startsWith('data:text/html')) {
        el.removeAttribute(attr.name)
      }
    }
  })

  return doc.body.innerHTML
}

export function sanitizeSvg(rawSvg) {
  if (!rawSvg || typeof rawSvg !== 'string') return ''
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return rawSvg

  const parser = new DOMParser()
  const doc = parser.parseFromString(rawSvg, 'image/svg+xml')

  if (doc.querySelector('parsererror')) return ''

  const svg = doc.querySelector('svg')
  if (!svg) return ''

  svg.querySelectorAll('script').forEach((s) => s.remove())

  const elements = [svg, ...svg.querySelectorAll('*')]
  elements.forEach((el) => {
    for (let i = el.attributes.length - 1; i >= 0; i--) {
      const attr = el.attributes[i]
      const name = attr.name.toLowerCase()
      const val = attr.value.trim().toLowerCase()

      if (name.startsWith('on') || val.startsWith('javascript:') || val.startsWith('data:text/html')) {
        el.removeAttribute(attr.name)
      }
    }
  })

  return svg.outerHTML
}
