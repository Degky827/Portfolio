import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ImageUpload from '../components/ImageUpload'
import Toast from '../components/Toast'
import { getHomeContent, updateHomeContent } from '../../services/homeContentService'

export default function HomeContent() {
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    resumeUrl: '',
    primaryButtonText: 'Get Started',
    primaryButtonLink: '#projects',
    secondaryButtonText: 'Contact Me',
    secondaryButtonLink: '#contact',
    socialLinks: {
      github: '',
      linkedin: '',
      telegram: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
  })
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [existingImage, setExistingImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getHomeContent()
        if (content) {
          setForm({
            heroTitle: content.heroTitle || '',
            heroSubtitle: content.heroSubtitle || '',
            heroDescription: content.heroDescription || '',
            resumeUrl: content.resumeUrl || '',
            primaryButtonText: content.primaryButtonText || 'Get Started',
            primaryButtonLink: content.primaryButtonLink || '#projects',
            secondaryButtonText: content.secondaryButtonText || 'Contact Me',
            secondaryButtonLink: content.secondaryButtonLink || '#contact',
            socialLinks: {
              github: content.socialLinks?.github || '',
              linkedin: content.socialLinks?.linkedin || '',
              telegram: content.socialLinks?.telegram || '',
              twitter: content.socialLinks?.twitter || '',
              facebook: content.socialLinks?.facebook || '',
              instagram: content.socialLinks?.instagram || '',
            },
          })
          setExistingImage(content.profileImage || '')
        }
      } catch {
        setToast({ message: 'Failed to load home content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const handleSocialChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: e.target.value },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData()
    fd.append('heroTitle', form.heroTitle)
    fd.append('heroSubtitle', form.heroSubtitle)
    fd.append('heroDescription', form.heroDescription)
    fd.append('resumeUrl', form.resumeUrl)
    fd.append('primaryButtonText', form.primaryButtonText)
    fd.append('primaryButtonLink', form.primaryButtonLink)
    fd.append('secondaryButtonText', form.secondaryButtonText)
    fd.append('secondaryButtonLink', form.secondaryButtonLink)
    fd.append('socialLinks', JSON.stringify(form.socialLinks))
    if (profileImageFile) fd.append('profileImage', profileImageFile)
    else if (profileImageUrl) fd.append('profileImageUrl', profileImageUrl)

    try {
      await updateHomeContent(fd)
      setToast({ message: 'Home content updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update home content', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Home Content"
        subtitle="Manage your homepage hero section and social links."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hero Section</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={form.heroTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="e.g. Full-Stack Developer"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={form.heroSubtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                  placeholder="e.g. Building digital experiences"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Hero Description
                </label>
                <textarea
                  value={form.heroDescription}
                  onChange={(e) => setForm((prev) => ({ ...prev, heroDescription: e.target.value }))}
                  rows={4}
                  placeholder="A brief description about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Buttons</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={form.primaryButtonText}
                    onChange={(e) => setForm((prev) => ({ ...prev, primaryButtonText: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={form.primaryButtonLink}
                    onChange={(e) => setForm((prev) => ({ ...prev, primaryButtonLink: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={form.secondaryButtonText}
                    onChange={(e) => setForm((prev) => ({ ...prev, secondaryButtonText: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={form.secondaryButtonLink}
                    onChange={(e) => setForm((prev) => ({ ...prev, secondaryButtonLink: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Resume URL
                </label>
                <input
                  type="url"
                  value={form.resumeUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, resumeUrl: e.target.value }))}
                  placeholder="https://drive.google.com/your-resume"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Links</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
                  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
                  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
                  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
                  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      {label}
                    </label>
                    <input
                      type="url"
                      value={form.socialLinks[key]}
                      onChange={handleSocialChange(key)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
            >
              <ImageUpload
                value={existingImage}
                onChange={(val) => {
                  if (typeof val === 'string') { setProfileImageUrl(val); setProfileImageFile(null) }
                  else { setProfileImageFile(val); setProfileImageUrl('') }
                }}
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-end gap-3"
        >
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
