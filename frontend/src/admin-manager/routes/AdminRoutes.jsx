import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../authentication/AuthContext'
import RoleGuard from '../authentication/RoleGuard'
import ProtectedRoute from '../authentication/ProtectedRoute'
import AdminLayout from '../layout/AdminLayout'
import Dashboard from '../dashboard/Dashboard'
import Analytics from '../analytics-management/Analytics'
import ActivityLogs from '../activity-management/ActivityLogs'
import Projects from '../projects-management/ProjectsList'
import ProjectForm from '../projects-management/ProjectForm'
import Skills from '../skills-management/SkillsList'
import SkillForm from '../skills-management/SkillForm'
import HomeContent from '../homepage-management/HomeContent'
import NavigationManagement from '../navigation-management/NavigationManagement'
import AboutContent from '../about-management/AboutContent'
import ContactContent from '../contact-management/ContactContent'
import MessageCenter from '../contact-management/MessageCenter'
import FooterContent from '../footer-management/FooterContent'
import MediaLibrary from '../media-management/MediaLibrary'
import ImportExport from '../import-export/ImportExport'
import Maintenance from '../maintenance/Maintenance'
import UserManagement from '../user-management/UserManagement'
import Profile from '../profile-management/Profile'
import ThemeSettings from '../settings-management/ThemeSettings'
import SystemConfig from '../system-config/SystemConfig'
import Backup from '../backup-management/Backup'
import CustomPagesList from '../custom-pages-management/CustomPagesList'
import CustomPageForm from '../custom-pages-management/CustomPageForm'

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
            path="messages"
            element={
              <RoleGuard roles={['super_admin', 'admin']}>
                <MessageCenter />
              </RoleGuard>
            }
          />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id" element={<ProjectForm />} />
          <Route path="custom-pages" element={<CustomPagesList />} />
          <Route path="custom-pages/new" element={<CustomPageForm />} />
          <Route path="custom-pages/:id" element={<CustomPageForm />} />
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
          <Route path="navigation" element={<NavigationManagement />} />
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
