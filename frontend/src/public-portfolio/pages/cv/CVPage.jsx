import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import defaultCVData from '../../../shared/data/cvData'
import CVSidebar from './CVSidebar'
import CVMain from './CVMain'
import CVDownloadButton from './components/CVDownloadButton'
import { getCVContent } from '../../../shared/services/cvService'
import { getNavbarSettings } from '../../../shared/services/navigationService'
import { usePublicSocket } from '../../../shared/context/PublicSocketContext'

export default function CVPage({ data }) {
  const [cvData, setCvData] = useState(data || defaultCVData)
  const [cvSettings, setCvSettings] = useState({ cvDownloadEnabled: true, cvPrintEnabled: true })
  const { personal } = cvData
  const cvRef = useRef(null)
  const { on, off } = usePublicSocket()

  useEffect(() => {
    if (!data) {
      getCVContent()
        .then(res => {
          if (res.content && (res.content.personal?.name || res.content.summary)) {
            setCvData(res.content)
          }
        })
        .catch(() => {})
    }
    getNavbarSettings()
      .then(res => {
        const s = res.settings || res
        setCvSettings({
          cvDownloadEnabled: s.cvDownloadEnabled !== false,
          cvPrintEnabled: s.cvPrintEnabled !== false,
        })
      })
      .catch(() => {})
  }, [data])

  useEffect(() => {
    const handler = (payload) => {
      if (payload?.type === 'navbar-settings') {
        setCvSettings({
          cvDownloadEnabled: payload.data?.cvDownloadEnabled !== false,
          cvPrintEnabled: payload.data?.cvPrintEnabled !== false,
        })
        return
      }
      getCVContent()
        .then(res => {
          if (res.content && (res.content.personal?.name || res.content.summary)) {
            setCvData(res.content)
          }
        })
        .catch(() => {})
    }
    on('content:updated', handler)
    return () => off('content:updated', handler)
  }, [on, off])

  useEffect(() => {
    document.title = `${personal.name} | ${personal.title} CV`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        `Professional CV/Resume of ${personal.name}, ${personal.title}. View experience, skills, projects, and education.`
      )
    }
  }, [personal.name, personal.title])

  const showActions = cvSettings.cvDownloadEnabled || cvSettings.cvPrintEnabled

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="cv-page"
      aria-label={`${personal.name} — Curriculum Vitae`}
    >
      {showActions && (
        <CVDownloadButton
          targetRef={cvRef}
          name={personal.name}
          showDownload={cvSettings.cvDownloadEnabled}
          showPrint={cvSettings.cvPrintEnabled}
        />
      )}

      <div className="cv-container" ref={cvRef}>
        <CVSidebar data={cvData} />
        <CVMain data={cvData} />
      </div>
    </motion.main>
  )
}
