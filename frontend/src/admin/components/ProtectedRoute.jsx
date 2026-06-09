import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const user = (() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })()
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
