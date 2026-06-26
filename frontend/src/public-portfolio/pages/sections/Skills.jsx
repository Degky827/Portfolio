import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
import { getMediaUrl } from '../../../shared/services/api'
import { SkillsScene } from '../../../components/skills3d'
import GlassCard from '../../../components/skills3d/GlassCard'
import StatsDashboard3D from '../../../components/skills3d/StatsDashboard3D'

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
  const { t } = useTranslation()
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
      <SkillsScene>
        <section id="skills" className="py-16 sm:py-20 md:py-24 min-h-screen" aria-label={t('skills.ariaLabel')}>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          </div>
        </section>
      </SkillsScene>
    )
  }

  return (
    <SkillsScene>
      <section
        id="skills"
        className="py-16 sm:py-20 md:py-24 min-h-screen"
        aria-label={t('skills.ariaLabel')}
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
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-cyan-400 uppercase bg-cyan-500/10 rounded-full border border-cyan-500/20"
            >
              <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('skills.badge')}
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
              {t('skills.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
              {t('skills.description')}
            </p>
          </motion.div>

          {allCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">{t('skills.empty')}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 md:p-10 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] max-w-5xl lg:max-w-6xl mx-auto relative overflow-hidden shadow-2xl shadow-cyan-500/5"
            >
              {topRow.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8 relative z-10">
                  {topRow.map((card, index) => (
                    <GlassCard
                      key={card._id}
                      card={card}
                      itemVariants={itemVariants}
                      onCertClick={(cert) => setSelectedCert(cert)}
                      SkillIcon={SkillIcon}
                      getMediaUrl={getMediaUrl}
                      t={t}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {bottomRow.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto relative z-10">
                  {bottomRow.map((card, index) => (
                    <GlassCard
                      key={card._id}
                      card={card}
                      itemVariants={itemVariants}
                      onCertClick={(cert) => setSelectedCert(cert)}
                      SkillIcon={SkillIcon}
                      getMediaUrl={getMediaUrl}
                      t={t}
                      index={index + topRow.length}
                    />
                  ))}
                </div>
              )}

              <StatsDashboard3D
                technologies={skills.filter((s) => s.category?.toLowerCase() !== 'certificates').length}
                certificates={certificatesCard?.skills.length || 0}
                categories={skillCards.length}
                t={t}
              />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {selectedCert && (
            <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
          )}
        </AnimatePresence>
      </section>
    </SkillsScene>
  )
}

function CertModal({ cert, onClose }) {
  const { t } = useTranslation()
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-700/50"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          aria-label={t('skills.close')}
        >
          <X size={18} />
        </button>

        {cert.icon && (
          <div className="h-36 bg-slate-800 overflow-hidden">
            <img
              src={getMediaUrl(cert.icon)}
              alt={cert.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{t('skills.certificateLabel')}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            {cert.name}
          </h3>

          <div className="space-y-3 text-sm">
            {cert.issuer && (
              <div className="flex items-center gap-2.5 text-slate-400">
                <Building2 size={16} className="shrink-0" />
                <span>{cert.issuer}</span>
              </div>
            )}
            {cert.issueDate && (
              <div className="flex items-center gap-2.5 text-slate-400">
                <Calendar size={16} className="shrink-0" />
                <span>{cert.issueDate}</span>
              </div>
            )}
          </div>

          {cert.description && (
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              {cert.description}
            </p>
          )}

          {cert.certificateUrl && (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink size={14} />
              {t('skills.viewCertificate')}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
