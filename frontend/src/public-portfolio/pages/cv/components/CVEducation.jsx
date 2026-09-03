import { GraduationCap } from 'lucide-react'

export default function CVEducation({ education }) {
  if (!education || education.length === 0) return null

  return (
    <section className="mb-6" aria-label="Education">
      <h2 className="cv-section-title">Education</h2>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-700">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[var(--accent-cv)] dark:bg-[var(--accent-cv)]" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
                {edu.degree}
              </h3>
              <span className="text-[12px] text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">
                {edu.startDate} — {edu.endDate}{edu.expected ? ' (Expected)' : ''}
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {edu.institution}{edu.location ? ` · ${edu.location}` : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
