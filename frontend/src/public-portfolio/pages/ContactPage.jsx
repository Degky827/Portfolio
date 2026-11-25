import Contact from './sections/Contact'
import SectionDepth from '../shared/SectionDepth'

export default function ContactPage() {
  return (
    <SectionDepth sectionId="contact" className="py-4 sm:py-8">
      <Contact />
    </SectionDepth>
  )
}
