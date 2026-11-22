import Skills from './sections/Skills'
import SectionDepth from '../shared/SectionDepth'
import PageNavigationHeader from '../shared/PageNavigationHeader'

export default function SkillsPage() {
  return (
    <SectionDepth sectionId="skills" className="py-4 sm:py-8">
      <PageNavigationHeader title="Skills" subtitle="Tech Stack & Expertise" />
      <Skills />
    </SectionDepth>
  )
}
