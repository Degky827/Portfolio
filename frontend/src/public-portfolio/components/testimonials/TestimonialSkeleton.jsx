export default function TestimonialSkeleton() {
  return (
    <div
      className="flex flex-col bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] rounded-[20px] p-5 sm:p-6 animate-pulse"
      aria-hidden="true"
    >
      {/* Card Header: Avatar + Author Info */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-[80px] h-[80px] rounded-full bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700 shrink-0" />
        <div className="flex-1 pt-1 space-y-2">
          <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-40 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="flex items-center gap-2 mt-1">
            <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-14 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Quote + Text lines */}
      <div className="relative flex-1 mb-4 pl-7 space-y-2.5">
        <div className="absolute top-0 left-0 w-8 h-8 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Footer: Project Badge + LinkedIn icon */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="h-5 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )
}
