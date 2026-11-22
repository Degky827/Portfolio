import { memo } from 'react'

/**
 * HeroHeaderBanner
 *
 * Exact 3D Title & Subtitle Banner matching Image 1:
 * - 3D Extruded "Desalegn Kasaye" in royal/electric blue with clean specular bevel & drop shadow
 * - Subtitle: [</>] Fullstack | [Flutter Logo] Flutter Developer
 * - Soft ground reflection arc underneath matching Image 1
 */
function HeroHeaderBanner({ name = 'Desalegn Kasaye' }) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center select-none pt-2 sm:pt-4 pb-0">
      {/* ── 3D Extruded Name: "Desalegn Kasaye" matching Image 1 ── */}
      <div className="relative inline-flex flex-col items-center">
        <h1
          className="font-black tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-[78px] leading-tight select-none"
          style={{
            background: 'linear-gradient(180deg, #53A5FF 0%, #1668E8 40%, #0B46A8 75%, #082F78 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `
              drop-shadow(0 1px 0 #072a6b)
              drop-shadow(0 2px 0 #052054)
              drop-shadow(0 3px 0 #041940)
              drop-shadow(0 5px 6px rgba(4, 25, 64, 0.35))
              drop-shadow(0 10px 14px rgba(7, 42, 107, 0.25))
            `,
            transform: 'perspective(600px) rotateX(4deg)',
          }}
        >
          {name}
        </h1>

        {/* Soft ground reflection arc underneath matching Image 1 */}
        <div
          className="w-[110%] h-2.5 mt-0.5 rounded-[100%] bg-gradient-to-r from-transparent via-[#0B46A8]/25 to-transparent blur-[3px]"
          aria-hidden="true"
        />
      </div>

      {/* ── Subtitle Banner: [</>] Fullstack | [Flutter Logo] Flutter Developer ── */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-2.5 px-4 sm:px-6 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 shadow-sm">
        {/* </> Code Icon for Fullstack */}
        <span className="font-mono font-bold text-[#0084FF] text-base sm:text-xl lg:text-[22px] drop-shadow-sm select-none">
          &lt;/&gt;
        </span>

        {/* Fullstack */}
        <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg lg:text-[20px] tracking-tight">
          Fullstack
        </span>

        {/* Divider | */}
        <span className="text-slate-300 dark:text-slate-600 font-light text-base sm:text-lg select-none px-0.5">
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
        <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg lg:text-[20px] tracking-tight">
          Flutter Developer
        </span>
      </div>
    </div>
  )
}

export default memo(HeroHeaderBanner)
