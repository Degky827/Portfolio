import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getMediaUrl } from '../services/api'

export default function Logo({ settings, showText = true, linkTo = '#home', onNavClick, className = '' }) {
  const { i18n } = useTranslation()
  const isAm = i18n.language === 'am'
  const logoImage = settings?.logoImage || ''
  const logoSvg = settings?.logoSvg || ''
  const logoText = settings?.logoText || ''
  const brandName = isAm ? (settings?.brandNameAm || settings?.brandName || 'DESALEGN') : (settings?.brandName || 'DESALEGN')
  const nameAmharic = settings?.nameAmharic || ''
  const logoEnabled = settings?.logoEnabled !== false
  const logoWidth = settings?.logoWidth || 40
  const logoHeight = settings?.logoHeight || 40
  const logoBorderRadius = settings?.logoBorderRadius ?? 8
  const logoBgColor = settings?.logoBgColor || 'transparent'
  const logoPosition = settings?.logoPosition || 'left'

  const handleClick = (e) => {
    if (onNavClick) {
      onNavClick(e)
    }
  }

  if (!logoEnabled) return null

  const iconStyle = {
    width: logoWidth + 'px',
    height: logoHeight + 'px',
    borderRadius: logoBorderRadius + 'px',
    backgroundColor: logoBgColor,
  }

  const content = (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`} style={{ justifyContent: logoPosition }}>
      <div className="overflow-hidden flex items-center justify-center shadow-lg border border-gray-200 dark:border-neutral-700" style={iconStyle}>
        {logoSvg ? (
          <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: logoSvg }} />
        ) : logoImage ? (
          <img
            src={getMediaUrl(logoImage)}
            alt={logoText || brandName}
            className="w-full h-full object-contain p-0.5"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#6366f1] text-white text-[10px] sm:text-xs font-black">
            {nameAmharic || brandName.charAt(0)}
          </div>
        )}
      </div>
      {showText && (
        <span
          className={`font-black tracking-tighter ${
            onNavClick
              ? 'text-xl sm:text-2xl text-gray-900 dark:text-[#F8FAFC]'
              : 'uppercase tracking-tight'
          }`}
        >
          {logoText || brandName}
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <motion.a
        href={linkTo}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="cursor-pointer"
      >
        {content}
      </motion.a>
    )
  }

  return content
}
