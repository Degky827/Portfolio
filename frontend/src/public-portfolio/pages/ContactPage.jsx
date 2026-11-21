import Contact from './sections/Contact'
import SectionDepth from '../shared/SectionDepth'

export default function ContactPage() {
  return (
    <SectionDepth sectionId="contact" className="py-6 sm:py-10">
      <Contact />
    </SectionDepth>
  )
}
