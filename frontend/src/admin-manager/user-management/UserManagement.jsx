import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Edit2, Trash2, Search, X, Shield, AlertCircle,
  Smartphone, Copy, Check, Key,
} from 'lucide-react'
import { useAuth } from '../authentication/AuthContext'
import { getUsers, createUser, updateUser, deleteUser, getUser } from '../../shared/services/userService'
import ConfirmModal from '../shared/ConfirmModal'
import Toast from '../shared/Toast'

const roles = ['super_admin', 'admin', 'editor']

const roleBadgeClass = {
  super_admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  admin: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  editor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
}

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'editor',
}

export default function UserManagement() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [serverError, setServerError] = useState('')
  const [createdUserData, setCreatedUserData] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [viewingSecret, setViewingSecret] = useState(null)
  const [showSecretFor, setShowSecretFor] = useState(null)

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true)
    setServerError('')
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter
      if (statusFilter) params.status = statusFilter
      const data = await getUsers(params)
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers(1)
  }, [search, roleFilter, statusFilter])

  function openCreateModal() {
    setEditingUser(null)
    setForm(initialForm)
    setFormErrors({})
    setServerError('')
    setCreatedUserData(null)
    setModalOpen(true)
  }

  function openEditModal(user) {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setFormErrors({})
    setServerError('')
    setCreatedUserData(null)
    setModalOpen(true)
  }

  function validateForm() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!editingUser && !form.password) errs.password = 'Password is required'
    if (form.password && form.password.length < 8) errs.password = 'At least 8 characters'
    if (form.password && !/(?=.*[a-z])/.test(form.password)) errs.password = 'Needs a lowercase letter'
    if (form.password && !/(?=.*[A-Z])/.test(form.password)) errs.password = 'Needs an uppercase letter'
    if (form.password && !/(?=.*\d)/.test(form.password)) errs.password = 'Needs a number'
    if (form.password && !/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(form.password)) errs.password = 'Needs a special character'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return
    setSaving(true)
    setServerError('')
    try {
      if (editingUser) {
        const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role }
        if (form.password) payload.password = form.password
        await updateUser(editingUser._id, payload)
        setToast({ message: 'User updated successfully.', type: 'success' })
      } else {
        const data = await createUser({ ...form, email: form.email.trim(), name: form.name.trim() })
        setCreatedUserData(data.user)
        setToast({ message: 'User created successfully. 2FA secret generated.', type: 'success' })
      }
      setModalOpen(false)
      fetchUsers(pagination.page)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save user.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget._id)
      setToast({ message: 'User deleted successfully.', type: 'success' })
      setDeleteTarget(null)
      fetchUsers(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete user.', type: 'error' })
      setDeleteTarget(null)
    }
  }

  async function toggleUserStatus(user) {
    try {
      await updateUser(user._id, { isActive: !user.isActive })
      setToast({ message: `User ${user.isActive ? 'disabled' : 'enabled'} successfully.`, type: 'success' })
      fetchUsers(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update user status.', type: 'error' })
    }
  }

  async function handleViewSecret(userId) {
    if (showSecretFor === userId) {
      setShowSecretFor(null)
      return
    }
    try {
      const data = await getUser(userId)
      setViewingSecret(data.user.twoFactorSecret || 'No secret available')
      setShowSecretFor(userId)
    } catch {
      setToast({ message: 'Failed to load 2FA secret.', type: 'error' })
    }
  }

  function handleCopySecret(secret) {
    navigator.clipboard.writeText(secret)
    setCopiedId(showSecretFor)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage admin users and their roles</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus size={18} />
          Create User
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {serverError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <span className="text-red-700 dark:text-red-400 text-sm font-medium">{serverError}</span>
        </motion.div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Shield size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="text-left px-6 py-4">User</th>
                  <th className="text-left px-6 py-4">Role</th>
                  <th className="text-left px-6 py-4 hidden md:table-cell">Status</th>
                  <th className="text-center px-6 py-4 hidden md:table-cell">2FA</th>
                  <th className="text-left px-6 py-4 hidden lg:table-cell">Last Login</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${roleBadgeClass[u.role] || roleBadgeClass.editor}`}>
                        <Shield size={12} />
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${u.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        u.twoFactorEnabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        <Smartphone size={12} />
                        {u.twoFactorEnabled ? 'Enabled' : 'Off'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-500 dark:text-gray-400 text-xs">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() + ' ' + new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewSecret(u._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                          title={showSecretFor === u._id ? 'Hide 2FA secret' : 'View 2FA secret'}
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 size={16} />
                        </button>
                        {u._id !== currentUser?._id && (
                          <>
                            <button
                              onClick={() => toggleUserStatus(u)}
                              className={`p-2 rounded-lg transition-colors ${u.isActive ? 'text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                              title={u.isActive ? 'Disable user' : 'Enable user'}
                            >
                              {u.isActive ? <X size={16} /> : <Shield size={16} />}
                            </button>
                            {u.role !== 'super_admin' && (
                              <button
                                onClick={() => setDeleteTarget(u)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      {showSecretFor === u._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">2FA Secret Key</span>
                            <button
                              onClick={() => handleCopySecret(viewingSecret)}
                              className="text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                              title="Copy secret"
                            >
                              {copiedId === u._id ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          <code className="text-xs font-mono text-purple-800 dark:text-purple-200 break-all select-all">
                            {viewingSecret || 'Not configured'}
                          </code>
                          <p className="text-[10px] text-purple-500 dark:text-purple-400 mt-1">
                            Share this key securely with the user to set up their authenticator app.
                          </p>
                        </motion.div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-slate-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} users)
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchUsers(pagination.page - 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchUsers(pagination.page + 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                {editingUser ? 'Edit User' : 'Create User'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            {serverError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-red-700 dark:text-red-400 text-sm font-medium">{serverError}</span>
              </div>
            )}

            {createdUserData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={16} className="text-purple-600" />
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-400">2FA Auto-Configured</span>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-300 mb-2">
                  A 2FA secret was automatically generated for this user. Share it securely.
                </p>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <code className="text-xs font-mono text-purple-800 dark:text-purple-200 break-all select-all bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded">
                    {createdUserData.twoFactorSecret}
                  </code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(createdUserData.twoFactorSecret); setToast({ message: 'Secret copied!', type: 'success' }) }}
                    className="p-1.5 rounded-lg text-purple-500 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/20 shrink-0 transition-colors"
                    title="Copy secret"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                {createdUserData.twoFactorQrCode && (
                  <div className="mt-2 flex justify-center">
                    <img src={createdUserData.twoFactorQrCode} alt="2FA QR Code" className="w-32 h-32 rounded-lg" />
                  </div>
                )}
              </motion.div>
            )}

            {!createdUserData && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setFormErrors((p) => ({ ...p, name: '' })) }}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setFormErrors((p) => ({ ...p, email: '' })) }}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Password {editingUser && <span className="font-normal normal-case text-gray-400">(leave empty to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setFormErrors((p) => ({ ...p, password: '' })) }}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-start gap-2">
                  <Smartphone size={14} className="shrink-0 mt-0.5" />
                  <span>A unique 2FA secret will be automatically generated for this user. Share it securely after creation.</span>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingUser ? 'Update User' : 'Create User'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${deleteTarget.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
