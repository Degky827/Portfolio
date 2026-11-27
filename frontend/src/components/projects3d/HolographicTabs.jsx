import { Layers, Globe, Smartphone } from 'lucide-react'

function HolographicTab({ id, label, icon: Icon, isActive, onClick, count }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none active:scale-[0.98] ${
        isActive
          ? 'bg-[#6C2BFF] text-white shadow-md shadow-[#6C2BFF]/25 border border-[#5b21b6]'
          : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Tab Icon */}
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-colors ${
          isActive
            ? 'bg-white/20 text-white'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}
      >
        <Icon size={16} />
      </div>

      {/* Tab Label */}
      <span className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap">
        {label}
      </span>

      {/* Count Badge */}
      {count !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

export default function HolographicTabs({
  activeTab,
  setActiveTab,
  allCount = 0,
  webCount = 0,
  mobileCount = 0,
}) {
  return (
    <div className="flex justify-center mb-8 sm:mb-10 w-full px-2">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <HolographicTab
          id="all"
          label="All Projects"
          icon={Layers}
          isActive={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
          count={allCount}
        />
        <HolographicTab
          id="web"
          label="Web & Systems"
          icon={Globe}
          isActive={activeTab === 'web'}
          onClick={() => setActiveTab('web')}
          count={webCount}
        />
        <HolographicTab
          id="mobile"
          label="Applications"
          icon={Smartphone}
          isActive={activeTab === 'mobile'}
          onClick={() => setActiveTab('mobile')}
          count={mobileCount}
        />
      </div>
    </div>
  )
}
