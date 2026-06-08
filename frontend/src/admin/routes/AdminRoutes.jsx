import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../components/AdminLayout'
import Dashboard from '../pages/Dashboard'
import Analytics from '../pages/Analytics'
import Projects from '../pages/Projects'
import ProjectForm from '../pages/ProjectForm'
import PlaceholderPage from '../pages/PlaceholderPage'

const placeholderPages = [
  { path: 'certificates', title: 'Certificates', description: 'Manage your certificates and credentials' },
  { path: 'skills', title: 'Skills', description: 'Manage your skills and technologies' },
  { path: 'home', title: 'Home', description: 'Edit your homepage content' },
  { path: 'about', title: 'About', description: 'Edit your about section' },
  { path: 'contact', title: 'Contact', description: 'Manage contact form and information' },
  { path: 'footer', title: 'Footer', description: 'Edit your footer content' },
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

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectForm />} />
        {placeholderPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<PlaceholderPage title={page.title} description={page.description} />}
          />
        ))}
      </Routes>
    </AdminLayout>
  )
}
