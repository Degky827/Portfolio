export default function CVSummary({ summary }) {
  if (!summary) return null
  return (
    <section className="mb-6" aria-label="Professional summary">
      <h2 className="cv-section-title">Professional Summary</h2>
      <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-300">
        {summary}
      </p>
    </section>
  )
}
