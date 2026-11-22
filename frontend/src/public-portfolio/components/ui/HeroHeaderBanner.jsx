import { memo } from 'react'

/**
 * HeroHeaderBanner
 *
 * Exact 3D Title & Subtitle Banner matching Image 1:
 * - 3D Extruded "Desalegn Kasaye" in royal/electric blue gradient with specular bevel & drop shadow
 * - Subtitle banner with Flutter Logo, "Fullstack", divider "|", code icon "</>", and "Flutter Developer"
 * - Soft curved underline shelf matching Image 1
 */
function HeroHeaderBanner({ name = 'Desalegn Kasaye' }) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center select-none pt-2 sm:pt-4 pb-1">
      {/* ── 3D Extruded Name: "Desalegn Kasaye" matching Image 1 ── */}
      <div className="relative inline-flex flex-col items-center">
        <h1
          className="font-black tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-tight"
          style={{
            background: 'linear-gradient(180deg, #60A5FA 0%, #1D4ED8 45%, #0B2568 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `
              drop-shadow(0 2px 0 #071948)
              drop-shadow(0 4px 0 #05143A)
              drop-shadow(0 6px 0 #040F2C)
              drop-shadow(0 8px 1px rgba(0, 0, 0, 0.25))
              drop-shadow(0 14px 18px rgba(11, 37, 104, 0.45))
            `,
            transform: 'perspective(600px) rotateX(6deg)',
          }}
        >
          {name}
        </h1>

        {/* Soft curved underline shelf / shadow arc matching Image 1 */}
        <div
          className="w-[110%] h-3 mt-1 rounded-[100%] bg-gradient-to-r from-transparent via-[#0B2568]/30 to-transparent blur-[3px]"
          aria-hidden="true"
        />
      </div>

      {/* ── Subtitle Banner: [</>] Fullstack | [Flutter] Flutter Developer ── */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-3 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 shadow-sm">
        {/* </> Code Icon for Fullstack */}
        <span className="font-mono font-bold text-[#0284C7] text-base sm:text-xl lg:text-[22px] drop-shadow-sm select-none">
          &lt;/&gt;
        </span>

        {/* Fullstack */}
        <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-xl lg:text-[22px] tracking-tight">
          Fullstack
        </span>

        {/* Divider | */}
        <span className="text-slate-400 dark:text-slate-500 font-light text-base sm:text-xl select-none">
          |
        </span>

        {/* Flutter Logo for Flutter Developer */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-sm"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Flutter logo"
        >
          <path d="M14.314 0L2.3 12l3.7 3.7L21.714 0h-7.4z" fill="#02569B" />
          <path d="M14.314 10.286L8.457 16.143 14.314 22h7.4l-9.543-9.571 2.143-2.143z" fill="#0175C2" />
          <path d="M8.457 16.143l3.714 3.714 2.143-2.143-3.714-3.714z" fill="#54C5F8" />
        </svg>

        {/* Flutter Developer */}
        <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-xl lg:text-[22px] tracking-tight">
          Flutter Developer
        </span>
      </div>
    </div>
  )
}

export default memo(HeroHeaderBanner)
