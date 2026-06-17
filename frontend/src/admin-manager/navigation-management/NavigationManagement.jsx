import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Layout, Plus, Trash2, Eye, EyeOff, Image,
  Settings, ChevronDown, Info, GripVertical, Monitor, Tablet,
  Smartphone, Menu, Sun, Moon, Globe, Download, PanelRight,
  PanelLeft, Move, Type, Palette, Square, Layers, ExternalLink,
  Copy, ToggleLeft, ToggleRight, AlignLeft, AlignCenter, AlignRight,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import {
  getNavigation, createNavigation, updateNavigation, deleteNavigation, reorderNavigation,
  getNavbarSettings, updateNavbarSettings,
} from '../../shared/services/navigationService'

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

const RESPONSIVE_PRESETS = {
  desktop: [
    { label: 'Desktop HD', w: 1920, h: 1080 },
    { label: 'Desktop', w: 1440, h: 900 },
    { label: 'Small Desktop', w: 1024, h: 768 },
  ],
  tablet: [
    { label: 'iPad Pro', w: 1024, h: 1366 },
    { label: 'iPad', w: 768, h: 1024 },
  ],
  mobile: [
    { label: 'iPhone 14', w: 390, h: 844 },
    { label: 'iPhone SE', w: 375, h: 667 },
    { label: 'Pixel 7', w: 412, h: 915 },
  ],
}

const HAMBURGER_STYLES = [
  { value: 'three-lines', label: 'Three Horizontal Lines', icon: '☰' },
  { value: 'rounded-lines', label: 'Rounded Lines', icon: '☰' },
  { value: 'minimal-lines', label: 'Minimal Lines', icon: '≡' },
  { value: 'modern-animated', label: 'Modern Animated', icon: '⋮' },
  { value: 'material', label: 'Material Design', icon: '⎔' },
  { value: 'ios', label: 'iOS Style', icon: '☰' },
  { value: 'custom-svg', label: 'Custom SVG', icon: '✚' },
]

const ICON_OPTIONS = [
  'Home', 'User', 'Code2', 'FolderKanban', 'Mail', 'Settings',
  'Award', 'BookOpen', 'Cpu', 'Users', 'Trophy', 'Shield',
  'Terminal', 'GraduationCap', 'Star', 'Heart', 'Briefcase',
]

export default function NavigationManagement() {
  const [navItems, setNavItems] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('menu-items')
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', url: '#', sectionId: '', icon: '', visible: true, active: true, isExternal: false, openNewTab: false })

  const tabs = [
    { id: 'menu-items', label: 'Menu Items', icon: Layout },
    { id: 'navbar', label: 'Navbar Settings', icon: Settings },
    { id: 'logo', label: 'Logo', icon: Image },
    { id: 'resume', label: 'Resume Button', icon: Download },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'theme', label: 'Theme', icon: Sun },
    { id: 'responsive', label: 'Responsive', icon: Monitor },
    { id: 'hamburger', label: 'Hamburger', icon: Menu },
    { id: 'animations', label: 'Animations', icon: Layers },
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

  async function handleDeleteItem(id) {
    if (!window.confirm('Delete this menu item?')) return
    try {
      await deleteNavigation(id)
      setToast({ message: 'Menu item deleted', type: 'success' })
      const navRes = await getNavigation()
      setNavItems(navRes.items || [])
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete item', type: 'error' })
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
                    <button onClick={() => handleEditItem(item)} className="p-1 text-gray-400 hover:text-primary" title="Edit"><Settings size={14} /></button>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Navbar Height (px)"><Input type="number" value={settings?.navbarHeight ?? 72} onChange={(e) => updateSetting('navbarHeight', Number(e.target.value))} /></Field>
              <Field label="Navbar Width"><Input value={settings?.navbarWidth ?? '100%'} onChange={(e) => updateSetting('navbarWidth', e.target.value)} /></Field>
              <Field label="Container Width"><Input value={settings?.containerWidth ?? '1200px'} onChange={(e) => updateSetting('containerWidth', e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Toggle value={settings?.sticky} onChange={(v) => updateSetting('sticky', v)} label="Sticky Navbar" />
              <Toggle value={settings?.transparent} onChange={(v) => updateSetting('transparent', v)} label="Transparent" />
              <Toggle value={settings?.fixed} onChange={(v) => updateSetting('fixed', v)} label="Fixed Navbar" />
              <Toggle value={settings?.fullWidth} onChange={(v) => updateSetting('fullWidth', v)} label="Full Width" />
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
            <CardHeader icon={Layers} title="Effects & Spacing" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Toggle value={settings?.glassmorphism} onChange={(v) => updateSetting('glassmorphism', v)} label="Glassmorphism" />
              <Toggle value={settings?.blurEffect} onChange={(v) => updateSetting('blurEffect', v)} label="Blur Effect" />
              <Toggle value={settings?.shadow} onChange={(v) => updateSetting('shadow', v)} label="Shadow" />
              <Toggle value={settings?.backdropFilter} onChange={(v) => updateSetting('backdropFilter', v)} label="Backdrop Filter" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <Field label="Logo Margin (px)"><Input type="number" value={settings?.logoMargin ?? 0} onChange={(e) => updateSetting('logoMargin', Number(e.target.value))} /></Field>
              <Field label="Menu Gap (px)"><Input type="number" value={settings?.menuGap ?? 24} onChange={(e) => updateSetting('menuGap', Number(e.target.value))} /></Field>
              <Field label="Navbar Padding (px)"><Input type="number" value={settings?.navbarPadding ?? 16} onChange={(e) => updateSetting('navbarPadding', Number(e.target.value))} /></Field>
              <Field label="Button Padding (px)"><Input type="number" value={settings?.buttonPadding ?? 12} onChange={(e) => updateSetting('buttonPadding', Number(e.target.value))} /></Field>
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

      {/* ── RESUME BUTTON ─────────────────────────── */}
      {activeTab === 'resume' && (
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
      )}

      {/* ── LANGUAGE ──────────────────────────────── */}
      {activeTab === 'language' && (
        <Card>
          <CardHeader icon={Globe} title="Language Settings" subtitle="Configure the language switcher in the navbar." />
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
      )}

      {/* ── THEME ─────────────────────────────────── */}
      {activeTab === 'theme' && (
        <Card>
          <CardHeader icon={Sun} title="Theme Settings" subtitle="Light and dark mode configuration for the navbar." />
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
      )}

      {/* ── RESPONSIVE ────────────────────────────── */}
      {activeTab === 'responsive' && (
        <div className="space-y-6">
          {/* Desktop */}
          <Card>
            <CardHeader icon={Monitor} title="Desktop Navigation" subtitle="≥ 1024px" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Toggle value={settings?.desktopShowFullMenu} onChange={(v) => updateSetting('desktopShowFullMenu', v)} label="Show Full Menu" />
              <Toggle value={settings?.desktopShowResume} onChange={(v) => updateSetting('desktopShowResume', v)} label="Show Resume Button" />
              <Toggle value={settings?.desktopShowTheme} onChange={(v) => updateSetting('desktopShowTheme', v)} label="Show Theme Toggle" />
              <Toggle value={settings?.desktopShowLanguage} onChange={(v) => updateSetting('desktopShowLanguage', v)} label="Show Language Switcher" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <Field label="Layout">
                <Select
                  value={settings?.desktopLayout ?? 'logo-left-menu-right'}
                  onChange={(e) => updateSetting('desktopLayout', e.target.value)}
                  options={[
                    { value: 'logo-left-menu-center', label: 'Logo Left, Menu Center' },
                    { value: 'logo-left-menu-right', label: 'Logo Left, Menu Right' },
                    { value: 'centered', label: 'Centered' },
                    { value: 'split', label: 'Split Navigation' },
                  ]}
                />
              </Field>
              <Field label="Navbar Height (px)"><Input type="number" value={settings?.desktopNavbarHeight ?? 72} onChange={(e) => updateSetting('desktopNavbarHeight', Number(e.target.value))} /></Field>
              <Field label="Logo Size (px)"><Input type="number" value={settings?.desktopLogoSize ?? 40} onChange={(e) => updateSetting('desktopLogoSize', Number(e.target.value))} /></Field>
              <Field label="Menu Gap (px)"><Input type="number" value={settings?.desktopMenuGap ?? 24} onChange={(e) => updateSetting('desktopMenuGap', Number(e.target.value))} /></Field>
              <Field label="Font Size"><Input value={settings?.desktopFontSize ?? '12px'} onChange={(e) => updateSetting('desktopFontSize', e.target.value)} /></Field>
              <Field label="Icon Size (px)"><Input type="number" value={settings?.desktopIconSize ?? 16} onChange={(e) => updateSetting('desktopIconSize', Number(e.target.value))} /></Field>
            </div>
          </Card>

          {/* Tablet */}
          <Card>
            <CardHeader icon={Tablet} title="Tablet Navigation" subtitle="768px – 1023px" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Toggle value={settings?.tabletShowFullMenu} onChange={(v) => updateSetting('tabletShowFullMenu', v)} label="Show Full Menu" />
              <Toggle value={settings?.tabletShowHamburger} onChange={(v) => updateSetting('tabletShowHamburger', v)} label="Show Hamburger Menu" />
            </div>
            <Field label="Navigation Type" className="pt-4">
              <Select
                value={settings?.tabletNavigationType ?? 'hamburger'}
                onChange={(e) => updateSetting('tabletNavigationType', e.target.value)}
                options={[
                  { value: 'horizontal', label: 'Horizontal' },
                  { value: 'dropdown', label: 'Dropdown' },
                  { value: 'hamburger', label: 'Hamburger' },
                ]}
              />
            </Field>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <Field label="Navbar Height (px)"><Input type="number" value={settings?.tabletNavbarHeight ?? 64} onChange={(e) => updateSetting('tabletNavbarHeight', Number(e.target.value))} /></Field>
              <Field label="Logo Size (px)"><Input type="number" value={settings?.tabletLogoSize ?? 36} onChange={(e) => updateSetting('tabletLogoSize', Number(e.target.value))} /></Field>
              <Field label="Menu Gap (px)"><Input type="number" value={settings?.tabletMenuGap ?? 16} onChange={(e) => updateSetting('tabletMenuGap', Number(e.target.value))} /></Field>
              <Field label="Font Size"><Input value={settings?.tabletFontSize ?? '11px'} onChange={(e) => updateSetting('tabletFontSize', e.target.value)} /></Field>
              <Field label="Icon Size (px)"><Input type="number" value={settings?.tabletIconSize ?? 14} onChange={(e) => updateSetting('tabletIconSize', Number(e.target.value))} /></Field>
            </div>
          </Card>

          {/* Mobile */}
          <Card>
            <CardHeader icon={Smartphone} title="Mobile Navigation" subtitle="320px – 767px" />
            <div className="grid grid-cols-2 gap-4">
              <Toggle value={settings?.mobileMenuEnabled} onChange={(v) => updateSetting('mobileMenuEnabled', v)} label="Enable Mobile Menu" />
              <Toggle value={settings?.mobileDrawerEnabled} onChange={(v) => updateSetting('mobileDrawerEnabled', v)} label="Enable Drawer Menu" />
              <Toggle value={settings?.mobileFullScreenMenu} onChange={(v) => updateSetting('mobileFullScreenMenu', v)} label="Full Screen Menu" />
              <Toggle value={settings?.mobileSlideMenu} onChange={(v) => updateSetting('mobileSlideMenu', v)} label="Slide Menu" />
            </div>
            <Field label="Mobile Layout">
              <Select
                value={settings?.mobileLayout ?? 'logo-hamburger'}
                onChange={(e) => updateSetting('mobileLayout', e.target.value)}
                options={[
                  { value: 'logo-only', label: 'Logo Only' },
                  { value: 'logo-hamburger', label: 'Logo + Hamburger' },
                  { value: 'logo-resume-hamburger', label: 'Logo + Resume + Hamburger' },
                ]}
              />
            </Field>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <Field label="Navbar Height (px)"><Input type="number" value={settings?.mobileNavbarHeight ?? 56} onChange={(e) => updateSetting('mobileNavbarHeight', Number(e.target.value))} /></Field>
              <Field label="Logo Size (px)"><Input type="number" value={settings?.mobileLogoSize ?? 32} onChange={(e) => updateSetting('mobileLogoSize', Number(e.target.value))} /></Field>
              <Field label="Menu Gap (px)"><Input type="number" value={settings?.mobileMenuGap ?? 12} onChange={(e) => updateSetting('mobileMenuGap', Number(e.target.value))} /></Field>
              <Field label="Font Size"><Input value={settings?.mobileFontSize ?? '10px'} onChange={(e) => updateSetting('mobileFontSize', e.target.value)} /></Field>
              <Field label="Icon Size (px)"><Input type="number" value={settings?.mobileIconSize ?? 14} onChange={(e) => updateSetting('mobileIconSize', Number(e.target.value))} /></Field>
            </div>
          </Card>
        </div>
      )}

      {/* ── HAMBURGER ─────────────────────────────── */}
      {activeTab === 'hamburger' && (
        <div className="space-y-6">
          <Card>
            <CardHeader icon={Menu} title="Hamburger Menu Settings" subtitle="Style, position, and behavior." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Menu Position">
                <div className="flex gap-3">
                  {[
                    { value: 'left', label: 'Left', icon: PanelLeft },
                    { value: 'right', label: 'Right', icon: PanelRight },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateSetting('hamburgerPosition', opt.value)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        (settings?.hamburgerPosition || 'right') === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <opt.icon size={16} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Menu Style">
                <Select
                  value={settings?.hamburgerStyle ?? 'three-lines'}
                  onChange={(e) => updateSetting('hamburgerStyle', e.target.value)}
                  options={HAMBURGER_STYLES}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Width (px)"><Input type="number" value={settings?.hamburgerWidth ?? 24} onChange={(e) => updateSetting('hamburgerWidth', Number(e.target.value))} /></Field>
              <Field label="Height (px)"><Input type="number" value={settings?.hamburgerHeight ?? 18} onChange={(e) => updateSetting('hamburgerHeight', Number(e.target.value))} /></Field>
              <Field label="Thickness (px)"><Input type="number" value={settings?.hamburgerThickness ?? 2} onChange={(e) => updateSetting('hamburgerThickness', Number(e.target.value))} /></Field>
              <Field label="Color"><ColorInput value={settings?.hamburgerColor ?? '#374151'} onChange={(e) => updateSetting('hamburgerColor', e.target.value)} /></Field>
              <Field label="Hover Color"><ColorInput value={settings?.hamburgerHoverColor ?? '#6366f1'} onChange={(e) => updateSetting('hamburgerHoverColor', e.target.value)} /></Field>
              <Field label="Active Color"><ColorInput value={settings?.hamburgerActiveColor ?? '#6366f1'} onChange={(e) => updateSetting('hamburgerActiveColor', e.target.value)} /></Field>
              <Field label="Animation">
                <Select
                  value={settings?.hamburgerAnimation ?? 'rotate-to-x'}
                  onChange={(e) => updateSetting('hamburgerAnimation', e.target.value)}
                  options={[
                    { value: 'rotate-to-x', label: 'Rotate To X' },
                    { value: 'morph-to-x', label: 'Morph To X' },
                    { value: 'fade', label: 'Fade' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'elastic', label: 'Elastic' },
                  ]}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader icon={PanelRight} title="Drawer Settings" subtitle="Mobile navigation drawer." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Drawer Type">
                <Select
                  value={settings?.drawerType ?? 'slide-right'}
                  onChange={(e) => updateSetting('drawerType', e.target.value)}
                  options={[
                    { value: 'slide-left', label: 'Slide From Left' },
                    { value: 'slide-right', label: 'Slide From Right' },
                    { value: 'slide-top', label: 'Slide From Top' },
                    { value: 'fullscreen', label: 'Full Screen Overlay' },
                  ]}
                />
              </Field>
              <Field label="Drawer Width">
                <Select
                  value={settings?.drawerWidth ?? '80%'}
                  onChange={(e) => updateSetting('drawerWidth', e.target.value)}
                  options={[
                    { value: '70%', label: '70%' },
                    { value: '80%', label: '80%' },
                    { value: '90%', label: '90%' },
                    { value: '100%', label: '100%' },
                  ]}
                />
              </Field>
              <Field label="Background Color"><ColorInput value={settings?.drawerBgColor ?? '#ffffff'} onChange={(e) => updateSetting('drawerBgColor', e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Toggle value={settings?.drawerBlur} onChange={(v) => updateSetting('drawerBlur', v)} label="Blur Effect" />
              <Toggle value={settings?.drawerShadow} onChange={(v) => updateSetting('drawerShadow', v)} label="Shadow" />
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Drawer Content</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Toggle value={settings?.drawerShowLogo} onChange={(v) => updateSetting('drawerShowLogo', v)} label="Show Logo" />
                <Toggle value={settings?.drawerShowLinks} onChange={(v) => updateSetting('drawerShowLinks', v)} label="Show Links" />
                <Toggle value={settings?.drawerShowSocial} onChange={(v) => updateSetting('drawerShowSocial', v)} label="Show Social Icons" />
                <Toggle value={settings?.drawerShowResume} onChange={(v) => updateSetting('drawerShowResume', v)} label="Show Resume Button" />
                <Toggle value={settings?.drawerShowTheme} onChange={(v) => updateSetting('drawerShowTheme', v)} label="Show Theme Toggle" />
                <Toggle value={settings?.drawerShowLanguage} onChange={(v) => updateSetting('drawerShowLanguage', v)} label="Show Language Switcher" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── ANIMATIONS ────────────────────────────── */}
      {activeTab === 'animations' && (
        <Card>
          <CardHeader icon={Layers} title="Animation Settings" subtitle="Framer Motion animations for the navbar." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Navbar Animation">
              <Select
                value={settings?.navbarAnimation ?? 'slide-down'}
                onChange={(e) => updateSetting('navbarAnimation', e.target.value)}
                options={[
                  { value: 'fade-in', label: 'Fade In' },
                  { value: 'slide-down', label: 'Slide Down' },
                  { value: 'slide-up', label: 'Slide Up' },
                  { value: 'blur-reveal', label: 'Blur Reveal' },
                ]}
              />
            </Field>
            <Field label="Hover Effect">
              <Select
                value={settings?.hoverEffect ?? 'underline'}
                onChange={(e) => updateSetting('hoverEffect', e.target.value)}
                options={[
                  { value: 'underline', label: 'Underline Animation' },
                  { value: 'border', label: 'Border Animation' },
                  { value: 'glow', label: 'Glow Animation' },
                  { value: 'scale', label: 'Scale Animation' },
                ]}
              />
            </Field>
            <Field label="Menu Open Animation">
              <Select
                value={settings?.menuOpenAnimation ?? 'slide'}
                onChange={(e) => updateSetting('menuOpenAnimation', e.target.value)}
                options={[
                  { value: 'slide', label: 'Slide' },
                  { value: 'fade', label: 'Fade' },
                  { value: 'scale', label: 'Scale' },
                  { value: 'reveal', label: 'Reveal' },
                ]}
              />
            </Field>
            <Field label="Scroll Effect">
              <Select
                value={settings?.scrollEffect ?? 'shrink'}
                onChange={(e) => updateSetting('scrollEffect', e.target.value)}
                options={[
                  { value: 'shrink', label: 'Navbar Shrink' },
                  { value: 'blur', label: 'Navbar Blur' },
                  { value: 'color-change', label: 'Color Change' },
                  { value: 'none', label: 'None' },
                ]}
              />
            </Field>
          </div>
        </Card>
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

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
