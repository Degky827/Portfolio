import { memo } from 'react'
import CertificateGallery from '../components/about/CertificateGallery'
import GuillocheWaves from '../components/ui/GuillocheWaves'

function CertificationsPage() {
  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <GuillocheWaves className="opacity-40" />
      </div>

      {/* Main Certifications Showcase */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <CertificateGallery />
      </div>
    </div>
  )
}

export default memo(CertificationsPage)
