import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Admin() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMetrics = useCallback(async () => {
    try {
      const { data } = await api.get('/analytics/metrics')
      setMetrics(data)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout()
        navigate('/login', { replace: true })
        return
      }
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    fetchMetrics()
  }, [isAuthenticated, navigate, fetchMetrics])

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button
            onClick={fetchMetrics}
            className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { totalCount, recentVisits } = metrics || {}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-900 to-purple-700 text-white text-[9px] font-black flex items-center justify-center shadow-lg">
              ደካ
            </div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {user?.email}
            </span>
            <button
              onClick={() => { logout(); navigate('/login', { replace: true }) }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl">👥</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Views
              </p>
              <p className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
                {totalCount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">People who have visited your portfolio</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Visit History
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              When / Where / Who — the last {recentVisits?.length || 0} visits
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="text-left px-4 sm:px-6 py-3">When</th>
                  <th className="text-left px-4 sm:px-6 py-3">Who</th>
                  <th className="text-left px-4 sm:px-6 py-3">Where</th>
                  <th className="text-left px-4 sm:px-6 py-3 hidden md:table-cell">Device</th>
                  <th className="text-left px-4 sm:px-6 py-3 hidden lg:table-cell">Browser / OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {recentVisits?.length ? (
                  recentVisits.map((visit) => (
                    <tr
                      key={visit._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                        <span className="font-medium">
                          {new Date(visit.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {visit.visitorName}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-400">
                        {visit.location ? (
                          <span>
                            {[visit.location.city, visit.location.region, visit.location.country]
                              .filter(Boolean)
                              .join(', ') || 'Unknown'}
                          </span>
                        ) : (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {visit.deviceInfo?.deviceType || 'Unknown'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        {[visit.deviceInfo?.browser, visit.deviceInfo?.os].filter(Boolean).join(' / ') || 'Unknown'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No visits recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
