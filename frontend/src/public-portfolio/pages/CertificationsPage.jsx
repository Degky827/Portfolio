import { memo } from 'react'
import CertificateGallery from '../components/about/CertificateGallery'
import GuillocheWaves from '../components/ui/GuillocheWaves'
import SectionDepth from '../shared/SectionDepth'

function CertificationsPage() {
  return (
    <SectionDepth sectionId="certifications" className="w-full">
      <section
        id="certifications"
        className="relative min-h-screen py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden"
        aria-label="Certifications section"
      >
        {/* Monochromatic Guilloche Ribbon Wave Background (matching About & Experience pages) */}
        <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

        {/* Subtle background glow orbs matching all other pages */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px] pointer-events-none" />

        {/* Main Certifications Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <CertificateGallery />
        </div>
      </section>
    </SectionDepth>
  )
}

export default memo(CertificationsPage)
