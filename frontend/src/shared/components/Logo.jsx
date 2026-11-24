import { motion } from 'framer-motion'

export default function Logo({ settings, showText = true, linkTo = '#home', onNavClick, className = '' }) {
  const logoText = settings?.logoText || ''
  const brandName = settings?.brandName || 'DESALEGN'
  const logoEnabled = settings?.logoEnabled !== false
  const logoWidth = settings?.logoWidth || 40
  const logoHeight = settings?.logoHeight || 40
  const logoBorderRadius = settings?.logoBorderRadius ?? 10
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
        {/* Portfolio Logo: </> Code Icon (Electric Cyan to Blue) */}
        <div className="w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white font-mono font-black text-xs sm:text-sm tracking-tight shadow-md shadow-cyan-500/35 border border-cyan-400/40 select-none hover:scale-105 transition-transform">
          &lt;/&gt;
        </div>
      </div>
      {showText && (
        <span
          className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1 select-none"
        >
          {logoText || (brandName === 'DESALEGN' || brandName === 'DK' ? 'Desalegn Kasaye' : brandName)}
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
