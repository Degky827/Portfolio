import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save, Eye, EyeOff, AlertCircle, Shield, Calendar, Clock,
  Mail, User as UserIcon, Phone, MapPin, Link, Code2, Globe, Image,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getMe } from '../../services/authService'
import { updateMe } from '../../services/userService'
import ImageUpload from '../components/ImageUpload'
import Toast from '../components/Toast'

export default function Profile() {
  const { user: authUser, setUserData } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const { user } = await getMe()
        setProfile(user)
        setName(user.name || '')
        setDisplayName(user.displayName || '')
        setAvatar(user.avatar || '')
        setPhone(user.phone || '')
        setBio(user.bio || '')
        setLocation(user.location || '')
        setLinkedin(user.socialLinks?.linkedin || '')
        setGithub(user.socialLinks?.github || '')
        setPortfolioUrl(user.socialLinks?.portfolioUrl || '')
      } catch {
        setServerError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function validateProfile() {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validatePassword() {
    const errs = {}
    if (!currentPassword) errs.currentPassword = 'Current password is required'
    if (!newPassword) errs.newPassword = 'New password is required'
    else if (newPassword.length < 8) errs.newPassword = 'At least 8 characters'
    else if (!/(?=.*[a-z])/.test(newPassword)) errs.newPassword = 'Needs a lowercase letter'
    else if (!/(?=.*[A-Z])/.test(newPassword)) errs.newPassword = 'Needs an uppercase letter'
    else if (!/(?=.*\d)/.test(newPassword)) errs.newPassword = 'Needs a number'
    else if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(newPassword)) errs.newPassword = 'Needs a special character'
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    if (!validateProfile()) return
    setSaving(true)
    setServerError('')
    try {
      const body = {
        name: name.trim(),
        displayName: displayName.trim(),
        avatar,
        phone: phone.trim(),
        bio,
        location: location.trim(),
        socialLinks: { linkedin, github, portfolioUrl },
      }
      const { user } = await updateMe(body)
      setProfile(user)
      setUserData({ ...authUser, name: user.name, avatar: user.avatar, displayName: user.displayName })
      setToast({ message: 'Profile updated successfully.', type: 'success' })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    if (!validatePassword()) return
    setSaving(true)
    setServerError('')
    try {
      await updateMe({
        currentPassword,
        password: newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setToast({ message: 'Password changed successfully.', type: 'success' })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setSaving(false)
    }
  }

  const displayInitial = profile?.displayName?.charAt(0)
    || profile?.name?.charAt(0)
    || 'D'

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-slate-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account details, personal information, and password
        </p>
      </div>

      {serverError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <span className="text-red-700 dark:text-red-400 text-sm font-medium">{serverError}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-800">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="w-16 h-16 rounded-full object-cover shrink-0 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 text-white text-xl font-black flex items-center justify-center shrink-0 shadow-lg">
              {displayInitial}
            </div>
          )}
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              {profile?.displayName || profile?.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Mail size={14} />
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Shield size={14} className="text-purple-500" />
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                {profile?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Calendar size={14} />
            <span>Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            <span>Last login {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Desalegn"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Profile Photo
            </label>
            <ImageUpload
              value={avatar}
              onChange={(url) => setAvatar(url)}
              label="Upload Profile Photo"
              folder="avatars"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                <Phone size={12} className="inline mr-1" />
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +251 911 234 567"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                <MapPin size={12} className="inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Addis Ababa, Ethiopia"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-800 pt-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Social & Portfolio Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  <Link size={12} className="inline mr-1" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  <Code2 size={12} className="inline mr-1" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  <Globe size={12} className="inline mr-1" />
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
      >
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your account password</p>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, currentPassword: '' })) }}
                className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
              />
              <button type="button" onClick={() => setShowCurrent((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: '' })) }}
                className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
              />
              <button type="button" onClick={() => setShowNew((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
            {!errors.newPassword && newPassword && (
              <ul className="text-xs text-gray-400 mt-1 space-y-0.5">
                <li className={newPassword.length >= 8 ? 'text-green-500' : ''}>At least 8 characters</li>
                <li className={/(?=.*[a-z])/.test(newPassword) ? 'text-green-500' : ''}>Contains lowercase letter</li>
                <li className={/(?=.*[A-Z])/.test(newPassword) ? 'text-green-500' : ''}>Contains uppercase letter</li>
                <li className={/(?=.*\d)/.test(newPassword) ? 'text-green-500' : ''}>Contains number</li>
                <li className={/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(newPassword) ? 'text-green-500' : ''}>Contains special character</li>
              </ul>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })) }}
                className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
              />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}