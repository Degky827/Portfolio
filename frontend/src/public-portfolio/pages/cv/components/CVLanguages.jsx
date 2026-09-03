export default function CVLanguages({ languages }) {
  return (
    <div className="space-y-2.5">
      {languages.map(({ id, language, proficiency }) => (
        <div key={id} className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-white/90">{language}</span>
          <span className="text-[11px] text-white/50">{proficiency}</span>
        </div>
      ))}
    </div>
  )
}
