import Testimonials from './sections/Testimonials'
import SectionDepth from '../shared/SectionDepth'

export default function RecommendationsPage() {
  return (
    <SectionDepth sectionId="testimonials" className="p-0">
      <Testimonials />
    </SectionDepth>
  )
}
