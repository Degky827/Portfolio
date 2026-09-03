export default function CVHeader({ name, title }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-tight">
        {name}
      </h1>
      <p className="mt-1.5 text-base sm:text-lg font-semibold text-[var(--accent-cv)] dark:text-[var(--accent-cv)]">
        {title}
      </p>
    </header>
  )
}
