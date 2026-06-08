import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye, Users, UserCheck, CalendarDays, ExternalLink, RefreshCw, ArrowRight, BarChart3 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get('/analytics/stats')
      setStats(data)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout()
        navigate('/login', { replace: true })
        return
      }
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    fetchStats()
  }, [isAuthenticated, navigate, fetchStats])

  if (!isAuthenticated) return null

  const statCards = [
    { title: 'Total Portfolio Views', value: stats?.totalCount, icon: Eye },
    { title: 'Unique Visitors', value: stats?.uniqueVisitors, icon: Users },
    { title: "Today's Visitors", value: stats?.todayCount, icon: UserCheck },
    { title: "This Month's Visitors", value: stats?.monthCount, icon: CalendarDays },
  ]

  const quickActions = [
    { label: 'View Analytics', icon: BarChart3, onClick: () => navigate('/admin/analytics'), color: 'text-primary bg-primary/10' },
    { label: 'Refresh Data', icon: RefreshCw, onClick: fetchStats, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
    { label: 'Visit Portfolio', icon: ExternalLink, onClick: () => window.open('/', '_blank'), color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Here is your portfolio overview."
        />
      </motion.div>

      {error && (
        <motion.div
          variants={itemVariants}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
        >
          {error}
          <button onClick={fetchStats} className="ml-3 underline font-medium">
            Retry
          </button>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} loading={loading} delay={i * 0.08} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-4 sm:px-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            ) : stats?.recentVisits?.length ? (
              stats.recentVisits.map((visit, i) => (
                <motion.div
                  key={visit._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="p-4 sm:px-6 py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {(visit.visitorName || 'A')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {visit.visitorName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {visit.location
                        ? [visit.location.city, visit.location.region, visit.location.country]
                            .filter(Boolean)
                            .join(', ')
                        : 'Unknown location'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatTimeAgo(visit.timestamp)}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400">No recent activity.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function formatTimeAgo(timestamp) {
  const now = Date.now()
  const diff = now - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}
