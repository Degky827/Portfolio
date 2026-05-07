import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import {
  Terminal, Code2, Zap, Shield, Globe, Database,
  Cpu, Wifi, Layers, Monitor, Rocket,
  Sparkles, Activity, TrendingUp, Award,
  GitBranch, Settings, Lock, Eye, Brain,
  Play, Pause, RefreshCw, Download, Upload,
  CheckCircle, AlertCircle, Clock, BarChart3
} from 'lucide-react'

const advancedFeatures = [
  {
    title: 'Real-time Performance Monitor',
    description: 'Live system performance tracking with advanced metrics visualization',
    icon: Activity,
    color: '#10b981',
    stats: { cpu: 45, memory: 2.1, network: 125, requests: 1240 },
    details: ['Auto-scaling enabled', 'Load balancer active', 'Cache hit rate: 94%']
  },
  {
    title: 'AI-Powered Code Analysis',
    description: 'Machine learning algorithms for code optimization and security scanning',
    icon: Brain,
    color: '#8b5cf6',
    stats: { lines: 15200, complexity: 72, security: 98, coverage: 87 },
    details: ['Pattern recognition active', 'Vulnerability scanning', 'Auto-fix suggestions']
  },
  {
    title: 'Advanced Security Protocols',
    description: 'Multi-layered encryption with quantum-resistant algorithms',
    icon: Shield,
    color: '#ef4444',
    stats: { encryption: 256, protocols: 3, compliance: 99.9, threats: 0 },
    details: ['End-to-end encryption', 'Zero-trust architecture', 'SOC2 Type II certified']
  },
  {
    title: 'Distributed Architecture',
    description: 'Microservices with auto-scaling and load balancing',
    icon: Layers,
    color: '#f59e0b',
    stats: { services: 47, uptime: 99.9, latency: 12, instances: 100 },
    details: ['Kubernetes orchestration', 'Service mesh enabled', 'Circuit breakers active']
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState({ cpu: 45, memory: 62, network: 125, activeUsers: 342 })
  const terminalRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50])

  const fadeIn = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { duration: 0.8 }
  })

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(20, Math.min(85, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(40, Math.min(80, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(50, Math.min(200, prev.network + (Math.random() - 0.5) * 30)),
        activeUsers: Math.max(200, Math.min(500, prev.activeUsers + Math.floor((Math.random() - 0.5) * 50)))
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getTerminalCommands = () => ({
    'help': 'Available commands: help, status, deploy, scan, monitor, clear, uptime, version',
    'status': 'All systems operational. CPU: 45% | Memory: 62% | Network: 125Mbps | Active Users: 342',
    'deploy': 'Initiating deployment... [████████████] 100%\nDeployment successful! Version 2.4.1 now live.',
    'scan': 'Running security scan...\n✓ No vulnerabilities found\n✓ Dependencies up to date\n✓ SSL certificates valid\nScan complete in 2.3s',
    'monitor': 'Real-time monitoring activated\nCPU: ████████░░ 45%\nMEM: ███████░░░ 62%\nNET: █████████░ 125Mbps',
    'uptime': `System uptime: ${Math.floor(Math.random() * 99) + 1} days, ${Math.floor(Math.random() * 23)} hours, ${Math.floor(Math.random() * 59)} minutes`,
    'version': 'Advanced Dev Platform v2.4.1\nBuild: 2026.05.07\nNode: v22.x\nReact: v19.x',
    'clear': 'CLEAR_TERMINAL'
  })

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  const handleTerminalCommand = (e) => {
    e.preventDefault()
    if (terminalInput.trim()) {
      const cmd = terminalInput.toLowerCase().trim()
      const newCommand = `$ ${terminalInput}`
      setTerminalHistory(prev => [...prev, newCommand])
      setIsProcessing(true)
      const terminalCommands = getTerminalCommands()

      setTimeout(() => {
        let response
        if (terminalCommands[cmd]) {
          response = terminalCommands[cmd]
        } else if (cmd.startsWith('npm ') || cmd.startsWith('git ') || cmd.startsWith('docker ')) {
          response = `Executing: ${terminalInput}\n✓ Command completed successfully`
        } else {
          response = `Command not found: ${cmd}\nType 'help' for available commands`
        }

        if (response === 'CLEAR_TERMINAL') {
          setTerminalHistory([])
        } else {
          setTerminalHistory(prev => [...prev, response])
        }
        setIsProcessing(false)
        setTerminalInput('')
      }, 500 + Math.random() * 1000)
    }
  }

  // Animated counter component
  const AnimatedCounter = ({ value, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const animationRef = useRef(null)

    useEffect(() => {
      if (isInView) {
        let startTime
        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          setCount(Math.floor(progress * value))
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          }
        }
        animationRef.current = requestAnimationFrame(animate)
      }
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [isInView, value, duration])

    return <span ref={ref}>{count}{suffix}</span>
  }

  return (
    <section id="advanced" className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
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
                  
                   {/* Live Stats with Animated Counters */}
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-4">
                     {Object.entries(feature.stats).map(([key, value]) => (
                       <div key={key} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                         <div className="font-bold text-gray-900 dark:text-white" style={{ color: feature.color }}>
                           <AnimatedCounter value={typeof value === 'number' ? value : parseFloat(value)} suffix={typeof value === 'number' && key !== 'complexity' && key !== 'security' && key !== 'coverage' && key !== 'uptime' && key !== 'latency' ? '' : (key === 'security' || key === 'coverage' || key === 'complexity' ? '%' : key === 'uptime' ? '%' : key === 'latency' ? 'ms' : '')} />
                         </div>
                         <div className="text-gray-500 dark:text-gray-400 capitalize">
                           {key}
                         </div>
                       </div>
                     ))}
                   </div>

                    {/* Feature Details */}
                    {activeFeature === index && feature.details && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-1"
                      >
                        {feature.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <CheckCircle size={12} className="text-green-500" />
                            {detail}
                          </div>
                        ))}
                      </motion.div>
                    )}
                 </div>
               </motion.div>
             )
           })}
         </motion.div>

         {/* Live System Metrics Dashboard */}
         <motion.div
           initial={fadeIn}
           className="mb-12 sm:mb-16 p-6 sm:p-8 rounded-2xl glass-card border border-gray-200 dark:border-slate-700"
         >
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <BarChart3 className="text-primary" size={24} />
               Live System Metrics
             </h3>
             <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Real-time
             </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
             {[
               { label: 'CPU Usage', value: systemMetrics.cpu, color: '#10b981', suffix: '%' },
               { label: 'Memory', value: systemMetrics.memory, color: '#8b5cf6', suffix: '%' },
               { label: 'Network', value: systemMetrics.network, color: '#f59e0b', suffix: ' Mbps' },
               { label: 'Active Users', value: systemMetrics.activeUsers, color: '#ef4444', suffix: '' }
             ].map((metric, idx) => (
               <div key={idx} className="text-center">
                 <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3">
                   <svg className="w-full h-full -rotate-90">
                     <circle
                       cx="50%"
                       cy="50%"
                       r="45%"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth="8"
                       className="text-gray-200 dark:text-slate-700"
                     />
                     <circle
                       cx="50%"
                       cy="50%"
                       r="45%"
                       fill="none"
                       stroke={metric.color}
                       strokeWidth="8"
                       strokeDasharray={`${2 * Math.PI * 45}`}
                       strokeDashoffset={`${2 * Math.PI * 45 * (1 - metric.value / 100)}`}
                       className="transition-all duration-1000"
                     />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-sm sm:text-lg font-bold" style={{ color: metric.color }}>
                       {metric.suffix === '%' ? `${Math.round(metric.value)}` : metric.value}
                     </span>
                   </div>
                 </div>
                 <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                   {metric.label}
                 </div>
                 {metric.suffix === '%' && (
                   <div className="text-xs text-gray-500 mt-1">
                     {metric.value < 50 ? 'Optimal' : metric.value < 75 ? 'Normal' : 'High'}
                   </div>
                 )}
               </div>
             ))}
           </div>
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
               <div className="flex items-center gap-3">
                 {isProcessing && (
                   <RefreshCw size={16} className="text-yellow-500 animate-spin" />
                 )}
                 <motion.div
                   animate={{ rotate: isTerminalOpen ? 180 : 0 }}
                   className="text-gray-400"
                 >
                   <Code2 size={20} />
                 </motion.div>
               </div>
             </div>
           </motion.div>

           <AnimatePresence>
             {isTerminalOpen && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="bg-gray-900 dark:bg-black rounded-xl border border-gray-700 overflow-hidden"
               >
                 {/* Terminal Header */}
                 <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-950 border-b border-gray-700">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500" />
                     <div className="w-3 h-3 rounded-full bg-green-500" />
                     <span className="ml-4 text-xs text-gray-400 font-mono">terminal@advanced-dev</span>
                   </div>
                   <button
                     onClick={() => setTerminalHistory([])}
                     className="text-xs text-gray-400 hover:text-white transition-colors"
                   >
                     Clear
                   </button>
                 </div>

                 {/* Terminal Output */}
                 <div
                   ref={terminalRef}
                   className="p-4 h-72 overflow-y-auto font-mono text-sm text-green-400"
                   style={{ fontFamily: 'monospace' }}
                 >
                   {terminalHistory.length === 0 && (
                     <div className="text-gray-500">
                       <div className="mb-2">Welcome to Advanced Development Terminal v2.4.1</div>
                       <div>Type 'help' for available commands or click a quick command below.</div>
                       <div className="mt-4 flex flex-wrap gap-2">
                         {['status', 'deploy', 'scan', 'monitor'].map((cmd) => (
                           <button
                             key={cmd}
                             onClick={() => {
                               setTerminalInput(cmd)
                               setTimeout(() => {
                                 const event = { preventDefault: () => {} }
                                 handleTerminalCommand(event)
                               }, 100)
                             }}
                             className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 transition-colors"
                           >
                             {cmd}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                    {terminalHistory.map((line, index) => (
                      <div key={index} className={`mb-1 ${line.startsWith('$') ? 'text-blue-400' : ''}`}>
                        {line.includes('\n') ? (
                          line.split('\n').map((l, i) => <div key={`${index}-${i}`}>{l}</div>)
                        ) : (
                          <span className="whitespace-pre-wrap">{line}</span>
                        )}
                      </div>
                    ))}
                   {isProcessing && (
                     <div className="flex items-center gap-2 text-yellow-500">
                       <RefreshCw size={14} className="animate-spin" />
                       Processing...
                     </div>
                   )}
                 </div>

                 {/* Terminal Input */}
                 <form onSubmit={handleTerminalCommand} className="p-4 border-t border-gray-700">
                   <div className="flex items-center gap-2">
                     <span className="text-green-400">$</span>
                     <input
                       type="text"
                       value={terminalInput}
                       onChange={(e) => setTerminalInput(e.target.value)}
                       className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono placeholder-gray-600"
                       placeholder="Enter command..."
                       style={{ fontFamily: 'monospace' }}
                       autoComplete="off"
                     />
                     <button
                       type="submit"
                       disabled={isProcessing}
                       className="px-4 py-1 bg-primary text-white text-xs rounded hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                     >
                       {isProcessing ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                       Execute
                     </button>
                   </div>
                 </form>
               </motion.div>
             )}
           </AnimatePresence>
         </motion.div>
      </div>
    </section>
  )
}
