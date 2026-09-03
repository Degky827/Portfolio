import testimonialsData from '../data/testimonials.json'

function normalizeTestimonials(data) {
  let list = []
  if (Array.isArray(data)) {
    list = data
  } else if (data?.testimonials && Array.isArray(data.testimonials)) {
    list = data.testimonials
  } else if (data?.data?.testimonials && Array.isArray(data.data.testimonials)) {
    list = data.data.testimonials
  } else if (data?.data && Array.isArray(data.data)) {
    list = data.data
  }
  return list.map((t) => ({
    ...t,
    _id: t._id || t.id,
    published: t.status === 'PUBLISHED',
    featured: t.featured ?? false,
  }))
}

const localTestimonials = normalizeTestimonials(testimonialsData)

export async function getTestimonials() {
  return { testimonials: localTestimonials }
}
