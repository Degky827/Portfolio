import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { getMediaUrl } from '../../shared/services/api'

export default function DynamicCustomPage() {
  const { customSlug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchPage() {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get(`/custom-pages/public/${customSlug}`)
        const data = res.data
        if (!cancelled) {
          setPage(data.page)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPage()
    return () => { cancelled = true }
  }, [customSlug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-gray-600 dark:text-gray-400">This page could not be found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12"
    >
      {page.featuredImage && (
        <div className="mb-8">
          <img
            src={getMediaUrl(page.featuredImage) || page.featuredImage}
            alt={page.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl"
          />
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {page.title}
      </h1>

      {page.description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {page.description}
        </p>
      )}

      <div className="space-y-8">
        {page.sections
          ?.sort((a, b) => a.displayOrder - b.displayOrder)
          .map((section, idx) => (
            <SectionRenderer key={section._id || idx} section={section} />
          ))}
      </div>
    </motion.div>
  )
}

function SectionRenderer({ section }) {
  const { sectionType, sectionData } = section

  switch (sectionType) {
    case 'text':
      return (
        <div className={`text-${sectionData.alignment || 'left'}`}>
          {sectionData.heading && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {sectionData.heading}
            </h2>
          )}
          {sectionData.subheading && (
            <h3 className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {sectionData.subheading}
            </h3>
          )}
          {sectionData.body && (
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: sectionData.body }}
            />
          )}
        </div>
      )

    case 'image':
      return (
        <figure className={`${sectionData.layout === 'half' ? 'max-w-xl mx-auto' : ''}`}>
          <img
            src={getMediaUrl(sectionData.src) || sectionData.src}
            alt={sectionData.alt || ''}
            className="w-full rounded-xl"
          />
          {sectionData.caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
              {sectionData.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'gallery': {
      const cols = sectionData.columns || 3
      return (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {(sectionData.images || []).map((img, i) => {
            const src = typeof img === 'string' ? img : img?.src || ''
            if (!src) return null
            return (
              <img
                key={i}
                src={getMediaUrl(src) || src}
                alt={`Gallery ${i + 1}`}
                className="w-full aspect-square object-cover rounded-xl"
              />
            )
          })}
        </div>
      )
    }

    case 'video': {
      const embedUrl = getVideoEmbedUrl(sectionData.videoUrl)
      return (
        <div className="aspect-video rounded-xl overflow-hidden">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Video"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-400">
              No video URL provided
            </div>
          )}
        </div>
      )
    }

    case 'button':
      return (
        <div className="text-center">
          <a
            href={sectionData.url || '#'}
            target={sectionData.openInNewTab ? '_blank' : undefined}
            rel={sectionData.openInNewTab ? 'noopener noreferrer' : undefined}
            className={`inline-block px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              sectionData.variant === 'primary'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                : sectionData.variant === 'secondary'
                  ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  : 'border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
            }`}
          >
            {sectionData.label || 'Click here'}
          </a>
        </div>
      )

    case 'html':
      return (
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sectionData.htmlContent || '' }}
        />
      )

    default:
      return null
  }
}

function getVideoEmbedUrl(url) {
  if (!url) return null
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return url
}
