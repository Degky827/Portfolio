import Experience from './sections/Experience'
import Testimonials from './sections/Testimonials'
import SectionDepth from '../shared/SectionDepth'

export default function ExperiencePage() {
  return (
    <div className="py-4 sm:py-8 space-y-16">
      <SectionDepth sectionId="experience">
        <Experience />
      </SectionDepth>
      <SectionDepth sectionId="testimonials">
        <Testimonials />
      </SectionDepth>
    </div>
  )
}
