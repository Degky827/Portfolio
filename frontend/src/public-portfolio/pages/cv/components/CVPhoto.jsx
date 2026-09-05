export default function CVPhoto({ photo, name, title }) {
  const initials = (name || '')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white/20 dark:ring-white/10 shadow-lg">
        {photo ? (
          <img
            src={photo}
            alt={`${name} — ${title}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{initials}</span>
          </div>
        )}
      </div>
    </div>
  )
}
