const axios = require('axios')

const LOCAL_IPS = new Set(['::1', '::ffff:127.0.0.1', '127.0.0.1', 'localhost'])
const MOCK_LOCATION = { country: 'Local', region: 'Development', city: 'Localhost' }

const cache = new Map()
const CACHE_TTL = 60 * 60 * 1000

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cache) {
    if (now - entry.ts > CACHE_TTL) cache.delete(key)
  }
}, 5 * 60 * 1000)

function extractIP(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = req.headers['x-real-ip']
  if (realIp) return realIp.trim()
  return req.ip || req.socket?.remoteAddress || null
}

function cleanIP(ip) {
  if (!ip) return null
  return ip.replace(/^::ffff:/, '')
}

async function lookupViaIpApi(ip) {
  const { data } = await axios.get(`https://ip-api.com/json/${ip}?fields=status,country,regionName,city,query`, {
    timeout: 4000,
  })
  if (data.status !== 'success') {
    console.warn(`[ipLookup] ip-api.com error for ${ip}: ${data.status}`)
    return null
  }
  return {
    country: data.country || null,
    region: data.regionName || null,
    city: data.city || null,
  }
}

async function lookupViaIpapiCo(ip) {
  const { data } = await axios.get(`https://ipapi.co/${ip}/json/`, {
    timeout: 4000,
  })
  if (data.error) {
    console.warn(`[ipLookup] ipapi.co error for ${ip}: ${data.reason}`)
    return null
  }
  return {
    country: data.country_name || null,
    region: data.region || null,
    city: data.city || null,
  }
}

async function lookupLocation(ip) {
  if (!ip) return null

  const clean = cleanIP(ip)
  if (!clean) return null

  if (LOCAL_IPS.has(clean)) {
    return MOCK_LOCATION
  }

  const cached = cache.get(clean)
  if (cached) return cached.data

  const providers = [lookupViaIpApi, lookupViaIpapiCo]

  for (const lookup of providers) {
    try {
      const result = await lookup(clean)
      if (result) {
        cache.set(clean, { data: result, ts: Date.now() })
        return result
      }
    } catch (error) {
      console.warn(`[ipLookup] Provider error for ${clean}: ${error.message}`)
    }
  }

  console.warn(`[ipLookup] All providers failed for ${clean}`)
  return null
}

module.exports = { extractIP, lookupLocation }
