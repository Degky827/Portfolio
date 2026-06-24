function buildPagination({ page, limit, totalCount }) {
  const safePage = Math.max(1, parseInt(page) || 1)
  const safeLimit = Math.min(Math.max(1, parseInt(limit) || 10), 100)
  const skip = (safePage - 1) * safeLimit

  return {
    page: safePage,
    limit: safeLimit,
    skip,
    totalCount,
    totalPages: Math.ceil(totalCount / safeLimit) || 1,
    hasMore: skip + safeLimit < totalCount,
  }
}

function paginationResponse(pagination) {
  return {
    page: pagination.page,
    limit: pagination.limit,
    totalPages: pagination.totalPages,
    hasMore: pagination.hasMore,
  }
}

module.exports = { buildPagination, paginationResponse }
