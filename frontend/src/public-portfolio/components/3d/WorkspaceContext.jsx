import { createContext, useContext, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const WorkspaceContext = createContext(null)

const SECTION_MAP = {
  home: { object: 'mouse', hash: '#home' },
  about: { object: 'monitor', hash: '#about' },
  skills: { object: 'keyboard', hash: '#skills' },
  experience: { object: 'speaker-right', hash: '#experience' },
  projects: { object: 'pc', hash: '#projects' },
  testimonials: { object: 'floating-testimonials', hash: '#testimonials' },
  contact: { object: 'speaker', hash: '#contact' },
  cv: { object: 'floating-cv', hash: '#cv' },
}

const OBJECT_TO_SECTION = Object.fromEntries(
  Object.entries(SECTION_MAP).map(([section, { object }]) => [object, section])
)

function getSectionFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean)
  const lastPart = parts[parts.length - 1]
  if (lastPart && SECTION_MAP[lastPart]) {
    return lastPart
  }
  return null
}

export function WorkspaceProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const activeSection = getSectionFromPath(location.pathname)

  const openSection = useCallback(
    (sectionName) => {
      if (SECTION_MAP[sectionName]) {
        navigate(`/workspace/${sectionName}`, { replace: false })
      }
    },
    [navigate]
  )

  const closeSection = useCallback(() => {
    navigate('/workspace', { replace: false })
  }, [navigate])

  const openByObject = useCallback(
    (objectName) => {
      const sectionName = OBJECT_TO_SECTION[objectName]
      if (sectionName) {
        openSection(sectionName)
      }
    },
    [openSection]
  )

  return (
    <WorkspaceContext.Provider
      value={{ activeSection, openSection, closeSection, openByObject, SECTION_MAP }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  return useContext(WorkspaceContext)
}

export { SECTION_MAP, OBJECT_TO_SECTION }
