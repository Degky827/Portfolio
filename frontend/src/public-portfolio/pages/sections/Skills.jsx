import { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  Code2, Award, ExternalLink, Calendar, Building2, X,
} from 'lucide-react'
import {
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte, SiPreact, SiSolid,
  SiPython, SiDjango, SiFlask, SiFastapi,
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiTailwindcss, SiBootstrap, SiSass, SiLess, SiStylus,
  SiNodedotjs, SiExpress, SiDeno, SiBun, SiNestjs, SiNuxt, SiRemix, SiAstro,
  SiPhp, SiLaravel, SiRuby, SiRubyonrails,
  SiOpenjdk, SiKotlin, SiGo, SiRust, SiCplusplus, SiSwift, SiDart, SiDotnet, SiFlutter,
  SiMongodb, SiMysql, SiPostgresql, SiRedis, SiSqlite,
  SiFirebase, SiSupabase, SiPlanetscale,
  SiGit, SiGithub, SiGitlab,
  SiDocker, SiKubernetes, SiDigitalocean, SiHeroku, SiVercel, SiNetlify, SiRailway, SiRender, SiFlydotio,
  SiLinux, SiUbuntu, SiKalilinux,
  SiFigma, SiFramer, SiCanva,
  SiWordpress, SiGraphql, SiTrpc,
  SiWebpack, SiVite, SiBabel, SiEslint, SiPrettier,
  SiYarn, SiNpm, SiPnpm,
  SiJest, SiCypress, SiSelenium,
  SiPrisma, SiSequelize, SiMongoose, SiSocketdotio,
  SiNginx, SiApache, SiApachemaven, SiGradle, SiAnsible, SiTerraform, SiGrafana, SiPrometheus,
  SiPostman, SiSwagger,
  SiMarkdown,
  SiRedux, SiReactrouter, SiShadcnui, SiRadixui, SiDaisyui, SiChakraui, SiMui, SiAntdesign,
  SiThreedotjs, SiElectron,
  SiTensorflow, SiPytorch, SiOpenai, SiJupyter, SiAnaconda,
  SiMatterdotjs, SiGsap, SiGreensock, SiChartdotjs, SiMermaid,
  SiStrapi, SiSanity, SiContentful, SiDirectus, SiPayloadcms,
  SiSolidity, SiHono, SiFastify, SiKoa, SiAdonisjs, SiMoleculer,
  SiBabylondotjs, SiP5Dotjs, SiCocos,
  SiHomebrew, SiVim, SiNeovim, SiZsh,
  SiXcode, SiWebstorm, SiIntellijidea, SiPycharm, SiGoland,
  SiApple, SiAndroid, SiRaspberrypi, SiArduino,
  SiTailscale, SiCloudflare, SiCloudinary,
  SiCisco,
} from 'react-icons/si'
import { getSkills } from '../../../shared/services/skillService'

const skillIconMap = {
  SiHtml5, HTML5: SiHtml5, HTML: SiHtml5,
  SiCss: SiCss, CSS: SiCss, CSS3: SiCss,
  SiJavascript: SiJavascript, JAVASCRIPT: SiJavascript, JS: SiJavascript,
  SiTypescript: SiTypescript, TYPESCRIPT: SiTypescript, TS: SiTypescript,
  SiReact: SiReact, REACT: SiReact, 'REACT.JS': SiReact,
  SiNextdotjs: SiNextdotjs, NEXTJS: SiNextdotjs, NEXT: SiNextdotjs, 'NEXT.JS': SiNextdotjs,
  SiVuedotjs: SiVuedotjs, VUEJS: SiVuedotjs, VUE: SiVuedotjs, 'VUE.JS': SiVuedotjs,
  SiAngular: SiAngular, ANGULAR: SiAngular,
  SiSvelte: SiSvelte, SVELTE: SiSvelte,
  SiPreact: SiPreact, PREACT: SiPreact,
  SiSolid: SiSolid, SOLID: SiSolid,
  SiTailwindcss: SiTailwindcss, TAILWIND: SiTailwindcss, 'TAILWIND CSS': SiTailwindcss, TAILWINDCSS: SiTailwindcss,
  SiBootstrap: SiBootstrap, BOOTSTRAP: SiBootstrap,
  SiSass: SiSass, SASS: SiSass, SCSS: SiSass,
  SiLess: SiLess, LESS: SiLess,
  SiStylus: SiStylus, STYLUS: SiStylus,
  SiNodedotjs: SiNodedotjs, NODEJS: SiNodedotjs, NODE: SiNodedotjs, 'NODE.JS': SiNodedotjs,
  SiExpress: SiExpress, EXPRESS: SiExpress, 'EXPRESS.JS': SiExpress,
  SiDeno: SiDeno, DENO: SiDeno,
  SiBun: SiBun, BUN: SiBun,
  SiNestjs: SiNestjs, NESTJS: SiNestjs, NEST: SiNestjs,
  SiNuxt: SiNuxt, NUXTJS: SiNuxt, NUXT: SiNuxt,
  SiRemix: SiRemix, REMIX: SiRemix,
  SiAstro: SiAstro, ASTRO: SiAstro,
  SiPython: SiPython, PYTHON: SiPython,
  SiDjango: SiDjango, DJANGO: SiDjango,
  SiFlask: SiFlask, FLASK: SiFlask,
  SiFastapi: SiFastapi, FASTAPI: SiFastapi,
  SiPhp: SiPhp, PHP: SiPhp,
  SiLaravel: SiLaravel, LARAVEL: SiLaravel,
  SiRuby: SiRuby, RUBY: SiRuby,
  SiRubyonrails: SiRubyonrails, RAILS: SiRubyonrails, 'RUBY ON RAILS': SiRubyonrails,
  SiOpenjdk: SiOpenjdk, JAVA: SiOpenjdk,
  SiKotlin: SiKotlin, KOTLIN: SiKotlin,
  SiGo: SiGo, GO: SiGo, GOLANG: SiGo,
  SiRust: SiRust, RUST: SiRust,
  SiCplusplus: SiCplusplus, 'C++': SiCplusplus, CPP: SiCplusplus,
  SiSwift: SiSwift, SWIFT: SiSwift,
  SiDart: SiDart, DART: SiDart,
  SiDotnet: SiDotnet, DOTNET: SiDotnet, '.NET': SiDotnet, CSHARP: SiDotnet, 'C#': SiDotnet,
  SiFlutter: SiFlutter, FLUTTER: SiFlutter,
  SiMongodb: SiMongodb, MONGODB: SiMongodb, MONGO: SiMongodb,
  SiMysql: SiMysql, MYSQL: SiMysql,
  SiPostgresql: SiPostgresql, POSTGRESQL: SiPostgresql, POSTGRES: SiPostgresql,
  SiRedis: SiRedis, REDIS: SiRedis,
  SiSqlite: SiSqlite, SQLITE: SiSqlite,
  SiFirebase: SiFirebase, FIREBASE: SiFirebase,
  SiSupabase: SiSupabase, SUPABASE: SiSupabase,
  SiPlanetscale: SiPlanetscale, PLANETSCALE: SiPlanetscale,
  SiGit: SiGit, GIT: SiGit,
  SiGithub: SiGithub, GITHUB: SiGithub,
  SiGitlab: SiGitlab, GITLAB: SiGitlab,
  SiDocker: SiDocker, DOCKER: SiDocker,
  SiKubernetes: SiKubernetes, KUBERNETES: SiKubernetes, K8S: SiKubernetes,
  SiDigitalocean: SiDigitalocean, DIGITALOCEAN: SiDigitalocean,
  SiHeroku: SiHeroku, HEROKU: SiHeroku,
  SiVercel: SiVercel, VERCEL: SiVercel,
  SiNetlify: SiNetlify, NETLIFY: SiNetlify,
  SiRailway: SiRailway, RAILWAY: SiRailway,
  SiRender: SiRender, RENDER: SiRender,
  SiFlydotio: SiFlydotio, FLYIO: SiFlydotio, FLY: SiFlydotio,
  SiLinux: SiLinux, LINUX: SiLinux,
  SiUbuntu: SiUbuntu, UBUNTU: SiUbuntu,
  SiKalilinux: SiKalilinux, KALI: SiKalilinux, 'KALI LINUX': SiKalilinux,
  SiFigma: SiFigma, FIGMA: SiFigma,
  SiFramer: SiFramer, FRAMER: SiFramer, 'FRAMER MOTION': SiFramer,
  SiCanva: SiCanva, CANVA: SiCanva,
  SiWordpress: SiWordpress, WORDPRESS: SiWordpress, WP: SiWordpress,
  SiGraphql: SiGraphql, GRAPHQL: SiGraphql,
  SiTrpc: SiTrpc, TRPC: SiTrpc,
  SiWebpack: SiWebpack, WEBPACK: SiWebpack,
  SiVite: SiVite, VITE: SiVite,
  SiBabel: SiBabel, BABEL: SiBabel,
  SiEslint: SiEslint, ESLINT: SiEslint,
  SiPrettier: SiPrettier, PRETTIER: SiPrettier,
  SiYarn: SiYarn, YARN: SiYarn,
  SiNpm: SiNpm, NPM: SiNpm,
  SiPnpm: SiPnpm, PNPM: SiPnpm,
  SiJest: SiJest, JEST: SiJest,
  SiCypress: SiCypress, CYPRESS: SiCypress,
  SiSelenium: SiSelenium, SELENIUM: SiSelenium,
  SiPrisma: SiPrisma, PRISMA: SiPrisma,
  SiSequelize: SiSequelize, SEQUELIZE: SiSequelize,
  SiMongoose: SiMongoose, MONGOOSE: SiMongoose,
  SiSocketdotio: SiSocketdotio, SOCKETIO: SiSocketdotio, 'SOCKET.IO': SiSocketdotio, SOCKET: SiSocketdotio,
  SiNginx: SiNginx, NGINX: SiNginx,
  SiApache: SiApache, APACHE: SiApache,
  SiApachemaven: SiApachemaven, MAVEN: SiApachemaven,
  SiGradle: SiGradle, GRADLE: SiGradle,
  SiAnsible: SiAnsible, ANSIBLE: SiAnsible,
  SiTerraform: SiTerraform, TERRAFORM: SiTerraform,
  SiGrafana: SiGrafana, GRAFANA: SiGrafana,
  SiPrometheus: SiPrometheus, PROMETHEUS: SiPrometheus,
  SiPostman: SiPostman, POSTMAN: SiPostman,
  SiSwagger: SiSwagger, SWAGGER: SiSwagger,
  SiMarkdown: SiMarkdown, MARKDOWN: SiMarkdown, MD: SiMarkdown,
  SiRedux: SiRedux, REDUX: SiRedux,
  SiReactrouter: SiReactrouter, 'REACT ROUTER': SiReactrouter, REACTROUTER: SiReactrouter,
  SiShadcnui: SiShadcnui, SHADCN: SiShadcnui, 'SHADCN UI': SiShadcnui,
  SiRadixui: SiRadixui, RADIX: SiRadixui, 'RADIX UI': SiRadixui,
  SiDaisyui: SiDaisyui, DAISYUI: SiDaisyui, DAISY: SiDaisyui,
  SiChakraui: SiChakraui, CHAKRA: SiChakraui, 'CHAKRA UI': SiChakraui,
  SiMui: SiMui, MUI: SiMui, 'MATERIAL UI': SiMui,
  SiAntdesign: SiAntdesign, ANT: SiAntdesign, 'ANT DESIGN': SiAntdesign,
  SiThreedotjs: SiThreedotjs, THREEJS: SiThreedotjs, THREE: SiThreedotjs, 'THREE.JS': SiThreedotjs,
  SiElectron: SiElectron, ELECTRON: SiElectron,
  SiTensorflow: SiTensorflow, TENSORFLOW: SiTensorflow, TF: SiTensorflow,
  SiPytorch: SiPytorch, PYTORCH: SiPytorch,
  SiOpenai: SiOpenai, OPENAI: SiOpenai,
  SiJupyter: SiJupyter, JUPYTER: SiJupyter,
  SiAnaconda: SiAnaconda, ANACONDA: SiAnaconda,
  SiMatterdotjs: SiMatterdotjs, MATTERJS: SiMatterdotjs,
  SiGsap: SiGsap, GSAP: SiGsap,
  SiGreensock: SiGreensock, GREENSOCK: SiGreensock,
  SiChartdotjs: SiChartdotjs, CHARTJS: SiChartdotjs, 'CHART.JS': SiChartdotjs,
  SiMermaid: SiMermaid, MERMAID: SiMermaid,
  SiStrapi: SiStrapi, STRAPI: SiStrapi,
  SiSanity: SiSanity, SANITY: SiSanity,
  SiContentful: SiContentful, CONTENTFUL: SiContentful,
  SiDirectus: SiDirectus, DIRECTUS: SiDirectus,
  SiPayloadcms: SiPayloadcms, PAYLOAD: SiPayloadcms, 'PAYLOAD CMS': SiPayloadcms,
  SiSolidity: SiSolidity, SOLIDITY: SiSolidity,
  SiHono: SiHono, HONO: SiHono,
  SiFastify: SiFastify, FASTIFY: SiFastify,
  SiKoa: SiKoa, KOA: SiKoa,
  SiAdonisjs: SiAdonisjs, ADONIS: SiAdonisjs,
  SiMoleculer: SiMoleculer, MOLECULER: SiMoleculer,
  SiBabylondotjs: SiBabylondotjs, BABYLON: SiBabylondotjs,
  SiP5Dotjs: SiP5Dotjs, P5JS: SiP5Dotjs,
  SiCocos: SiCocos, COCOS: SiCocos,
  SiHomebrew: SiHomebrew, HOMEBREW: SiHomebrew, BREW: SiHomebrew,
  SiVim: SiVim, VIM: SiVim,
  SiNeovim: SiNeovim, NEOVIM: SiNeovim, NVIM: SiNeovim,
  SiZsh: SiZsh, ZSH: SiZsh,
  SiXcode: SiXcode, XCODE: SiXcode,
  SiWebstorm: SiWebstorm, WEBSTORM: SiWebstorm,
  SiIntellijidea: SiIntellijidea, INTELLIJ: SiIntellijidea, 'INTELLIJ IDEA': SiIntellijidea,
  SiPycharm: SiPycharm, PYCHARM: SiPycharm,
  SiGoland: SiGoland, GOLAND: SiGoland,
  SiApple: SiApple, APPLE: SiApple, IOS: SiApple, MACOS: SiApple,
  SiAndroid: SiAndroid, ANDROID: SiAndroid,
  SiRaspberrypi: SiRaspberrypi, RASPBERRYPI: SiRaspberrypi, 'RASPBERRY PI': SiRaspberrypi,
  SiArduino: SiArduino, ARDUINO: SiArduino,
  SiTailscale: SiTailscale, TAILSCALE: SiTailscale,
  SiCloudflare: SiCloudflare, CLOUDFLARE: SiCloudflare,
  SiCloudinary: SiCloudinary, CLOUDINARY: SiCloudinary,
  SiCisco: SiCisco, CISCO: SiCisco, 'NETWORK DESIGN': SiCisco, 'CYBER SECURITY': SiCisco, 'INTERNET OF THINGS': SiCisco,
  'VISUAL STUDIO': SiCisco,
  'OPENCODE': SiCisco,
}

function SkillIcon({ skill, className, style }) {
  const IconComponent = useMemo(() => {
    const key = skill.icon || skill.name
    if (!key) return null
    return skillIconMap[key] || skillIconMap[key.toUpperCase()] || null
  }, [skill.icon, skill.name])
  const FallbackIcon = Code2
  const Icon = IconComponent || FallbackIcon
  return <Icon className={className} style={style} />
}

export default function Skills() {
  const shouldReduceMotion = useReducedMotion()
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState(null)

  useEffect(() => {
    getSkills({ status: 'active', limit: 100 })
      .then((data) => {
        setSkills(data.skills || [])
        setCategories(data.categories || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const skillCards = useMemo(() => {
    return categories
      .filter((cat) => cat.type === 'skills')
      .map((cat) => {
        const catSkills = skills.filter(
          (s) => s.category?.toLowerCase() === cat.title?.toLowerCase() && s.status === 'active',
        )
        return {
          _id: cat._id,
          category: cat.title,
          headerIcon: cat.icon,
          color: cat.color || '#6366f1',
          skills: catSkills,
          type: 'skills',
        }
      })
      .filter((card) => card.skills.length > 0)
  }, [categories, skills])

  const certificatesCard = useMemo(() => {
    const certCat = categories.find((cat) => cat.type === 'certificates')
    if (!certCat) return null
    const certSkills = skills.filter(
      (s) => s.category?.toLowerCase() === certCat.title?.toLowerCase() && s.status === 'active',
    )
    if (certSkills.length === 0) return null
    return {
      _id: certCat._id,
      category: certCat.title,
      headerIcon: certCat.icon,
      color: certCat.color || '#14b8a6',
      skills: certSkills,
      type: 'certificates',
    }
  }, [categories, skills])

  const allCards = useMemo(() => {
    const cards = [...skillCards]
    if (certificatesCard) cards.push(certificatesCard)
    return cards
  }, [skillCards, certificatesCard])

  const topRow = allCards.slice(0, 4)
  const bottomRow = allCards.slice(4)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
    },
  }

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: 80,
        damping: 12,
      },
    },
  }

  if (loading) {
    return (
      <section id="skills" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-black/50 transition-colors duration-500">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-black transition-colors duration-500"
      aria-label="Skills section"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20"
          >
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
            My Expertise
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-[#F8FAFC] mb-4 sm:mb-6 tracking-tight">
            Technical Skills
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed px-4">
            A comprehensive overview of the technologies and tools I master to build modern digital solutions.
          </p>
        </motion.div>

        {allCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500">No skills added yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 md:p-10 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] max-w-5xl lg:max-w-6xl mx-auto relative overflow-hidden shadow-sm"
          >
            {topRow.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8 relative z-10">
                {topRow.map((card) => (
                  <SkillCard
                    key={card._id}
                    card={card}
                    itemVariants={itemVariants}
                    onCertClick={(cert) => setSelectedCert(cert)}
                  />
                ))}
              </div>
            )}

            {bottomRow.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto relative z-10">
                {bottomRow.map((card) => (
                  <SkillCard
                    key={card._id}
                    card={card}
                    itemVariants={itemVariants}
                    onCertClick={(cert) => setSelectedCert(cert)}
                  />
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: shouldReduceMotion ? 0.1 : 0.8 }}
              className="mt-10 sm:mt-14 md:mt-18 pt-8 sm:pt-10 md:pt-14 border-t border-gray-200 dark:border-neutral-800 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-16 relative z-10"
            >
              {[
                { label: 'Technologies', value: `${skills.filter((s) => s.category?.toLowerCase() !== 'certificates').length}+` },
                { label: 'Certificates', value: `${certificatesCard?.skills.length || 0}+` },
                { label: 'Categories', value: `${skillCards.length}+` },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center flex flex-col items-center"
                >
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/10 text-primary mb-2 sm:mb-3 md:mb-4">
                    <Award size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-[#F8FAFC] mb-1 font-display">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-400 dark:text-[#94A3B8]">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Certificate Detail Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function SkillCard({ card, itemVariants, onCertClick }) {
  const color = card.color

  if (card.type === 'certificates') {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-slate-700 transition-all duration-300 group"
      >
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{ color, backgroundColor: `${color}14` }}
            >
              <Award size={20} />
            </div>
            <h3 className="text-sm sm:text-base font-bold tracking-wide opacity-30 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
              {card.category}
            </h3>
          </div>

          {/* Certificate list inside the card */}
          <div className="space-y-1.5 flex-1">
            {card.skills.map((cert) => (
              <button
                key={cert._id}
                onClick={() => onCertClick(cert)}
                className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group/cert"
              >
                {cert.icon ? (
                  <img
                    src={cert.icon.startsWith('http') ? cert.icon : `http://localhost:5000${cert.icon}`}
                    alt=""
                    className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Award size={14} style={{ color }} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium leading-tight block truncate transition-colors duration-200 group-hover/cert:text-gray-900 dark:group-hover/cert:text-gray-200">
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span className="text-[11px] text-gray-400 block truncate">
                      {cert.issuer}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              {card.skills.length} certificate{card.skills.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-slate-700 transition-all duration-300 group"
    >
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{ color, backgroundColor: `${color}14` }}
          >
            <Code2 size={20} style={{ color }} />
          </div>
          <h3 className="text-sm sm:text-base font-bold tracking-wide opacity-30 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
            {card.category}
          </h3>
        </div>

        <div className="space-y-2.5 flex-1">
          {card.skills.map((skill) => (
            <div
              key={skill._id}
              className="flex items-center gap-2.5 group/skill"
            >
              <SkillIcon
                skill={skill}
                className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover/skill:scale-110 dark:opacity-100"
                style={{ color }}
              />
              <span className="text-sm font-medium leading-tight transition-colors duration-200 group-hover/skill:text-gray-900 dark:group-hover/skill:text-gray-200">
                {skill.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            {card.skills.length} skill{card.skills.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function CertModal({ cert, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-slate-800"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {cert.icon && (
          <div className="h-36 bg-gray-100 dark:bg-slate-800 overflow-hidden">
            <img
              src={cert.icon.startsWith('http') ? cert.icon : `http://localhost:5000${cert.icon}`}
              alt={cert.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Certificate</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {cert.name}
          </h3>

          <div className="space-y-3 text-sm">
            {cert.issuer && (
              <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400">
                <Building2 size={16} className="shrink-0" />
                <span>{cert.issuer}</span>
              </div>
            )}
            {cert.issueDate && (
              <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400">
                <Calendar size={16} className="shrink-0" />
                <span>{cert.issueDate}</span>
              </div>
            )}
          </div>

          {cert.description && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {cert.description}
            </p>
          )}

          {cert.certificateUrl && (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink size={14} />
              View Certificate
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
