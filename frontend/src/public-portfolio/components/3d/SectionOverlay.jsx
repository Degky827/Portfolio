import { useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { X, Monitor, Keyboard, Cpu, Volume2, Home, Briefcase, Quote, FileText } from 'lucide-react'
import { useWorkspace } from './WorkspaceContext'

const Hero = lazy(() => import('../../pages/sections/Hero'))
const About = lazy(() => import('../../pages/sections/About'))
const Skills = lazy(() => import('../../pages/sections/Skills'))
const Experience = lazy(() => import('../../pages/sections/Experience'))
const Projects = lazy(() => import('../../pages/sections/Projects'))
const Testimonials = lazy(() => import('../../pages/sections/Testimonials'))
const Contact = lazy(() => import('../../pages/sections/Contact'))
const CVPage = lazy(() => import('../../pages/cv/CVPage'))

const SECTION_CONFIG = {
  home: {
    icon: Home,
    label: 'Home',
    color: '#6366f1',
    Component: Hero,
    seoTitle: 'Home - Portfolio',
    seoDescription: 'Welcome to my developer portfolio.',
  },
  about: {
    icon: Monitor,
    label: 'About Me',
    color: '#8b5cf6',
    Component: About,
    seoTitle: 'About - Portfolio',
    seoDescription: 'Learn about my background, education, and professional journey.',
  },
  skills: {
    icon: Keyboard,
    label: 'Skills & Expertise',
    color: '#22d3ee',
    Component: Skills,
    seoTitle: 'Skills - Portfolio',
    seoDescription: 'Explore my technical skills, certifications, and expertise.',
  },
  experience: {
    icon: Briefcase,
    label: 'Experience',
    color: '#f59e0b',
    Component: Experience,
    seoTitle: 'Experience - Portfolio',
    seoDescription: 'View my professional experience and work history.',
  },
  projects: {
    icon: Cpu,
    label: 'Projects',
    color: '#6366f1',
    Component: Projects,
    seoTitle: 'Projects - Portfolio',
    seoDescription: 'View my web and mobile development projects.',
  },
  testimonials: {
    icon: Quote,
    label: 'Testimonials',
    color: '#0a66c2',
    Component: Testimonials,
    seoTitle: 'Testimonials - Portfolio',
    seoDescription: 'Read professional recommendations and testimonials.',
  },
  contact: {
    icon: Volume2,
    label: 'Get In Touch',
    color: '#a78bfa',
    Component: Contact,
    seoTitle: 'Contact - Portfolio',
    seoDescription: 'Get in touch with me for collaborations and inquiries.',
  },
  cv: {
    icon: FileText,
    label: 'CV / Resume',
    color: '#4F46E5',
    Component: CVPage,
    seoTitle: 'CV - Desalegn Kasaye',
    seoDescription: 'Professional CV of Desalegn Kasaye, Full-Stack Developer.',
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
        className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-[#1a1a2e] shadow-2xl overflow-hidden flex flex-col"
        style={{ opacity: 0, transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a2e] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
              {Icon && <Icon size={20} />}
            </div>
            <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
              {config.label}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            style={{ color: 'var(--text-primary)' }}
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
