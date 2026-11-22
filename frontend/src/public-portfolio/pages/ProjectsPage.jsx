import Projects from './sections/Projects'
import SectionDepth from '../shared/SectionDepth'
import PageNavigationHeader from '../shared/PageNavigationHeader'

export default function ProjectsPage() {
  return (
    <SectionDepth sectionId="projects" className="py-4 sm:py-8">
      <PageNavigationHeader title="Projects" subtitle="Featured Works & Case Studies" />
      <Projects />
    </SectionDepth>
  )
}
