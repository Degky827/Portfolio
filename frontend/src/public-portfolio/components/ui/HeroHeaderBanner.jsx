import { memo } from 'react'

/**
 * HeroHeaderBanner
 *
 * Exact 3D Title & Subtitle Banner matching Target Reference Image:
 * - High-fidelity 3D Extruded vector typography for "Desalegn Kasaye" (immune to CSS background-clip box bugs)
 * - Specular royal-to-sky-blue gradient with physical stepped extrusion depth
 * - Subtitle: [Flutter Logo] Fullstack | [</>] Flutter Developer with clean typography
 */
function HeroHeaderBanner({ name = 'Desalegn Kasaye' }) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center select-none pt-0 sm:pt-0.5 pb-0 px-4">
      {/* ── 3D Extruded Name: "Desalegn Kasaye" (Proportionally sized, lifted near navbar) ── */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 1000 105"
          className="w-full h-auto max-h-[58px] sm:max-h-[74px] md:max-h-[86px] overflow-visible select-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={name}
        >
          <defs>
            {/* Specular royal-to-sky blue gradient matching Target Reference */}
            <linearGradient id="heroBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#67B8FF" />
              <stop offset="35%" stopColor="#2575F8" />
              <stop offset="70%" stopColor="#1458E0" />
              <stop offset="100%" stopColor="#0B3EAA" />
            </linearGradient>

            {/* Soft ground arc shadow filter */}
            <filter id="heroShadow" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#062568" floodOpacity="0.30" />
            </filter>
          </defs>

          {/* ── 3D Extruded Depth Layers (Stepped extrusion for true 3D look) ── */}
          <text
            x="500"
            y="82"
            textAnchor="middle"
            fill="#03102c"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="70"
            letterSpacing="-0.02em"
          >
            {name}
          </text>
          <text
            x="500"
            y="80"
            textAnchor="middle"
            fill="#051942"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="70"
            letterSpacing="-0.02em"
          >
            {name}
          </text>
          <text
            x="500"
            y="79"
            textAnchor="middle"
            fill="#092663"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="70"
            letterSpacing="-0.02em"
          >
            {name}
          </text>
          <text
            x="500"
            y="78"
            textAnchor="middle"
            fill="#0f398f"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="70"
            letterSpacing="-0.02em"
          >
            {name}
          </text>
          <text
            x="500"
            y="77"
            textAnchor="middle"
            fill="#174eb8"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="70"
            letterSpacing="-0.02em"
          >
            {name}
          </text>

          {/* ── Front Face with Gradient & Soft Drop Shadow ── */}
          <text
            x="500"
            y="76"
            textAnchor="middle"
            fill="url(#heroBlueGrad)"
            filter="url(#heroShadow)"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="70"
            letterSpacing="-0.02em"
          >
            {name}
          </text>
        </svg>

        {/* Soft ground reflection arc underneath */}
        <div
          className="w-[75%] max-w-[500px] h-2.5 -mt-1 rounded-[100%] bg-gradient-to-r from-transparent via-[#1458E0]/20 to-transparent blur-[3px]"
          aria-hidden="true"
        />
      </div>

      {/* ── Subtitle Banner matching Target Reference Image: [Flutter Logo] Fullstack | [</>] Flutter Developer ── */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-1 sm:mt-1.5 px-3 py-0.5 select-none">
        {/* Flutter Logo */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Flutter logo"
        >
          <path d="M14.314 0L2.3 12l3.7 3.7L21.714 0h-7.4z" fill="#02569B" />
          <path d="M14.314 10.286L8.457 16.143 14.314 22h7.4l-9.543-9.571 2.143-2.143z" fill="#0175C2" />
          <path d="M8.457 16.143l3.714 3.714 2.143-2.143-3.714-3.714z" fill="#00C8FF" />
        </svg>

        {/* Fullstack */}
        <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg md:text-[21px] tracking-tight">
          Fullstack
        </span>

        {/* Clean Divider | */}
        <span className="text-slate-300 dark:text-slate-600 font-light text-base sm:text-lg md:text-[21px] select-none px-0.5">
          |
        </span>

        {/* </> Code Icon for Flutter Developer */}
        <span className="font-mono font-black text-[#00A3FF] text-base sm:text-lg md:text-[21px] drop-shadow-sm select-none">
          &lt;/&gt;
        </span>

        {/* Flutter Developer */}
        <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg md:text-[21px] tracking-tight">
          Flutter Developer
        </span>
      </div>
    </div>
  )
}

export default memo(HeroHeaderBanner)
