import api from './api'
import testimonialsData from '../data/testimonials.json'

function normalizeTestimonials(data) {
  const list = Array.isArray(data) ? data : data?.testimonials || []
  return list.map((t) => ({
    ...t,
    _id: t._id || t.id,
    published: t.status === 'PUBLISHED',
    featured: t.featured ?? false,
  }))
}

export async function getTestimonials({ published = true, featured = false } = {}) {
  try {
    const response = await api.get('/testimonials')
    const data = normalizeTestimonials(response.data)
    return { testimonials: data }
  } catch {
    return { testimonials: normalizeTestimonials(testimonialsData) }
  }
}
