const HomeContent = require('../models/HomeContent')
const FooterContent = require('../models/FooterContent')
const ContactContent = require('../models/ContactContent')

const HOME_SOCIAL_KEYS = ['github', 'linkedin', 'telegram', 'twitter', 'facebook', 'instagram', 'youtube', 'email']

const PLATFORM_ICONS = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.127.087.776.085 1.257-.008 1.33-.364 5.275-.565 7.454-.07.747-.156 1.074-.357 1.28-.2.207-.546.285-.754.282-.38-.006-.724-.115-1.016-.224-1.391-.518-3.316-1.645-4.617-2.574-.246-.175-.304-.393-.066-.597.63-.54 2.05-1.92 2.825-2.655.054-.051.109-.145.04-.244-.07-.1-.17-.066-.246-.045-.24.066-2.08 1.322-2.435 1.538-.204.124-.433.035-.57-.043-.399-.225-.97-.57-1.4-.864-.396-.27-.312-.423.043-.569.982-.405 2.216-.884 3.257-1.237 1.72-.583 2.54-.786 3.138-.79z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
  discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  website: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
  stackoverflow: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.36 20.2v-4.22h1.44V21.7H3.62v-5.72h1.44v4.22h12.3zM6.8 16.56h10.68v-1.46H6.81v1.46zm.27-3.57l10.37 2.15.3-1.44L7.38 11.55l-.3 1.44zm1.38-3.45l9.61 4.16.57-1.34-9.6-4.16-.58 1.34zm3.6-4.25l-5.18 7.16 1.1.8 5.17-7.15-1.09-.8zm4.47 10.79H6.95v1.46h11.57v-1.46z"/></svg>',
}

function getPlatformKey(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getIconForPlatform(platformName) {
  const key = getPlatformKey(platformName)
  return PLATFORM_ICONS[key] || ''
}

function footerToHomeSocial(socialLinks) {
  const obj = {}
  HOME_SOCIAL_KEYS.forEach((k) => { obj[k] = '' })
  if (!Array.isArray(socialLinks)) return obj
  socialLinks
    .filter((s) => s.active !== false && s.url)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .forEach((s) => {
      const key = getPlatformKey(s.platform)
      if (HOME_SOCIAL_KEYS.includes(key)) {
        obj[key] = s.url
      }
    })
  return obj
}

function footerToContactSocial(socialLinks) {
  if (!Array.isArray(socialLinks)) return []
  return socialLinks
    .filter((s) => s.active !== false && s.url)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map((s, i) => ({
      channelName: s.platform || '',
      linkUrl: s.url || '',
      iconVector: getIconForPlatform(s.platform),
      displayWeight: s.displayOrder ?? i,
    }))
}

function homeToFooterSocial(socialLinks) {
  if (!socialLinks || typeof socialLinks !== 'object') return []
  return HOME_SOCIAL_KEYS
    .filter((k) => socialLinks[k])
    .map((k, i) => ({
      platform: k,
      url: socialLinks[k],
      displayOrder: i,
      active: true,
    }))
}

function homeToContactSocial(socialLinks) {
  if (!socialLinks || typeof socialLinks !== 'object') return []
  return HOME_SOCIAL_KEYS
    .filter((k) => socialLinks[k])
    .map((k, i) => ({
      channelName: k,
      linkUrl: socialLinks[k],
      iconVector: getIconForPlatform(k),
      displayWeight: i,
    }))
}

function contactToFooterSocial(socialChannels) {
  if (!Array.isArray(socialChannels)) return []
  return socialChannels
    .filter((ch) => ch.channelName && ch.linkUrl)
    .map((ch, i) => ({
      platform: ch.channelName,
      url: ch.linkUrl,
      displayOrder: ch.displayWeight ?? i,
      active: true,
    }))
}

function contactToHomeSocial(socialChannels) {
  const obj = {}
  HOME_SOCIAL_KEYS.forEach((k) => { obj[k] = '' })
  if (!Array.isArray(socialChannels)) return obj
  socialChannels
    .filter((ch) => ch.channelName && ch.linkUrl)
    .sort((a, b) => (a.displayWeight || 0) - (b.displayWeight || 0))
    .forEach((ch) => {
      const key = getPlatformKey(ch.channelName)
      if (HOME_SOCIAL_KEYS.includes(key)) {
        obj[key] = ch.linkUrl
      }
    })
  return obj
}

async function syncFooterSocial(socialLinks) {
  const homeUpdate = footerToHomeSocial(socialLinks)
  const contactUpdate = footerToContactSocial(socialLinks)
  try { await HomeContent.findOneAndUpdate({}, { $set: { socialLinks: homeUpdate } }, { upsert: true }) } catch (e) { console.error('[socialSync] Footer→Home:', e.message) }
  try { await ContactContent.findOneAndUpdate({}, { $set: { socialChannels: contactUpdate } }, { upsert: true }) } catch (e) { console.error('[socialSync] Footer→Contact:', e.message) }
}

async function syncHomeSocial(socialLinks) {
  const footerUpdate = homeToFooterSocial(socialLinks)
  const contactUpdate = homeToContactSocial(socialLinks)
  try { await FooterContent.findOneAndUpdate({}, { $set: { socialLinks: footerUpdate } }, { upsert: true }) } catch (e) { console.error('[socialSync] Home→Footer:', e.message) }
  try { await ContactContent.findOneAndUpdate({}, { $set: { socialChannels: contactUpdate } }, { upsert: true }) } catch (e) { console.error('[socialSync] Home→Contact:', e.message) }
}

async function syncContactSocial(socialChannels) {
  const footerUpdate = contactToFooterSocial(socialChannels)
  const homeUpdate = contactToHomeSocial(socialChannels)
  try { await FooterContent.findOneAndUpdate({}, { $set: { socialLinks: footerUpdate } }, { upsert: true }) } catch (e) { console.error('[socialSync] Contact→Footer:', e.message) }
  try { await HomeContent.findOneAndUpdate({}, { $set: { socialLinks: homeUpdate } }, { upsert: true }) } catch (e) { console.error('[socialSync] Contact→Home:', e.message) }
}

module.exports = {
  PLATFORM_ICONS,
  HOME_SOCIAL_KEYS,
  getIconForPlatform,
  footerToHomeSocial,
  footerToContactSocial,
  homeToFooterSocial,
  homeToContactSocial,
  contactToFooterSocial,
  contactToHomeSocial,
  syncFooterSocial,
  syncHomeSocial,
  syncContactSocial,
}
