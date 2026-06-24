import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function ProtectedRoute({ role, children }) {
  const { currentUser, activeRole, setActiveRole } = useApp()
  const location = useLocation()

  // Any signed-in member may use either interface. Visiting a dashboard
  // simply switches their active interface to match.
  useEffect(() => {
    if (currentUser && role && activeRole !== role) {
      setActiveRole(role)
    }
  }, [currentUser, role, activeRole, setActiveRole])

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}
