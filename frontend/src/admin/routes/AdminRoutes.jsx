import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import RoleGuard from '../components/RoleGuard'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminLayout from '../components/AdminLayout'
import Dashboard from '../pages/Dashboard'
import Analytics from '../pages/Analytics'
import ActivityLogs from '../pages/ActivityLogs'
import NotificationsPage from '../pages/Notifications'
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
import MediaLibrary from '../pages/MediaLibrary'
import ImportExport from '../pages/ImportExport'
import Maintenance from '../pages/Maintenance'
import UserManagement from '../pages/UserManagement'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import ThemeSettings from '../pages/ThemeSettings'
import SystemConfig from '../pages/SystemConfig'
import Backup from '../pages/Backup'

export default function AdminRoutes() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="analytics"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <Analytics />
              </RoleGuard>
            }
          />
          <Route
            path="activity-logs"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <ActivityLogs />
              </RoleGuard>
            }
          />
          <Route
            path="notifications"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <NotificationsPage />
              </RoleGuard>
            }
          />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id" element={<ProjectForm />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="certificates/new" element={<CertificateForm />} />
          <Route path="certificates/:id" element={<CertificateForm />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route
            path="import-export"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <ImportExport />
              </RoleGuard>
            }
          />
          <Route
            path="maintenance"
            element={
              <RoleGuard roles={['super_admin']}>
                <Maintenance />
              </RoleGuard>
            }
          />
          <Route path="skills" element={<Skills />} />
          <Route path="skills/new" element={<SkillForm />} />
          <Route path="skills/:id" element={<SkillForm />} />
          <Route path="home" element={<HomeContent />} />
          <Route path="about" element={<AboutContent />} />
          <Route path="contact" element={<ContactContent />} />
          <Route path="footer" element={<FooterContent />} />
          <Route
            path="users"
            element={
              <RoleGuard roles={['super_admin']}>
                <UserManagement />
              </RoleGuard>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route
            path="settings"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <Settings />
              </RoleGuard>
            }
          />
          <Route
            path="theme"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <ThemeSettings />
              </RoleGuard>
            }
          />
          <Route
            path="system-config"
            element={
              <RoleGuard roles={['super_admin']}>
                <SystemConfig />
              </RoleGuard>
            }
          />
          <Route
            path="backup"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <Backup />
              </RoleGuard>
            }
          />
        </Route>
      </Routes>
    </ProtectedRoute>
  )
}
