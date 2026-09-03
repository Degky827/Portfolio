export default function CVPhoto({ photo, name, title }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white/20 dark:ring-white/10 shadow-lg">
        <img
          src={photo}
          alt={`${name} — ${title}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  )
}
