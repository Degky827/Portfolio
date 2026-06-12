import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), [])

  const value = useMemo(
    () => ({ mobileOpen, collapsed, toggleMobile, closeMobile, toggleCollapsed }),
    [mobileOpen, collapsed, toggleMobile, closeMobile, toggleCollapsed],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
