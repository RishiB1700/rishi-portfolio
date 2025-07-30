// Enhanced Home Page - Fully Responsive & Accessible
'use client'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Volume2, VolumeX, ArrowRight, ExternalLink, Eye, Mail, Linkedin, Instagram, FileText, SkipForward } from 'lucide-react'
import projectsData from '../data/projects.json'

// Mock blog data (replace with actual when available)
const mockBlogs: any[] = []

// Mock campaign data (replace with actual when available) 
const mockCampaigns: any[] = []

// Accessibility: Respect reduced motion preferences
const useAccessibleMotion = () => {
  const [isClient, setIsClient] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
    }
  }, [])

  return (isClient && reducedMotion) ? { duration: 0.01 } : {}
}

// Enhanced Kinetic Text with accessibility improvements
const KineticText = ({ children, className = "", delay = 0, as: Component = "div" }) => {
  const words = children.split(' ')
  const motionSettings = useAccessibleMotion()
  
  return (
    <Component className={className} role="heading" aria-live="polite">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: '1rem' }}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            delay: delay + i * 0.1, 
            duration: motionSettings.duration || 0.8,
            type: "spring",
            stiffness: 120
          }}
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{ 
            scale: 1.05,
            color: '#7C3AED',
            transition: { duration: 0.2 }
          }}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  )
}

// Enhanced Section with better responsive and accessibility
const Section = ({ children, className = "", parallax = false, as: Component = "section", id, ariaLabel }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', parallax ? '20%' : '0%'])
  const motionSettings = useAccessibleMotion()
  
  return (
    <Component
      id={id}
      aria-label={ariaLabel}
      className={`py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative z-10 ${className}`}
      style={{ y: parallax ? y : 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: motionSettings.duration || 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {children}
      </motion.div>
    </Component>
  )
}

// Enhanced Card Component with full accessibility
const MorphingCard = ({ 
  children, 
  className = "", 
  hoverColor = "rgba(230, 230, 250, 0.15)",
  as: Component = "div",
  role,
  tabIndex,
  onClick,
  onKeyDown,
  ariaLabel
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const motionSettings = useAccessibleMotion()
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
    onKeyDown?.(e)
  }
  
  return (
    <Component
      className={`relative focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-3xl ${className}`}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={ariaLabel}
    >
      <motion.div
        whileHover={{ 
          scale: 1.02,
          y: -8,
          transition: { duration: motionSettings.duration || 0.3 }
        }}
        className="w-full h-full"
      >
        {/* Morphing blob background */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{
            background: (isHovered || isFocused)
              ? `radial-gradient(circle at 30% 30%, ${hoverColor}, transparent 70%)`
              : `radial-gradient(circle at 50% 50%, ${hoverColor.replace('0.15', '0.08')}, transparent 60%)`,
            scale: (isHovered || isFocused) ? 1.05 : 1
          }}
          transition={{ duration: motionSettings.duration || 0.6 }}
        />
        
        {children}
      </motion.div>
    </Component>
  )
}

// PDF Viewer Component with accessibility
const PDFViewer = ({ pdfUrl, title, isOpen, onClose }) => {
  const [isClient, setIsClient] = useState(false)
  const motionSettings = useAccessibleMotion()

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Focus management
  useEffect(() => {
    if (!isClient) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus the modal when it opens
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]')
        if (modal) modal.focus()
      }, 100)
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, isClient])

  if (!isOpen || !isClient) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: motionSettings.duration || 0.3 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-viewer-title"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: motionSettings.duration || 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl"
          tabIndex={-1}
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div>
              <h2 id="pdf-viewer-title" className="text-lg sm:text-xl font-marcellus text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">View-only document</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={`Close ${title} viewer`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                ✕
              </motion.div>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={`${title} - PDF Viewer`}
              allow="fullscreen"
              style={{ background: '#f5f5f5' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Resume View Component with full accessibility
const ResumeViewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPDFUrl, setCurrentPDFUrl] = useState('')
  const [currentPDFTitle, setCurrentPDFTitle] = useState('')
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  const motionSettings = useAccessibleMotion()
  
  const resumeOptions = [
    {
      title: "General Resume",
      description: "All-purpose professional resume",
      url: "https://drive.google.com/file/d/1sAPXtgEecK1iEK1_uTTP9lwuJpn1upHh/preview"
    },
    {
      title: "Media & Performance Focus",
      description: "Media planning & analytics focused",
      url: "https://drive.google.com/file/d/1Z3gYf_wcn4TNHAqZpcQWSpEFiY83qpJy/preview"
    },
    {
      title: "Brand & Creative Focus",
      description: "Creative & brand strategy focused",
      url: "https://drive.google.com/file/d/1CLhdi_wm4R3mAT_oBP1gyYKJ0PruOnUL/preview"
    }
  ]

  const openPDF = (url, title) => {
    setCurrentPDFUrl(url)
    setCurrentPDFTitle(title)
    setIsPDFViewerOpen(true)
    setIsModalOpen(false)
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isModalOpen])

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: motionSettings.duration || 0.2 }}
        className="glassmorphism rounded-2xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-xl border border-white/40 hover:border-purple-200 transition-all duration-300 group flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        style={{ minWidth: '44px', minHeight: '44px' }}
        aria-label="View resume options"
      >
        <Eye size={20} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
        <span className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors text-sm sm:text-base">
          View Resume
        </span>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionSettings.duration || 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: motionSettings.duration || 0.3 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-white/50 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Close resume selection modal"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                ✕
              </button>

              <div className="text-center mb-6 sm:mb-8">
                <h3 id="resume-modal-title" className="text-xl sm:text-2xl lg:text-3xl font-marcellus text-gray-800 mb-4">
                  Choose Resume Version
                </h3>
                <p className="text-gray-600 font-inter text-sm sm:text-base">
                  Select the resume that best fits what you're looking for
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {resumeOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => openPDF(option.url, option.title)}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: motionSettings.duration || 0.2 }}
                    className="glassmorphism rounded-2xl p-4 sm:p-6 backdrop-blur-xl border border-white/40 hover:border-purple-200 transition-all duration-300 group text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ minHeight: '44px' }}
                    aria-label={`Select ${option.title} - ${option.description}`}
                  >
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" aria-hidden="true">📄</div>
                    <h4 className="font-marcellus text-base sm:text-lg text-gray-800 mb-2 group-hover:text-purple-700">
                      {option.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700">
                      {option.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="text-center">
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: motionSettings.duration || 0.2 }}
                  className="px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ minHeight: '44px' }}
                  aria-label="Close modal"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PDFViewer
        pdfUrl={currentPDFUrl}
        title={currentPDFTitle}
        isOpen={isPDFViewerOpen}
        onClose={() => setIsPDFViewerOpen(false)}
      />
    </>
  )
}

export default function EnhancedHome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [randomProjects, setRandomProjects] = useState([])
  const [isClient, setIsClient] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const motionSettings = useAccessibleMotion()

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
    
    // Check for reduced motion preference on client
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      
      const handleChange = (e) => setPrefersReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handleChange)
      
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Get 3 random projects on component mount
  useEffect(() => {
    const getRandomProjects = () => {
      const shuffled = [...projectsData].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 3)
    }
    setRandomProjects(getRandomProjects())
  }, [])

  // Enhanced mouse tracking with accessibility consideration
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return

    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: e.clientX,
        y: e.clientY
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isClient, prefersReducedMotion])

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
  }

  // Skip to content function for accessibility
  const skipToContent = () => {
    if (typeof window !== 'undefined') {
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.focus()
        mainContent.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Skip to Content Link for Screen Readers */}
      {isClient && (
        <button
          onClick={skipToContent}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-[9999] focus:outline-none focus:ring-2 focus:ring-purple-300"
          style={{ minHeight: '44px' }}
        >
          Skip to main content
        </button>
      )}

      {/* Enhanced Blob System */}
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-violet-50" />
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-50/70 via-transparent to-indigo-50/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 via-transparent to-purple-50/50" />
        
        {isClient && !prefersReducedMotion && [...Array(6)].map((_, i) => (
          <motion.div
            key={`organic-blob-${i}`}
            className="absolute pointer-events-none w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 rounded-full opacity-20 sm:opacity-25"
            style={{
              background: `radial-gradient(circle, ${
                i === 0 ? 'rgba(244, 114, 182, 0.5)' :   // Pink-400
                i === 1 ? 'rgba(168, 85, 247, 0.4)' :    // Purple-500  
                i === 2 ? 'rgba(251, 146, 60, 0.5)' :    // Orange-400
                i === 3 ? 'rgba(236, 72, 153, 0.4)' :    // Pink-500
                i === 4 ? 'rgba(139, 92, 246, 0.4)' :    // Violet-500
                'rgba(251, 191, 36, 0.4)'               // Amber-400
              } 0%, transparent 70%)`,
              filter: 'blur(60px) sm:blur(80px)',
            }}
            animate={{
              x: [mousePosition.x - 150 + i * 80, mousePosition.x + 150 + i * 60, mousePosition.x - 150 + i * 80],
              y: [mousePosition.y - 150 + i * 90, mousePosition.y + 150 + i * 70, mousePosition.y - 150 + i * 90],
              scale: [1, 1.4, 0.8, 1.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: motionSettings.duration || (25 + i * 4),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Improved Music Toggle with Accessibility */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: motionSettings.duration || 3, type: "spring" }}
        onClick={toggleAudio}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full glassmorphism backdrop-blur-xl border border-white/20 flex items-center justify-center hover:border-purple-300 transition-all shadow-lg group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label={isAudioEnabled ? "Mute ambient audio" : "Play ambient audio"}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        {isAudioEnabled ? (
          <Volume2 size={18} className="text-gray-700 group-hover:text-purple-600 transition-colors" aria-hidden="true" />
        ) : (
          <VolumeX size={18} className="text-gray-700 group-hover:text-purple-600 transition-colors" aria-hidden="true" />
        )}
      </motion.button>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 min-h-screen" tabIndex={-1}>
        
        {/* Enhanced Hero Section */}
        <Section 
          className="min-h-screen flex flex-col justify-center"
          id="hero"
          ariaLabel="Introduction and main call-to-action"
          as="header"
        >
          <div className="max-w-6xl mx-auto text-center">
            <KineticText 
              className="font-marcellus text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-800 mb-8 sm:mb-12 leading-tight"
              delay={0.5}
              as="h1"
            >
              Hey there, I'm Rishi!
            </KineticText>
            
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-600 font-inter font-light max-w-4xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: motionSettings.duration || 2, duration: motionSettings.duration || 1 }}
            >
              A strategist at heart, a storyteller by passion, and a data-driven marketer by expertise.
            </motion.p>
          </div>
        </Section>

        {/* Enhanced About Section */}
        <Section 
          parallax 
          id="about-preview"
          ariaLabel="Professional background overview"
        >
          <div className="max-w-4xl mx-auto text-center">
            <KineticText 
              className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-6 sm:mb-8"
              as="h2"
            >
              I thrive at the intersection of creativity and analytics
            </KineticText>
            
            <motion.p
              className="text-base sm:text-lg text-gray-700 font-inter leading-relaxed mb-6 sm:mb-8 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: motionSettings.duration || 0.8 }}
              viewport={{ once: true }}
            >
              I hold an MS in Media Management from Parsons, specializing in media planning, brand building/communication, performance analytics, and content strategy. From programmatic campaigns to brand storytelling, I blend creative instincts with analytical rigor.
            </motion.p>
            
            <Link href="/about">
              <MorphingCard 
                className="glassmorphism rounded-2xl px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-xl border border-white/40 hover:border-purple-300 transition-all duration-300 group inline-block"
                role="button"
                tabIndex={0}
                ariaLabel="Learn more about my professional journey"
              >
                <span className="flex items-center space-x-3">
                  <span className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors text-sm sm:text-base">
                    Discover My Journey
                  </span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </MorphingCard>
            </Link>
          </div>
        </Section>

        {/* Enhanced Specialization Grid */}
        <Section 
          id="specializations"
          ariaLabel="Professional specializations and expertise"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <KineticText 
                className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4"
                as="h2"
              >
                I specialize in campaigns that perform
              </KineticText>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  title: "Performance Marketing & Paid Media",
                  description: "Google Ads, Meta campaigns, programmatic advertising with $50K+ monthly budgets",
                  icon: "📊",
                  color: "rgba(59, 130, 246, 0.15)"
                },
                {
                  title: "Brand Marketing & Storytelling", 
                  description: "Narrative development, positioning, and creative campaigns that connect with audiences",
                  icon: "✨",
                  color: "rgba(236, 72, 153, 0.15)"
                },
                {
                  title: "Content Strategy & Social Media",
                  description: "Content planning, community engagement, and growth marketing across digital platforms",
                  icon: "📱",
                  color: "rgba(34, 197, 94, 0.15)"
                },
                {
                  title: "Media Planning & Advertising",
                  description: "Multi-channel coordination, audience targeting, and campaign optimization",
                  icon: "🎯",
                  color: "rgba(245, 158, 11, 0.15)"
                }
              ].map((item, i) => (
                <MorphingCard
                  key={i}
                  className="glassmorphism rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-white/30 text-center hover:border-purple-300 transition-all duration-500"
                  hoverColor={item.color}
                  role="article"
                  ariaLabel={`${item.title}: ${item.description}`}
                >
                  <motion.div
                    className="text-3xl sm:text-4xl mb-4"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: motionSettings.duration || 0.6 }
                    }}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="font-marcellus text-lg sm:text-xl text-gray-800 mb-4">{item.title}</h3>
                  <p className="text-gray-600 font-inter text-sm sm:text-base leading-relaxed">{item.description}</p>
                </MorphingCard>
              ))}
            </div>
          </div>
        </Section>

        {/* Enhanced Current Work Section */}
        <Section 
          parallax 
          id="current-work"
          ariaLabel="Current professional positions"
        >
          <div className="max-w-4xl mx-auto text-center">
            <KineticText 
              className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-8 sm:mb-12"
              as="h2"
            >
              Currently creating impact at
            </KineticText>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {[
                {
                  company: "Media x Women",
                  role: "Digital Content Analyst",
                  description: "Analyzing media narratives and amplifying voices that matter",
                  color: "rgba(236, 72, 153, 0.15)"
                },
                {
                  company: "Innovarex Media",
                  role: "Digital Marketing Specialist", 
                  description: "Managing $50K+ monthly budgets across performance campaigns",
                  color: "rgba(59, 130, 246, 0.15)"
                }
              ].map((job, i) => (
                <MorphingCard
                  key={i}
                  className="glassmorphism rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/30"
                  hoverColor={job.color}
                  role="article"
                  ariaLabel={`Current position: ${job.role} at ${job.company}`}
                >
                  <h3 className="font-marcellus text-lg sm:text-xl text-gray-800 mb-2">{job.company}</h3>
                  <p className="text-purple-600 font-medium mb-3 text-sm sm:text-base">{job.role}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-inter">{job.description}</p>
                </MorphingCard>
              ))}
            </div>
            
            <motion.div
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 glassmorphism rounded-full backdrop-blur-xl border border-white/40"
              animate={{ 
                scale: [1, 1.05, 1],
                borderColor: ['rgba(255,255,255,0.4)', 'rgba(34,197,94,0.6)', 'rgba(255,255,255,0.4)']
              }}
              transition={{ 
                duration: motionSettings.duration || 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              role="status"
              aria-live="polite"
            >
              <span className="text-green-800 font-medium flex items-center gap-2 text-sm sm:text-base">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
                Open to new opportunities
              </span>
            </motion.div>
          </div>
        </Section>

        {/* Real Portfolio Teaser */}
        <Section 
          id="featured-projects"
          ariaLabel="Featured project portfolio"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <KineticText 
                className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4"
                as="h2"
              >
                Selected Projects
              </KineticText>
              <p className="text-base sm:text-lg text-gray-600 font-inter italic px-4">Campaigns and initiatives that delivered measurable results</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {randomProjects.map((project, i) => (
                <MorphingCard
                  key={project.id}
                  className="glassmorphism rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-white/30 hover:border-purple-300 transition-all duration-500 group cursor-pointer"
                  hoverColor="rgba(147, 51, 234, 0.15)"
                  role="button"
                  tabIndex={0}
                  ariaLabel={`View project: ${project.title} - ${project.insight}`}
                >
                  <Link href="/projects" className="block">
                    <div className="h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      {project.previewImage || project.heroImage ? (
                        <img
                          src={project.previewImage || project.heroImage}
                          alt={`Preview of ${project.title} project`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <motion.div
                          className="text-2xl sm:text-3xl font-bold text-gray-600"
                          whileHover={{ scale: 1.2 }}
                          aria-hidden="true"
                        >
                          {project.category === 'Strategy' ? '📊' : 
                           project.category === 'Data Viz' ? '📈' : 
                           project.category === 'Creative' ? '🎨' : '🔬'}
                        </motion.div>
                      )}
                    </div>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mb-3">
                      {project.category}
                    </span>
                    <h3 className="font-marcellus text-base sm:text-lg text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-inter leading-relaxed">{project.insight}</p>
                  </Link>
                </MorphingCard>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/projects">
                <MorphingCard 
                  className="glassmorphism rounded-2xl px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-xl border border-white/40 hover:border-purple-300 transition-all duration-300 group inline-block"
                  role="button"
                  tabIndex={0}
                  ariaLabel="View all projects in portfolio"
                >
                  <span className="flex items-center space-x-3">
                    <span className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors text-sm sm:text-base">
                      View All Projects
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </MorphingCard>
              </Link>
            </div>
          </div>
        </Section>

        {/* Blog Teaser Section */}
        <Section 
          id="blog-preview"
          ariaLabel="Blog and insights preview"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <KineticText 
                className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4"
                as="h2"
              >
                Scribbles & Signals
              </KineticText>
              <p className="text-base sm:text-lg text-gray-600 font-inter italic px-4">Where insights meet instinct, thoughts become breakthroughs</p>
            </div>
            
            {mockBlogs.length > 0 ? (
              <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                {mockBlogs.slice(0, 2).map((post, i) => (
                  <MorphingCard
                    key={i}
                    className="glassmorphism rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/30 hover:border-blue-300 transition-all duration-500 group cursor-pointer"
                    hoverColor="rgba(59, 130, 246, 0.15)"
                    role="article"
                    tabIndex={0}
                    ariaLabel={`Read blog post: ${post.title}`}
                  >
                    <Link href="/blog">
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        <div className="text-3xl sm:text-4xl" aria-hidden="true">{post.mood}</div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs text-gray-500 font-mono">{post.date}</span>
                            <span className="px-2 py-1 bg-blue-100/70 text-blue-800 rounded-full text-xs">
                              {post.category}
                            </span>
                          </div>
                          <h3 className="font-marcellus text-lg sm:text-xl md:text-2xl text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 font-inter leading-relaxed text-sm sm:text-base">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </MorphingCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <MorphingCard 
                  className="glassmorphism rounded-3xl p-8 sm:p-12 backdrop-blur-xl border border-white/50 shadow-lg max-w-md mx-auto"
                  role="status"
                  ariaLabel="Blog content coming soon"
                >
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6" aria-hidden="true">✍️</div>
                  <h3 className="font-marcellus text-xl sm:text-2xl text-gray-900 mb-4">
                    Scribbles Coming Soon
                  </h3>
                  <p className="text-gray-600 font-inter mb-4 sm:mb-6 text-sm sm:text-base">
                    Fresh insights on marketing, creativity, and culture are being crafted.
                  </p>
                  <div className="inline-block px-4 py-2 bg-orange-100/80 text-orange-800 rounded-full text-sm font-medium">
                    Coming Soon
                  </div>
                </MorphingCard>
              </div>
            )}
            
            <div className="text-center">
              <Link href="/blog">
                <MorphingCard 
                  className="glassmorphism rounded-2xl px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-xl border border-white/40 hover:border-blue-300 transition-all duration-300 group inline-block"
                  role="button"
                  tabIndex={0}
                  ariaLabel="View all blog posts and insights"
                >
                  <span className="flex items-center space-x-3">
                    <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                      All Insights
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </MorphingCard>
              </Link>
            </div>
          </div>
        </Section>

        {/* Campaign Archive Teaser Section */}
        <Section 
          id="campaign-archive"
          ariaLabel="Campaign archive preview"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <KineticText 
                className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4"
                as="h2"
              >
                Campaigns that made me think
              </KineticText>
              <p className="text-base sm:text-lg text-gray-600 font-inter italic px-4">A curated vault of campaigns that moved industries</p>
            </div>
            
            {mockCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {mockCampaigns.slice(0, 2).map((campaign, i) => (
                  <MorphingCard
                    key={i}
                    className="glassmorphism rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/30 hover:border-green-300 transition-all duration-500 group cursor-pointer text-center"
                    hoverColor="rgba(34, 197, 94, 0.15)"
                    role="article"
                    tabIndex={0}
                    ariaLabel={`View campaign analysis: ${campaign.campaign} by ${campaign.brand}`}
                  >
                    <Link href="/archive">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl" aria-hidden="true">
                            {campaign.emoji}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-2 font-mono">
                            {campaign.brand} • {campaign.year}
                          </div>
                          <h3 className="font-marcellus text-lg sm:text-xl md:text-2xl text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                            {campaign.campaign}
                          </h3>
                          <div className="text-gray-600 italic mb-4 text-sm sm:text-base">
                            {campaign.insight}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </MorphingCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <MorphingCard 
                  className="glassmorphism rounded-3xl p-8 sm:p-12 backdrop-blur-xl border border-white/50 shadow-lg max-w-md mx-auto"
                  role="status"
                  ariaLabel="Campaign archive coming soon"
                >
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6" aria-hidden="true">📺</div>
                  <h3 className="font-marcellus text-xl sm:text-2xl text-gray-900 mb-4">
                    Campaign Vault Opening Soon
                  </h3>
                  <p className="text-gray-600 font-inter mb-4 sm:mb-6 text-sm sm:text-base">
                    A curated collection of campaigns that shaped industries and inspired minds.
                  </p>
                  <div className="inline-block px-4 py-2 bg-green-100/80 text-green-800 rounded-full text-sm font-medium">
                    Coming Soon
                  </div>
                </MorphingCard>
              </div>
            )}
            
            <div className="text-center">
              <Link href="/archive">
                <MorphingCard 
                  className="glassmorphism rounded-2xl px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-xl border border-white/40 hover:border-green-300 transition-all duration-300 group inline-block"
                  role="button"
                  tabIndex={0}
                  ariaLabel="Explore campaign archive"
                >
                  <span className="flex items-center space-x-3">
                    <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors text-sm sm:text-base">
                      Explore Archive
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </MorphingCard>
              </Link>
            </div>
          </div>
        </Section>

        {/* Enhanced Final CTA */}
        <Section 
          className="pb-16 sm:pb-24 lg:pb-32"
          id="contact-cta"
          ariaLabel="Contact information and call-to-action"
        >
          <div className="max-w-4xl mx-auto text-center">
            <KineticText 
              className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-6 sm:mb-8"
              as="h2"
            >
              Ready to create something extraordinary?
            </KineticText>
            
            <motion.p
              className="text-base sm:text-lg text-gray-600 font-inter italic mb-8 sm:mb-12 leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: motionSettings.duration || 0.8 }}
              viewport={{ once: true }}
            >
              Let's bridge marketing excellence and creative storytelling to build campaigns that actually matter.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-6 sm:mb-8">
              {isClient && <ResumeViewButton />}
              
              <Link href="/contact">
                <MorphingCard 
                  className="glassmorphism rounded-2xl px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50 backdrop-blur-xl border border-white/40 hover:border-pink-200 transition-all duration-300 group"
                  hoverColor="rgba(255, 228, 225, 0.25)"
                  role="button"
                  tabIndex={0}
                  ariaLabel="Contact me to start a conversation"
                >
                  <span className="flex items-center space-x-3">
                    <Mail size={20} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <span className="font-medium text-gray-700 group-hover:text-pink-600 transition-colors text-sm sm:text-base">
                      Let's Connect
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </MorphingCard>
              </Link>
            </div>

            {/* Social Links & Contact */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.a
                href="https://www.linkedin.com/in/rishi-bhanushali-838713230/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                transition={{ duration: motionSettings.duration || 0.2 }}
                className="glassmorphism rounded-full p-3 sm:p-4 hover:shadow-xl transition-all group backdrop-blur-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Connect with me on LinkedIn"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Linkedin size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
              </motion.a>
              
              <motion.a
                href="https://www.instagram.com/hrishi.bhanushali/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                transition={{ duration: motionSettings.duration || 0.2 }}
                className="glassmorphism rounded-full p-3 sm:p-4 hover:shadow-xl transition-all group backdrop-blur-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                aria-label="Follow me on Instagram"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Instagram size={20} className="text-gray-600 group-hover:text-pink-600 transition-colors" />
              </motion.a>

              <motion.a
                href="mailto:bhanr480@newschool.edu"
                whileHover={{ scale: 1.1, y: -3 }}
                transition={{ duration: motionSettings.duration || 0.2 }}
                className="glassmorphism rounded-full p-3 sm:p-4 hover:shadow-xl transition-all group backdrop-blur-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Send me an email at bhanr480@newschool.edu"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Mail size={20} className="text-gray-600 group-hover:text-green-600 transition-colors" />
              </motion.a>
            </div>
            
            <motion.div
              className="text-sm sm:text-base text-gray-600 px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: motionSettings.duration || 0.8 }}
              viewport={{ once: true }}
            >
              <p className="mb-2">Based in NYC | Currently at Media x Women & Innovarex Media</p>
              <p>Open to new opportunities • In-person, Hybrid & Remote</p>
            </motion.div>
          </div>
        </Section>
      </main>
    </>
  )
}