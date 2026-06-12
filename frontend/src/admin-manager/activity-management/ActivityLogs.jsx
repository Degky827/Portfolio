import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Search, X, Download, RefreshCw, Filter, Activity,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { listLogs, exportLogs, getActions } from '../../shared/services/activityLogService'

const actionStyles = {
  LOGIN_SUCCESS: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  LOGIN_FAILED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  LOGOUT: 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400',
  TOKEN_REFRESH: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  CREATE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  UPDATE: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  DELETE: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  ACCOUNT_LOCKED: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  PASSWORD_CHANGE: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  ROLE_CHANGE: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
  ACCOUNT_DISABLED: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400',
  ACCOUNT_ENABLED: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400',
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [availableActions, setAvailableActions] = useState([])
  const [toast, setToast] = useState(null)
  const [exporting, setExporting] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listLogs({
        page, limit, search,
        action: actionFilter,
        resource: resourceFilter,
      })
      setLogs(data.logs || [])
      setTotalCount(data.totalCount || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch {
      setToast({ message: 'Failed to load activity logs', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, actionFilter, resourceFilter])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  useEffect(() => {
    getActions().then((res) => {
      if (res.success) setAvailableActions(res.actions || [])
    }).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setActionFilter('')
    setResourceFilter('')
    setPage(1)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportLogs({
        action: actionFilter, resource: resourceFilter,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'activity-logs.csv'
      a.click()
      URL.revokeObjectURL(url)
      setToast({ message: 'Logs exported successfully', type: 'success' })
    } catch {
      setToast({ message: 'Failed to export logs', type: 'error' })
    } finally {
      setExporting(false)
    }
  }

  const hasFilters = search || actionFilter || resourceFilter

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        subtitle={`${totalCount} event${totalCount !== 1 ? 's' : ''} recorded`}
        actions={
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Export CSV
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search user, action, resource, or IP..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </form>

          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Actions</option>
            {availableActions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <input
            type="text"
            value={resourceFilter}
            onChange={(e) => { setResourceFilter(e.target.value); setPage(1) }}
            placeholder="Filter by module..."
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-full sm:w-40 transition-all"
          />

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Activity size={48} className="text-gray-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Activity Logs</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              {hasFilters ? 'No logs match your filters.' : 'Activity logs will appear here as users interact with the system.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Action</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Module</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">IP Address</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {log.user?.name || log.user?.email || 'System'}
                      </span>
                      {log.user?.email && log.user?.name && (
                        <span className="text-xs text-gray-400 ml-2">{log.user.email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${actionStyles[log.action] || 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">
                      {log.resource || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {log.ipAddress || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Showing {Math.min((page - 1) * limit + 1, totalCount)}-{Math.min(page * limit, totalCount)} of {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <span key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
