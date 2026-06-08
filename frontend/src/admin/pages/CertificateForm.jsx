import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import { createCertificate, updateCertificate, getCertificate } from '../../services/certificateService'

export default function CertificateForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    verificationUrl: '',
    description: '',
    skillsCovered: '',
    featured: false,
    status: 'active',
  })
  const [imageFile, setImageFile] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    ;(async () => {
      try {
        const { certificate } = await getCertificate(id)
        setForm({
          title: certificate.title || '',
          issuingOrganization: certificate.issuingOrganization || '',
          issueDate: certificate.issueDate ? certificate.issueDate.slice(0, 10) : '',
          expirationDate: certificate.expirationDate ? certificate.expirationDate.slice(0, 10) : '',
          credentialId: certificate.credentialId || '',
          verificationUrl: certificate.verificationUrl || '',
          description: certificate.description || '',
          skillsCovered: (certificate.skillsCovered || []).join(', '),
          featured: certificate.featured || false,
          status: certificate.status || 'active',
        })
        setExistingImage(certificate.certificateImage || '')
      } catch {
        setServerError('Failed to load certificate')
      } finally {
        setFetching(false)
      }
    })()
  }, [id, isEditing])

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.issuingOrganization.trim()) errs.issuingOrganization = 'Issuing organization is required'
    if (!form.issueDate.trim()) errs.issueDate = 'Issue date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('issuingOrganization', form.issuingOrganization.trim())
    fd.append('issueDate', form.issueDate)
    fd.append('expirationDate', form.expirationDate || '')
    fd.append('credentialId', form.credentialId.trim())
    fd.append('verificationUrl', form.verificationUrl.trim())
    fd.append('description', form.description.trim())
    fd.append('skillsCovered', form.skillsCovered)
    fd.append('featured', form.featured)
    fd.append('status', form.status)
    if (imageFile) fd.append('certificateImage', imageFile)

    try {
      if (isEditing) {
        await updateCertificate(id, fd)
      } else {
        await createCertificate(fd)
      }
      navigate('/admin/certificates')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save certificate')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
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
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/certificates')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {isEditing ? 'Edit Certificate' : 'Add Certificate'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update the certificate details below' : 'Fill in the details to add a new certificate'}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Certificate Information</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Certificate Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={set('title')}
                  placeholder="e.g. AWS Solutions Architect"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.title ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Issuing Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.issuingOrganization}
                  onChange={set('issuingOrganization')}
                  placeholder="e.g. Amazon Web Services"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.issuingOrganization ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.issuingOrganization && <p className="text-xs text-red-500 mt-1">{errors.issuingOrganization}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={4}
                  placeholder="Brief description of the certificate..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Skills Covered (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.skillsCovered}
                  onChange={set('skillsCovered')}
                  placeholder="e.g. AWS, Cloud Architecture, Security"
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dates & Credentials</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={set('issueDate')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.issueDate ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                  />
                  {errors.issueDate && <p className="text-xs text-red-500 mt-1">{errors.issueDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={form.expirationDate}
                    onChange={set('expirationDate')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={form.credentialId}
                  onChange={set('credentialId')}
                  placeholder="e.g. AWS-12345-ABCDE"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Verification URL
                </label>
                <input
                  type="url"
                  value={form.verificationUrl}
                  onChange={set('verificationUrl')}
                  placeholder="https://verify.certificate.com/credential"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={set('status')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={set('featured')}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-300 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Certificate</span>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
            >
              <ImageUpload
                value={existingImage}
                onChange={setImageFile}
                error={errors.certificateImage}
              />
            </motion.div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/certificates')}
            className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? 'Update Certificate' : 'Create Certificate'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
