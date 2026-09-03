import { Briefcase } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  if (!month) return year
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function CVExperience({ experience }) {
  if (!experience || experience.length === 0) return null

  return (
    <section className="mb-6" aria-label="Work experience">
      <h2 className="cv-section-title">Experience</h2>
      <div className="space-y-5">
        {experience.map((job) => (
          <div key={job.id} className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-700">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[var(--accent-cv)] dark:bg-[var(--accent-cv)]" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
                {job.title}
              </h3>
              <span className="text-[12px] text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">
                {formatDate(job.startDate)} — {job.current ? 'Present' : formatDate(job.endDate)}
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {job.company}{job.location ? ` · ${job.location}` : ''}
            </p>
            {job.bullets && job.bullets.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {job.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                    <Briefcase size={11} className="shrink-0 mt-1 text-[var(--accent-cv)] dark:text-[var(--accent-cv)] opacity-60" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
