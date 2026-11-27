import Projects from './sections/Projects'
import SectionDepth from '../shared/SectionDepth'

export default function ProjectsPage() {
  return (
    <SectionDepth sectionId="projects" className="w-full">
      <Projects />
    </SectionDepth>
  )
}
