import { useEffect, useRef, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { X, Monitor, Keyboard, Cpu, Volume2 } from 'lucide-react'
import { useWorkspace } from './WorkspaceContext'

const About = lazy(() => import('../../pages/sections/About'))
const Skills = lazy(() => import('../../pages/sections/Skills'))
const Projects = lazy(() => import('../../pages/sections/Projects'))
const Contact = lazy(() => import('../../pages/sections/Contact'))

const SECTION_CONFIG = {
  about: {
    icon: Monitor,
    labelKey: 'workspace.sectionAbout',
    color: '#8b5cf6',
    Component: About,
    seoTitle: 'About - Portfolio',
    seoDescription: 'Learn about my background, education, and professional journey.',
  },
  skills: {
    icon: Keyboard,
    labelKey: 'workspace.sectionSkills',
    color: '#22d3ee',
    Component: Skills,
    seoTitle: 'Skills - Portfolio',
    seoDescription: 'Explore my technical skills, certifications, and expertise.',
  },
  projects: {
    icon: Cpu,
    labelKey: 'workspace.sectionProjects',
    color: '#6366f1',
    Component: Projects,
    seoTitle: 'Projects - Portfolio',
    seoDescription: 'View my web and mobile development projects.',
  },
  contact: {
    icon: Volume2,
    labelKey: 'workspace.sectionContact',
    color: '#a78bfa',
    Component: Contact,
    seoTitle: 'Contact - Portfolio',
    seoDescription: 'Get in touch with me for collaborations and inquiries.',
  },
}

function useSectionSEO(activeSection) {
  useEffect(() => {
    const prevTitle = document.title
    const config = activeSection ? SECTION_CONFIG[activeSection] : null

    if (config) {
      document.title = config.seoTitle

      let metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.dataset.workspacePrevious = metaDesc.content
        metaDesc.content = config.seoDescription
      }
    }

    return () => {
      document.title = prevTitle
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc && metaDesc.dataset.workspacePrevious) {
        metaDesc.content = metaDesc.dataset.workspacePrevious
        delete metaDesc.dataset.workspacePrevious
      }
    }
  }, [activeSection])
}

export default function SectionOverlay() {
  const { t } = useTranslation()
  const { activeSection, closeSection } = useWorkspace()
  const panelRef = useRef(null)
  const backdropRef = useRef(null)
  const contentRef = useRef(null)

  const config = activeSection ? SECTION_CONFIG[activeSection] : null
  const Icon = config?.icon

  useSectionSEO(activeSection)

  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return

    if (activeSection) {
      gsap.killTweensOf([panelRef.current, backdropRef.current])

      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )

      gsap.fromTo(
        panelRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
      )

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            delay: 0.2,
            ease: 'power2.out',
          }
        )
      }
    }
  }, [activeSection])

  const handleClose = () => {
    if (!panelRef.current || !backdropRef.current) return

    gsap.to(panelRef.current, {
      x: '100%',
      opacity: 0,
      duration: 0.35,
      ease: 'power3.in',
    })

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: closeSection,
    })
  }

  if (!activeSection || !config) return null

  const { Component } = config

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto" style={{ position: 'fixed' }}>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        style={{ opacity: 0 }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-[#0a0a1a] shadow-2xl overflow-hidden flex flex-col"
        style={{ opacity: 0, transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a1a] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
              {Icon && <Icon size={20} />}
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
              {t(config.labelKey)}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            }
          >
            <Component />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
