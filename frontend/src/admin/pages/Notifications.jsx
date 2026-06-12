import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCheck, Trash2, RefreshCw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import { listNotifications, markRead, markAllRead, deleteNotification } from '../../services/notificationService'

const typeConfig = {
  contact_submission: { label: 'Contact', classes: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  failed_login: { label: 'Security', classes: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
  backup_completed: { label: 'Backup', classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
  restore_completed: { label: 'Restore', classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  system_warning: { label: 'Warning', classes: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' },
  project_created: { label: 'Project', classes: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  project_updated: { label: 'Project', classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  project_deleted: { label: 'Project', classes: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
  project_archived: { label: 'Project', classes: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
  project_published: { label: 'Project', classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listNotifications({
        page, limit,
        type: typeFilter,
      })
      setNotifications(data.notifications || [])
      setTotalCount(data.totalCount || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch {
      setToast({ message: 'Failed to load notifications', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [page, limit, typeFilter])

  useEffect(() => { fetch() }, [fetch])

  const handleMarkRead = async (id) => {
    try {
      await markRead(id)
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n))
    } catch { /* noop */ }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setToast({ message: 'All notifications marked as read', type: 'success' })
    } catch {
      setToast({ message: 'Failed to mark all as read', type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteNotification(deleteTarget._id)
      setNotifications((prev) => prev.filter((n) => n._id !== deleteTarget._id))
      setDeleteTarget(null)
      setTotalCount((prev) => prev - 1)
      setToast({ message: 'Notification deleted', type: 'success' })
    } catch {
      setToast({ message: 'Failed to delete notification', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${totalCount} notification${totalCount !== 1 ? 's' : ''}`}
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors"
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          </div>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Types</option>
            {[...new Map(Object.entries(typeConfig).map(([key, cfg]) => [cfg.label, key])).entries()].map(([label, key]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell size={48} className="text-gray-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${!n.read ? 'bg-primary/[0.02] dark:bg-primary/[0.05]' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConfig[n.type]?.classes || 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                      {typeConfig[n.type]?.label || n.type}
                    </span>
                  </div>
                  <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                    {n.title}
                  </p>
                  {n.message && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>}
                  <p className="text-[11px] text-gray-400 mt-1.5">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-1 shrink-0 mt-1">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(n)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
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
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-medium transition-colors"
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
                      p === page ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Notification"
        message={`Delete "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
