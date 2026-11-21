const UAParser = require('ua-parser-js')

function parseUserAgent(uaString) {
  if (!uaString) {
    return {
      browser: 'Unknown Browser',
      os: 'Unknown OS',
      device: 'Desktop',
      deviceType: 'desktop',
    }
  }

  const parser = new UAParser(uaString)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const deviceInfo = parser.getDevice()

  const rawType = deviceInfo.type || 'desktop'
  const deviceName = rawType.charAt(0).toUpperCase() + rawType.slice(1)
  const browserName = browser.name || 'Unknown Browser'
  const osName = os.name ? `${os.name}${os.version ? ' ' + os.version : ''}` : 'Unknown OS'

  return {
    browser: browserName,
    os: osName,
    device: deviceName,
    deviceType: rawType,
  }
}

module.exports = { parseUserAgent }
