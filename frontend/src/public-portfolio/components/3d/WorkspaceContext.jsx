import { createContext, useContext, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const WorkspaceContext = createContext(null)

const SECTION_MAP = {
  about: { object: 'monitor', hash: '#about' },
  skills: { object: 'keyboard', hash: '#skills' },
  projects: { object: 'pc', hash: '#projects' },
  contact: { object: 'speaker', hash: '#contact' },
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
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}

export { SECTION_MAP, OBJECT_TO_SECTION }
