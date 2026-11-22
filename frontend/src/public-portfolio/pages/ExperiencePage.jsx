import Experience from './sections/Experience'
import Testimonials from './sections/Testimonials'
import SectionDepth from '../shared/SectionDepth'
import PageNavigationHeader from '../shared/PageNavigationHeader'

export default function ExperiencePage() {
  return (
    <div className="py-4 sm:py-8 space-y-16">
      <PageNavigationHeader title="Experience" subtitle="Career Journey & Testimonials" />
      <SectionDepth sectionId="experience">
        <Experience />
      </SectionDepth>
      <SectionDepth sectionId="testimonials">
        <Testimonials />
      </SectionDepth>
    </div>
  )
}
