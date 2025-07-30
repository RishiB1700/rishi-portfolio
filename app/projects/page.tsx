'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { 
  X, 
  BarChart3, 
  Megaphone, 
  Palette, 
  Monitor, 
  ArrowRight, 
  ExternalLink, 
  Play, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Zap, 
  Search, 
  FileText, 
  Calendar, 
  Award, 
  Video, 
  Settings,
  Eye,
  ChevronDown,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import projectsData from '../../data/projects.json'
import PDFViewer from '../../components/PDFViewer'

/**
 * Enhanced Projects Page with Progressive Navigation & Live Previews
 * 
 * Features:
 * - Progressive navigation: Floating filter on scroll
 * - Smart preview system: Live iframes for Data Viz projects, static images for others
 * - Backdrop blur dropdown with smooth animations
 * - Responsive positioning and touch-friendly interactions
 */

interface Project {
  id: number
  title: string
  subtitle?: string
  insight: string
  year: string
  category: string
  categoryTags: string[]
  tags: string[]
  projectType?: 'caseStudy' | 'creative' | 'shortfilm' | 'research'
  
  // Case Study fields
  challenge?: string
  strategy?: string
  process?: string[]
  results?: Array<{
    metric: string
    value: string
    description: string
  }>
  learnings?: string
  
  // Creative fields
  synopsis?: string
  role?: string
  toolsUsed?: string[]
  designRationale?: string
  
  // Short Film fields
  duration?: string
  embedVideo?: string
  festivals?: string[]
  behindTheScenes?: string
  
  // Research fields
  researchFocus?: string
  methodology?: string
  keyFindings?: string
  implications?: string
  
  // Common fields
  previewImage?: string
  heroImage: string
  heroType: 'image' | 'video'
  liveLink?: string
  pdfLink?: string
  assetLink?: string
  assetsDownload?: string
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  const [currentPDFUrl, setCurrentPDFUrl] = useState('')
  const [currentPDFTitle, setCurrentPDFTitle] = useState('')
  
  // Progressive Navigation States
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [isFilterFloating, setIsFilterFloating] = useState(false)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  
  const { scrollY: motionScrollY } = useScroll()
  const filterBarRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Load projects from JSON
  const projects = projectsData as Project[]

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Debounced scroll handler to prevent glitchy transitions
  const handleScrollChange = useCallback((latest: number) => {
    setScrollY(latest)
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // Debounce the scroll updates
    scrollTimeoutRef.current = setTimeout(() => {
      const heroHeight = heroRef.current?.offsetHeight || 600
      const scrollThreshold = heroHeight + 150 // More generous buffer
      
      if (latest > scrollThreshold) {
        // User has scrolled past hero - show floating filter
        setIsNavVisible(false)
        setIsFilterFloating(true)
      } else {
        // User is near top - show full nav and filter bar
        setIsNavVisible(true)
        setIsFilterFloating(false)
        setIsFilterDropdownOpen(false)
      }
    }, 50) // 50ms debounce
  }, [])

  // Progressive navigation scroll detection
  useMotionValueEvent(motionScrollY, "change", handleScrollChange)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Helper functions
  const getProjectsByCategory = (category: string): Project[] => {
    if (category === 'All') return projects
    return projects.filter(project => 
      project.categoryTags.includes(category) || project.category === category
    )
  }

  // Updated filters
  const filters = [
    { name: 'All', icon: null },
    { name: 'Strategy', icon: Lightbulb },
    { name: 'Storytelling', icon: Megaphone },
    { name: 'Data Viz', icon: BarChart3 },
    { name: 'Multimedia', icon: Palette },
    { name: 'Research', icon: Search }
  ]

  // Function to infer projectType from categoryTags
  const inferProjectType = (project: Project): 'caseStudy' | 'creative' | 'shortfilm' | 'research' => {
    if (project.projectType) return project.projectType
    
    const categoryTags = project.categoryTags || []
    
    if (categoryTags.includes('Research')) return 'research'
    if (categoryTags.includes('Data Viz') || categoryTags.includes('Strategy')) return 'caseStudy'
    if (categoryTags.includes('Storytelling')) return 'creative'
    if (categoryTags.includes('Multimedia')) return 'shortfilm'
    
    return 'caseStudy'
  }

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => 
        project.categoryTags.includes(activeFilter) || project.category === activeFilter
      )

  const projectsByCategory = {
    Strategy: getProjectsByCategory('Strategy'),
    Storytelling: getProjectsByCategory('Storytelling'),
    'Data Viz': getProjectsByCategory('Data Viz'),
    Multimedia: getProjectsByCategory('Multimedia'),
    Research: getProjectsByCategory('Research')
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen || isFilterDropdownOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, isFilterDropdownOpen])

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    setIsFilterDropdownOpen(false) // Close filter dropdown if open
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  const openPDFViewer = (pdfUrl: string, title: string) => {
    setCurrentPDFUrl(pdfUrl)
    setCurrentPDFTitle(title)
    setIsPDFViewerOpen(true)
  }

  const closePDFViewer = () => {
    setIsPDFViewerOpen(false)
    setCurrentPDFUrl('')
    setCurrentPDFTitle('')
  }

  // Handle filter change
  const handleFilterChange = (filterName: string) => {
    setActiveFilter(filterName)
    setIsFilterDropdownOpen(false)
    
    // Announce to screen readers
    const message = filterName === 'All' 
      ? 'Showing all projects' 
      : `Filtered to show ${filterName} projects`
    
    // Create and dispatch a custom event for screen readers
    const announcement = new CustomEvent('announce', { 
      detail: { message, priority: 'polite' } 
    })
    document.dispatchEvent(announcement)
  }

  // Close dropdown when clicking outside
  const handleBackdropClick = () => {
    setIsFilterDropdownOpen(false)
  }

  // Keyboard navigation for floating filter
  const handleFilterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsFilterDropdownOpen(!isFilterDropdownOpen)
    } else if (e.key === 'Escape') {
      setIsFilterDropdownOpen(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFilterDropdownOpen) {
          setIsFilterDropdownOpen(false)
        } else if (isModalOpen) {
          closeModal()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, isFilterDropdownOpen])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Strategy': return Lightbulb
      case 'Storytelling': return Megaphone
      case 'Data Viz': return BarChart3
      case 'Multimedia': return Palette
      case 'Research': return Search
      default: return Lightbulb
    }
  }

  const renderIcon = (IconComponent: any, props: any = {}) => {
    if (!IconComponent) return null
    return <IconComponent {...props} />
  }

  // Get current filter display name
  const getCurrentFilterDisplay = () => {
    return activeFilter === 'Storytelling' ? 'Storytelling & Design' : activeFilter
  }

  // Get current filter icon
  const getCurrentFilterIcon = () => {
    const currentFilter = filters.find(f => f.name === activeFilter)
    return currentFilter?.icon
  }

  // Backdrop Blur Component
  const FilterBackdrop = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-35"
      style={{ top: '0px' }} // Ensure it covers everything including nav
    />
  )

  // Floating Filter Component
  const FloatingFilter = () => {
    const CurrentIcon = getCurrentFilterIcon()
    
    // Responsive positioning
    const getFloatingPosition = () => {
      if (isMobile) {
        return {
          position: 'fixed' as const,
          bottom: '24px',
          right: '24px',
          zIndex: 45
        }
      } else if (isTablet) {
        return {
          position: 'fixed' as const,
          top: '120px',
          right: '24px',
          zIndex: 45
        }
      } else {
        return {
          position: 'fixed' as const,
          top: '120px',
          left: '24px',
          zIndex: 45
        }
      }
    }

    return (
      <>
        {/* Backdrop when dropdown is open */}
        <AnimatePresence>
          {isFilterDropdownOpen && <FilterBackdrop />}
        </AnimatePresence>
        
        <div style={getFloatingPosition()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Floating Button */}
            <motion.button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              onKeyDown={handleFilterKeyDown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-fuchsia-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={`Filter projects by category, currently showing ${getCurrentFilterDisplay()} projects. Press Enter to open filter menu.`}
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="true"
            >
              <div className="flex items-center gap-2">
                {CurrentIcon && <CurrentIcon size={18} className="text-gray-700" />}
                <Filter size={16} className="text-gray-600" />
                <span className="font-medium text-gray-800 text-sm hidden sm:inline">
                  {getCurrentFilterDisplay()}
                </span>
                <motion.div
                  animate={{ rotate: isFilterDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-gray-600" />
                </motion.div>
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isFilterDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute ${isMobile ? 'bottom-full mb-3 right-0' : 'top-full mt-3 left-0'} min-w-[220px] bg-white/98 backdrop-blur-xl rounded-2xl border border-fuchsia-200/60 shadow-2xl py-3 z-50`}
                  role="menu"
                  aria-labelledby="filter-button"
                >
                  {filters.map((filter, index) => {
                    const Icon = filter.icon
                    const isActive = activeFilter === filter.name
                    const displayName = filter.name === 'Storytelling' ? 'Storytelling & Design' : filter.name
                    
                    return (
                      <motion.button
                        key={filter.name}
                        onClick={() => handleFilterChange(filter.name)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(251, 113, 133, 0.1)' }}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-200 focus:outline-none focus:bg-fuchsia-50 ${
                          isActive 
                            ? 'bg-gradient-to-r from-fuchsia-100 to-sky-100 text-gray-900' 
                            : 'text-gray-700 hover:bg-fuchsia-50'
                        }`}
                        role="menuitem"
                        aria-label={`Filter projects by ${displayName}`}
                        style={{ minHeight: '44px' }}
                      >
                        {Icon && <Icon size={18} />}
                        <span className="font-medium">{displayName}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 bg-fuchsia-500 rounded-full"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </>
    )
  }

  // Render project content sections without tabs
  const renderProjectContent = (project: Project) => {
    const projectType = inferProjectType(project)
    
    return (
      <div className="space-y-12">
        {/* Case Study Content */}
        {projectType === 'caseStudy' && (
          <>
            {project.challenge && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">The Challenge</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.challenge}</p>
              </div>
            )}

            {project.strategy && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Lightbulb className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Strategic Approach</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.strategy}</p>
              </div>
            )}

            {project.process && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8 border border-green-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Process & Execution</h3>
                </div>
                <div className="space-y-4">
                  {project.process.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-200 to-teal-200 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-green-700 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-800 font-inter leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {project.results && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-amber-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Results & Impact</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 rounded-2xl p-6 shadow-sm"
                    >
                      <div className="text-3xl font-bold text-gray-900 mb-2">{result.metric}</div>
                      <div className="text-lg font-medium text-gray-800 mb-2">{result.value}</div>
                      <div className="text-sm text-gray-700 font-inter leading-relaxed">{result.description}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {project.learnings && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Zap className="text-rose-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Key Learnings</h3>
                </div>
                <p className="text-gray-800 font-inter italic leading-relaxed text-lg">{project.learnings}</p>
              </div>
            )}
          </>
        )}

        {/* Creative Content */}
        {projectType === 'creative' && (
          <>
            {(project.id === 15 || project.id === 16) && project.synopsis && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Synopsis</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.synopsis}</p>
              </div>
            )}

            {(project.id === 21 || project.id === 22) && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Creative Brief</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.insight}</p>
              </div>
            )}

            {project.id !== 15 && project.id !== 16 && project.id !== 21 && project.id !== 22 && project.synopsis && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Synopsis</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.synopsis}</p>
              </div>
            )}

            {project.role && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">My Role</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.role}</p>
              </div>
            )}

            {project.toolsUsed && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8 border border-green-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Settings className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Tools Used</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.toolsUsed.map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 rounded-xl p-4 text-center shadow-sm"
                    >
                      <span className="text-gray-800 font-inter font-medium">{tool}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {project.designRationale && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Lightbulb className="text-amber-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Design Rationale</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.designRationale}</p>
              </div>
            )}
          </>
        )}

        {/* Research Content */}
        {projectType === 'research' && (
          <>
            {project.researchFocus && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Search className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Research Focus</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.researchFocus}</p>
              </div>
            )}

            {project.methodology && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Settings className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Methodology</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.methodology}</p>
              </div>
            )}

            {project.keyFindings && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8 border border-green-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Key Findings</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.keyFindings}</p>
              </div>
            )}

            {project.implications && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Lightbulb className="text-amber-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Implications</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.implications}</p>
              </div>
            )}
          </>
        )}

        {/* Short Film Content */}
        {projectType === 'shortfilm' && (
          <>
            {project.synopsis && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Synopsis</h3>
                </div>
                <p className="text-gray-800 font-inter leading-relaxed text-lg">{project.synopsis}</p>
              </div>
            )}

            {project.embedVideo && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-3xl p-8 border border-gray-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Video className="text-gray-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Watch</h3>
                </div>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src={project.embedVideo}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`${project.title} video`}
                  />
                </div>
              </div>
            )}

            {project.festivals && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Award className="text-amber-600" size={24} />
                  </div>
                  <h3 className="font-marcellus text-2xl text-gray-900">Recognition</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.festivals.map((festival, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="text-amber-600" size={20} />
                        <span className="text-gray-800 font-inter font-medium">{festival}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-sky-100 relative">
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="font-marcellus text-5xl md:text-7xl text-gray-900 mb-6"
          >
            The Projects Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 font-inter font-light italic mb-8 max-w-4xl mx-auto"
          >
            Where strategic thinking meets creative execution. A curated collection of transformative projects and meaningful outcomes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-fuchsia-200/50 shadow-sm"
          >
            <span className="text-gray-700 font-inter text-sm font-medium">
              {projects.length} Projects • 5 Disciplines
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Filter Navigation */}
      <AnimatePresence mode="wait">
        {!isFilterFloating && (
          <motion.div 
            key="main-filter"
            ref={filterBarRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="sticky top-20 z-30 px-4 mb-12"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-fuchsia-100/50 shadow-lg">
                <div className="flex flex-wrap gap-2 justify-center">
                  {filters.map((filter) => {
                    const Icon = filter.icon
                    const displayName = filter.name === 'Storytelling' ? 'Storytelling & Design' : filter.name
                    return (
                      <motion.button
                        key={filter.name}
                        onClick={() => handleFilterChange(filter.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 ${
                          activeFilter === filter.name
                            ? 'bg-gradient-to-r from-fuchsia-200 to-sky-200 text-gray-900 shadow-md'
                            : 'bg-white/60 text-gray-700 hover:bg-white/80'
                        }`}
                        aria-label={`Filter projects by ${displayName}`}
                        style={{ minHeight: '44px' }}
                      >
                        {Icon && <Icon size={16} />}
                        {displayName}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Filter */}
      <AnimatePresence>
        {isFilterFloating && <FloatingFilter />}
      </AnimatePresence>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 space-y-16 pt-4">
        {activeFilter === 'All' ? (
          // Show all categories as separate shelves
          Object.entries(projectsByCategory).map(([category, categoryProjects], index) => (
            categoryProjects.length > 0 && (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-20"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    {renderIcon(getCategoryIcon(category), { size: 32, className: "text-gray-800" })}
                    <h2 className="font-marcellus text-3xl md:text-4xl text-gray-900">
                      {category}
                    </h2>
                  </div>
                  <p className="text-gray-700 font-inter italic text-lg">
                    {category === 'Strategy' && 'Data-driven approaches that transform brands and drive measurable results'}
                    {category === 'Storytelling' && 'Creative narratives, visual design, and brand identity that connect and inspire'}
                    {category === 'Data Viz' && 'Interactive visualizations and dashboards that make complex data accessible'}
                    {category === 'Multimedia' && 'Interactive experiences that engage audiences across all touchpoints'}
                    {category === 'Research' && 'Evidence-based insights that inform strategic decisions and drive innovation'}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryProjects.map((project, projectIndex) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: projectIndex * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                    >
                      {/* Hero Image/Live Preview Section */}
                      <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {/* Live Preview for Data Viz Projects */}
                        {project.liveLink && project.categoryTags.includes('Data Viz') ? (
                          <>
                            {/* Live Preview Iframe */}
                            <div className="relative w-full h-full">
                              <iframe
                                src={project.liveLink}
                                className="w-full h-full border-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform group-hover:scale-105"
                                title={`${project.title} live preview`}
                                loading="lazy"
                                sandbox="allow-scripts allow-same-origin"
                              />
                              {/* Live Badge */}
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                LIVE
                              </div>
                            </div>
                            
                            {/* Interactive Overlay */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(project.liveLink, '_blank')
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 text-center shadow-xl border border-white/50 hover:bg-white transition-all"
                              >
                                <div className="flex items-center gap-2 text-gray-800">
                                  <ExternalLink size={20} />
                                  <span className="font-medium">Explore Interactive</span>
                                </div>
                              </motion.button>
                            </motion.div>
                          </>
                        ) : (
                          <>
                            {/* Static Image for Other Projects */}
                            <img
                              src={project.previewImage || project.heroImage}
                              alt={`${project.title} preview`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            
                            {/* Live Project Overlay */}
                            {project.liveLink && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(project.liveLink, '_blank')
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 text-center shadow-lg border border-white/50 hover:bg-white transition-all"
                                >
                                  <div className="flex items-center gap-2 text-gray-800">
                                    <Eye size={20} />
                                    <span className="font-medium">View Live Project</span>
                                  </div>
                                </motion.button>
                              </motion.div>
                            )}
                            
                            {/* PDF Project Overlay */}
                            {project.assetsDownload && !project.liveLink && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(project.assetsDownload, '_blank')
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 text-center shadow-lg border border-white/50 hover:bg-white transition-all"
                                >
                                  <div className="flex items-center gap-2 text-gray-800">
                                    <FileText size={20} />
                                    <span className="font-medium">View Document</span>
                                  </div>
                                </motion.button>
                              </motion.div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="p-6" onClick={() => openModal(project)}>
                        <div className="flex items-start gap-3 mb-3">
                          {renderIcon(getCategoryIcon(project.category), { size: 20, className: "text-gray-600 mt-1" })}
                          <h3 className="font-marcellus text-xl text-gray-900 group-hover:text-fuchsia-700 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <p className="text-gray-700 font-inter text-sm leading-relaxed mb-4">
                          {project.insight}
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs text-gray-600 font-mono bg-white/90 px-3 py-1 rounded-full border border-gray-200">
                            {project.year}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-600 font-mono bg-gradient-to-r from-fuchsia-100 to-sky-100 px-3 py-1 rounded-full">
                            {renderIcon(getCategoryIcon(project.category), { size: 12 })}
                            {project.category}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag} 
                              className="px-3 py-1 bg-gradient-to-r from-rose-100 to-orange-100 text-gray-800 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-fuchsia-200/50 hover:border-fuchsia-300 transition-all duration-300 group-hover:shadow-md focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
                          style={{ minHeight: '44px' }}
                        >
                          <span className="flex items-center justify-center gap-2 font-medium text-gray-800 group-hover:text-fuchsia-700 transition-colors">
                            Read Full Story
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )
          ))
        ) : (
          // Show filtered projects
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                {renderIcon(getCategoryIcon(activeFilter), { size: 32, className: "text-gray-800" })}
                <h2 className="font-marcellus text-3xl md:text-4xl text-gray-900">
                  {getCurrentFilterDisplay()}
                </h2>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  {/* Hero Image/Live Preview Section */}
                  <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {/* Live Preview for Data Viz Projects */}
                    {project.liveLink && project.categoryTags.includes('Data Viz') ? (
                      <>
                        {/* Live Preview Iframe */}
                        <div className="relative w-full h-full">
                          <iframe
                            src={project.liveLink}
                            className="w-full h-full border-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform group-hover:scale-105"
                            title={`${project.title} live preview`}
                            loading="lazy"
                            sandbox="allow-scripts allow-same-origin"
                          />
                          {/* Live Badge */}
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            LIVE
                          </div>
                        </div>
                        
                        {/* Interactive Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(project.liveLink, '_blank')
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 text-center shadow-xl border border-white/50 hover:bg-white transition-all"
                          >
                            <div className="flex items-center gap-2 text-gray-800">
                              <ExternalLink size={20} />
                              <span className="font-medium">Explore Interactive</span>
                            </div>
                          </motion.button>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        {/* Static Image for Other Projects */}
                        <img
                          src={project.previewImage || project.heroImage}
                          alt={`${project.title} preview`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Live Project Overlay */}
                        {project.liveLink && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.liveLink, '_blank')
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 text-center shadow-lg border border-white/50 hover:bg-white transition-all"
                            >
                              <div className="flex items-center gap-2 text-gray-800">
                                <Eye size={20} />
                                <span className="font-medium">View Live Project</span>
                              </div>
                            </motion.button>
                          </motion.div>
                        )}
                        
                        {/* PDF Project Overlay */}
                        {project.assetsDownload && !project.liveLink && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.assetsDownload, '_blank')
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 text-center shadow-lg border border-white/50 hover:bg-white transition-all"
                            >
                              <div className="flex items-center gap-2 text-gray-800">
                                <FileText size={20} />
                                <span className="font-medium">View Document</span>
                              </div>
                            </motion.button>
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6" onClick={() => openModal(project)}>
                    <div className="flex items-start gap-3 mb-3">
                      {renderIcon(getCategoryIcon(project.category), { size: 20, className: "text-gray-600 mt-1" })}
                      <h3 className="font-marcellus text-xl text-gray-900 group-hover:text-fuchsia-700 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-inter text-sm leading-relaxed mb-4">
                      {project.insight}
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs text-gray-600 font-mono bg-white/90 px-3 py-1 rounded-full border border-gray-200">
                        {project.year}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-600 font-mono bg-gradient-to-r from-fuchsia-100 to-sky-100 px-3 py-1 rounded-full">
                        {renderIcon(getCategoryIcon(project.category), { size: 12 })}
                        {project.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 bg-gradient-to-r from-rose-100 to-orange-100 text-gray-800 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-fuchsia-200/50 hover:border-fuchsia-300 transition-all duration-300 group-hover:shadow-md focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
                      style={{ minHeight: '44px' }}
                    >
                      <span className="flex items-center justify-center gap-2 font-medium text-gray-800 group-hover:text-fuchsia-700 transition-colors">
                        Read Full Story
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Enhanced Modal without tabs */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-3xl w-full shadow-2xl ${
                isMobile 
                  ? 'h-[90vh] max-h-[90vh] mt-auto rounded-t-3xl rounded-b-none' 
                  : 'max-w-6xl max-h-[90vh]'
              } overflow-y-auto`}
            >
              <div className="p-6 md:p-10">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    {renderIcon(getCategoryIcon(selectedProject.category), { size: 24, className: "text-gray-700" })}
                    <span className="text-sm text-gray-600 font-inter font-medium">
                      Project Deep Dive
                    </span>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    aria-label="Close project modal"
                  >
                    <X size={24} className="text-gray-700" />
                  </button>
                </div>

                {/* Project Header */}
                <div className="mb-8">
                  <h1 className="font-marcellus text-3xl md:text-4xl text-gray-900 mb-3">
                    {selectedProject.title}
                  </h1>
                  {selectedProject.subtitle && (
                    <p className="text-xl text-gray-600 font-inter font-medium mb-3">
                      {selectedProject.subtitle}
                    </p>
                  )}
                  <p className="text-xl text-gray-700 font-inter font-light italic mb-4">
                    {selectedProject.insight}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-full">
                      {selectedProject.year}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600 font-mono bg-gradient-to-r from-fuchsia-100 to-sky-100 px-3 py-1 rounded-full">
                      {renderIcon(getCategoryIcon(selectedProject.category), { size: 16 })}
                      {selectedProject.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 bg-gradient-to-r from-rose-100 to-orange-100 text-gray-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Live Link for Interactive Projects */}
                  {selectedProject.liveLink && (
                    <motion.a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-100 to-sky-100 text-gray-800 rounded-xl font-medium hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
                      style={{ minHeight: '44px' }}
                    >
                      <ExternalLink size={18} />
                      Explore Live Project
                    </motion.a>
                  )}
                </div>

                {/* Project Content - No tabs, just flowing sections */}
                <div className="space-y-8">
                  {renderProjectContent(selectedProject)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <section className="py-24 px-4 mt-20 bg-gradient-to-r from-fuchsia-50/80 to-sky-100/80">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-fuchsia-100/60"
          >
            <h3 className="font-marcellus text-3xl md:text-4xl text-gray-900 mb-6">
              Want to collaborate on your next strategic success story?
            </h3>
            <p className="text-lg text-gray-700 font-inter mb-8">
              Let's transform your challenges into compelling narratives and measurable results.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-fuchsia-100 to-sky-100 backdrop-blur-xl rounded-2xl px-8 py-4 border border-fuchsia-200/50 hover:border-fuchsia-300 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
                aria-label="Start a conversation about your project"
                style={{ minHeight: '44px' }}
              >
                <span className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800 group-hover:text-fuchsia-700 transition-colors">
                    Begin the Conversation
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PDF Viewer */}
      <PDFViewer
        pdfUrl={currentPDFUrl}
        title={currentPDFTitle}
        isOpen={isPDFViewerOpen}
        onClose={closePDFViewer}
      />

      {/* Screen Reader Announcements */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        id="filter-announcements"
      />
    </div>
  )
}