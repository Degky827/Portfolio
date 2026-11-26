/**
 * SectionDepth
 * Lightweight, zero-overhead section wrapper that preserves silky smooth 60-120fps native scroll.
 */
export default function SectionDepth({ children, sectionId, className = '', style = {} }) {
  return (
    <div
      id={sectionId}
      className={`relative w-full ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
