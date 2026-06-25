import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Shield, Key, Users, AlertTriangle, RefreshCw, Save,
  CheckCircle, XCircle, Smartphone, Monitor, Laptop, Copy, Check,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { useAuth } from '../authentication/AuthContext'
import { setup2FA, verify2FASetup, disable2FA, getMe } from '../../shared/services/authService'
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
  const { user, setUserData } = useAuth()
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

  const [twoFaState, setTwoFaState] = useState({
    step: 'idle',
    qrCode: '',
    secret: '',
    totpCode: '',
    loading: false,
    copied: false,
  })
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)
  const [disableLoading, setDisableLoading] = useState(false)

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

  const handleSetup2FA = async () => {
    setTwoFaState((s) => ({ ...s, loading: true, step: 'loading' }))
    try {
      const res = await setup2FA()
      if (res.success) {
        setTwoFaState((s) => ({
          ...s,
          loading: false,
          step: 'qr',
          qrCode: res.qrCode,
          secret: res.secret,
        }))
      }
    } catch (err) {
      setTwoFaState((s) => ({ ...s, loading: false, step: 'idle' }))
      setToast({ message: err.response?.data?.message || 'Failed to initialize 2FA setup', type: 'error' })
    }
  }

  const handleVerify2FA = async () => {
    if (twoFaState.totpCode.length !== 6) {
      setToast({ message: 'Please enter a 6-digit code', type: 'error' })
      return
    }
    setTwoFaState((s) => ({ ...s, loading: true }))
    try {
      await verify2FASetup(twoFaState.totpCode)
      const meRes = await getMe()
      if (meRes.success && meRes.user) {
        setUserData(meRes.user)
      }
      setTwoFaState({ step: 'idle', qrCode: '', secret: '', totpCode: '', loading: false, copied: false })
      setShowDisableConfirm(false)
      setToast({ message: 'Two-factor authentication enabled successfully', type: 'success' })
    } catch (err) {
      setTwoFaState((s) => ({ ...s, loading: false }))
      setToast({ message: err.response?.data?.message || 'Invalid TOTP code. Please try again.', type: 'error' })
    }
  }

  const handleDisable2FA = async () => {
    setDisableLoading(true)
    try {
      await disable2FA()
      const meRes = await getMe()
      if (meRes.success && meRes.user) {
        setUserData(meRes.user)
      }
      setShowDisableConfirm(false)
      setToast({ message: 'Two-factor authentication disabled', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to disable 2FA', type: 'error' })
    } finally {
      setDisableLoading(false)
    }
  }

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(twoFaState.secret)
      setTwoFaState((s) => ({ ...s, copied: true }))
      setTimeout(() => setTwoFaState((s) => ({ ...s, copied: false })), 2000)
    } catch {
      setToast({ message: 'Failed to copy secret', type: 'error' })
    }
  }

  const reset2FASetup = () => {
    setTwoFaState({ step: 'idle', qrCode: '', secret: '', totpCode: '', loading: false, copied: false })
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

              {/* Current Status */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${
                user?.twoFactorEnabled
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                  : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user?.twoFactorEnabled
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    {user?.twoFactorEnabled ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.twoFactorEnabled ? 'Two-Factor Authentication is Enabled' : 'Two-Factor Authentication is Disabled'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {user?.twoFactorEnabled
                        ? 'Your account is protected with an authenticator app'
                        : 'Your account is vulnerable. Enable 2FA for extra security.'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  user?.twoFactorEnabled
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                }`}>
                  {user?.twoFactorEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Setup Flow */}
              {!user?.twoFactorEnabled && twoFaState.step === 'idle' && (
                <div className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-center">
                  <Smartphone size={40} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Set up two-factor authentication to add an extra layer of security to your account.
                  </p>
                  <button
                    onClick={handleSetup2FA}
                    disabled={twoFaState.loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    <Smartphone size={16} />
                    Enable Two-Factor Authentication
                  </button>
                </div>
              )}

              {/* Loading State */}
              {twoFaState.step === 'loading' && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw size={24} className="animate-spin text-primary" />
                </div>
              )}

              {/* QR Code + Verification */}
              {twoFaState.step === 'qr' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-4">
                      Step 1: Scan QR Code
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
                      Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-md">
                        <img src={twoFaState.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                      </div>

                      <div className="w-full max-w-sm">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
                          Or enter this code manually:
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-mono text-sm text-gray-900 dark:text-white text-center tracking-widest select-all">
                            {twoFaState.secret}
                          </div>
                          <button
                            onClick={handleCopySecret}
                            className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            title="Copy secret"
                          >
                            {twoFaState.copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                      Step 2: Enter Verification Code
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Enter the 6-digit code from your authenticator app to verify the setup.
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={twoFaState.totpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          setTwoFaState((s) => ({ ...s, totpCode: val }))
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && twoFaState.totpCode.length === 6) {
                            handleVerify2FA()
                          }
                        }}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        autoFocus
                      />
                      <button
                        onClick={handleVerify2FA}
                        disabled={twoFaState.totpCode.length !== 6 || twoFaState.loading}
                        className="px-6 py-3 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {twoFaState.loading ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          'Verify & Enable'
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={reset2FASetup}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Cancel setup
                  </button>
                </motion.div>
              )}

              {/* Disable Flow */}
              {user?.twoFactorEnabled && !showDisableConfirm && (
                <div className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Disable Two-Factor Authentication
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    This will remove the 2FA requirement from your account. Your account will be less secure.
                  </p>
                  <button
                    onClick={() => setShowDisableConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <XCircle size={16} />
                    Disable 2FA
                  </button>
                </div>
              )}

              {/* Disable Confirmation Dialog */}
              <AnimatePresence>
                {showDisableConfirm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shrink-0">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
                          Are you sure you want to disable 2FA?
                        </h4>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          This will remove the extra security layer from your account. You will only need your password to log in.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={handleDisable2FA}
                            disabled={disableLoading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {disableLoading ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <>
                                <XCircle size={14} />
                                Yes, Disable 2FA
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowDisableConfirm(false)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Policy Settings */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Policy Settings
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Enforce 2FA for All Users
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
