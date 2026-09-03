import { motion } from 'framer-motion'
import { getMediaUrl } from '../services/api'

export default function Logo({ settings, showText = true, linkTo = '#home', onNavClick, className = '' }) {
  const logoImage = settings?.logoImage || ''
  const logoSvg = settings?.logoSvg || ''
  const logoText = settings?.logoText || ''
  const brandName = settings?.brandName || 'DESALEGN'
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
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`} style={{ justifyContent: logoPosition }}>
      <div
        className="overflow-hidden flex items-center justify-center transition-all duration-200"
        style={iconStyle}
      >
        {logoSvg ? (
          <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: logoSvg }} />
        ) : logoImage ? (
          <img
            src={getMediaUrl(logoImage)}
            alt={logoText || brandName}
            className="w-full h-full object-contain p-0.5"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 border border-indigo-400/40 text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-indigo-500/20">
            {brandName.substring(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      {showText && (
        <span
          className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1"
        >
          {logoText || (brandName === 'DESALEGN' ? 'DK' : brandName)}
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block ml-0.5" />
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
