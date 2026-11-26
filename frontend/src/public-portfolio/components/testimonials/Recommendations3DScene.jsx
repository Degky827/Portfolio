import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Star, BadgeCheck, X } from 'lucide-react'
import GuillocheWaves from '../ui/GuillocheWaves'

export default function Recommendations3DScene({
  testimonials = [],
  onSelectTestimonial,
}) {
  // Perspective isometric tilt angle (-16deg pitch gives the exact isometric view of top & front/side faces)
  const [rotationY, setRotationY] = useState(25)
  const [rotationX, setRotationX] = useState(-16)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [activeFaceIndex, setActiveFaceIndex] = useState(0)
  const [cubeSize, setCubeSize] = useState(250)
  const [isFastSpinning, setIsFastSpinning] = useState(false)

  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const hasDragged = useRef(false)
  const lastRotY = useRef(25)
  const lastRotX = useRef(-16)
  const requestRef = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.15 })

  // Trigger fast 3D rotation during entrance and 3-second hover
  useEffect(() => {
    if (isInView) {
      setIsFastSpinning(true)
      const timer = setTimeout(() => {
        setIsFastSpinning(false)
      }, 4600)
      return () => clearTimeout(timer)
    } else {
      setIsFastSpinning(false)
    }
  }, [isInView])

  // Measure responsive cube size (compact to leave full visibility for text & hand)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 420) {
        setCubeSize(170)
      } else if (window.innerWidth < 640) {
        setCubeSize(185)
      } else {
        setCubeSize(205)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const halfSize = Math.round(cubeSize / 2)

  // 4 Primary faces for the 3D cube using real testimonial data
  const defaultCubeData = [
    {
      name: 'Emily Rodriguez',
      role: 'Startup Founder',
      content: 'Desalegn is an exceptional developer. His work is clean, professional, and always delivered on time.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Daniel Tesfaye',
      role: 'Software Engineer',
      content: 'Professional, creative, and always goes the extra mile.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Abebe Kebede',
      role: 'Senior Software Engineer',
      content: 'Consistently delivered high-quality software solutions and demonstrated strong problem-solving skills throughout the project.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Sara Mohammed',
      role: 'Team Lead, Frontend',
      content: 'He wrote clean, maintainable React components. Attention to detail and communication made collaboration effortless.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  ]

  // Merge with fetched testimonials if available
  const cubeFaces = defaultCubeData.map((fallback, idx) => {
    const match = testimonials[idx]
    return match
      ? {
          name: match.name || fallback.name,
          role: match.role || fallback.role,
          content: match.content ? (match.content.length > 120 ? match.content.slice(0, 115) + '...' : match.content) : fallback.content,
          rating: match.rating || 5,
          avatar: match.avatar || fallback.avatar,
        }
      : fallback
  })

  // Helper to calculate which face is facing forward
  // Face k has initial angle (k * 90 deg).
  // Under transform rotateY(rotY), its angle is (k * 90 + rotY).
  // The face facing front has (k * 90 + rotY) ≈ 0 mod 360, so k * 90 ≈ -rotY mod 360.
  const calculateFrontFaceIndex = useCallback((rotY) => {
    const targetAngle = ((-rotY % 360) + 360) % 360
    return Math.round(targetAngle / 90) % 4
  }, [])

  // Continuous auto-rotation (Very fast while hovering/waiting for 3s, then serene)
  const animateRotation = useCallback(() => {
    if (isAutoRotating && !isDragging && !isPopoverOpen) {
      setRotationY((prev) => {
        const speed = isFastSpinning ? 7.5 : 0.3
        const next = prev - speed
        const frontIdx = calculateFrontFaceIndex(next)
        setActiveFaceIndex(frontIdx)
        return next
      })
    }
    requestRef.current = requestAnimationFrame(animateRotation)
  }, [isAutoRotating, isDragging, isPopoverOpen, isFastSpinning, calculateFrontFaceIndex])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateRotation)
    return () => cancelAnimationFrame(requestRef.current)
  }, [animateRotation])

  // Mouse & Touch Drag Handlers
  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true)
    hasDragged.current = false
    dragStartX.current = clientX
    dragStartY.current = clientY
    lastRotY.current = rotationY
    lastRotX.current = rotationX
  }

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging) return
    const deltaX = clientX - dragStartX.current
    const deltaY = clientY - dragStartY.current

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDragged.current = true
    }

    const newY = lastRotY.current + deltaX * 0.6
    const newX = Math.max(-28, Math.min(-5, lastRotX.current - deltaY * 0.3))
    setRotationY(newY)
    setRotationX(newX)

    const frontIdx = calculateFrontFaceIndex(newY)
    setActiveFaceIndex(frontIdx)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Click on cube: if not dragged, open front card popover
  const handleCubeClick = (e) => {
    e.stopPropagation()
    if (!hasDragged.current) {
      setIsPopoverOpen(true)
    }
  }

  // Rotate smoothly to a specific face when pill is clicked
  const rotateToFace = (index) => {
    const desiredBase = -index * 90
    const k = Math.round((rotationY - desiredBase) / 360)
    const targetY = desiredBase + k * 360
    setRotationY(targetY)
    setActiveFaceIndex(index)
  }

  const activeReview = cubeFaces[activeFaceIndex] || cubeFaces[0]

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none"
    >
      {/* ── Background: About-Page Style Guilloche Waves + Glow Orbs ── */}
      <div className="absolute -inset-x-12 sm:-inset-x-28 -inset-y-20 pointer-events-none overflow-hidden -z-10">
        {/* Monochromatic purple Guilloche mathematical ribbon wave background matching About page */}
        <GuillocheWaves className="absolute inset-0 z-0 opacity-55 dark:opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-purple-500/[0.08] dark:bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
      </div>

      {/* ── Main 3D Stage: Hand Supporting the Glowing Tray with 3D Glass Cube ── */}
      <div
        className="relative w-full max-w-lg aspect-[4/3.2] sm:aspect-[4/3.0] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing p-2 select-none"
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => {
          if (e.touches[0]) handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
        }}
        onTouchEnd={handleDragEnd}
      >
        {/* ── 3D Scene Container ── */}
        <div className="relative w-full flex flex-col items-center justify-center pt-2">
          
          {/* ── The Real 3D Glass Cube: Floats straight down from above, hovers/rotates VERY FAST above hand for 3 seconds, then softly sits ── */}
          <motion.div
            className="relative z-20 cursor-pointer"
            onClick={handleCubeClick}
            initial={{
              opacity: 0,
              x: 0,
              y: -280,
              scale: 0.55,
              rotateZ: 0,
            }}
            animate={
              isInView
                ? {
                    opacity: [0, 1, 1, 1, 1],
                    x: [0, 0, 0, 0, 0],
                    y: [-280, -42, -38, -36, 0],
                    scale: [0.55, 1, 1, 1, 1],
                    rotateZ: [0, 0, 0, 0, 0],
                  }
                : {
                    opacity: 0,
                    x: 0,
                    y: -280,
                    scale: 0.55,
                    rotateZ: 0,
                  }
            }
            transition={{
              duration: 4.6,
              delay: 0.8,
              times: [0, 0.174, 0.50, 0.826, 1],
              ease: ['easeOut', 'easeInOut', 'easeInOut', [0.16, 1, 0.3, 1]],
            }}
            style={{
              width: `${cubeSize}px`,
              height: `${cubeSize}px`,
              perspective: '1200px',
              perspectiveOrigin: '50% 50%',
            }}
            title="Click to view full testimonial card"
          >
            <div
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                transition: isDragging ? 'none' : 'transform 0.08s linear',
              }}
            >
              {/* ── Face 0: Front (Emily Rodriguez) ── */}
              <div
                className="absolute inset-0 p-3 sm:p-3.5 rounded-[22px] flex flex-col justify-between border-2 border-[#36454F]/85 dark:border-slate-500/85 shadow-[0_0_25px_rgba(54,69,79,0.3),inset_0_0_20px_rgba(255,255,255,0.9)] backdrop-blur-2xl bg-gradient-to-br from-white/95 via-purple-50/90 to-white/90 text-slate-900"
                style={{
                  transform: `translateZ(${halfSize}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div>
                  <span className="text-purple-600 font-serif text-xl sm:text-2xl leading-none block font-black">
                    &ldquo;&ldquo;
                  </span>
                  <p className="mt-1 text-[10.5px] sm:text-[11px] font-medium leading-snug text-slate-800 line-clamp-3">
                    {cubeFaces[0].content}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1 text-purple-600">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-3 h-3 fill-purple-600 text-purple-600" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1.5 border-t border-purple-100">
                  <img
                    src={cubeFaces[0].avatar}
                    alt={cubeFaces[0].name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1.5 ring-purple-400 shadow-sm"
                  />
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold truncate text-[#1a0b3b]">
                      {cubeFaces[0].name}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">
                      {cubeFaces[0].role}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Face 1: Right (Daniel Tesfaye) ── */}
              <div
                className="absolute inset-0 p-3 sm:p-3.5 rounded-[22px] flex flex-col justify-between border-2 border-[#36454F]/85 dark:border-slate-500/85 shadow-[0_0_25px_rgba(54,69,79,0.3),inset_0_0_20px_rgba(255,255,255,0.9)] backdrop-blur-2xl bg-gradient-to-br from-white/95 via-purple-50/90 to-white/90 text-slate-900"
                style={{
                  transform: `rotateY(90deg) translateZ(${halfSize}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div>
                  <span className="text-purple-600 font-serif text-xl sm:text-2xl leading-none block font-black">
                    &ldquo;&ldquo;
                  </span>
                  <p className="mt-1 text-[10.5px] sm:text-[11px] font-medium leading-snug text-slate-800 line-clamp-3">
                    {cubeFaces[1].content}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1 text-purple-600">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-3 h-3 fill-purple-600 text-purple-600" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1.5 border-t border-purple-100">
                  <img
                    src={cubeFaces[1].avatar}
                    alt={cubeFaces[1].name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1.5 ring-purple-400 shadow-sm"
                  />
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold truncate text-[#1a0b3b]">
                      {cubeFaces[1].name}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">
                      {cubeFaces[1].role}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Face 2: Back (Abebe Kebede) ── */}
              <div
                className="absolute inset-0 p-3 sm:p-3.5 rounded-[22px] flex flex-col justify-between border-2 border-[#36454F]/85 dark:border-slate-500/85 shadow-[0_0_25px_rgba(54,69,79,0.3),inset_0_0_20px_rgba(255,255,255,0.9)] backdrop-blur-2xl bg-gradient-to-br from-white/95 via-purple-50/90 to-white/90 text-slate-900"
                style={{
                  transform: `rotateY(180deg) translateZ(${halfSize}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div>
                  <span className="text-purple-600 font-serif text-xl sm:text-2xl leading-none block font-black">
                    &ldquo;&ldquo;
                  </span>
                  <p className="mt-1 text-[10.5px] sm:text-[11px] font-medium leading-snug text-slate-800 line-clamp-3">
                    {cubeFaces[2].content}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1 text-purple-600">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-3 h-3 fill-purple-600 text-purple-600" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1.5 border-t border-purple-100">
                  <img
                    src={cubeFaces[2].avatar}
                    alt={cubeFaces[2].name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1.5 ring-purple-400 shadow-sm"
                  />
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold truncate text-[#1a0b3b]">
                      {cubeFaces[2].name}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">
                      {cubeFaces[2].role}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Face 3: Left (Sara Mohammed) ── */}
              <div
                className="absolute inset-0 p-3 sm:p-3.5 rounded-[22px] flex flex-col justify-between border-2 border-[#36454F]/85 dark:border-slate-500/85 shadow-[0_0_25px_rgba(54,69,79,0.3),inset_0_0_20px_rgba(255,255,255,0.9)] backdrop-blur-2xl bg-gradient-to-br from-white/95 via-purple-50/90 to-white/90 text-slate-900"
                style={{
                  transform: `rotateY(270deg) translateZ(${halfSize}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div>
                  <span className="text-purple-600 font-serif text-xl sm:text-2xl leading-none block font-black">
                    &ldquo;&ldquo;
                  </span>
                  <p className="mt-1 text-[10.5px] sm:text-[11px] font-medium leading-snug text-slate-800 line-clamp-3">
                    {cubeFaces[3].content}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1 text-purple-600">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-3 h-3 fill-purple-600 text-purple-600" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1.5 border-t border-purple-100">
                  <img
                    src={cubeFaces[3].avatar}
                    alt={cubeFaces[3].name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1.5 ring-purple-400 shadow-sm"
                  />
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold truncate text-[#1a0b3b]">
                      {cubeFaces[3].name}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">
                      {cubeFaces[3].role}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Top Face: Frosted Smoked Glass with Charcoal Black Edges ── */}
              <div
                className="absolute inset-0 rounded-[26px] flex items-center justify-center border-2 border-[#36454F]/85 dark:border-slate-500/85 bg-gradient-to-br from-white/90 via-slate-100/70 to-white/85 backdrop-blur-xl shadow-[inset_0_0_30px_rgba(54,69,79,0.3)]"
                style={{
                  transform: `rotateX(90deg) translateZ(${halfSize}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="w-14 h-14 rounded-full bg-slate-800/10 flex items-center justify-center border border-slate-400/50 shadow-inner">
                  <span className="text-slate-800 dark:text-slate-200 font-serif text-3xl font-black">
                    &ldquo;&ldquo;
                  </span>
                </div>
              </div>

              {/* ── Bottom Face: Charcoal Black Underglow Plate ── */}
              <div
                className="absolute inset-0 rounded-[26px] bg-[#1E252B]/40 blur-md"
                style={{
                  transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
                }}
              />
            </div>
          </motion.div>

          {/* ── Charcoal Black Orbital Ring Beneath the Cube Base (Fades in as cube touches down) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.9, delay: 4.6, ease: 'easeOut' }}
            className="relative z-10 w-[160px] h-[30px] sm:w-[180px] sm:h-[34px] mt-1 pointer-events-none"
            style={{
              transform: `rotateY(${rotationY * 0.25}deg)`,
              transition: isDragging ? 'none' : 'transform 0.08s linear',
            }}
          >
            {/* Primary Charcoal Black Ring */}
            <div className="w-full h-full rounded-[100%] border-[2px] border-[#36454F] shadow-[0_0_24px_rgba(54,69,79,0.5),inset_0_0_12px_rgba(74,85,104,0.4)] bg-gradient-to-r from-slate-700/20 via-white/40 to-slate-700/20 blur-[0.3px] animate-pulse" />
            
            {/* Outer Subtle Orbital Ring */}
            <div className="absolute -inset-2 rounded-[100%] border border-slate-400/40 shadow-[0_0_15px_rgba(54,69,79,0.3)] pointer-events-none" />
          </motion.div>

          {/* ── Realistic Human Hand (Palm-Up from Image: Positioned cleanly beneath cube) ── */}
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 70, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-15 w-[180px] sm:w-[210px] mt-0.5 sm:mt-1 pointer-events-none flex justify-center"
            style={{
              transform: `rotateY(${Math.sin((rotationY * Math.PI) / 180) * 2.5}deg) translateY(${Math.cos((rotationY * Math.PI) / 90) * 1.5}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <img
              src="/recommendations-hand-front.png"
              alt="Realistic human hand supporting the 3D rotating cube with its fingertips"
              className="w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(30,37,43,0.25)]"
            />
          </motion.div>

          {/* ── Popover over the Cube on Click ── */}
          <AnimatePresence>
            {isPopoverOpen && (
              <div
                className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/25 backdrop-blur-[3px] rounded-3xl"
                onClick={() => setIsPopoverOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 8 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-[340px] sm:max-w-[380px] p-6 rounded-[28px] bg-white/95 backdrop-blur-2xl border-2 border-[#36454F] shadow-[0_22px_55px_rgba(54,69,79,0.35),0_0_30px_rgba(54,69,79,0.2)] text-slate-900"
                >
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsPopoverOpen(false)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close popover"
                  >
                    <X size={15} />
                  </button>

                  <span className="text-purple-600 font-serif text-3xl sm:text-4xl leading-none block font-black">
                    &ldquo;&ldquo;
                  </span>

                  {/* Scrollable Testimonial Text Reading */}
                  <div className="mt-3 max-h-44 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                      {activeReview.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3.5 text-purple-600">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-purple-600 text-purple-600" />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      5.0 Star Rating
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-purple-100">
                    <img
                      src={activeReview.avatar}
                      alt={activeReview.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-[#1a0b3b]">
                          {activeReview.name}
                        </h4>
                        <BadgeCheck size={15} className="text-purple-600" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {activeReview.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Reviewer Selector Tabs & Active Testimonial Card ── */}
      <div className="w-full max-w-2xl mt-1 sm:mt-1.5 px-3 flex flex-col gap-2">
        {/* Face Selector Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-1.5"
        >
          {cubeFaces.map((face, index) => (
            <button
              key={face.name}
              type="button"
              onClick={() => rotateToFace(index)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                activeFaceIndex === index
                  ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md shadow-indigo-500/30 scale-105 border border-indigo-400/40'
                  : 'bg-white/95 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50/70 dark:hover:bg-slate-700 hover:border-indigo-300 hover:text-indigo-900'
              }`}
            >
              <img
                src={face.avatar}
                alt={face.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{face.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Active Testimonial Detailed Preview: Comes in rotating as cube descends */}
        <motion.div
          initial={{ opacity: 0, y: 25, rotateX: 15 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 25, rotateX: 15 }}
          transition={{ duration: 0.7, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
          className="w-full p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-purple-50/70 via-white to-purple-50/70 dark:from-slate-800/80 dark:via-slate-900/90 dark:to-slate-800/80 border border-purple-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src={activeReview.avatar}
              alt={activeReview.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-purple-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#1a0b3b] dark:text-white">
                  {activeReview.name}
                </h4>
                <BadgeCheck size={13} className="text-purple-600" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                {activeReview.role}
              </p>
              <div className="flex items-center gap-0.5 mt-0.5 text-purple-600">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-purple-600 text-purple-600" />
                ))}
              </div>
            </div>
          </div>

          <div className="max-h-16 overflow-y-auto pr-1.5 custom-scrollbar max-w-md">
            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium italic line-clamp-2">
              &ldquo;{activeReview.content}&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
