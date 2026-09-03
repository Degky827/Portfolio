const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  databases: 'Databases',
  devops: 'DevOps & Tools',
}

export default function CVSkills({ skills }) {
  return (
    <div className="space-y-4">
      {Object.entries(skills).map(([category, items]) => (
        <div key={category}>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
            {CATEGORY_LABELS[category] || category}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {items.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[11px] font-medium rounded bg-white/10 text-white/70 leading-relaxed"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
