import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { getFooterContent } from '../../shared/services/footerService'
import {
  FaGithub, FaLinkedin, FaTelegram, FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaDiscord, FaTwitter,
} from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { FaXTwitter } from 'react-icons/fa6'

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  telegram: FaTelegram,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  discord: FaDiscord,
  whatsapp: FaWhatsapp,
  twitter: FaXTwitter,
  x: FaXTwitter,
  email: MdEmail,
}

function getSocialIcon(platform) {
  const key = platform?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
  return socialIconMap[key] || null
}

function getPhoneHref(phone, protocol, customUrl) {
  if (!phone) return '#'
  switch (protocol) {
    case 'whatsapp':
      return `https://wa.me/${phone.replace(/[^+\d]/g, '').replace('+', '')}`
    case 'telegram': {
      const u = phone.replace(/^@/, '').trim()
      return u ? `https://t.me/${u}` : '#'
    }
    case 'custom':
      return customUrl || '#'
    default:
      return `tel:${phone.replace(/[^+\d]/g, '')}`
  }
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [content, setContent] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getFooterContent()
        setContent(content)
      } catch {
        /* fall back to hardcoded */
      }
    })()
  }, [])

  const brandName = content?.brandName || 'DESALEGN'
  const brandDescription = content?.brandDescription || 'Building robust digital experiences through modern web development and secure network infrastructure.'
  const footerLogo = content?.footerLogo || ''

  const locationHeadline = content?.locationHeadline || 'Bahirdar, Ethiopia'
  const subLocation = content?.subLocation || 'Amhara Region'
  const locationMapUrl = content?.locationMapUrl || ''
  const emailAddress = content?.emailAddress || 'desalegnky827@gmail.com'
  const phoneNumber = content?.phoneNumber || '+251 908 720 092'
  const phoneProtocol = content?.phoneProtocol || 'tel'
  const phoneCustomUrl = content?.phoneCustomUrl || ''

  const copyrightText = content?.copyrightText || `© ${currentYear} ${brandName}. Built with passion and precision.`
  const visualSeparator = content?.visualSeparator || ''
  const attributionText = content?.attributionText || ''

  const socialLinks = content?.socialLinks?.filter(s => s.active !== false) || []
  const navigationItems = content?.navigation || []

  const scrollToSection = (e, targetId) => {
    e.preventDefault()
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const target = document.getElementById(targetId)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#0B1120] text-white pt-16 sm:pt-20 pb-8 sm:pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg className="relative block w-[calc(100%+1.3px)] h-[50px] sm:h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21 0 0 0 321.39,56.44Z" className="fill-gray-50 dark:fill-[#0B1120] transition-colors duration-500" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 md:gap-16 mb-12 sm:mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 text-2xl sm:text-3xl font-black mb-4 sm:mb-6 md:mb-8">
              {footerLogo ? (
                <img src={footerLogo.startsWith('http') ? footerLogo : `http://localhost:5000${footerLogo}`} alt={brandName} className="h-10 sm:h-12 w-auto" />
              ) : (
                <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg bg-[#6366f1] text-white text-[11px] sm:text-sm font-black">
                  {brandName.charAt(0)}
                </span>
              )}
              <span className="tracking-tight uppercase">{brandName}</span>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-sm mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              {brandDescription}
            </p>
            <div className="flex gap-3 sm:gap-4 md:gap-5">
              {socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.platform)
                if (!Icon) return null
                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm shadow-white/5"
                    title={link.platform}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          {navigationItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 mb-6 sm:mb-8 md:mb-10">Explore</h4>
              <ul className="space-y-3 sm:space-y-4 md:space-y-6">
                {navigationItems.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault()
                        const targetId = item.url.replace('#', '')
                        if (targetId === 'home') {
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        } else {
                          const target = document.getElementById(targetId)
                          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                      className="text-sm sm:text-base md:text-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2 sm:gap-3 group font-medium sm:font-bold"
                    >
                      <span className="w-0 sm:w-0 group-hover:w-3 h-0.5 sm:h-1 bg-primary rounded-full transition-all duration-300" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 mb-6 sm:mb-8 md:mb-10">Contact</h4>
            <ul className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-400">
              {locationHeadline && (
                <li className="flex items-start gap-3 sm:gap-4">
                  <span className="text-lg sm:text-xl md:text-2xl">📍</span>
                  <div>
                    <span className="text-sm sm:text-base md:text-lg font-medium leading-tight block">
                      {locationHeadline}
                    </span>
                    {subLocation && <span className="text-xs text-white/50">{subLocation}</span>}
                    {locationMapUrl && (
                      <a href={locationMapUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:text-white transition-colors mt-0.5 block">
                        View on Google Maps ↗
                      </a>
                    )}
                  </div>
                </li>
              )}
              {emailAddress && (
                <li className="flex items-start gap-3 sm:gap-4">
                  <span className="text-lg sm:text-xl md:text-2xl">📧</span>
                  <a href={`mailto:${emailAddress}`} className="text-sm sm:text-base md:text-lg font-medium hover:text-white transition-colors break-all">{emailAddress}</a>
                </li>
              )}
              {phoneNumber && (
                <li className="flex items-start gap-3 sm:gap-4">
                  <span className="text-lg sm:text-xl md:text-2xl">📱</span>
                  <a
                    href={getPhoneHref(phoneNumber, phoneProtocol, phoneCustomUrl)}
                    target={phoneProtocol !== 'tel' ? '_blank' : undefined}
                    rel={phoneProtocol !== 'tel' ? 'noopener noreferrer' : undefined}
                    className="text-sm sm:text-base md:text-lg font-medium hover:text-white transition-colors"
                  >
                    {phoneNumber}
                  </a>
                </li>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 sm:pt-10 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 text-gray-500 text-xs sm:text-sm font-medium sm:font-bold uppercase tracking-wider"
        >
          <p>{copyrightText}</p>
          {visualSeparator && <span>{visualSeparator}</span>}
          {attributionText && <span>{attributionText}</span>}

          {/* Back to Top Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-primary flex items-center justify-center transition-colors"
            title="Back to top"
          >
            <ArrowUp size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}
