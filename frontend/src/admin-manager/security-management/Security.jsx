import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Shield, Key, Users, AlertTriangle, RefreshCw, Save,
  CheckCircle, XCircle, Smartphone, Monitor, Laptop, Globe,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import {
  getSecuritySettings,
  updateSecuritySettings,
  getActiveSessions,
  revokeSession,
  revokeAllSessions,
  getSecurityAudit,
} from '../../shared/services/securityService'

const tabs = [
  { id: 'password', label: 'Password Policy', icon: Key },
  { id: 'sessions', label: 'Active Sessions', icon: Users },
  { id: '2fa', label: 'Two-Factor Auth', icon: Smartphone },
  { id: 'audit', label: 'Security Audit', icon: Shield },
]

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown'
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString()
}

function getDeviceIcon(device) {
  if (/mobile|phone/i.test(device)) return Smartphone
  if (/tablet|ipad/i.test(device)) return Monitor
  return Laptop
}

export default function Security() {
  const [activeTab, setActiveTab] = useState('password')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAgeDays: 90,
      preventReuseCount: 5,
    },
    sessionConfig: {
      maxConcurrentSessions: 10,
      idleTimeoutMinutes: 30,
      enforceSessionTimeout: true,
    },
    twoFactorConfig: {
      enforceForAll: false,
      allowedMethods: ['authenticator'],
    },
    loginSecurity: {
      maxFailedAttempts: 5,
      lockDurationMinutes: 15,
      cooldownBetweenAttempts: 0,
    },
  })

  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)

  const [audit, setAudit] = useState(null)
  const [auditLoading, setAuditLoading] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await getSecuritySettings()
      if (res.success) {
        setSettings((prev) => ({
          passwordPolicy: { ...prev.passwordPolicy, ...res.settings.passwordPolicy },
          sessionConfig: { ...prev.sessionConfig, ...res.settings.sessionConfig },
          twoFactorConfig: { ...prev.twoFactorConfig, ...res.settings.twoFactorConfig },
          loginSecurity: { ...prev.loginSecurity, ...res.settings.loginSecurity },
        }))
      }
    } catch {
      setToast({ message: 'Failed to load security settings', type: 'error' })
    }
  }, [])

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true)
    try {
      const res = await getActiveSessions()
      if (res.success) setSessions(res.sessions)
    } catch {
      setToast({ message: 'Failed to load sessions', type: 'error' })
    } finally {
      setSessionsLoading(false)
    }
  }, [])

  const fetchAudit = useCallback(async () => {
    setAuditLoading(true)
    try {
      const res = await getSecurityAudit()
      if (res.success) setAudit(res.audit)
    } catch {
      setToast({ message: 'Failed to load security audit', type: 'error' })
    } finally {
      setAuditLoading(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchSettings()
      setLoading(false)
    }
    init()
  }, [fetchSettings])

  useEffect(() => {
    if (activeTab === 'sessions') fetchSessions()
    if (activeTab === 'audit') fetchAudit()
  }, [activeTab, fetchSessions, fetchAudit])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSecuritySettings(settings)
      setToast({ message: 'Security settings saved successfully', type: 'success' })
    } catch {
      setToast({ message: 'Failed to save security settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleRevokeSession = async (index) => {
    try {
      await revokeSession(index)
      setSessions((prev) => prev.filter((_, i) => i !== index))
      setToast({ message: 'Session revoked successfully', type: 'success' })
    } catch {
      setToast({ message: 'Failed to revoke session', type: 'error' })
    }
  }

  const handleRevokeAll = async () => {
    try {
      await revokeAllSessions()
      setSessions((prev) => prev.filter((s) => s.isCurrent))
      setToast({ message: 'All other sessions revoked', type: 'success' })
    } catch {
      setToast({ message: 'Failed to revoke sessions', type: 'error' })
    }
  }

  const updatePasswordPolicy = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      passwordPolicy: { ...prev.passwordPolicy, [field]: value },
    }))
  }

  return (
    <div>
      <PageHeader
        title="Security Settings"
        subtitle="Manage password policies, sessions, two-factor authentication, and security audits."
      />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
        {(activeTab === 'password' || activeTab === '2fa') && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 transition-colors disabled:opacity-50 ml-auto"
          >
            <Save size={18} className={saving ? 'animate-spin' : ''} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
        >
          {activeTab === 'password' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Key size={20} /> Password Policy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    min={6}
                    max={128}
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) => updatePasswordPolicy('minLength', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password Max Age (days)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={settings.passwordPolicy.maxAgeDays}
                    onChange={(e) => updatePasswordPolicy('maxAgeDays', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prevent Password Reuse (count)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={settings.passwordPolicy.preventReuseCount}
                    onChange={(e) => updatePasswordPolicy('preventReuseCount', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'requireUppercase', label: 'Require uppercase letters' },
                  { key: 'requireLowercase', label: 'Require lowercase letters' },
                  { key: 'requireNumbers', label: 'Require numbers' },
                  { key: 'requireSpecialChars', label: 'Require special characters' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.passwordPolicy[key]}
                      onChange={(e) => updatePasswordPolicy(key, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Lock size={18} /> Login Security
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Failed Attempts
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={20}
                      value={settings.loginSecurity.maxFailedAttempts}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          loginSecurity: { ...prev.loginSecurity, maxFailedAttempts: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lock Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={1440}
                      value={settings.loginSecurity.lockDurationMinutes}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          loginSecurity: { ...prev.loginSecurity, lockDurationMinutes: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users size={20} /> Active Sessions
                </h3>
                <button
                  onClick={handleRevokeAll}
                  disabled={sessions.filter((s) => !s.isCurrent).length === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Revoke All Others
                </button>
              </div>

              {sessionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw size={20} className="animate-spin text-primary" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Users size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No active sessions found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, idx) => {
                    const DeviceIcon = getDeviceIcon(session.device)
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          session.isCurrent
                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                            : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            session.isCurrent
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            <DeviceIcon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {session.device} &middot; {session.browser}
                              {session.isCurrent && (
                                <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {session.os} &middot; IP: {session.ipAddress} &middot; {formatDate(session.createdAt)}
                            </p>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <button
                            onClick={() => handleRevokeSession(idx)}
                            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === '2fa' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Smartphone size={20} /> Two-Factor Authentication
              </h3>

              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Enforce 2FA for All Users
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Require all admin users to enable two-factor authentication
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      twoFactorConfig: {
                        ...prev.twoFactorConfig,
                        enforceForAll: !prev.twoFactorConfig.enforceForAll,
                      },
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.twoFactorConfig.enforceForAll ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.twoFactorConfig.enforceForAll ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Allowed Methods
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'authenticator', label: 'Authenticator App', desc: 'Google Authenticator, Authy, etc.' },
                    { id: 'sms', label: 'SMS Codes', desc: 'Receive codes via text message' },
                  ].map(({ id, label, desc }) => {
                    const isActive = settings.twoFactorConfig.allowedMethods.includes(id)
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setSettings((prev) => {
                            const methods = isActive
                              ? prev.twoFactorConfig.allowedMethods.filter((m) => m !== id)
                              : [...prev.twoFactorConfig.allowedMethods, id]
                            return {
                              ...prev,
                              twoFactorConfig: { ...prev.twoFactorConfig, allowedMethods: methods },
                            }
                          })
                        }}
                        className={`p-4 rounded-xl border text-left transition-colors ${
                          isActive
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield size={20} /> Security Audit
                </h3>
                <button
                  onClick={fetchAudit}
                  disabled={auditLoading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw size={14} className={auditLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {auditLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw size={20} className="animate-spin text-primary" />
                </div>
              ) : audit ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Security Score', value: `${audit.summary.score}/${audit.summary.total}`, color: 'text-primary' },
                      { label: 'Users with 2FA', value: `${audit.summary.usersWith2FA}/${audit.summary.totalUsers}`, color: 'text-blue-500' },
                      { label: 'Locked Accounts', value: audit.summary.lockedUsers, color: 'text-amber-500' },
                      { label: 'Failed Logins (24h)', value: audit.summary.recentFailures, color: 'text-red-500' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {audit.checks.map((check) => (
                      <div
                        key={check.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{check.label}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{check.detail}</p>
                        </div>
                        {check.status === 'pass' ? (
                          <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle size={16} /> Pass
                          </span>
                        ) : check.status === 'warn' ? (
                          <span className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                            <AlertTriangle size={16} /> Warn
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                            <XCircle size={16} /> Fail
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Shield size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click Refresh to run security audit</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
