import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

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
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-y-8 lg:inset-x-24 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl z-[2001] overflow-hidden flex flex-col"
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
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
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
                    alt="Desalegn" 
                    className="w-28 h-32 sm:w-36 sm:h-44 rounded-xl sm:rounded-2xl object-cover object-top border-4 border-primary/20 shadow-xl"
                  />
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">Desalegn Kasaye Mulu</h1>
                    <p className="text-primary font-bold text-base sm:text-lg mb-4">Full-Stack Developer & Network Designer</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                      <a href="https://linkedin.com/in/dk-cs-3rd" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <LinkedinIcon size={20} />
                      </a>
                      <a href="https://github.com/desalegn-tech" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <GithubIcon size={20} />
                      </a>
                      <a href="https://t.me/Ds35kg" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <TelegramIcon size={20} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Bahirdar, Ethiopia</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">desalegnky827@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">+251 908 720 092</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <ExternalLink className="w-5 h-5 text-primary flex-shrink-0" />
                    <a href="https://desalegnkasayemulu.yekasaye.tech.github.io/portkiro/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Portfolio</a>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm">📝</span>
                    Professional Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-10 sm:pl-10">
                    Passionate Full-Stack Developer and Network Designer with expertise in building secure, scalable digital solutions. 
                    Combining 5+ years of experience in web development with deep knowledge in cyber security and network infrastructure.
                  </p>
                </div>

                {/* Education */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary text-sm">🎓</span>
                    Education
                  </h3>
                  <div className="pl-10 sm:pl-10 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">MSc in Cyber Security</h4>
                        <span className="text-sm text-primary font-medium">2020 - 2022</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Advanced degree focusing on digital protection, network security, and ethical hacking</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">BSc in Computer Science</h4>
                        <span className="text-sm text-primary font-medium">2016 - 2020</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Foundation in software engineering, algorithms, and data structures</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent text-sm">⚡</span>
                    Technical Skills
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10 sm:pl-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="text-gray-600 dark:text-gray-300">React, JavaScript, HTML5, CSS3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span className="text-gray-600 dark:text-gray-300">Node.js, Express, MongoDB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      <span className="text-gray-600 dark:text-gray-300">Cisco, Network Design, Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-600 dark:text-gray-300">Python, Java, C++, PHP</span>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm">💼</span>
                    Experience
                  </h3>
                  <div className="pl-10 sm:pl-10 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">Full-Stack Developer</h4>
                        <span className="text-sm text-primary font-medium">2022 - Present</span>
                      </div>
                      <p className="text-sm font-medium text-secondary mb-1">Freelance / Self-Employed</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Building modern web applications and providing network design solutions for clients.</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">Network Designer</h4>
                        <span className="text-sm text-primary font-medium">2020 - Present</span>
                      </div>
                      <p className="text-sm font-medium text-secondary mb-1">Enterprise Solutions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Designing and implementing secure network infrastructures for businesses.</p>
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-8">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 text-sm">🚀</span>
                    Featured Projects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10 sm:pl-10">
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-slate-800 dark:to-slate-800 rounded-xl border border-primary/10">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Portfolio Website</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Modern React portfolio with animations</p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">React + Tailwind</span>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-secondary/5 to-accent/5 dark:from-slate-800 dark:to-slate-800 rounded-xl border border-secondary/10">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Media Platform</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Full-stack media streaming app</p>
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">Next.js + Vercel</span>
                    </div>
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
                    className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Preview CV</span>
                  </motion.button>
                  <motion.button
                    onClick={handleDownload}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
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
