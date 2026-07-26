import { memo } from 'react'
import { motion } from 'framer-motion'
import { useIntro } from './IntroContext'

function SkipButton({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[100] px-4 py-2 rounded-lg font-mono text-xs tracking-wider border transition-all hover:scale-105 active:scale-95"
      style={{
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        borderColor: 'rgba(6, 182, 212, 0.25)',
        color: '#06b6d4',
        backdropFilter: 'blur(8px)',
      }}
    >
      SKIP INTRO →
    </motion.button>
  )
}

function MuteButton({ isMuted, onToggle }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      onClick={onToggle}
      className="fixed bottom-6 left-6 z-[100] p-2.5 rounded-lg border transition-all hover:scale-105 active:scale-95"
      style={{
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        borderColor: 'rgba(6, 182, 212, 0.25)',
        backdropFilter: 'blur(8px)',
      }}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isMuted ? (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </motion.button>
  )
}

function IntroControls() {
  const { skipIntro, isMuted, toggleMute } = useIntro()

  return (
    <>
      <SkipButton onClick={skipIntro} />
      <MuteButton isMuted={isMuted} onToggle={toggleMute} />
    </>
  )
}

export default memo(IntroControls)
