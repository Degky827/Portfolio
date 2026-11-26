import Testimonials from './sections/Testimonials'
import SectionDepth from '../shared/SectionDepth'

export default function RecommendationsPage() {
  return (
    <SectionDepth sectionId="testimonials" className="py-4 sm:py-8">
      <Testimonials />
    </SectionDepth>
  )
}
