export default function TestimonialSkeleton() {
  return (
    <div
      className="flex flex-col rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5 sm:p-6 animate-pulse items-center text-center"
      aria-hidden="true"
    >
      {/* Avatar placeholder */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 dark:bg-slate-800 ring-4 ring-slate-200 dark:ring-slate-700 mb-4" />

      {/* Quote mark placeholder */}
      <div className="mb-3">
        <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 mx-auto" />
      </div>

      {/* Text lines */}
      <div className="flex-1 w-full space-y-2.5 mb-4">
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3.5 w-3/4 rounded bg-slate-100 dark:bg-slate-800 mx-auto" />
      </div>

      {/* Badges placeholder */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-5 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Author placeholder */}
      <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center gap-2">
          <div className="h-3.5 w-28 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3.5 w-3.5 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-3 w-36 rounded bg-slate-100 dark:bg-slate-800 mx-auto mt-2" />
        <div className="h-2.5 w-16 rounded bg-slate-100 dark:bg-slate-800 mx-auto mt-1.5" />
      </div>

      {/* Rating stars placeholder */}
      <div className="flex items-center gap-0.5 mt-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  )
}
