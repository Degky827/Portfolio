import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLES_HIERARCHY = {
  super_admin: ['super_admin', 'admin', 'editor'],
  admin: ['admin', 'editor'],
  editor: ['editor'],
}

export function canAccess(userRole, allowedRoles) {
  if (!userRole) return false
  const userRoles = ROLES_HIERARCHY[userRole] || [userRole]
  return allowedRoles.some((role) => userRoles.includes(role))
}

export default function RoleGuard({ children, roles = [] }) {
  const { userRole } = useAuth()

  if (!canAccess(userRole, roles)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}
