import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const contactItems = [
  { icon: MapPin, label: 'location', href: null, text: null },
  { icon: Phone, label: 'phone', href: null, text: null },
  { icon: Mail, label: 'email', href: null, text: null },
  { icon: FaGithub, label: 'github', href: null, text: null },
  { icon: FaLinkedin, label: 'linkedin', href: null, text: null },
  { icon: Globe, label: 'portfolio', href: null, text: null },
]

function getContactHref(label, personal) {
  switch (label) {
    case 'phone': return `tel:${personal.phone}`
    case 'email': return `mailto:${personal.email}`
    case 'github': return personal.github
    case 'linkedin': return personal.linkedin
    case 'portfolio': return personal.portfolio
    default: return null
  }
}

function getContactText(label, personal) {
  switch (label) {
    case 'location': return personal.location
    case 'phone': return personal.phone
    case 'email': return personal.email
    case 'github': return 'github.com/Degky827'
    case 'linkedin': return 'linkedin.com/in/desiye-dev'
    case 'portfolio': return 'modernize-portifo.vercel.app'
    default: return null
  }
}

export default function CVContact({ personal }) {
  return (
    <div className="space-y-3">
      {contactItems.map(({ icon: Icon, label }) => {
        const href = getContactHref(label, personal)
        const text = getContactText(label, personal)
        if (!text) return null

        const content = (
          <span className="flex items-start gap-2.5 text-[13px] leading-snug break-words">
            <Icon size={14} className="shrink-0 mt-0.5 text-white/50" aria-hidden="true" />
            <span className="text-white/80">{text}</span>
          </span>
        )

        return href ? (
          <a
            key={label}
            href={href}
            target={label !== 'phone' && label !== 'email' ? '_blank' : undefined}
            rel={label !== 'phone' && label !== 'email' ? 'noopener noreferrer' : undefined}
            className="block hover:text-white transition-colors duration-200"
          >
            {content}
          </a>
        ) : (
          <div key={label}>{content}</div>
        )
      })}
    </div>
  )
}
