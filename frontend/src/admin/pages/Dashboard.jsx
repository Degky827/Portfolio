import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Eye, Users, UserCheck, CalendarDays, ExternalLink, RefreshCw,
  ArrowRight, BarChart3, Clock, Globe, MapPin, Sparkles,
  Plus, Image, Award, Shield, FolderKanban,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good Morning', emoji: '☀️' }
  if (h < 17) return { text: 'Good Afternoon', emoji: '🌤️' }
  return { text: 'Good Evening', emoji: '🌙' }
}

const formatCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastLogin, setLastLogin] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('adminLastLogin')
    const now = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
    if (stored) {
      setLastLogin(stored)
    } else {
      localStorage.setItem('adminLastLogin', now)
      setLastLogin(now)
    }
  }, [])

  const greeting = getGreeting()
  const currentDate = formatCurrentDate()
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Admin'
  const roleDisplay = user?.role?.replace('_', ' ') || 'Admin'

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get('/analytics/stats')
      setStats(data)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please refresh the page.')
        return
      }
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const todayVisits = stats?.todayCount || 0
  const monthVisits = stats?.monthCount || 0
  const totalVisits = stats?.totalCount || 0
  const uniqueV = stats?.uniqueVisitors || 0

  const todayVsMonth = monthVisits > 0 ? Math.round((todayVisits / monthVisits) * 100) : 0
  const bounceRate = stats?.bounceRate ?? null

  const projectCount = stats?.projectCount || 0
  const publishedCount = stats?.publishedCount || 0

  const statCards = [
    { title: 'Total Views', value: totalVisits, icon: Eye, trend: stats?.trend?.total ?? null, accent: 'primary', subtitle: 'All time portfolio visits' },
    { title: 'Unique Visitors', value: uniqueV, icon: Users, trend: stats?.trend?.unique ?? null, accent: 'blue', subtitle: 'Distinct visitors' },
    { title: "Today's Visitors", value: todayVisits, icon: UserCheck, trend: stats?.trend?.today ?? null, accent: 'green', subtitle: 'vs. yesterday' },
    { title: 'Total Projects', value: projectCount, icon: FolderKanban, trend: null, accent: 'purple', subtitle: `${publishedCount} published` },
  ]

  const quickActions = [
    { label: 'View Analytics', icon: BarChart3, onClick: () => navigate('/admin/analytics'), color: 'text-primary bg-primary/10' },
    { label: 'Refresh Data', icon: RefreshCw, onClick: fetchStats, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
    { label: 'View Portfolio', icon: ExternalLink, onClick: () => window.open('/', '_blank'), color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Dashboard"
          actions={
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </motion.button>
          }
        />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {greeting.emoji} {greeting.text}, {firstName} 👋
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentDate}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                  {roleDisplay}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  Last login: {lastLogin}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Welcome back to your Portfolio Control Center.
          </p>
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/admin/projects/new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus size={16} />
              Add Project
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/admin/media')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
            >
              <Image size={16} />
              Upload Media
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/admin/certificates')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
            >
              <Award size={16} />
              Add Certificate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/admin/backup')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
            >
              <Shield size={16} />
              Create Backup
            </motion.button>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          variants={itemVariants}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center justify-between"
        >
          <span>{error}</span>
          <button onClick={fetchStats} className="ml-3 underline font-medium shrink-0">Retry</button>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} loading={loading} delay={i * 0.08} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Clock size={18} className="text-primary" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              {!loading && stats?.recentVisits?.length > 0 && (
                <button
                  onClick={() => navigate('/admin/analytics')}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={12} />
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 sm:px-6 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-slate-700" />
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
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="flex items-center gap-4 px-4 sm:px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {(visit.visitorName || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {visit.visitorName || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {visit.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {[visit.location.city, visit.location.region, visit.location.country]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        )}
                        {visit.ip && <span className="text-gray-400">{visit.ip}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 tabular-nums">
                      {formatTimeAgo(visit.timestamp)}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Globe size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Visitors will appear here as they browse your portfolio.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-800">
              <Sparkles size={16} className="text-primary" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group text-left"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                    <action.icon size={18} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                  <ArrowRight size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-800">
              <BarChart3 size={16} className="text-primary" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Traffic Overview</h2>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  {[
                    { label: 'Today', value: todayVisits, max: Math.max(todayVisits, monthVisits), color: 'bg-gradient-to-r from-green-500 to-green-400' },
                    { label: 'This Month', value: monthVisits, max: Math.max(todayVisits, monthVisits), color: 'bg-gradient-to-r from-primary to-purple-500' },
                    { label: 'Total', value: totalVisits, max: totalVisits || 1, color: 'bg-gradient-to-r from-blue-500 to-blue-400' },
                  ].map((item) => {
                    const pct = item.max > 0 ? (item.value / item.max) * 100 : 0
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                          <span className="font-bold text-gray-900 dark:text-white tabular-nums">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct, 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                            className={`h-full rounded-full ${item.color}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                  {uniqueV > 0 && (
                    <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {totalVisits > 0 ? ((uniqueV / totalVisits) * 100).toFixed(1) : '0'}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Unique visitors vs total views</p>
                    </div>
                  )}
                </>
              )}
            </div>
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
