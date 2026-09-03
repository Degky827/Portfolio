import { Award } from 'lucide-react'

export default function CVHighlights({ achievements }) {
  if (!achievements || achievements.length === 0) return null

  return (
    <section className="mb-6" aria-label="Professional highlights">
      <h2 className="cv-section-title">Professional Highlights</h2>
      <ul className="space-y-2">
        {achievements.map((ach) => (
          <li key={ach.id} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
            <Award size={13} className="shrink-0 mt-0.5 text-[var(--accent-cv)] dark:text-[var(--accent-cv)] opacity-70" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-slate-800 dark:text-slate-200">{ach.title}</strong>
              {ach.description ? ` — ${ach.description}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
