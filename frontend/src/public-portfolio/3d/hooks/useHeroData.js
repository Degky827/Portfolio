import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getHomeContent } from '../../../shared/services/homeContentService'
import { getAboutContent } from '../../../shared/services/aboutService'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'

/**
 * useHeroData
 *
 * Mirrors the exact same data resolution logic as the 2D Hero component.
 * Uses settings, content, and i18n translations with the same fallback chain.
 */
export function useHeroData() {
  const [heroContent, setHeroContent] = useState(null)
  const [aboutContent, setAboutContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        const [homeRes, aboutRes] = await Promise.all([
          getHomeContent().catch(() => null),
          getAboutContent().catch(() => null),
        ])
        if (!cancelled) {
          setHeroContent(homeRes?.content || null)
          setAboutContent(aboutRes?.content || null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  return { heroContent, aboutContent, loading }
}

/**
 * useHeroSettings
 *
 * Provides site settings for the 3D hero.
 */
export function useHeroSettings() {
  const { settings } = useSiteSettings()
  return settings
}

/**
 * useHeroContent
 *
 * Resolves all hero content fields using the SAME logic as the 2D Hero.
 * This ensures admin-updated content appears in both 2D and 3D modes.
 */
export function useHeroContent(heroContent, settings) {
  const { t, i18n } = useTranslation()
  const isAm = i18n.language === 'am'

  const greeting = isAm
    ? (settings?.greetingAm || heroContent?.hero?.greetingAm || settings?.greeting || heroContent?.hero?.greeting || t('hero.greeting'))
    : (settings?.greeting || heroContent?.hero?.greeting || t('hero.greeting'))

  const fullName = isAm
    ? (settings?.brandNameAm || heroContent?.hero?.fullNameAm || settings?.brandName || heroContent?.hero?.fullName || t('hero.fullName'))
    : (settings?.brandName || heroContent?.hero?.fullName || t('hero.fullName'))

  const nameAmharic = settings?.nameAmharic || heroContent?.hero?.nameAmharic || t('hero.nameAmharic')

  const badge = isAm
    ? (settings?.professionalBadgeAm || heroContent?.hero?.professionalBadgeAm || settings?.professionalBadge || heroContent?.hero?.professionalBadge || t('hero.badge'))
    : (settings?.professionalBadge || heroContent?.hero?.professionalBadge || t('hero.badge'))

  const fullText = isAm
    ? ((settings?.typingWordsAm?.length ? settings.typingWordsAm : heroContent?.hero?.typingWordsAm)?.[0] || (settings?.typingWords?.length ? settings.typingWords : heroContent?.hero?.typingWords)?.[0] || t('hero.typingText'))
    : ((settings?.typingWords?.length ? settings.typingWords : heroContent?.hero?.typingWords)?.[0] || t('hero.typingText'))

  const introduction = isAm
    ? (settings?.shortIntroductionAm || heroContent?.hero?.shortIntroductionAm || settings?.shortIntroduction || heroContent?.hero?.shortIntroduction || t('hero.introduction'))
    : (settings?.shortIntroduction || heroContent?.hero?.shortIntroduction || t('hero.introduction'))

  const profilePhotoUrl = heroContent?.hero?.profilePhoto?.url || '/BDU1601297.png'
  const profilePhotoAlt = heroContent?.hero?.profilePhoto?.alt || t('hero.profileAlt')

  const stats = heroContent?.hero?.statistics?.length > 0
    ? heroContent.hero.statistics
    : [
        { label: t('hero.statTopCertifications'), value: '3+', icon: 'Award', color: '#6366f1' },
        { label: t('hero.statClassProjects'), value: '15+', icon: 'BookOpen', color: '#10b981' },
        { label: t('hero.statCoreSkills'), value: '30+', icon: 'Cpu', color: '#f59e0b' },
      ]

  const socialLinks = settings?.socialLinks || {}

  return {
    greeting,
    fullName,
    nameAmharic,
    badge,
    fullText,
    introduction,
    profilePhotoUrl,
    profilePhotoAlt,
    stats,
    socialLinks,
    isAm,
  }
}
