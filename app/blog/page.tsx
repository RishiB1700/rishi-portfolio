'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, Clock, Edit3, BookOpen, FileText, Brain, PenTool } from 'lucide-react'
import { getAllPosts } from '@/lib/sanity'
import { SanityPost } from '@/types/sanity'
import { PortableText } from '@portabletext/react'

export default function Blog() {
  const [posts, setPosts] = useState<SanityPost[]>([])
  const [selectedPost, setSelectedPost] = useState<SanityPost | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [floatingElements, setFloatingElements] = useState<Array<{ type: string; x: number; y: number; delay: number; rotation: number }>>([])
  const [loading, setLoading] = useState(true)

  const filters = ['All', 'strategy', 'reflections', 'reviews', 'behind-the-scenes']

  // Fetch posts from Sanity
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeFilter)

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    } else if (sortBy === 'Mood') {
      return a.mood.localeCompare(b.mood)
    }
    return 0
  })

  // Generate floating elements (sophisticated ambient design)
  useEffect(() => {
    const elements = []
    const types = ['sticky-note', 'pen', 'paper']
    
    for (let i = 0; i < 8; i++) {
      elements.push({
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 10,
        rotation: Math.random() * 360
      })
    }
    setFloatingElements(elements)
  }, [])

  const openDrawer = (post: SanityPost) => {
    setSelectedPost(post)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedPost(null), 300)
  }

  // Keyboard navigation and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  // Focus management for drawer
  useEffect(() => {
    if (isDrawerOpen) {
      const drawer = document.querySelector('[role="dialog"]')
      if (drawer) {
        const focusableElements = drawer.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstFocusable = focusableElements[0] as HTMLElement
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

        firstFocusable?.focus()

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstFocusable) {
                lastFocusable?.focus()
                e.preventDefault()
              }
            } else {
              if (document.activeElement === lastFocusable) {
                firstFocusable?.focus()
                e.preventDefault()
              }
            }
          }
        }

        drawer.addEventListener('keydown', handleTabKey)
        return () => {
          drawer.removeEventListener('keydown', handleTabKey)
        }
      }
    }
  }, [isDrawerOpen, selectedPost])

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen])

  const FloatingElement = ({ element }: { element: any }) => {
    const renderElement = () => {
      switch (element.type) {
        case 'sticky-note':
          return (
            <div className="w-4 h-4 bg-yellow-100/20 border border-yellow-200/30 rounded-sm transform rotate-12" />
          )
        case 'pen':
          return (
            <Edit3 size={16} className="text-gray-300/40" />
          )
        case 'paper':
          return (
            <FileText size={14} className="text-gray-300/30" />
          )
        default:
          return null
      }
    }

    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${element.x}%`,
          top: `${element.y}%`,
          transform: `rotate(${element.rotation}deg)`
        }}
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -15, 5, 0],
          rotate: [element.rotation, element.rotation + 10, element.rotation - 5, element.rotation],
          opacity: [0.3, 0.6, 0.2, 0.3]
        }}
        transition={{
          duration: 15 + element.delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {renderElement()}
      </motion.div>
    )
  }

  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
      h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-4">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-xl font-bold mb-4">{children}</h3>,
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-orange-200 pl-4 italic my-4">{children}</blockquote>
      ),
    },
    marks: {
      link: ({ children, value }: any) => (
        <a href={value.href} className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-gray-600 font-inter">Loading scribbles...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 relative overflow-hidden">
      
      {/* Paper Texture Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.5" fill="#D1D5DB" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      {/* Sophisticated Floating Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        {floatingElements.map((element, index) => (
          <FloatingElement key={index} element={element} />
        ))}
      </div>

      {/* Header Section */}
      <section className="pt-32 pb-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="font-marcellus text-5xl md:text-7xl text-gray-900 mb-6 relative"
          >
            Scribbles & Signals
            <motion.svg
              className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-48 md:w-64 h-4"
              viewBox="0 0 200 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M10 10 Q 50 5, 100 10 T 190 10"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
              />
            </motion.svg>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 font-inter font-light italic max-w-4xl mx-auto"
          >
            Thoughts in transit, signals from the noise, scribbles that stuck.
          </motion.p>
        </div>
      </section>

      {/* Filter + Sort Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="sticky top-24 z-40 px-4 mb-12"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="glassmorphism rounded-2xl p-6 backdrop-blur-xl border border-white/40 shadow-lg"
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3" role="tablist" aria-label="Filter blog posts by category">
                {filters.map((filter) => (
                  <motion.button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                      activeFilter === filter
                        ? 'bg-gradient-to-r from-orange-200 to-yellow-200 text-gray-900 shadow-md'
                        : 'bg-white/60 text-gray-700 hover:bg-white/80'
                    }`}
                    role="tab"
                    aria-selected={activeFilter === filter}
                    aria-controls="blog-posts-grid"
                    aria-label={`Filter posts by ${filter} category`}
                  >
                    {filter === 'All' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-inter">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/70 border border-white/50 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1"
                  aria-label="Sort posts by"
                >
                  <option value="Newest">Newest</option>
                  <option value="Mood">Mood</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sticky Note Wall */}
      <div className="max-w-7xl mx-auto px-4 pb-20" id="blog-posts-grid">
        {sortedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto glassmorphism rounded-3xl p-12 backdrop-blur-xl border border-white/50 shadow-lg">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                <Brain className="w-16 h-16 mx-auto text-orange-400" />
              </motion.div>
              <h3 className="font-marcellus text-2xl text-gray-900 mb-4">
                No scribbles in this category yet
              </h3>
              <p className="text-gray-600 font-inter mb-6">
                Come back soon for more signals.
              </p>
              <motion.button
                onClick={() => setActiveFilter('All')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-200 to-yellow-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                ← Back to All Posts
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {sortedPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: (index * 17) % 7 - 3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8, 
                  rotate: 0, 
                  scale: 1.02,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg cursor-pointer group break-inside-avoid mb-6 relative overflow-hidden"
                onClick={() => openDrawer(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openDrawer(post)
                  }
                }}
                aria-label={`Read full post: ${post.title}`}
              >
                <div className="absolute -top-1 left-4 right-4 h-3 bg-gradient-to-r from-orange-200/40 to-yellow-200/40 rounded-sm opacity-60"></div>

                <div className="absolute top-3 right-3 text-lg opacity-80">
                  {post.mood}
                </div>

                <div className="space-y-4 mt-2">
                  <div>
                    <h3 className="font-marcellus text-lg text-gray-900 group-hover:text-orange-700 transition-colors leading-tight pr-8">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-inter italic mt-3 leading-relaxed">
                      {post.hook}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>{post.category}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, tagIndex) => (
                      <motion.span 
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 bg-white/70 text-gray-700 rounded-full text-xs font-medium hover:bg-white/90 transition-all"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-xs text-orange-600 font-inter font-medium">
                      Read Entry →
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Journal Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={closeDrawer}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white shadow-2xl z-50 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              aria-describedby="drawer-content"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center text-xl shadow-sm"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {selectedPost.mood}
                    </motion.div>
                    <div>
                      <div className="text-lg font-marcellus text-gray-900">
                        {new Date(selectedPost.publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-500 font-inter flex items-center gap-2">
                        <Clock size={14} />
                        {selectedPost.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={closeDrawer}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-target-44"
                    aria-label="Close journal entry"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <X size={24} className="text-gray-600" />
                  </motion.button>
                </div>

                <article className="space-y-6">
                  <div>
                    <h1 
                      id="drawer-title"
                      className="font-marcellus text-3xl md:text-4xl text-gray-900 mb-4 leading-tight"
                    >
                      {selectedPost.title}
                    </h1>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedPost.tags?.map((tag, index) => (
                        <motion.span 
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-gray-800 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  <div id="drawer-content" className="prose prose-lg max-w-none font-inter text-gray-700">
                    <PortableText value={selectedPost.body} components={portableTextComponents} />
                  </div>
                </article>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <motion.button
                    onClick={closeDrawer}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-100 to-yellow-100 text-gray-900 rounded-xl font-medium hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  >
                    <ArrowLeft size={18} />
                    Back to Wall
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}