import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { 
  Terminal, Code2, Zap, Shield, Globe, Database, 
  Cpu, Wifi, Layers, Monitor, Rocket, 
  Sparkles, Activity, TrendingUp, Award,
  GitBranch, Settings, Lock, Eye, Brain
} from 'lucide-react'

const advancedFeatures = [
  {
    title: 'Real-time Performance Monitor',
    description: 'Live system performance tracking with advanced metrics visualization',
    icon: Activity,
    color: '#10b981',
    stats: { cpu: '45%', memory: '2.1GB', network: '125Mbps' }
  },
  {
    title: 'AI-Powered Code Analysis',
    description: 'Machine learning algorithms for code optimization and security scanning',
    icon: Brain,
    color: '#8b5cf6',
    stats: { lines: '15.2K', complexity: 'Medium', security: '98%' }
  },
  {
    title: 'Advanced Security Protocols',
    description: 'Multi-layered encryption with quantum-resistant algorithms',
    icon: Shield,
    color: '#ef4444',
    stats: { encryption: 'AES-256', protocols: 'TLS 1.3', compliance: 'SOC2' }
  },
  {
    title: 'Distributed Architecture',
    description: 'Microservices with auto-scaling and load balancing',
    icon: Layers,
    color: '#f59e0b',
    stats: { services: '47', uptime: '99.9%', latency: '12ms' }
  }
]

const limitations = [
  {
    title: 'Quantum Computing Integration',
    description: 'Currently limited by quantum hardware availability',
    icon: Cpu,
    challenge: 'Hardware Access',
    solution: 'Hybrid classical-quantum algorithms'
  },
  {
    title: 'Neural Network Scaling',
    description: 'Training large models requires distributed computing',
    icon: Brain,
    challenge: 'Computational Resources',
    solution: 'Optimized model architectures'
  },
  {
    title: 'Real-time Data Processing',
    description: 'Processing terabytes of streaming data with sub-second latency',
    icon: TrendingUp,
    challenge: 'Network Bandwidth',
    solution: 'Edge computing optimization'
  },
  {
    title: 'Cross-platform Compatibility',
    description: 'Ensuring seamless operation across all devices and OS',
    icon: Monitor,
    challenge: 'Fragmentation',
    solution: 'WebAssembly and containerization'
  }
]

export default function AdvancedFeatures() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [terminalHistory, setTerminalHistory] = useState([])
  const [terminalInput, setTerminalInput] = useState('')
  const terminalRef = useRef(null)
  
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50])
  
  const fadeIn = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { duration: 0.8 }
  })

  const terminalCommands = [
    'npm install quantum-computing@latest',
    'git push origin main --force-with-lease',
    'docker run --rm -it --gpus all neural-network',
    'kubectl scale deployment --replicas=100',
    'openssl genpkey -algorithm ed25519'
  ]

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  const handleTerminalCommand = (e) => {
    e.preventDefault()
    if (terminalInput.trim()) {
      const newCommand = `$ ${terminalInput}`
      setTerminalHistory(prev => [...prev, newCommand])
      
      // Simulate command execution
      setTimeout(() => {
        const responses = [
          'Quantum circuit initialized successfully',
          'Neural network training complete: 98.7% accuracy',
          'Security audit passed: 0 vulnerabilities found',
          'Deployment scaled to 100 instances',
          'Performance optimized: 45% improvement achieved'
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        setTerminalHistory(prev => [...prev, randomResponse])
      }, 1000 + Math.random() * 2000)
      
      setTerminalInput('')
    }
  }

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            backgroundSize: '60px 60px, 80px 80px'
          }} 
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={fadeIn}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20"
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
            Advanced Capabilities
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-4 sm:mb-6 tracking-tight">
            Technical Excellence
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Pushing boundaries with cutting-edge technologies and solving complex engineering challenges
          </p>
        </motion.div>

        {/* Advanced Features Grid */}
        <motion.div 
          initial={fadeIn}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {advancedFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setActiveFeature(index)}
                className={`relative p-6 sm:p-8 rounded-2xl glass-card border transition-all duration-500 cursor-pointer ${
                  activeFeature === index 
                    ? 'border-primary/50 shadow-2xl shadow-primary/20' 
                    : 'border-gray-200 dark:border-slate-700 hover:border-primary/30'
                }`}
              >
                {/* Glow Effect */}
                {activeFeature === index && (
                  <motion.div
                    layoutId={`glow-${index}`}
                    className="absolute inset-0 rounded-2xl opacity-20"
                    style={{ backgroundColor: feature.color }}
                  />
                )}
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      animate={{ rotate: activeFeature === index ? 360 : 0 }}
                      transition={{ duration: 20, repeat: activeFeature === index ? Infinity : 0, ease: "linear" }}
                      className="p-3 rounded-xl glass-card"
                      style={{ color: feature.color }}
                    >
                      <IconComponent size={24} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Live Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(feature.stats).map(([key, value]) => (
                      <div key={key} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                        <div className="font-bold text-gray-900 dark:text-white" style={{ color: feature.color }}>
                          {value}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Technical Limitations */}
        <motion.div 
          initial={fadeIn}
          className="mb-12 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
            Engineering Challenges & Solutions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {limitations.map((limitation, index) => {
              const IconComponent = limitation.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 sm:p-6 rounded-xl glass-card border border-red-200 dark:border-red-900/30"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                      <IconComponent size={18} className="text-red-600 dark:text-red-400" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {limitation.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {limitation.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-red-500" />
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                        Challenge: {limitation.challenge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-green-500" />
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        Solution: {limitation.solution}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Interactive Terminal */}
        <motion.div 
          initial={fadeIn}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className="mb-4 p-4 rounded-xl glass-card border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={20} className="text-primary" />
                <span className="font-bold text-gray-900 dark:text-white">
                  Interactive Development Terminal
                </span>
              </div>
              <motion.div
                animate={{ rotate: isTerminalOpen ? 180 : 0 }}
                className="text-gray-400"
              >
                <Code2 size={20} />
              </motion.div>
            </div>
          </motion.div>

          {isTerminalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-gray-900 dark:bg-black rounded-xl border border-gray-700 overflow-hidden"
            >
              <div 
                ref={terminalRef}
                className="p-4 h-64 overflow-y-auto font-mono text-xs text-green-400"
                style={{ fontFamily: 'monospace' }}
              >
                {terminalHistory.map((line, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-400">$</span> {line}
                  </div>
                ))}
                {terminalHistory.length === 0 && (
                  <div className="text-gray-500">
                    Welcome to Advanced Development Terminal v2.0.0<br />
                    Type 'help' for available commands...
                  </div>
                )}
              </div>
              <form onSubmit={handleTerminalCommand} className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                    placeholder="Enter command..."
                    style={{ fontFamily: 'monospace' }}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/80 transition-colors"
                  >
                    Execute
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
