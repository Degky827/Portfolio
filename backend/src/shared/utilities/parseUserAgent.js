const UAParser = require('ua-parser-js')

function parseUserAgent(uaString) {
  if (!uaString) {
    return { browser: null, os: null, deviceType: null }
  }

  const parser = new UAParser(uaString)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const device = parser.getDevice()

  return {
    browser: browser.name || null,
    os: os.name || null,
    deviceType: device.type || 'desktop',
  }
}

module.exports = { parseUserAgent }
