import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, LogIn, AlertCircle, Shield, ArrowLeft, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { login as loginApi, verify2FA as verify2FAApi } from '../services/authService'

const TOTP_LENGTH = 6

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [step, setStep] = useState('credentials')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [totpCode, setTotpCode] = useState(Array.from({ length: TOTP_LENGTH }, () => ''))
  const inputRefs = useRef([])

  const { setAuth, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    if (step === 'totp' && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [step])

  function validateCredentials() {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validateTOTP() {
    const code = totpCode.join('')
    const errs = {}
    if (code.length < TOTP_LENGTH) errs.totpCode = 'Enter a valid 6-digit code'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    if (!validateCredentials()) return
    setError('')
    setLoading(true)

    try {
      const data = await loginApi(email, password)
      setVerifiedEmail(data.email)
      setStep('totp')
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 423) {
        setError(err.response.data.message || 'Account is locked. Try again later.')
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Try again in 15 minutes.')
      } else {
        setError('Login failed. Check your credentials and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTOTPSubmit = async (e) => {
    e.preventDefault()
    if (!validateTOTP()) return
    setError('')
    setLoading(true)

    const code = totpCode.join('')

    try {
      const data = await verify2FAApi(verifiedEmail, code, rememberMe)
      setAuth(data.token, data.user, rememberMe)
      navigate(from, { replace: true })
    } catch (err) {
      setTotpCode(Array.from({ length: TOTP_LENGTH }, () => ''))
      if (inputRefs.current[0]) inputRefs.current[0].focus()
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 423) {
        setError(err.response.data.message || 'Account is locked. Try again later.')
      } else if (err.response?.status === 429) {
        setError('Too many 2FA attempts. Try again in 15 minutes.')
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTotpChange = useCallback((index, e) => {
    const val = e.target.value
    if (!/^\d*$/.test(val)) return

    const digit = val.slice(-1)
    setTotpCode((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    setErrors((prev) => ({ ...prev, totpCode: '' }))

    if (digit && index < TOTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus()
    }
  }, [])

  const handleTotpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace') {
      if (!totpCode[index] && index > 0) {
        setTotpCode((prev) => {
          const next = [...prev]
          next[index - 1] = ''
          return next
        })
        inputRefs.current[index - 1].focus()
      } else if (totpCode[index]) {
        setTotpCode((prev) => {
          const next = [...prev]
          next[index] = ''
          return next
        })
      }
    }
  }, [totpCode])

  const handleTotpPaste = useCallback((e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, TOTP_LENGTH)
    if (!pasted) return
    setTotpCode((prev) => {
      const next = [...prev]
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i]
      }
      return next
    })
    const focusIndex = Math.min(pasted.length, TOTP_LENGTH - 1)
    inputRefs.current[focusIndex].focus()
  }, [])

  const handleTotpFocus = useCallback((index, e) => {
    e.target.select()
  }, [])

  function resetToCredentials() {
    setStep('credentials')
    setTotpCode(Array.from({ length: TOTP_LENGTH }, () => ''))
    setError('')
    setErrors({})
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-800"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900 to-purple-700 text-white text-xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              ደካ
            </motion.div>
            <AnimatePresence mode="wait">
              {step === 'credentials' ? (
                <motion.div
                  key="creds-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Sign In</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter your credentials to access the dashboard
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="totp-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                    <Smartphone size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white">Two-Factor Auth</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3"
            >
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.form
                key="creds-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleCredentialsSubmit}
                noValidate
              >
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((prev) => ({ ...prev, email: '' })) }}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                  />
                  {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1 font-medium">{errors.email}</motion.p>}
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((prev) => ({ ...prev, password: '' })) }}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1 font-medium">{errors.password}</motion.p>}
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-900/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                  ) : (
                    <><LogIn size={18} />Sign In</>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="totp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleTOTPSubmit}
                noValidate
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                  Open your authenticator app and enter the code shown for your account.
                </p>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 text-center">
                    Authentication Code
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: TOTP_LENGTH }, (_, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={i === 0 ? 'one-time-code' : 'off'}
                        maxLength={1}
                        value={totpCode[i]}
                        onChange={(e) => handleTotpChange(i, e)}
                        onKeyDown={(e) => handleTotpKeyDown(i, e)}
                        onPaste={i === 0 ? handleTotpPaste : undefined}
                        onFocus={(e) => handleTotpFocus(i, e)}
                        className={`w-11 h-14 rounded-xl border-2 text-center text-2xl font-bold font-mono outline-none transition-all ${
                          errors.totpCode
                            ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                            : totpCode[i]
                              ? 'border-primary bg-primary/5 dark:bg-primary/10 text-gray-900 dark:text-white'
                              : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20'
                        }`}
                      />
                    ))}
                  </div>
                  {errors.totpCode && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-2 text-center font-medium">
                      {errors.totpCode}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || totpCode.join('').length !== TOTP_LENGTH}
                  whileHover={{ scale: loading || totpCode.join('').length !== TOTP_LENGTH ? 1 : 1.02 }}
                  whileTap={{ scale: loading || totpCode.join('').length !== TOTP_LENGTH ? 1 : 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-900/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
                  ) : (
                    <><Shield size={18} />Verify & Sign In</>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={resetToCredentials}
                  className="w-full flex items-center justify-center gap-1.5 mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to credentials
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500"
          >
            Authorized administrators only.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
