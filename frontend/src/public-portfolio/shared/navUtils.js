/**
 * Navigation Route Resolution Utilities
 *
 * Normalizes navigation items (from MongoDB, footer settings, or static fallbacks)
 * to clean internal route paths (e.g. '/', '/about', '/skills', '/projects', '/experience', '/contact', '/cv')
 * or external URLs.
 */

const KNOWN_SECTIONS = ['about', 'skills', 'projects', 'experience', 'testimonials', 'recommendations', 'contact', 'cv']

export function resolveNavPath(item) {
  if (!item) return '/'
  if (item.isExternal) return item.url || '#'

  // 1. Explicit internal URL
  const rawUrl = (typeof item.url === 'string' ? item.url : '').trim()
  if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('mailto:')) {
    const cleanUrl = rawUrl.replace(/^#\/?/, '').replace(/^\//, '').trim().toLowerCase()
    if (!cleanUrl || cleanUrl === 'home' || cleanUrl === '#') return '/'
    for (const k of KNOWN_SECTIONS) {
      if (cleanUrl === k || cleanUrl.startsWith(k)) return `/${k}`
    }
    return `/${cleanUrl}`
  }

  // 2. Section ID
  const rawSec = (typeof item.sectionId === 'string' ? item.sectionId : '').trim().toLowerCase()
  if (rawSec) {
    const cleanSec = rawSec.replace(/^#\/?/, '').replace(/^\//, '')
    if (!cleanSec || cleanSec === 'home' || cleanSec === 'hero') return '/'
    for (const k of KNOWN_SECTIONS) {
      if (cleanSec === k || cleanSec.startsWith(k)) return `/${k}`
    }
    return `/${cleanSec}`
  }

  // 3. Title / label heuristic fallback
  const rawTitle = (typeof item.title === 'string' ? item.title : (typeof item.label === 'string' ? item.label : '')).trim().toLowerCase()
  if (rawTitle) {
    if (rawTitle === 'home' || rawTitle === 'hero') return '/'
    if (rawTitle.includes('about')) return '/about'
    if (rawTitle.includes('skill')) return '/skills'
    if (rawTitle.includes('project') || rawTitle.includes('work') || rawTitle.includes('portfolio')) return '/projects'
    if (rawTitle.includes('experience') || rawTitle.includes('resume') || rawTitle.includes('timeline') || rawTitle.includes('history')) return '/experience'
    if (rawTitle.includes('testimonial') || rawTitle.includes('recommendation')) return '/recommendations'
    if (rawTitle.includes('contact') || rawTitle.includes('touch') || rawTitle.includes('reach') || rawTitle.includes('message')) return '/contact'
    if (rawTitle === 'cv') return '/cv'

    const slug = rawTitle.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (slug) return `/${slug}`
  }

  return '/'
}

export function isNavPathActive(targetPath, currentPathname) {
  const cleanCurrent = (currentPathname || '').replace(/^\//, '').trim().toLowerCase()
  const cleanTarget = (targetPath || '').replace(/^\//, '').trim().toLowerCase()

  if (!cleanTarget || cleanTarget === 'home') {
    return !cleanCurrent || cleanCurrent === 'home'
  }

  return cleanCurrent === cleanTarget || cleanCurrent.startsWith(`${cleanTarget}/`)
}
