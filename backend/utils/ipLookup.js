const axios = require('axios')

const LOCAL_IPS = new Set(['::1', '::ffff:127.0.0.1', '127.0.0.1', 'localhost'])
const MOCK_LOCATION = { country: 'Local', region: 'Development', city: 'Localhost' }

/**
 * Extracts the client IP from the request object.
 * Returns null if no IP is found.
 */
function extractIP(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.ip || req.socket?.remoteAddress || null
}

/**
 * Looks up location data for the given IP via ipapi.co.
 * Returns a mock object for local/private IPs.
 * Returns null on failure so callers can handle gracefully.
 */
async function lookupLocation(ip) {
  if (!ip) return null

  const cleanIP = ip.replace(/^::ffff:/, '')

  if (LOCAL_IPS.has(cleanIP)) {
    return MOCK_LOCATION
  }

  try {
    const { data } = await axios.get(`https://ipapi.co/${cleanIP}/json/`, {
      timeout: 5000,
    })

    if (data.error) {
      console.warn(`[ipLookup] ipapi.co error for ${cleanIP}: ${data.reason}`)
      return null
    }

    return {
      country: data.country_name || null,
      region: data.region || null,
      city: data.city || null,
    }
  } catch (error) {
    console.warn(`[ipLookup] Failed to look up ${ip}: ${error.message}`)
    return null
  }
}

module.exports = { extractIP, lookupLocation }
