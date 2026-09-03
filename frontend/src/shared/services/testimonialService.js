import api from './api'
import testimonialsData from '../data/testimonials.json'

export async function getTestimonials({ published = true, featured = false } = {}) {
  try {
    const params = new URLSearchParams()
    if (published) params.set('published', 'true')
    if (featured) params.set('featured', 'true')

    const response = await api.get(`/testimonials?${params.toString()}`)
    return response.data
  } catch {
    return { testimonials: testimonialsData }
  }
}
