import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../authentication/AuthContext'
import RoleGuard from '../authentication/RoleGuard'
import ProtectedRoute from '../authentication/ProtectedRoute'
import AdminLayout from '../layout/AdminLayout'

const Dashboard = lazy(() => import('../dashboard/Dashboard'))
const Analytics = lazy(() => import('../analytics-management/Analytics'))
const ActivityLogs = lazy(() => import('../activity-management/ActivityLogs'))
const Projects = lazy(() => import('../projects-management/ProjectsList'))
const ProjectForm = lazy(() => import('../projects-management/ProjectForm'))
const Skills = lazy(() => import('../skills-management/SkillsList'))
const SkillForm = lazy(() => import('../skills-management/SkillForm'))
const HomeContent = lazy(() => import('../homepage-management/HomeContent'))
const NavigationManagement = lazy(() => import('../navigation-management/NavigationManagement'))
const AboutContent = lazy(() => import('../about-management/AboutContent'))
const ContactContent = lazy(() => import('../contact-management/ContactContent'))
const MessageCenter = lazy(() => import('../contact-management/MessageCenter'))
const FooterContent = lazy(() => import('../footer-management/FooterContent'))
const MediaLibrary = lazy(() => import('../media-management/MediaLibrary'))
const ImportExport = lazy(() => import('../import-export/ImportExport'))
const Maintenance = lazy(() => import('../maintenance/Maintenance'))
const UserManagement = lazy(() => import('../user-management/UserManagement'))
const Profile = lazy(() => import('../profile-management/Profile'))
const ThemeSettings = lazy(() => import('../settings-management/ThemeSettings'))
const SystemConfig = lazy(() => import('../system-config/SystemConfig'))
const Backup = lazy(() => import('../backup-management/Backup'))
const CustomPagesList = lazy(() => import('../custom-pages-management/CustomPagesList'))
const CustomPageForm = lazy(() => import('../custom-pages-management/CustomPageForm'))

export default function AdminRoutes() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
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
      </Suspense>
    </ProtectedRoute>
  )
}
