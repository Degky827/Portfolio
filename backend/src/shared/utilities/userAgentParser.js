function parseUserAgent(userAgent) {
  if (!userAgent) return { device: 'Unknown Device', browser: 'Unknown Browser', os: 'Unknown OS' }

  let device = 'Desktop'
  let browser = 'Unknown Browser'
  let os = 'Unknown OS'

  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
    device = /ipad|tablet/i.test(userAgent) ? 'Tablet' : 'Mobile'
  }

  const browserPatterns = [
    { regex: /edg(e|a|ios)?\//i, name: 'Edge' },
    { regex: /chrome\//i, name: 'Chrome' },
    { regex: /firefox\//i, name: 'Firefox' },
    { regex: /safari\//i, name: 'Safari' },
    { regex: /opera|opr\//i, name: 'Opera' },
    { regex: /msie|trident/i, name: 'Internet Explorer' },
  ]
  for (const { regex, name } of browserPatterns) {
    if (regex.test(userAgent)) {
      browser = name
      break
    }
  }

  const osPatterns = [
    { regex: /windows nt 10/i, name: 'Windows 10' },
    { regex: /windows nt 11|windows nt 10.0.*build 2[0-9]{4}/i, name: 'Windows 11' },
    { regex: /windows/i, name: 'Windows' },
    { regex: /mac os x/i, name: 'macOS' },
    { regex: /android/i, name: 'Android' },
    { regex: /iphone|ipad|ipod/i, name: 'iOS' },
    { regex: /linux/i, name: 'Linux' },
    { regex: /crOS/i, name: 'Chrome OS' },
  ]
  for (const { regex, name } of osPatterns) {
    if (regex.test(userAgent)) {
      os = name
      break
    }
  }

  return { device, browser, os }
}

module.exports = { parseUserAgent }
