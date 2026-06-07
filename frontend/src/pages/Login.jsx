import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/admin', { replace: true })
    return null
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/admin-login', { email, password })

      if (data.requiresTwoFactor) {
        setStep(2)
      } else {
        setAuth(data.token, data.user)
        navigate('/admin', { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/admin-login', {
        email,
        password,
        twoFactorToken,
      })

      setAuth(data.token, data.user)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 2FA code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900 to-purple-700 text-white text-lg font-black flex items-center justify-center mx-auto mb-4 shadow-lg">
              ደካ
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {step === 1 ? 'Admin Sign In' : 'Two-Factor Authentication'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {step === 1
                ? 'Enter your credentials to continue'
                : 'Enter the 6-digit code from your authenticator app'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-900/30 transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Continue'}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Authenticator Code
                </label>
                <input
                  type="text"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-2xl tracking-[0.5em] font-mono"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading || twoFactorToken.length !== 6}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-900/30 transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </motion.button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mt-2"
              >
                Back to credentials
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
