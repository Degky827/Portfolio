import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw, Eye, Users, UserCheck, TrendingUp,
  Monitor, Globe, Link, Filter, X, ChevronDown, Download,
  MessageSquare, Bot,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart,
} from 'recharts'
import api from '../../services/api'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'

const DEVICE_COLORS = { Desktop: '#7c3aed', Mobile: '#3b82f6', Tablet: '#f59e0b', Unknown: '#6b7280' }
const BROWSER_COLORS = ['#7c3aed', '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#06b6d4', '#8b5cf6', '#6b7280', '#14b8a6']
const PIE_COLORS = ['#7c3aed', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6', '#f97316']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const initialFilters = { dateFrom: '', dateTo: '', country: '', deviceType: '', browser: '', source: '' }

export default function Analytics() {
  const [data, setData] = useState(null)
  const [visits, setVisits] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [visitsLoading, setVisitsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState(initialFilters)

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const { data: res } = await api.get(`/analytics/analytics-dashboard?${params}`)
      if (res.success) setData(res)
      setError('')
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please refresh the page.')
        return
      }
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchVisits = useCallback(async () => {
    try {
      setVisitsLoading(true)
      const params = new URLSearchParams({ limit: '100' })
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const { data: res } = await api.get(`/analytics/metrics?${params}`)
      if (res.success) {
        setVisits(res.visits || [])
        setTotalCount(res.totalCount || 0)
      }
    } catch { /* noop */ } finally {
      setVisitsLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])
  useEffect(() => { fetchVisits() }, [fetchVisits])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  const stats = data?.stats
  const trends7 = data?.trends7days || []
  const trends30 = data?.trends30days || []
  const deviceDist = data?.deviceDistribution || []
  const browserDist = data?.browserDistribution || []
  const topCountries = data?.topCountries || []
  const trafficSources = data?.trafficSources || []

  function formatDateLabel(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  function HumanTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-bold text-gray-900 dark:text-white">
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }

  const statCards = [
    { title: 'Total Page Reads', value: stats?.totalViews, icon: Eye, accent: 'primary', delay: 0, loading, subtitle: 'Human page views (bots excluded)' },
    { title: 'Potential Talents Reached', value: stats?.uniqueVisitors, icon: Users, accent: 'blue', delay: 0.05, loading, subtitle: 'Distinct human visitors' },
    { title: "Today's Visitors", value: stats?.todayCount, icon: UserCheck, accent: 'green', delay: 0.1, loading, subtitle: 'Active human interactions today' },
    { title: 'CV Downloads', value: stats?.cvDownloads, icon: Download, accent: 'purple', delay: 0.15, loading, subtitle: 'Unique download clicks on resume' },
    { title: 'Contact Inquiries', value: stats?.contactInquiries, icon: MessageSquare, accent: 'amber', delay: 0.2, loading, subtitle: 'Form submissions & mailto clicks' },
  ]

  const tableColumns = [
    {
      header: 'Date & Time',
      accessor: 'timestamp',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {new Date(row.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Visitor',
      accessor: 'visitorType',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            row.visitorType === 'new'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {row.visitorType === 'new' ? 'New' : 'Returning'}
          </span>
        </div>
      ),
    },
    {
      header: 'Interaction',
      accessor: 'interaction',
      render: (row) => {
        const interaction = row.interaction || ''
        if (!interaction) {
          return <span className="text-gray-400 dark:text-gray-500 text-xs">Page view</span>
        }
        const colorMap = {
          'Downloaded CV': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
          'Submitted Contact Form': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        }
        return (
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${colorMap[interaction] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'}`}>
            {interaction}
          </span>
        )
      },
    },
    {
      header: 'Location',
      accessor: 'country',
      render: (row) => {
        const city = row.location?.city
        const country = row.location?.country
        if (!city && !country) {
          return <span className="text-gray-400 dark:text-gray-500 italic text-xs">Location Masked (Respecting Privacy)</span>
        }
        return (
          <span className="text-gray-700 dark:text-gray-300">
            {[city, country].filter(Boolean).join(', ')}
          </span>
        )
      },
    },
    {
      header: 'Device',
      accessor: 'deviceType',
      render: (row) => {
        const dt = row.deviceInfo?.deviceType || 'Desktop'
        return (
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <Monitor size={14} className="text-gray-400" />
            {dt.charAt(0).toUpperCase() + dt.slice(1)}
          </span>
        )
      },
    },
    {
      header: 'Browser',
      accessor: 'browser',
      className: 'hidden md:table-cell',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">{row.deviceInfo?.browser || 'Unknown'}</span>
      ),
    },
    {
      header: 'OS',
      accessor: 'os',
      className: 'hidden lg:table-cell',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">{row.deviceInfo?.os || 'Unknown'}</span>
      ),
    },
    {
      header: 'Discovery Channel',
      accessor: 'referrer',
      className: 'hidden xl:table-cell',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
          row.referrer === 'Direct Link / Bookmarks'
            ? 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
            : 'bg-primary/10 text-primary dark:bg-primary/20'
        }`}>
          {row.referrer || 'Direct Link / Bookmarks'}
        </span>
      ),
    },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Analytics"
          description="Professional Engagement & Opportunity Tracker"
          actions={
            <div className="flex items-center gap-2">
              {stats?.botCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                >
                  <Bot size={12} />
                  {stats.botCount.toLocaleString()} Automated Pings Filtered
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                <Filter size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { fetchDashboard(); fetchVisits() }}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Loading...' : 'Refresh'}
              </motion.button>
            </div>
          }
        />
      </motion.div>

      {error && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <X size={16} />
              </div>
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-xs text-red-500/70 mt-0.5">Check the backend server and API endpoint availability.</p>
              </div>
            </div>
            <button
              onClick={() => { fetchDashboard(); fetchVisits() }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-medium text-xs transition-colors shrink-0"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    placeholder="e.g. United States"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Device</label>
                  <select
                    value={filters.deviceType}
                    onChange={(e) => handleFilterChange('deviceType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">All Devices</option>
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Browser</label>
                  <select
                    value={filters.browser}
                    onChange={(e) => handleFilterChange('browser', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">All Browsers</option>
                    <option value="Chrome">Chrome</option>
                    <option value="Edge">Edge</option>
                    <option value="Firefox">Firefox</option>
                    <option value="Safari">Safari</option>
                    <option value="Opera">Opera</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">All Sources</option>
                    <option value="Direct Link / Bookmarks">Direct Link / Bookmarks</option>
                    <option value="LinkedIn Referral">LinkedIn Referral</option>
                    <option value="GitHub Profile">GitHub Profile</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Resume QR Code">Resume QR Code</option>
                    <option value="Other Referral">Other Referral</option>
                  </select>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={12} />
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </motion.div>

      {!loading && !error && data && stats?.totalViews === 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Eye size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No engagement data available yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Human visitor data will appear here once public users start browsing your portfolio. Admin page visits and automated traffic are not tracked.
            </p>
            <button
              onClick={() => { fetchDashboard(); fetchVisits() }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </motion.div>
      )}

      {(loading || !data || stats?.totalViews > 0) && (
      <>
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Active Human Interactions (7 Days)" icon={TrendingUp} loading={loading}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trends7}>
              <defs>
                <linearGradient id="gradient7" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
              <XAxis dataKey="date" tickFormatter={formatDateLabel} stroke="#9ca3af" fontSize={11} tickMargin={8} />
              <YAxis stroke="#9ca3af" fontSize={11} tickMargin={8} />
              <Tooltip content={<HumanTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} fill="url(#gradient7)" name="Active Human Interactions" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Active Human Interactions (30 Days)" icon={TrendingUp} loading={loading}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trends30}>
              <defs>
                <linearGradient id="gradient30" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
              <XAxis dataKey="date" tickFormatter={formatDateLabel} stroke="#9ca3af" fontSize={11} tickMargin={8} interval="preserveStartEnd" />
              <YAxis stroke="#9ca3af" fontSize={11} tickMargin={8} />
              <Tooltip content={<HumanTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#gradient30)" name="Active Human Interactions" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Browser Distribution" icon={Monitor} loading={loading}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={browserDist} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} tickMargin={8} />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} tickMargin={8} width={70} />
              <Tooltip content={<HumanTooltip />} />
              <Bar dataKey="value" name="Interactions" radius={[0, 6, 6, 0]}>
                {browserDist.map((entry, i) => (
                  <Cell key={i} fill={BROWSER_COLORS[i % BROWSER_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Device Distribution" icon={Monitor} loading={loading}>
          <div className="flex items-center justify-center h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceDist}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {deviceDist.map((entry, i) => (
                    <Cell key={i} fill={DEVICE_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<HumanTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Top Countries" icon={Globe} loading={loading}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topCountries} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} tickMargin={8} />
              <YAxis type="category" dataKey="country" stroke="#9ca3af" fontSize={11} tickMargin={8} width={100} />
              <Tooltip content={<HumanTooltip />} />
              <Bar dataKey="count" name="Interactions" radius={[0, 6, 6, 0]} fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Discovery Channels" icon={Link} loading={loading}>
          <div className="flex items-center justify-center h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="count"
                  nameKey="source"
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {trafficSources.map((entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<HumanTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Visitor Log</h2>
            <span className="text-xs text-gray-400">
              {(totalCount || 0).toLocaleString()} total {(totalCount || 0) === 1 ? 'visit' : 'visits'}
            </span>
          </div>
          <DataTable
            columns={tableColumns}
            data={visits}
            searchable
            pageSize={10}
            loading={visitsLoading}
            emptyMessage="No visitor data yet."
          />
        </div>
      </motion.div>
      </>
      )}
    </motion.div>
  )
}

function ChartCard({ title, icon: Icon, children, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-slate-800">
        <Icon size={15} className="text-primary" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-3 sm:p-4">
        {loading ? (
          <div className="flex items-center justify-center h-[240px]">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : children}
      </div>
    </motion.div>
  )
}
