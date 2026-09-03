import { ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'

export default function CVProjects({ projects }) {
  if (!projects || projects.length === 0) return null

  return (
    <section className="mb-6" aria-label="Selected projects">
      <h2 className="cv-section-title">Selected Projects</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-white/[0.02] p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3">
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">
                {project.name}
                {project.featured && (
                  <span className="ml-2 inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-[var(--accent-cv)]/10 text-[var(--accent-cv)] dark:text-[var(--accent-cv)]">
                    Featured
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[var(--accent-cv)] dark:text-slate-500 dark:hover:text-[var(--accent-cv)] transition-colors"
                    aria-label={`${project.name} on GitHub`}
                  >
                    <FaGithub size={14} />
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[var(--accent-cv)] dark:text-slate-500 dark:hover:text-[var(--accent-cv)] transition-colors"
                    aria-label={`${project.name} live`}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 mt-1.5">
              {project.description}
            </p>
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
