import CVPhoto from './components/CVPhoto'
import CVContact from './components/CVContact'
import CVSkills from './components/CVSkills'
import CVLanguages from './components/CVLanguages'

export default function CVSidebar({ data }) {
  const { personal, skills, languages } = data

  return (
    <aside className="cv-sidebar">
      <CVPhoto photo={personal.photo} name={personal.name} title={personal.title} />

      <div className="mt-6">
        <h3 className="cv-sidebar-heading">Contact</h3>
        <CVContact personal={personal} />
      </div>

      <div className="mt-6">
        <h3 className="cv-sidebar-heading">Technical Skills</h3>
        <CVSkills skills={skills} />
      </div>

      <div className="mt-6">
        <h3 className="cv-sidebar-heading">Languages</h3>
        <CVLanguages languages={languages} />
      </div>
    </aside>
  )
}
