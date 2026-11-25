import Testimonials from './sections/Testimonials'
import SectionDepth from '../shared/SectionDepth'
import PageNavigationHeader from '../shared/PageNavigationHeader'

export default function RecommendationsPage() {
  return (
    <SectionDepth sectionId="testimonials" className="py-4 sm:py-8">
      <PageNavigationHeader title="Recommendations" subtitle="What People Say & 3D Testimonials" />
      <Testimonials />
    </SectionDepth>
  )
}
