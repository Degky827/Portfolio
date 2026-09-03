import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import defaultCVData from '../../../shared/data/cvData'
import CVSidebar from './CVSidebar'
import CVMain from './CVMain'
import CVDownloadButton from './components/CVDownloadButton'

export default function CVPage({ data }) {
  const cvData = data || defaultCVData
  const { personal } = cvData
  const cvRef = useRef(null)

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

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="cv-page"
      aria-label={`${personal.name} — Curriculum Vitae`}
    >
      <CVDownloadButton targetRef={cvRef} name={personal.name} />

      <div className="cv-container" ref={cvRef}>
        <CVSidebar data={cvData} />
        <CVMain data={cvData} />
      </div>
    </motion.main>
  )
}
