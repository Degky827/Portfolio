import CVHeader from './components/CVHeader'
import CVSummary from './components/CVSummary'
import CVExperience from './components/CVExperience'
import CVProjects from './components/CVProjects'
import CVEducation from './components/CVEducation'
import CVCertifications from './components/CVCertifications'
import CVHighlights from './components/CVHighlights'

export default function CVMain({ data }) {
  const { personal, summary, experience, projects, education, certifications, achievements } = data

  return (
    <article className="cv-main">
      <CVHeader name={personal.name} title={personal.title} />
      <CVSummary summary={summary} />
      <CVExperience experience={experience} />
      <CVProjects projects={projects} />
      <CVEducation education={education} />
      <CVCertifications certifications={certifications} />
      <CVHighlights achievements={achievements} />
    </article>
  )
}
