import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Layout, Plus, Trash2, Eye, EyeOff, Image,
  Settings, ChevronDown, Info, GripVertical,
  Sun, Moon, Globe, Download,
  Move, Type, Palette, Square, Layers, ExternalLink,
  Copy, ToggleLeft, ToggleRight, AlignLeft, AlignCenter, AlignRight,
  Edit2, Sliders,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import ConfirmModal from '../shared/ConfirmModal'
import {
  getNavigation, createNavigation, updateNavigation, deleteNavigation, reorderNavigation,
  getNavbarSettings, updateNavbarSettings,
} from '../../shared/services/navigationService'
import { updateSiteSettings } from '../../shared/services/siteSettingsService'
import { updateHomeContent } from '../../shared/services/homeContentService'
import { updateFooterContent } from '../../shared/services/footerService'
import api, { getMediaUrl } from '../../shared/services/api'
import { useAuth } from '../authentication/AuthContext'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-gray-400 mt-1.5 italic leading-relaxed flex items-start gap-1.5">
          <Info size={12} className="shrink-0 mt-0.5 text-gray-300" />
          {hint}
        </p>
      )}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${className}`}
    />
  )
}

function Select({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-700 cursor-pointer shrink-0"
      />
      <Input value={value} onChange={onChange} />
    </div>
  )
}

function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        role="checkbox"
        tabIndex={0}
        aria-checked={value}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!value) } }}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-700'}`}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
        />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-400" />
          {title}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 dark:border-slate-800 pt-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ICON_OPTIONS = [
  'Home', 'User', 'Code2', 'FolderKanban', 'Mail', 'Settings',
  'Award', 'BookOpen', 'Cpu', 'Users', 'Trophy', 'Shield',
  'Terminal', 'GraduationCap', 'Star', 'Heart', 'Briefcase',
]

export default function NavigationManagement() {
  const { setUserData, user: authUser } = useAuth()
  const { refreshSettings } = useSiteSettings()
  const [navItems, setNavItems] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('menu-items')
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({ title: '', url: '#', sectionId: '', icon: '', visible: true, active: true, isExternal: false, openNewTab: false })

  const tabs = [
    { id: 'menu-items', label: 'Menu Items', icon: Layout },
    { id: 'navbar', label: 'Navbar Settings', icon: Settings },
    { id: 'logo', label: 'Logo', icon: Image },
    { id: 'components', label: 'Components', icon: Sliders },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [navRes, settingsRes] = await Promise.all([getNavigation(), getNavbarSettings()])
      setNavItems(navRes.items || [])
      setSettings(settingsRes.settings || {})
      if (!settingsRes.settings) {
        // Create default settings
        try {
          const r = await getNavbarSettings()
          setSettings(r.settings || {})
        } catch {}
      }
    } catch {
      setToast({ message: 'Failed to load navigation data', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  function updateSetting(path, value) {
    setSettings((prev) => {
      const keys = path.split('.')
      const newSettings = { ...prev }
      let obj = newSettings
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  async function handleSaveSettings() {
    setSaving(true)
    try {
      await updateNavbarSettings(settings)
      try {
        await updateSiteSettings({
          brandName: settings.brandName,
          logoImage: settings.logo,
          logoSvg: settings.logoSvg,
          logoText: settings.logoAlt,
          logoWidth: settings.logoWidth,
          logoHeight: settings.logoHeight,
          logoBorderRadius: settings.logoBorderRadius,
          logoBgColor: settings.logoBgColor,
          logoPosition: settings.logoPosition,
        })
      } catch {}
      try {
        await updateHomeContent({
          hero: {
            fullName: settings.brandName,
            profilePhoto: { url: settings.logo || '', alt: settings.logoAlt || '' },
          },
        })
      } catch {}
      try {
        const fd = new FormData()
        fd.append('brandName', settings.brandName || '')
        fd.append('footerLogoUrl', settings.logo || '')
        await updateFooterContent(fd)
      } catch {}
      if (authUser) {
        setUserData({ ...authUser, displayName: settings.brandName, avatar: getMediaUrl(settings.logo) || settings.logo })
      }
      refreshSettings()
      setToast({ message: 'Settings saved successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // ─── Navigation Items CRUD ────────────────────────────────────────

  async function handleCreateItem(e) {
    e.preventDefault()
    try {
      await createNavigation(form)
      setToast({ message: 'Menu item created', type: 'success' })
      setShowForm(false)
      setForm({ title: '', url: '#', sectionId: '', icon: '', visible: true, active: true, isExternal: false, openNewTab: false })
      const navRes = await getNavigation()
      setNavItems(navRes.items || [])
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create item', type: 'error' })
    }
  }

  async function handleUpdateItem(e) {
    e.preventDefault()
    if (!editingItem) return
    try {
      await updateNavigation(editingItem._id, form)
      setToast({ message: 'Menu item updated', type: 'success' })
      setEditingItem(null)
      setShowForm(false)
      setForm({ title: '', url: '#', sectionId: '', icon: '', visible: true, active: true, isExternal: false, openNewTab: false })
      const navRes = await getNavigation()
      setNavItems(navRes.items || [])
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update item', type: 'error' })
    }
  }

  function handleDeleteItem(id) {
    setDeleteTarget(id)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteNavigation(deleteTarget)
      setToast({ message: 'Menu item deleted', type: 'success' })
      setDeleteTarget(null)
      const navRes = await getNavigation()
      setNavItems(navRes.items || [])
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete item', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  function handleEditItem(item) {
    setEditingItem(item)
    setForm({ title: item.title, url: item.url, sectionId: item.sectionId || '', icon: item.icon || '', visible: item.visible, active: item.active, isExternal: item.isExternal, openNewTab: item.openNewTab })
    setShowForm(true)
  }

  function handleDuplicateItem(item) {
    setForm({ title: `${item.title} (copy)`, url: item.url, sectionId: item.sectionId || '', icon: item.icon || '', visible: true, active: true, isExternal: item.isExternal, openNewTab: item.openNewTab })
    setShowForm(true)
  }

  async function handleToggleVisibility(id, current) {
    try {
      await updateNavigation(id, { visible: !current })
      const navRes = await getNavigation()
      setNavItems(navRes.items || [])
    } catch {}
  }

  async function handleToggleActive(id, current) {
    try {
      await updateNavigation(id, { active: !current })
      const navRes = await getNavigation()
      setNavItems(navRes.items || [])
    } catch {}
  }

  async function handleMoveItem(index, direction) {
    const items = [...navItems]
    const target = index + direction
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]]
    const reordered = items.map((item, i) => ({ _id: item._id, order: i }))
    try {
      await reorderNavigation(reordered)
      setNavItems(items)
    } catch {}
  }

  // ─── Render ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Navigation Management"
        subtitle="Full control over the public navbar — menu items, logo, colors, responsive behavior, and more."
      />

      {/* ── Tabs ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:border-primary/30'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MENU ITEMS ─────────────────────────────── */}
      {activeTab === 'menu-items' && (
        <div className="space-y-6">
          <Card>
            <CardHeader icon={Layout} title="Menu Items" subtitle="Create and manage navigation links for the public navbar." />
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <div className="col-span-1"></div>
                <div className="col-span-3">Title</div>
                <div className="col-span-2">Section ID</div>
                <div className="col-span-2">URL</div>
                <div className="col-span-1">Order</div>
                <div className="col-span-1">Visible</div>
                <div className="col-span-1">Active</div>
                <div className="col-span-1">Actions</div>
              </div>
              {navItems.map((item, i) => (
                <motion.div
                  key={item._id}
                  layout
                  className="grid grid-cols-12 gap-3 items-center px-3 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700"
                >
                  <div className="col-span-1 flex gap-1">
                    <button onClick={() => handleMoveItem(i, -1)} className="p-1 text-gray-400 hover:text-primary" title="Move up"><ChevronDown size={14} className="rotate-180" /></button>
                    <button onClick={() => handleMoveItem(i, 1)} className="p-1 text-gray-400 hover:text-primary" title="Move down"><ChevronDown size={14} /></button>
                  </div>
                  <div className="col-span-3 text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</div>
                  <div className="col-span-2 text-xs text-gray-500 truncate">{item.sectionId || '—'}</div>
                  <div className="col-span-2 text-xs text-gray-500 truncate">{item.url}</div>
                  <div className="col-span-1 text-xs text-gray-500">{item.order}</div>
                  <div className="col-span-1">
                    <button onClick={() => handleToggleVisibility(item._id, item.visible)} title={item.visible ? 'Visible' : 'Hidden'}>
                      {item.visible ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-gray-400" />}
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button onClick={() => handleToggleActive(item._id, item.active)} title={item.active ? 'Active' : 'Inactive'}>
                      {item.active ? <ToggleRight size={14} className="text-primary" /> : <ToggleLeft size={14} className="text-gray-400" />}
                    </button>
                  </div>
                  <div className="col-span-1 flex gap-1">
                    <button onClick={() => handleEditItem(item)} className="p-1 text-gray-400 hover:text-primary" title="Edit"><Edit2 size={14} /></button>
                    <button onClick={() => handleDuplicateItem(item)} className="p-1 text-gray-400 hover:text-primary" title="Duplicate"><Copy size={14} /></button>
                    <button onClick={() => handleDeleteItem(item._id)} className="p-1 text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
              {navItems.length === 0 && (
                <p className="text-sm text-gray-400 italic py-4 text-center">No menu items yet. Add your first navigation link.</p>
              )}
            </div>

            <button
              onClick={() => { setShowForm(true); setEditingItem(null); setForm({ title: '', url: '#', sectionId: '', icon: '', visible: true, active: true, isExternal: false, openNewTab: false }) }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
            >
              <Plus size={16} />
              Add Menu Item
            </button>
          </Card>

          {/* Item Form Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card>
                  <CardHeader icon={editingItem ? Settings : Plus} title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'} />
                  <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Menu Title">
                        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Home" required />
                      </Field>
                      <Field label="Section ID">
                        <Input value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} placeholder="e.g. home, about, skills" />
                      </Field>
                      <Field label="URL">
                        <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="#home or https://..." />
                      </Field>
                      <Field label="Icon">
                        <Select
                          value={form.icon}
                          onChange={(e) => setForm({ ...form, icon: e.target.value })}
                          options={[{ value: '', label: 'No icon' }, ...ICON_OPTIONS.map((i) => ({ value: i, label: i }))]}
                        />
                      </Field>
                    </div>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={form.isExternal} onChange={(e) => setForm({ ...form, isExternal: e.target.checked })} className="rounded border-gray-300 dark:border-slate-700" />
                        External Link
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={form.openNewTab} onChange={(e) => setForm({ ...form, openNewTab: e.target.checked })} className="rounded border-gray-300 dark:border-slate-700" />
                        Open in New Tab
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="rounded border-gray-300 dark:border-slate-700" />
                        Visible
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300 dark:border-slate-700" />
                        Active
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <Save size={16} />
                        {editingItem ? 'Update' : 'Create'}
                      </button>
                      <button type="button" onClick={() => { setShowForm(false); setEditingItem(null) }} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── NAVBAR SETTINGS ────────────────────────── */}
      {activeTab === 'navbar' && (
        <div className="space-y-6">
          <Card>
            <CardHeader icon={Settings} title="General Settings" subtitle="Basic navbar structure and behavior." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Navbar Height (px)"><Input type="number" value={settings?.navbarHeight ?? 72} onChange={(e) => updateSetting('navbarHeight', Number(e.target.value))} /></Field>
              <Field label="Navbar Width"><Input value={settings?.navbarWidth ?? '100%'} onChange={(e) => updateSetting('navbarWidth', e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <Toggle value={settings?.transparent} onChange={(v) => updateSetting('transparent', v)} label="Transparent" />
              <Toggle value={settings?.fixed} onChange={(v) => updateSetting('fixed', v)} label="Fixed Navbar" />
            </div>
          </Card>

          <Card>
            <CardHeader icon={Palette} title="Color Settings" subtitle="Colors for the navbar." />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Background"><ColorInput value={settings?.bgColor ?? '#ffffff'} onChange={(e) => updateSetting('bgColor', e.target.value)} /></Field>
              <Field label="Text Color"><ColorInput value={settings?.textColor ?? '#6b7280'} onChange={(e) => updateSetting('textColor', e.target.value)} /></Field>
              <Field label="Hover Color"><ColorInput value={settings?.hoverColor ?? '#6366f1'} onChange={(e) => updateSetting('hoverColor', e.target.value)} /></Field>
              <Field label="Active Link Color"><ColorInput value={settings?.activeLinkColor ?? '#6366f1'} onChange={(e) => updateSetting('activeLinkColor', e.target.value)} /></Field>
              <Field label="Border Color"><ColorInput value={settings?.borderColor ?? '#e5e7eb'} onChange={(e) => updateSetting('borderColor', e.target.value)} /></Field>
              <Field label="Shadow Color"><ColorInput value={settings?.shadowColor ?? 'rgba(0,0,0,0.1)'} onChange={(e) => updateSetting('shadowColor', e.target.value)} /></Field>
            </div>
          </Card>

          <Card>
            <CardHeader icon={Layers} title="Effects & Spacing" subtitle="Shadow and menu gap settings." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Toggle value={settings?.shadow} onChange={(v) => updateSetting('shadow', v)} label="Box Shadow" />
              <Field label="Menu Gap (px)"><Input type="number" value={settings?.menuGap ?? 24} onChange={(e) => updateSetting('menuGap', Number(e.target.value))} /></Field>
            </div>
          </Card>
        </div>
      )}

      {/* ── LOGO ──────────────────────────────────── */}
      {activeTab === 'logo' && (
        <Card>
          <CardHeader icon={Image} title="Logo Management" subtitle="Control the public navbar logo." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Logo Image URL">
              <Input value={settings?.logo ?? ''} onChange={(e) => updateSetting('logo', e.target.value)} placeholder="URL to logo image" />
            </Field>
            <Field label="SVG Logo">
              <Input value={settings?.logoSvg ?? ''} onChange={(e) => updateSetting('logoSvg', e.target.value)} placeholder="Paste SVG code or URL" />
            </Field>
            <Field label="Brand Name">
              <Input value={settings?.brandName ?? 'DESALEGN'} onChange={(e) => updateSetting('brandName', e.target.value)} />
            </Field>
            <Field label="Logo Alt Text">
              <Input value={settings?.logoAlt ?? ''} onChange={(e) => updateSetting('logoAlt', e.target.value)} />
            </Field>
            <Field label="Logo Width (px)">
              <Input type="number" value={settings?.logoWidth ?? 40} onChange={(e) => updateSetting('logoWidth', Number(e.target.value))} />
            </Field>
            <Field label="Logo Height (px)">
              <Input type="number" value={settings?.logoHeight ?? 40} onChange={(e) => updateSetting('logoHeight', Number(e.target.value))} />
            </Field>
            <Field label="Border Radius (px)">
              <Input type="number" value={settings?.logoBorderRadius ?? 8} onChange={(e) => updateSetting('logoBorderRadius', Number(e.target.value))} />
            </Field>
            <Field label="Background Color">
              <ColorInput value={settings?.logoBgColor ?? 'transparent'} onChange={(e) => updateSetting('logoBgColor', e.target.value)} />
            </Field>
            <Field label="Logo Position">
              <Select
                value={settings?.logoPosition ?? 'left'}
                onChange={(e) => updateSetting('logoPosition', e.target.value)}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            </Field>
          </div>
          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Logo Preview</p>
            <div className="flex items-center gap-3" style={{ justifyContent: settings?.logoPosition || 'left' }}>
              <div
                className="overflow-hidden flex items-center justify-center"
                style={{
                  width: (settings?.logoWidth || 40),
                  height: (settings?.logoHeight || 40),
                  borderRadius: (settings?.logoBorderRadius || 8),
                  backgroundColor: settings?.logoBgColor || 'transparent',
                }}
              >
                {settings?.logo ? (
                  <img src={settings.logo.startsWith('http') ? settings.logo : `http://localhost:5000${settings.logo}`} alt={settings?.logoAlt || 'Logo'} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-sm font-black">
                    {(settings?.brandName || 'D').charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{settings?.brandName || 'DESALEGN'}</span>
            </div>
          </div>
        </Card>
      )}

      {/* ── COMPONENTS ──────────────────────────── */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          <Card>
            <CardHeader icon={Download} title="Resume Button" subtitle="Configure the CV download button in the navbar." />
            <Toggle value={settings?.resumeEnabled} onChange={(v) => updateSetting('resumeEnabled', v)} label="Enable Resume Button" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Field label="Button Text"><Input value={settings?.resumeText ?? 'Download CV'} onChange={(e) => updateSetting('resumeText', e.target.value)} /></Field>
              <Field label="Resume File URL"><Input value={settings?.resumeFileUrl ?? ''} onChange={(e) => updateSetting('resumeFileUrl', e.target.value)} placeholder="/resume.pdf or full URL" /></Field>
              <Field label="Button Icon">
                <Select value={settings?.resumeIcon ?? 'Download'} onChange={(e) => updateSetting('resumeIcon', e.target.value)} options={[{ value: 'Download', label: 'Download' }, { value: 'FileText', label: 'File' }, { value: 'ExternalLink', label: 'External' }]} />
              </Field>
              <Field label="Icon Position">
                <Select value={settings?.resumeIconPosition ?? 'left'} onChange={(e) => updateSetting('resumeIconPosition', e.target.value)} options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]} />
              </Field>
              <Field label="Background Color"><ColorInput value={settings?.resumeBgColor ?? '#6366f1'} onChange={(e) => updateSetting('resumeBgColor', e.target.value)} /></Field>
              <Field label="Text Color"><ColorInput value={settings?.resumeTextColor ?? '#ffffff'} onChange={(e) => updateSetting('resumeTextColor', e.target.value)} /></Field>
              <Field label="Hover Color"><ColorInput value={settings?.resumeHoverColor ?? '#4f46e5'} onChange={(e) => updateSetting('resumeHoverColor', e.target.value)} /></Field>
              <Field label="Border Radius (px)"><Input type="number" value={settings?.resumeBorderRadius ?? 9999} onChange={(e) => updateSetting('resumeBorderRadius', Number(e.target.value))} /></Field>
              <Field label="Button Size">
                <Select value={settings?.resumeButtonSize ?? 'md'} onChange={(e) => updateSetting('resumeButtonSize', e.target.value)} options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader icon={Globe} title="Language" subtitle="Configure the language switcher in the navbar." />
            <Toggle value={settings?.languageEnabled} onChange={(v) => updateSetting('languageEnabled', v)} label="Enable Language Switcher" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Field label="Default Language">
                <Select
                  value={settings?.defaultLanguage ?? 'en'}
                  onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'am', label: 'Amharic' },
                    { value: 'ar', label: 'Arabic' },
                    { value: 'fr', label: 'French' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'de', label: 'German' },
                  ]}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader icon={Sun} title="Theme" subtitle="Light and dark mode configuration for the navbar." />
            <Toggle value={settings?.themeEnabled} onChange={(v) => updateSetting('themeEnabled', v)} label="Enable Theme Toggle" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Field label="Default Theme Mode">
                <Select
                  value={settings?.themeMode ?? 'auto'}
                  onChange={(e) => updateSetting('themeMode', e.target.value)}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto (System)' },
                  ]}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2"><Sun size={14} /> Light Theme</h4>
                <div className="space-y-3">
                  <Field label="Background"><ColorInput value={settings?.lightTheme?.bgColor ?? '#ffffff'} onChange={(e) => updateSetting('lightTheme.bgColor', e.target.value)} /></Field>
                  <Field label="Text Color"><ColorInput value={settings?.lightTheme?.textColor ?? '#1f2937'} onChange={(e) => updateSetting('lightTheme.textColor', e.target.value)} /></Field>
                  <Field label="Hover Color"><ColorInput value={settings?.lightTheme?.hoverColor ?? '#6366f1'} onChange={(e) => updateSetting('lightTheme.hoverColor', e.target.value)} /></Field>
                </div>
              </div>
              <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2"><Moon size={14} /> Dark Theme</h4>
                <div className="space-y-3">
                  <Field label="Background"><input type="color" value={settings?.darkTheme?.bgColor ?? '#0f172a'} onChange={(e) => updateSetting('darkTheme.bgColor', e.target.value)} className="w-full h-10 rounded-lg border border-gray-600 cursor-pointer" /></Field>
                  <Field label="Text Color"><input type="color" value={settings?.darkTheme?.textColor ?? '#e2e8f0'} onChange={(e) => updateSetting('darkTheme.textColor', e.target.value)} className="w-full h-10 rounded-lg border border-gray-600 cursor-pointer" /></Field>
                  <Field label="Hover Color"><input type="color" value={settings?.darkTheme?.hoverColor ?? '#818cf8'} onChange={(e) => updateSetting('darkTheme.hoverColor', e.target.value)} className="w-full h-10 rounded-lg border border-gray-600 cursor-pointer" /></Field>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Save Button ───────────────────────────── */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <><RefreshCw size={18} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={18} /> Save All Settings</>
          )}
        </button>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${navItems.find((i) => i._id === deleteTarget)?.title || 'this item'}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        confirmText="Delete"
        variant="danger"
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
