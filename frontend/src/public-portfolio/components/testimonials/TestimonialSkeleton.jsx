export default function TestimonialSkeleton() {
  return (
    <div
      className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-5 sm:p-6 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-11 h-11 rounded-full bg-[var(--surface)]" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-24 rounded bg-[var(--surface)]" />
          <div className="h-3 w-32 rounded bg-[var(--surface)]" />
        </div>
        <div className="w-5 h-5 rounded bg-[var(--surface)] opacity-20" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-[var(--surface)]" />
        <div className="h-3 w-full rounded bg-[var(--surface)]" />
        <div className="h-3 w-3/4 rounded bg-[var(--surface)]" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
        <div className="h-5 w-28 rounded bg-[var(--surface)]" />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-sm bg-[var(--surface)]" />
          ))}
        </div>
      </div>
    </div>
  )
}
