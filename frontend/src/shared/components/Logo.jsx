import { motion } from 'framer-motion'

export default function Logo({ settings, showText = true, linkTo = '#home', onNavClick, className = '' }) {
  const logoImage = settings?.logoImage || ''
  const logoText = settings?.logoText || ''
  const brandName = settings?.brandName || 'DESALEGN'
  const nameAmharic = settings?.nameAmharic || ''
  const logoEnabled = settings?.logoEnabled !== false

  const handleClick = (e) => {
    if (onNavClick) {
      onNavClick(e)
    }
  }

  if (!logoEnabled) return null

  const content = (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {logoImage ? (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center shadow-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
          <img
            src={logoImage.startsWith('http') ? logoImage : `http://localhost:5000${logoImage}`}
            alt={logoText || brandName}
            className="w-full h-full object-contain p-0.5"
          />
        </div>
      ) : (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg bg-[#6366f1] text-white text-[10px] sm:text-xs font-black">
          {nameAmharic || brandName.charAt(0)}
        </div>
      )}
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
