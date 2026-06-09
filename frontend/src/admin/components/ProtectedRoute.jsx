import { Navigate, useLocation } from 'react-router-dom'

const AUTH_FLAG = 'opencode_auth'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const cookieAuth = localStorage.getItem(AUTH_FLAG) === 'true'
  const user = (() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })()
  const location = useLocation()

  if (!(token || cookieAuth) || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
