/**
 * ScrollDrivenEffects
 * Lightweight non-blocking wrapper that preserves silky smooth 60fps native scroll.
 */
export default function ScrollDrivenEffects({ children }) {
  return <div className="relative w-full">{children}</div>
}
