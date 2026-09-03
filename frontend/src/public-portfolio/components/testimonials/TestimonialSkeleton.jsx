export default function TestimonialSkeleton() {
  return (
    <div
      className="flex flex-col h-full bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1e293b] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] rounded-[20px] p-6 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="w-[80px] h-[80px] rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="h-3 w-40 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-5 w-36 rounded-md bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>

      <div className="flex-1 pl-6 space-y-2.5">
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
      </div>

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="h-6 w-32 rounded-md bg-slate-100 dark:bg-slate-800" />
        <div className="h-6 w-20 rounded-md bg-slate-100 dark:bg-slate-800" />
        <div className="ml-auto h-4 w-16 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )
}
