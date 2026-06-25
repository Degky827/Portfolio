import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Shield, Key, Users, AlertTriangle, RefreshCw, Save,
  CheckCircle, XCircle, Eye, EyeOff, Smartphone,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'

const tabs = [
  { id: 'password', label: 'Password Policy', icon: Key },
  { id: 'sessions', label: 'Active Sessions', icon: Users },
  { id: '2fa', label: 'Two-Factor Auth', icon: Smartphone },
  { id: 'audit', label: 'Security Audit', icon: Shield },
]

export default function Security() {
  const [activeTab, setActiveTab] = useState('password')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90,
    preventReuse: 5,
  })

  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', ip: '192.168.1.1', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'Safari on iPhone', ip: '192.168.1.2', lastActive: '1 hour ago', current: false },
    { id: 3, device: 'Firefox on Linux', ip: '10.0.0.5', lastActive: '3 days ago', current: false },
  ])

  const [twoFa, setTwoFa] = useState({
    enabled: false,
    method: 'authenticator',
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setToast({ message: 'Security settings saved successfully', type: 'success' })
    }, 800)
  }

  const revokeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setToast({ message: 'Session revoked successfully', type: 'success' })
  }

  const revokeAllSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current))
    setToast({ message: 'All other sessions revoked', type: 'success' })
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
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 transition-colors disabled:opacity-50 ml-auto"
        >
          <Save size={18} className={loading ? 'animate-spin' : ''} />
          Save Changes
        </button>
      </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Length
                </label>
                <input
                  type="number"
                  min={6}
                  max={128}
                  value={passwordPolicy.minLength}
                  onChange={(e) =>
                    setPasswordPolicy((p) => ({ ...p, minLength: Number(e.target.value) }))
                  }
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
                  value={passwordPolicy.maxAge}
                  onChange={(e) =>
                    setPasswordPolicy((p) => ({ ...p, maxAge: Number(e.target.value) }))
                  }
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
                  value={passwordPolicy.preventReuse}
                  onChange={(e) =>
                    setPasswordPolicy((p) => ({ ...p, preventReuse: Number(e.target.value) }))
                  }
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
                    checked={passwordPolicy[key]}
                    onChange={(e) =>
                      setPasswordPolicy((p) => ({ ...p, [key]: e.target.checked }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
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
                onClick={revokeAllSessions}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <XCircle size={16} />
                Revoke All Others
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    session.current
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                      : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      session.current
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        IP: {session.ip} &middot; {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => revokeSession(session.id)}
                      className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
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
                  Enable Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => setTwoFa((p) => ({ ...p, enabled: !p.enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFa.enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFa.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {twoFa.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Authentication Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'authenticator', label: 'Authenticator App', desc: 'Google Authenticator, Authy, etc.' },
                      { id: 'sms', label: 'SMS Codes', desc: 'Receive codes via text message' },
                    ].map(({ id, label, desc }) => (
                      <button
                        key={id}
                        onClick={() => setTwoFa((p) => ({ ...p, method: id }))}
                        className={`p-4 rounded-xl border text-left transition-colors ${
                          twoFa.method === id
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Save your backup codes
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Store these codes in a safe place. You can use them to access your account if you lose your device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={20} /> Security Audit
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Password policy enforced', status: 'pass' },
                { label: 'Two-factor authentication', status: twoFa.enabled ? 'pass' : 'warn' },
                { label: 'Session timeout configured', status: 'pass' },
                { label: 'HTTPS enabled', status: 'pass' },
                { label: 'CSRF protection active', status: 'pass' },
                { label: 'Rate limiting enabled', status: 'pass' },
                { label: 'Input sanitization active', status: 'pass' },
                { label: 'CORS configured properly', status: 'pass' },
              ].map(({ label, status }) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  {status === 'pass' ? (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle size={16} /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                      <AlertTriangle size={16} /> Needs Attention
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
