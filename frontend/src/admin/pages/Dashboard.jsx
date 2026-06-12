import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Eye, Users, UserCheck, CalendarDays, ExternalLink, RefreshCw,
  ArrowRight, BarChart3, Clock, Globe, MapPin, Sparkles,
  Plus, Image, Award, Shield, FolderKanban, Activity,
  CheckCircle, AlertTriangle, HardDrive, Bell,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import StatCard from '../components/StatCard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
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

const quickActionsConfig = [
  {
    label: 'Add Project',
    icon: Plus,
    onClick: (navigate) => navigate('/admin/projects/new'),
    gradient: 'from-indigo-500 to-indigo-600',
    shadow: 'shadow-indigo-500/20',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    textColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    label: 'Upload Media',
    icon: Image,
    onClick: (navigate) => navigate('/admin/media'),
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/20',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Add Certificate',
    icon: Award,
    onClick: (navigate) => navigate('/admin/skills/new'),
    gradient: 'from-amber-500 to-amber-600',
    shadow: 'shadow-amber-500/20',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Create Backup',
    icon: Shield,
    onClick: (navigate) => navigate('/admin/backup'),
    gradient: 'from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-500/20',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
]

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

  const quickActions = quickActionsConfig

  const activityItems = stats?.recentVisits?.slice(0, 6) || []

  const systemStatus = [
    { label: 'Database', status: 'healthy', icon: HardDrive, color: 'text-emerald-500' },
    { label: 'API', status: 'operational', icon: Activity, color: 'text-emerald-500' },
    { label: 'Storage', status: 'healthy', icon: HardDrive, color: 'text-emerald-500' },
    { label: 'Notifications', status: 'active', icon: Bell, color: 'text-emerald-500' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* ── Welcome Section ─────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-premium-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent dark:from-indigo-500/[0.05]" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white text-xl font-black flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0"
                >
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {greeting.emoji} {greeting.text}, {firstName}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentDate}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <motion.span
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 capitalize border border-indigo-200/50 dark:border-indigo-500/20"
                    >
                      {roleDisplay}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs text-gray-400 flex items-center gap-1.5"
                    >
                      <Clock size={12} />
                      Last login: {lastLogin}
                    </motion.span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchStats}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-slate-800/50 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 transition-colors border border-gray-200/60 dark:border-slate-700/60 disabled:opacity-50 shadow-premium dark:shadow-premium-dark"
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : {}}
                  transition={loading ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                >
                  <RefreshCw size={14} />
                </motion.div>
                {loading ? 'Refreshing...' : 'Refresh'}
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-wrap gap-2.5 mt-6 pt-6 border-t border-gray-100/60 dark:border-slate-800/60"
            >
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => action.onClick(navigate)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${action.bg} ${action.textColor} hover:shadow-lg ${action.shadow} transition-all duration-200 border border-transparent hover:border-current/20`}
                >
                  <action.icon size={16} />
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Error State ──────────────────────────────── */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/60 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </span>
          <button onClick={fetchStats} className="ml-3 underline font-medium shrink-0 hover:no-underline">Retry</button>
        </motion.div>
      )}

      {/* ── Analytics Overview ───────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your portfolio performance at a glance</p>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => navigate('/admin/analytics')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {statCards.map((card, i) => (
            <StatCard key={card.title} {...card} loading={loading} delay={i * 0.08} />
          ))}
        </div>
      </motion.div>

      {/* ── Traffic & Projects ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Overview */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-premium-dark overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <BarChart3 size={18} className="text-indigo-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Traffic Overview</h2>
              </div>
              {!loading && stats?.recentVisits?.length > 0 && (
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => navigate('/admin/analytics')}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={12} />
                </motion.button>
              )}
            </div>
            <div className="p-6 space-y-5">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-20 bg-gray-100 dark:bg-slate-800 rounded shimmer-bg" />
                        <div className="h-4 w-12 bg-gray-100 dark:bg-slate-800 rounded shimmer-bg" />
                      </div>
                      <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded-lg shimmer-bg" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {[
                    { label: 'Today', value: todayVisits, max: Math.max(todayVisits, monthVisits, 1), color: 'from-emerald-500 to-emerald-400' },
                    { label: 'This Month', value: monthVisits, max: Math.max(todayVisits, monthVisits, 1), color: 'from-indigo-500 to-purple-500' },
                    { label: 'Total', value: totalVisits, max: totalVisits || 1, color: 'from-blue-500 to-blue-400' },
                  ].map((item) => {
                    const pct = item.max > 0 ? (item.value / item.max) * 100 : 0
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                          <span className="font-bold text-gray-900 dark:text-white tabular-nums">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct, 100)}%` }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                  {uniqueV > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="pt-4 border-t border-gray-100/60 dark:border-slate-800/60"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Conversion Rate</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {totalVisits > 0 ? ((uniqueV / totalVisits) * 100).toFixed(1) : '0'}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Unique visitors vs total views</p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-premium-dark overflow-hidden h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <FolderKanban size={18} className="text-indigo-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Projects</h2>
              </div>
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate('/admin/projects')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </motion.button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl shimmer-bg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.recentProjects?.length > 0 ? (
                    stats.recentProjects.map((project, i) => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 4 }}
                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0">
                          {project.title?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {project.title || 'Untitled Project'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {project.category || 'No category'}
                          </p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            project.published
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                          }`}>
                            {project.published ? 'Live' : 'Draft'}
                          </span>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FolderKanban size={32} className="text-gray-300 dark:text-slate-700 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No projects yet</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/admin/projects/new')}
                        className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        Create your first project
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Activity & System Status ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-premium-dark overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <Activity size={18} className="text-indigo-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              {!loading && activityItems.length > 0 && (
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => navigate('/admin/activity-logs')}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={12} />
                </motion.button>
              )}
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 shimmer-bg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-100 dark:bg-slate-800 rounded shimmer-bg" />
                        <div className="h-3 w-1/2 bg-gray-100 dark:bg-slate-800 rounded shimmer-bg" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activityItems.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-slate-700" />
                  <div className="space-y-0">
                    {activityItems.map((visit, i) => (
                      <motion.div
                        key={visit._id || i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex items-start gap-4 pb-5 last:pb-0"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.06 + 0.1, type: 'spring', stiffness: 300 }}
                          className="relative z-10 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-indigo-500/20"
                        >
                          {(visit.visitorName || 'A')[0].toUpperCase()}
                        </motion.div>
                        <div className="flex-1 min-w-0 pt-0.5">
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
                            {visit.page && (
                              <span className="text-gray-400 truncate max-w-[120px]">{visit.page}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 tabular-nums">
                          {formatTimeAgo(visit.timestamp)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Globe size={32} className="text-gray-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No recent activity</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Visitors will appear here as they browse your portfolio.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-premium-dark overflow-hidden h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <Shield size={18} className="text-indigo-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">System Status</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {systemStatus.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-slate-800/30 border border-gray-100/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center ${item.color}`}>
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.status}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    >
                      <CheckCircle size={16} className="text-emerald-500" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] dark:from-indigo-500/[0.05] dark:to-purple-500/[0.05] border border-indigo-200/30 dark:border-indigo-500/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">All systems operational</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your portfolio is running smoothly</p>
                  </div>
                </div>
              </motion.div>
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
