const UAParser = require('ua-parser-js')

function parseUserAgent(uaString) {
  if (!uaString) {
    return { browser: null, os: null, device: 'Unknown Device', deviceType: null }
  }

  const parser = new UAParser(uaString)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const deviceInfo = parser.getDevice()

  const deviceType = deviceInfo.type || 'desktop'
  const device = deviceType === 'desktop' ? 'Desktop' : deviceType === 'tablet' ? 'Tablet' : 'Mobile'

  return {
    browser: browser.name || null,
    os: os.name || null,
    device,
    deviceType,
  }
}

module.exports = { parseUserAgent }
