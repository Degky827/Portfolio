import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSave, FiArrowLeft, FiPlus, FiTrash2, FiImage, FiVideo, FiCode, FiType, FiGrid, FiExternalLink, FiMenu,
} from 'react-icons/fi'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import ImageUpload from '../shared/ImageUpload'
import ConfirmModal from '../shared/ConfirmModal'
import { getCustomPage, createCustomPage, updateCustomPage } from '../../shared/services/customPageService'
import { getMediaUrl } from '../../shared/services/api'

const SECTION_TYPES = [
  { type: 'text', label: 'Text Block', icon: FiType },
  { type: 'image', label: 'Image', icon: FiImage },
  { type: 'gallery', label: 'Gallery', icon: FiGrid },
  { type: 'video', label: 'Video', icon: FiVideo },
  { type: 'button', label: 'Button', icon: FiExternalLink },
  { type: 'html', label: 'Custom HTML', icon: FiCode },
]

function createEmptySection(type, order) {
  const base = { sectionType: type, displayOrder: order, sectionData: {} }
  switch (type) {
    case 'text':
      base.sectionData = { heading: '', subheading: '', body: '', alignment: 'left' }
      break
    case 'image':
      base.sectionData = { src: '', alt: '', caption: '', layout: 'full' }
      break
    case 'gallery':
      base.sectionData = { images: [], columns: 3, spacing: 16 }
      break
    case 'video':
      base.sectionData = { videoUrl: '', thumbnail: '', autoplay: false, controls: true }
      break
    case 'button':
      base.sectionData = { label: '', url: '', variant: 'primary', openInNewTab: true }
      break
    case 'html':
      base.sectionData = { htmlContent: '' }
      break
    default:
      break
  }
  return base
}

export default function CustomPageForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [sections, setSections] = useState([])
  const [status, setStatus] = useState('draft')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const fetchPage = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const data = await getCustomPage(id)
      const p = data.page
      setTitle(p.title || '')
      setSlug(p.slug || '')
      setDescription(p.description || '')
      setMetaTitle(p.metaTitle || '')
      setMetaDescription(p.metaDescription || '')
      setFeaturedImage(p.featuredImage || '')
      setSections(p.sections || [])
      setStatus(p.status || 'draft')
    } catch (err) {
      setToast({ message: 'Failed to load page', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => { fetchPage() }, [fetchPage])

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (val) => {
    setTitle(val)
    if (!isEditing) {
      setSlug(generateSlug(val))
    }
  }

  const addSection = (type) => {
    setSections((prev) => [...prev, createEmptySection(type, prev.length)])
  }

  const removeSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSection = (index, field, value) => {
    setSections((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index] }
      if (field === 'sectionData') {
        updated[index].sectionData = { ...updated[index].sectionData, ...value }
      } else {
        updated[index][field] = value
      }
      return updated
    })
  }

  const moveSection = (from, to) => {
    if (to < 0 || to >= sections.length) return
    setSections((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated.map((s, i) => ({ ...s, displayOrder: i }))
    })
  }

  const handleSave = async (publishAfter = false) => {
    if (!title.trim()) {
      setToast({ message: 'Page title is required', type: 'error' })
      return
    }
    try {
      setIsSaving(true)
      const body = {
        title: title.trim(),
        description,
        metaTitle,
        metaDescription,
        featuredImage,
        sections,
        status: publishAfter ? 'published' : status,
      }
      if (isEditing) {
        await updateCustomPage(id, body)
      } else {
        await createCustomPage(body)
      }
      setToast({
        message: publishAfter ? 'Page published successfully' : 'Page saved successfully',
        type: 'success',
      })
      setTimeout(() => navigate('/admin/custom-pages'), 800)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save page', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-20 text-[var(--text-secondary)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title={isEditing ? 'Edit Custom Page' : 'New Custom Page'}
        subtitle={isEditing ? `Editing "${title}"` : 'Create a new custom page'}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/custom-pages')}
              className="px-4 py-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-2"
            >
              <FiArrowLeft size={16} />
              Back
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Content</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Page Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  placeholder="e.g. My Custom Page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Slug</label>
                <input
                  type="text"
                  value={slug}
                  readOnly
                  className="w-full px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  placeholder="Brief description of this page"
                />
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Page Sections</h3>
              <div className="flex flex-wrap gap-2">
                {SECTION_TYPES.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)]/20 border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {sections.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-secondary)] border-2 border-dashed border-[var(--border-primary)] rounded-lg">
                <p>No sections yet. Add one from the buttons above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                        <div className="flex items-center gap-2">
                          <FiMenu className="text-[var(--text-secondary)] cursor-grab" size={14} />
                          <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                            {SECTION_TYPES.find((s) => s.type === section.sectionType)?.label || section.sectionType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveSection(index, index - 1)}
                            disabled={index === 0}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                          >
                            &#9650;
                          </button>
                          <button
                            onClick={() => moveSection(index, index + 1)}
                            disabled={index === sections.length - 1}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                          >
                            &#9660;
                          </button>
                          <button
                            onClick={() => removeSection(index)}
                            className="p-1 text-red-500 hover:text-red-400 ml-1"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <SectionEditor section={section} onChange={(data) => updateSection(index, 'sectionData', data)} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Publishing</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Featured Image</label>
                <ImageUpload
                  value={featuredImage}
                  onChange={setFeaturedImage}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiSave size={16} />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={() => setShowPublishModal(true)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-[var(--accent-primary)] hover:brightness-90 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiSave size={16} />
                  {isSaving ? 'Publishing...' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  placeholder="SEO title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  placeholder="SEO description"
                />
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Page Info</h3>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <p>Sections: {sections.length}</p>
              {isEditing && (
                <p className="text-xs text-[var(--text-secondary)]">Slug: /{slug}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={() => { setShowPublishModal(false); handleSave(true) }}
        title="Publish Page"
        message={`Publish "${title}" now? It will be visible to visitors.`}
        confirmText="Publish"
        loading={isSaving}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function SectionEditor({ section, onChange }) {
  const { sectionType, sectionData } = section

  switch (sectionType) {
    case 'text':
      return (
        <div className="space-y-3">
          <input
            type="text"
            value={sectionData.heading || ''}
            onChange={(e) => onChange({ heading: e.target.value })}
            placeholder="Heading"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
          <input
            type="text"
            value={sectionData.subheading || ''}
            onChange={(e) => onChange({ subheading: e.target.value })}
            placeholder="Subheading (optional)"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
          <ReactQuill
            value={sectionData.body || ''}
            onChange={(val) => onChange({ body: val })}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['clean'],
              ],
            }}
            className="bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)]"
          />
          <select
            value={sectionData.alignment || 'left'}
            onChange={(e) => onChange({ alignment: e.target.value })}
            className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          >
            <option value="left">Align Left</option>
            <option value="center">Align Center</option>
            <option value="right">Align Right</option>
          </select>
        </div>
      )

    case 'image':
      return (
        <div className="space-y-3">
          <ImageUpload
            value={sectionData.src || ''}
            onChange={(val) => onChange({ src: val })}
          />
          <input
            type="text"
            value={sectionData.alt || ''}
            onChange={(e) => onChange({ alt: e.target.value })}
            placeholder="Alt text"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
          <input
            type="text"
            value={sectionData.caption || ''}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
          <select
            value={sectionData.layout || 'full'}
            onChange={(e) => onChange({ layout: e.target.value })}
            className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          >
            <option value="full">Full Width</option>
            <option value="half">Half Width</option>
            <option value="thumbnail">Thumbnail</option>
          </select>
        </div>
      )

    case 'gallery':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            {(sectionData.images || []).map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImageUpload
                  value={typeof img === 'string' ? img : img.src || ''}
                  onChange={(val) => {
                    const updated = [...(sectionData.images || [])]
                    updated[i] = val
                    onChange({ images: updated })
                  }}
                />
                <button
                  onClick={() => {
                    const updated = (sectionData.images || []).filter((_, idx) => idx !== i)
                    onChange({ images: updated })
                  }}
                  className="p-1 text-red-500 hover:text-red-400"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => onChange({ images: [...(sectionData.images || []), ''] })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
          >
            <FiPlus size={12} />
            Add Image
          </button>
          <div className="flex gap-2">
            <select
              value={sectionData.columns || 3}
              onChange={(e) => onChange({ columns: parseInt(e.target.value) })}
              className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none"
            >
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>
        </div>
      )

    case 'video':
      return (
        <div className="space-y-3">
          <input
            type="text"
            value={sectionData.videoUrl || ''}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder="Video URL (YouTube, Vimeo, etc.)"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
          <ImageUpload
            value={sectionData.thumbnail || ''}
            onChange={(val) => onChange({ thumbnail: val })}
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={sectionData.autoplay || false}
                onChange={(e) => onChange({ autoplay: e.target.checked })}
                className="rounded"
              />
              Autoplay
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={sectionData.controls !== false}
                onChange={(e) => onChange({ controls: e.target.checked })}
                className="rounded"
              />
              Controls
            </label>
          </div>
        </div>
      )

    case 'button':
      return (
        <div className="space-y-3">
          <input
            type="text"
            value={sectionData.label || ''}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Button label"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
          <input
            type="text"
            value={sectionData.url || ''}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="URL"
            className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
          <div className="flex gap-2">
            <select
              value={sectionData.variant || 'primary'}
              onChange={(e) => onChange({ variant: e.target.value })}
              className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={sectionData.openInNewTab !== false}
                onChange={(e) => onChange({ openInNewTab: e.target.checked })}
                className="rounded"
              />
              New Tab
            </label>
          </div>
        </div>
      )

    case 'html':
      return (
        <textarea
          value={sectionData.htmlContent || ''}
          onChange={(e) => onChange({ htmlContent: e.target.value })}
          rows={8}
          placeholder="Paste your HTML/CSS here..."
          className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
        />
      )

    default:
      return <div className="text-sm text-[var(--text-secondary)]">Unknown section type</div>
  }
}
