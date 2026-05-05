import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Mail, Phone, MapPin, ExternalLink, Award, FileText } from 'lucide-react'
import projectsData from '../data/projects.json'

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
)

const TelegramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
  </svg>
)

export default function CVModal({ isOpen, onClose }) {
  const certificates = [
    { name: 'CCNA: Introduction to Networks', issuer: 'Cisco', file: '/CCNA-_Introduction_to_Networks_certificate_desalegnkasayemuluyekasaye-gmail-com_7249a65b-84fe-46db-8cbe-797a03205390.pdf' },
    { name: 'e-SHE OEX100 Certificate', issuer: 'e-SHE Online Learning', file: '/e-SHE OEX100 Certificate _ e-SHE Online Learning.pdf' },
    { name: 'e-SHE DS201 Certificate', issuer: 'e-SHE Online Learning', file: '/e-SHE DS201 Certificate _ e-SHE Online Learning.pdf' },
    { name: 'e-SHE CE106 Certificate', issuer: 'e-SHE Online Learning', file: '/e-SHE CE106 Certificate _ e-SHE Online Learning.pdf' },
    { name: 'e-SHE CE105 Certificate', issuer: 'e-SHE Online Learning', file: '/e-SHE CE105 Certificate _ e-SHE Online Learning.pdf' },
    { name: 'e-SHE CE104 Certificate', issuer: 'e-SHE Online Learning', file: '/e-SHE CE104 Certificate _ e-SHE Online Learning.pdf' },
    { name: 'e-SHE CE102 Certificate', issuer: 'e-SHE Online Learning', file: '/e-SHE CE102 Certificate _ e-SHE Online Learning.pdf' },
    { name: 'e-SHE CE101 Certificate', issuer: 'e-SHE Online Learning', file: '/e-SHE CE101 Certificate _ e-SHE Online Learning.pdf' },
    { name: 'Learn the Latest Tech Skills - Udacity', issuer: 'Udacity', file: '/Learn the Latest Tech Skills; Advance Your Career _ Udacity.pdf' },
    { name: 'Learn the Latest Tech Skills 1 - Udacity', issuer: 'Udacity', file: '/Learn_the_Latest_Tech_Skills;_Advance_Your_Career_Udacity_1.pdf' },
    { name: 'Learn the Latest Tech Skills 2 - Udacity', issuer: 'Udacity', file: '/Learn_the_Latest_Tech_Skills;_Advance_Your_Career_Udacity_2.pdf' },
    { name: 'Learn the Latest Tech Skills 3 - Udacity', issuer: 'Udacity', file: '/Learn_the_Latest_Tech_Skills;_Advance_Your_Career_Udacity_3.pdf' },
    { name: 'Learner Transcript', issuer: 'BDU', file: '/learner_transcript.pdf' },
    { name: 'Networking Academy Learn-A-Thon', issuer: 'Cisco Networking Academy', file: '/Networking_Academy_Learn-A-Thon_2026_certificate_desalegnkasayemuluyekasaye-gmail-com_d61d7bd1-93a4-418b-af56-08b473aa9b6d.pdf' },
  ]

  const handlePreview = () => {
    window.open('/Desalegn_CV.html', '_blank')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Desalegn_CV.html'
    link.download = 'Desalegn_CV.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-y-8 lg:inset-x-24 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl z-[2001] overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Resume Modal"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary via-secondary to-accent p-4 sm:p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">📄</span>
                </div>
                <div className="text-white">
                  <h2 className="text-xl sm:text-2xl font-black">My Resume</h2>
                  <p className="text-white/80 text-sm sm:text-base">Click download to get the PDF</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-gray-200 dark:border-slate-700">
                  <img
                    src="/BDU1601297.png"
                    alt="Desalegn Kasaye"
                    className="w-28 h-32 sm:w-36 sm:h-44 rounded-xl sm:rounded-2xl object-cover object-top border-4 border-primary/20 shadow-xl"
                  />
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">Desalegn Kasaye</h1>
                    <p className="text-primary font-bold text-base sm:text-lg mb-4">Aspiring Network Designer & Full-Stack Developer</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                      <a href="https://linkedin.com/in/dk-cs-3rd" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn Profile">
                        <LinkedinIcon size={20} />
                      </a>
                      <a href="https://github.com/desalegnkasayemuluyekasaye-tech" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors" aria-label="GitHub Profile">
                        <GithubIcon size={20} />
                      </a>
                      <a href="https://t.me/Ds35kg" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors" aria-label="Telegram Profile">
                        <TelegramIcon size={20} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Bahirdar, Ethiopia</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">desalegnky827@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">+251 908 720 092</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <ExternalLink className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <a href="https://desalegnkasayemuluyekasaye-tech.github.io/portkiro/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Portfolio</a>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm" aria-hidden="true">📝</span>
                    Professional Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-10 sm:pl-10">
                    Aspiring Full-Stack Developer with a vision to pursue MSc in Cyber Security.
                    Passionate about building secure, scalable digital solutions with knowledge in web development,
                    cyber security fundamentals and network infrastructure.
                  </p>
                </div>

                {/* Education */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary text-sm" aria-hidden="true">🎓</span>
                    Education
                  </h3>
                  <div className="pl-10 sm:pl-10 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Advanced degree focusing on digital protection, network security, and ethical hacking (Planned)</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">BSc in Computer Science</h4>
                        <span className="text-sm text-primary font-medium">2022 - 2027</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Foundation in software engineering, algorithms, and data structures</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent text-sm" aria-hidden="true">⚡</span>
                    Technical Skills
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10 sm:pl-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full" aria-hidden="true"></span>
                      <span className="text-gray-600 dark:text-gray-300">React, JavaScript, HTML5, CSS3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full" aria-hidden="true"></span>
                      <span className="text-gray-600 dark:text-gray-300">Node.js, Express, MongoDB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full" aria-hidden="true"></span>
                      <span className="text-gray-600 dark:text-gray-300">Cisco, Network Design, Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                      <span className="text-gray-600 dark:text-gray-300">Python, Java, C++, PHP</span>
                    </div>
                  </div>
                </div>

                {/* Projects - Now dynamically loaded */}
                <div className="mb-8">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 text-sm" aria-hidden="true">🚀</span>
                    Featured Projects ({projectsData.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10 sm:pl-10">
                    {projectsData.map((project, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-primary/30 transition-all">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{project.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Live Demo</a>
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">Source</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500 text-sm" aria-hidden="true">🏆</span>
                    Certificates
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-10 sm:pl-10">
                    {certificates.map((cert, index) => (
                      <a
                        key={index}
                        href={cert.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:shadow-md transition-all group"
                        aria-label={`View ${cert.name} certificate`}
                      >
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary">{cert.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                        </div>
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0 ml-auto" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed Download Button */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-4 sm:p-6 border-t border-gray-200 dark:border-slate-700">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  Preview your resume or download it
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handlePreview}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Preview CV</span>
                  </motion.button>
                  <motion.button
                    onClick={handleDownload}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Download className="w-4 h-4 group-hover:animate-bounce" />
                    <span>Download CV</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
