import Projects from './sections/Projects'
import SectionDepth from '../shared/SectionDepth'

export default function ProjectsPage() {
  return (
    <SectionDepth sectionId="projects" className="py-6 sm:py-10">
      <Projects />
    </SectionDepth>
  )
}
