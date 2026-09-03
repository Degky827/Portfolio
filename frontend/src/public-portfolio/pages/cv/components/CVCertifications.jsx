export default function CVCertifications({ certifications }) {
  if (!certifications || certifications.length === 0) return null

  return (
    <section className="mb-6" aria-label="Certifications and programs">
      <h2 className="cv-section-title">Certifications & Programs</h2>
      <div className="space-y-3">
        {certifications.map((cert) => (
          <div key={cert.id}>
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">
              {cert.name}
            </h3>
            {cert.track && (
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
                {cert.track}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
