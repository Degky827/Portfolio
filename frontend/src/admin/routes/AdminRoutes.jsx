import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../components/AdminLayout'
import Dashboard from '../pages/Dashboard'
import Analytics from '../pages/Analytics'
import Projects from '../pages/Projects'
import ProjectForm from '../pages/ProjectForm'
import Certificates from '../pages/Certificates'
import CertificateForm from '../pages/CertificateForm'
import Skills from '../pages/Skills'
import SkillForm from '../pages/SkillForm'
import HomeContent from '../pages/HomeContent'
import AboutContent from '../pages/AboutContent'
import ContactContent from '../pages/ContactContent'
import FooterContent from '../pages/FooterContent'
import PlaceholderPage from '../pages/PlaceholderPage'

const placeholderPages = [
  { path: 'settings', title: 'Settings', description: 'Configure your portfolio settings' },
]

export default function AdminRoutes() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      logout()
      navigate('/login', { state: { from: location.pathname }, replace: true })
    }
  }, [isAuthenticated, logout, navigate, location.pathname])

  if (!isAuthenticated) return null

  function renderPlaceholder(page) {
    return (
      <Route
        key={page.path}
        path={page.path}
        element={<PlaceholderPage title={page.title} description={page.description} />}
      />
    )
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectForm />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="certificates/new" element={<CertificateForm />} />
        <Route path="certificates/:id" element={<CertificateForm />} />
        <Route path="skills" element={<Skills />} />
        <Route path="skills/new" element={<SkillForm />} />
        <Route path="skills/:id" element={<SkillForm />} />
        <Route path="home" element={<HomeContent />} />
        <Route path="about" element={<AboutContent />} />
        <Route path="contact" element={<ContactContent />} />
        <Route path="footer" element={<FooterContent />} />
        {placeholderPages.map(renderPlaceholder)}
      </Route>
    </Routes>
  )
}
