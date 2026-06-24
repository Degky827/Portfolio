function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function ensureUniqueSlug(Model, baseSlug, excludeId) {
  let slug = baseSlug
  let counter = 1
  const query = { slug }
  if (excludeId) query._id = { $ne: excludeId }
  while (await Model.findOne(query)) {
    slug = `${baseSlug}-${counter}`
    query.slug = slug
    counter++
  }
  return slug
}

module.exports = { slugify, ensureUniqueSlug }
