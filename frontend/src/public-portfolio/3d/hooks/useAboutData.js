import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getAboutContent } from '../../../shared/services/aboutService'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'
import { getHomeContent } from '../../../shared/services/homeContentService'

/**
 * useAboutData — mirrors 2D About's data resolution for 3D
 */
export default function useAboutData(aboutContentFromParent) {
  const { t, i18n } = useTranslation()
  const isAm = i18n.language === 'am'
  const settings = useSiteSettings()
  const brand = settings?.brand || {}

  const [aboutContent, setAboutContent] = useState(aboutContentFromParent || null)
  const [heroContent, setHeroContent] = useState(null)

  useEffect(() => {
    if (aboutContentFromParent) return
    getAboutContent()
      .then(setAboutContent)
      .catch(() => {})
  }, [aboutContentFromParent])

  useEffect(() => {
    getHomeContent()
      .then(setHeroContent)
      .catch(() => {})
  }, [])

  const hero = heroContent?.content || {}
  const about = aboutContent || {}

  const title = isAm
    ? (about.titleAm || about.title || t('about.title'))
    : (about.title || t('about.title'))

  const subtitle = isAm
    ? (about.subtitleAm || about.subtitle || t('about.subtitle'))
    : (about.subtitle || t('about.subtitle'))

  const fullName = isAm
    ? (hero.fullNameAm || hero.fullName || t('about.fullName'))
    : (hero.fullName || t('about.fullName'))

  const roleTitle = isAm
    ? (hero.professionalBadgeAm || hero.professionalBadge || t('about.role'))
    : (hero.professionalBadge || t('about.role'))

  const storyPillars = about.storyPillars?.length
    ? about.storyPillars.filter((p) => {
        const enContent = p.content && p.content !== '<p><br></p>'
        const amContent = p.contentAm && p.contentAm !== '<p><br></p>'
        return isAm ? (amContent || enContent) : enContent
      })
    : []

  const sections = storyPillars.length > 0
    ? storyPillars.map((p) => ({
        title: isAm ? (p.titleAm || p.title) : p.title,
        content: isAm ? (p.contentAm || p.content) : p.content,
      }))
    : []

  const ide = about.idePresentation || {}
  const skills = ide.skills?.length ? ide.skills : ['React', 'Node']
  const available = ide.available !== undefined ? ide.available : true
  const locationText = ide.location || t('about.location')

  const highlightMetrics = about.highlightMetrics?.length
    ? about.highlightMetrics
    : []

  const certifications = about.certifications?.length
    ? [...about.certifications].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : []

  const badge = t('about.badge')

  return {
    title,
    subtitle,
    fullName,
    roleTitle,
    sections,
    skills,
    available,
    locationText,
    highlightMetrics,
    certifications,
    badge,
  }
}
