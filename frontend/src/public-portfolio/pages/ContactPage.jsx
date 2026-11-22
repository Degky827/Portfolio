import Contact from './sections/Contact'
import SectionDepth from '../shared/SectionDepth'
import PageNavigationHeader from '../shared/PageNavigationHeader'

export default function ContactPage() {
  return (
    <SectionDepth sectionId="contact" className="py-4 sm:py-8">
      <PageNavigationHeader title="Contact" subtitle="Get in touch" />
      <Contact />
    </SectionDepth>
  )
}
