import Projects from './sections/Projects'
import SectionDepth from '../shared/SectionDepth'

export default function ProjectsPage() {
  return (
    <SectionDepth sectionId="projects" className="py-4 sm:py-8">
      <Projects />
    </SectionDepth>
  )
}
