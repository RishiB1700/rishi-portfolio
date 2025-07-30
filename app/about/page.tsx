'use client'
import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Eye, Mail, MapPin, X, Download } from 'lucide-react'
import Link from 'next/link'

interface PDFViewerProps {
  pdfUrl: string
  title: string
  isOpen: boolean
  onClose: () => void
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-marcellus text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">🔒 View-only document</p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.a
                href={pdfUrl.replace('/preview', '/view')}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors"
              >
                <Download size={14} />
                View in Drive
              </motion.a>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close viewer"
              >
                <X size={20} />
              </button>
            </div>
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

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              This document is hosted securely on Google Drive
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function CinematicAboutPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentPDFUrl, setCurrentPDFUrl] = useState('')
  const [currentPDFTitle, setCurrentPDFTitle] = useState('')
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  
  const { scrollYProgress } = useScroll()
  
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.85])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.9, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth - 0.5) * 25,
        y: (e.clientY / window.innerHeight - 0.5) * 25
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const ResumeViewButton = () => {
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

    const openPDF = (url: string, title: string) => {
      setCurrentPDFUrl(url)
      setCurrentPDFTitle(title)
      setIsPDFViewerOpen(true)
    }

    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-600 text-center mb-2">Choose your preferred resume:</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resumeOptions.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => openPDF(option.url, option.title)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="glassmorphism rounded-xl px-4 py-3 backdrop-blur-xl border border-white/40 hover:border-teal-300 transition-all duration-300 group text-center min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <div className="flex items-center gap-2 justify-center">
                <Eye size={16} className="group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium text-gray-700 group-hover:text-teal-600 transition-colors text-xs sm:text-sm">
                    {option.title}
                  </div>
                  <div className="text-xs text-gray-500 sm:hidden">
                    {option.description}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <a
        href="#main-content"
        className="fixed -top-20 left-4 bg-teal-600 text-white px-4 py-2 rounded-lg z-[9999] transition-all duration-300 focus:top-4 focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium"
        style={{ minHeight: '44px' }}
        tabIndex={0}
      >
        Skip to main content
      </a>

      <div className="bg-gradient-to-br from-teal-100/70 via-sage-100/70 to-emerald-100/70 min-h-screen">
      
        <div className="fixed inset-0 pointer-events-none opacity-50">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-200/30 via-transparent to-sage-200/30" />
          <div className="absolute inset-0 bg-gradient-to-bl from-sage-200/20 via-transparent to-emerald-200/25" />
        </div>

        <motion.div
          className="fixed top-0 left-0 w-8 h-8 bg-gradient-to-r from-teal-400/40 to-sage-400/40 rounded-full blur-md pointer-events-none z-20 hidden lg:block"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                conic-gradient(from 0deg at 25% 25%, #2dd4bf, #84cc16, #10b981, #2dd4bf),
                conic-gradient(from 90deg at 75% 75%, #84cc16, #10b981, #6ee7b7, #84cc16),
                radial-gradient(ellipse 60% 80% at 30% 70%, rgba(45, 212, 191, 0.08), transparent),
                radial-gradient(ellipse 80% 60% at 70% 30%, rgba(132, 204, 22, 0.06), transparent),
                radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16, 185, 129, 0.04), transparent)
              `,
              filter: 'blur(60px)',
              opacity: 0.15
            }}
            animate={{
              background: [
                `
                  conic-gradient(from 0deg at 25% 25%, #2dd4bf, #84cc16, #10b981, #2dd4bf),
                  conic-gradient(from 90deg at 75% 75%, #84cc16, #10b981, #6ee7b7, #84cc16),
                  radial-gradient(ellipse 60% 80% at 30% 70%, rgba(45, 212, 191, 0.08), transparent),
                  radial-gradient(ellipse 80% 60% at 70% 30%, rgba(132, 204, 22, 0.06), transparent),
                  radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16, 185, 129, 0.04), transparent)
                `,
                `
                  conic-gradient(from 120deg at 35% 65%, #84cc16, #10b981, #6ee7b7, #2dd4bf),
                  conic-gradient(from 210deg at 65% 35%, #10b981, #6ee7b7, #2dd4bf, #84cc16),
                  radial-gradient(ellipse 80% 60% at 60% 40%, rgba(132, 204, 22, 0.08), transparent),
                  radial-gradient(ellipse 60% 80% at 40% 60%, rgba(16, 185, 129, 0.06), transparent),
                  radial-gradient(ellipse 90% 50% at 80% 20%, rgba(110, 231, 183, 0.04), transparent)
                `,
                `
                  conic-gradient(from 240deg at 45% 55%, #10b981, #6ee7b7, #2dd4bf, #84cc16),
                  conic-gradient(from 330deg at 55% 45%, #6ee7b7, #2dd4bf, #84cc16, #10b981),
                  radial-gradient(ellipse 70% 90% at 20% 80%, rgba(110, 231, 183, 0.08), transparent),
                  radial-gradient(ellipse 90% 70% at 80% 20%, rgba(45, 212, 191, 0.06), transparent),
                  radial-gradient(ellipse 50% 80% at 60% 70%, rgba(132, 204, 22, 0.04), transparent)
                `,
                `
                  conic-gradient(from 0deg at 25% 25%, #2dd4bf, #84cc16, #10b981, #2dd4bf),
                  conic-gradient(from 90deg at 75% 75%, #84cc16, #10b981, #6ee7b7, #84cc16),
                  radial-gradient(ellipse 60% 80% at 30% 70%, rgba(45, 212, 191, 0.08), transparent),
                  radial-gradient(ellipse 80% 60% at 70% 30%, rgba(132, 204, 22, 0.06), transparent),
                  radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16, 185, 129, 0.04), transparent)
                `
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`mesh-blob-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${20 + (i * 20)}%`,
                top: `${25 + (i * 15)}%`,
                width: `${100 + (i * 50)}px`,
                height: `${80 + (i * 40)}px`,
                background: `
                  radial-gradient(ellipse 100% 100%, 
                    ${i % 3 === 0 ? 'rgba(45, 212, 191, 0.06)' :
                      i % 3 === 1 ? 'rgba(132, 204, 22, 0.05)' :
                      'rgba(16, 185, 129, 0.04)'
                    } 0%, 
                    transparent 70%
                  )
                `,
                filter: 'blur(30px)',
                borderRadius: `${40 + (i * 10)}% ${60 - (i * 5)}% ${50 + (i * 8)}% ${45 - (i * 3)}%`
              }}
              animate={{
                x: [0, 40, -20, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.4, 0.8, 1],
              }}
              transition={{
                duration: 18 + i * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 3
              }}
            />
          ))}
        </div>

        <main id="main-content" className="relative z-10" role="main" tabIndex={-1}>

          {/* Hero Section */}
          <section 
            className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8"
            role="banner"
            aria-labelledby="hero-heading"
          >
            <motion.div
              style={{ scale: heroScale, opacity: heroOpacity }}
              className="text-center z-20 relative max-w-6xl mx-auto"
            >
              <motion.h1
                id="hero-heading"
                className="font-marcellus text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-900 leading-tight mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              >
                What are we but
                <br />
                <motion.span
                  className="bg-gradient-to-r from-teal-600 via-sage-600 to-emerald-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                >
                  our stories?
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-inter font-medium max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                role="doc-subtitle"
              >
                And what are stories without the data and experiences that shape them?
              </motion.p>
            </motion.div>

            <motion.div
              className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-teal-300/50 to-sage-300/50 rounded-full opacity-40"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-r from-sage-300/50 to-emerald-300/50 rounded-full opacity-30"
              animate={{
                y: [0, 25, 0],
                rotate: [360, 180, 0],
                scale: [1, 0.9, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </section>

          {/* Open to Opportunities Section */}
          <section 
            className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
            aria-labelledby="opportunities-heading"
          >
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center mb-8"
              >
                <h2 
                  id="opportunities-heading"
                  className="font-marcellus text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-6"
                >
                  Open to Opportunities In
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-inter italic mb-8">
                  Where data-driven strategy meets creative execution
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="glassmorphism rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-md border-2 border-white/60 shadow-2xl mb-8 bg-white/70"
                role="region"
                aria-label="Professional opportunities and specializations"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    "Media Planning", "Digital Strategy", "Performance Marketing", "Programmatic Advertising",
                    "Campaign Management", "Brand Strategy", "Account Management", "Growth Marketing", 
                    "Media Coordination", "Marketing Analytics", "Content Strategy", "Social Media Marketing"
                  ].map((opportunity, index) => (
                    <motion.div
                      key={opportunity}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="bg-gradient-to-br from-teal-100/90 to-sage-100/90 rounded-2xl p-3 sm:p-4 hover:shadow-lg transition-all text-center border-2 border-teal-200/60 backdrop-blur-sm focus-within:ring-2 focus-within:ring-teal-400"
                      tabIndex={0}
                      role="listitem"
                      aria-label={`Specialization: ${opportunity}`}
                    >
                      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">{opportunity}</h4>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Chapter 2: The Beginning */}
          <section className="min-h-screen flex items-center relative py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 relative">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-200px" }}
                  className="space-y-6 sm:space-y-8"
                >
                  <h2 className="font-marcellus text-3xl sm:text-4xl md:text-6xl text-gray-800 leading-tight">
                    My journey's been about chasing opportunities
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 font-inter leading-relaxed">
                    <p>
                      My journey has always been about moving toward new opportunities, new cities, and new ways to tell stories. Growing up in a small town in India, I was drawn to creativity through theater, design, and storytelling, yet I also thrived on structure and analysis.
                    </p>
                    <p>
                      This balance led me to Mumbai, where I pursued Mass Media and discovered advertising — a space where creativity meets strategy, backed by data. The transition from a small town to a bustling city taught me adaptability and resilience as I navigated new cultures and industries.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative order-first lg:order-last"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-200px" }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-full h-80 sm:h-96 lg:h-[500px] bg-gradient-to-br from-emerald-200 to-teal-400 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50"
                      whileHover={{ scale: 1.03, rotate: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src="/images/about/journey/profile-shot.jpg"
                        alt="Small town roots - the beginning of my journey"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-emerald-200 to-teal-400">
                        <span className="text-white font-inter text-lg font-medium">Small Town Roots</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Chapter 3: Mumbai Discovery */}
          <section 
            className="min-h-screen relative overflow-hidden py-16 sm:py-20"
            aria-labelledby="mumbai-heading"
          >
            <div className="relative z-10 min-h-screen flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="relative">
                  <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center relative z-10">
                    
                    <motion.div
                      className="lg:col-span-2 lg:order-first"
                      initial={{ opacity: 0, x: -100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true, margin: "-150px" }}
                    >
                      <div className="flex gap-4 sm:gap-6 justify-center">
                        <motion.div
                          className="w-44 sm:w-52 lg:w-56 h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-teal-300/80 to-sage-400/80 rounded-3xl shadow-xl overflow-hidden border-4 border-white/60"
                          whileHover={{ scale: 1.02, rotate: -1 }}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          viewport={{ once: true }}
                        >
                          <img
                            src="/images/about/journey/school-days.jpg"
                            alt="University days - studying Mass Media and discovering my passion"
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextSibling) {
                                (target.nextSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-teal-300/80 to-sage-400/80">
                            <span className="text-white font-inter font-medium text-center px-4">Personal Growth</span>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          className="w-44 sm:w-52 lg:w-56 h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-sage-300/80 to-emerald-400/80 rounded-3xl shadow-xl overflow-hidden border-4 border-white/60"
                          whileHover={{ scale: 1.02, rotate: 1 }}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          viewport={{ once: true }}
                        >
                          <img
                            src="/images/about/journey/university-days.jpg"
                            alt="Mumbai university days - discovering advertising and creative strategy"
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextSibling) {
                                (target.nextSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-sage-300/80 to-emerald-400/80">
                            <span className="text-white font-inter font-medium text-center px-4">Mumbai University</span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="lg:col-span-3 flex items-center"
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2 }}
                      viewport={{ once: true, margin: "-150px" }}
                    >
                      <div className="space-y-6 sm:space-y-8">
                        <h2 className="font-marcellus text-3xl sm:text-5xl md:text-7xl text-gray-800 leading-tight">
                          Where I found my calling
                        </h2>
                        
                        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-coral-500 to-teal-500 rounded-full"></div>
                        
                        <div className="space-y-4 sm:space-y-6 text-base sm:text-xl text-gray-700 font-inter leading-relaxed max-w-2xl">
                          <p>
                            The city of Mumbai taught me that advertising isn't just about pretty visuals or clever copy. 
                            It's where creativity meets strategy, backed by data that actually means something.
                          </p>
                          
                          <p>
                            The pandemic hit during my final year and changed everyone's plans. But it pushed me to get better at digital - social media strategy, SEO, content marketing.
                          </p>
                          
                          <p>
                            I explored film, content creation, anything that blended storytelling with analytics. 
                            That's when I realized I wanted to work where both sides of my brain could collaborate.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-12">
                          {['Digital Marketing', 'Content Strategy', 'Brand Building'].map((skill, i) => (
                            <motion.div
                              key={skill}
                              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-white/90 to-coral-50/90 backdrop-blur-sm rounded-full shadow-lg border border-white/60"
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                              viewport={{ once: true }}
                              whileHover={{ scale: 1.05, y: -5 }}
                            >
                              <span className="font-inter font-medium text-gray-800 text-sm sm:text-base">{skill}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 4: Imperial Growth */}
          <section className="min-h-screen flex items-center relative py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4">
              
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, rotate: -10 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-200px" }}
                >
                  <div className="relative">
                    <motion.div
                      className="h-80 sm:h-96 lg:h-[500px] bg-gradient-to-br from-teal-400/70 to-sage-500/70 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <img
                        src="/images/about/journey/imperial-office.jpg"
                        alt="Imperial Overseas office - where I grew from intern to strategist"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-teal-400/70 to-sage-500/70">
                        <span className="text-white font-inter font-medium">Imperial Office</span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-emerald-200"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-1">700+</div>
                        <div className="text-xs sm:text-sm text-emerald-600 font-inter font-medium">Students Guided</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-200px" }}
                  className="space-y-6 sm:space-y-8"
                >
                  <motion.div
                    className="inline-block px-4 sm:px-6 py-2 bg-gradient-to-r from-coral-200 to-teal-200 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-inter font-medium text-gray-800 text-sm sm:text-base">The Real Training Ground</span>
                  </motion.div>

                  <h2 className="font-marcellus text-3xl sm:text-4xl md:text-6xl text-gray-800 leading-tight">
                    From intern to strategic contributor
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 font-inter leading-relaxed">
                    <p>
                      Imperial Overseas became my comprehensive training ground. Started as a Social Media Intern, 
                      evolved into a Counselor & Digital Media Strategist.
                    </p>
                    <p>
                      I was running marketing campaigns AND helping students figure out 
                      their study abroad dreams. Two different things that taught me 
                      how to connect strategy with real human stories.
                    </p>
                    <p>
                      Conversations with students and mentors eventually 
                      inspired me to embark on my own journey abroad.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Chapter 5: The NYC Leap */}
          <section className="min-h-screen relative overflow-hidden py-20 sm:py-32">
            
            <div className="relative z-10 min-h-screen flex items-center">
              <div className="max-w-7xl mx-auto px-4 relative z-10">
                
                <div className="relative">

                  <div className="relative z-10 text-center space-y-12 sm:space-y-16">
                    
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.5 }}
                      viewport={{ once: true, margin: "-200px" }}
                      className="space-y-6 sm:space-y-8"
                    >
                      <motion.div
                        className="text-6xl sm:text-8xl mb-6 sm:mb-8"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        🗽
                      </motion.div>

                      <h2 className="font-marcellus text-3xl sm:text-4xl md:text-7xl text-gray-800 leading-tight max-w-4xl mx-auto">
                        The city where ambition meets opportunity
                      </h2>
                      
                      <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-teal-500 to-sage-500 rounded-full mx-auto"></div>
                      
                      <p className="text-base sm:text-xl md:text-2xl text-gray-700 font-inter max-w-3xl mx-auto leading-relaxed">
                        Completed my MS in Media Management at The New School. Finally found a program 
                        that bridges creativity and analytics.
                      </p>
                    </motion.div>

                    <motion.div
                      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {[
                        { 
                          image: '/images/about/journey/the-new-school.jpg',
                          title: 'MS Media Management', 
                          subtitle: 'Graduated 2025',
                          icon: '🎓'
                        },
                        { 
                          image: '/images/about/journey/campusep-summit.jpg',
                          title: 'First Student Speaker', 
                          subtitle: 'CampusESP 2025 Summit',
                          icon: '🎤'
                        },
                        { 
                          image: '/images/about/journey/emmys-red-carpet.jpg',
                          title: 'Red Carpet Coordinator', 
                          subtitle: 'Emmy Awards 2023 & 2024',
                          icon: '🏆'
                        }
                      ].map((achievement, i) => (
                        <motion.div
                          key={i}
                          className="group cursor-pointer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.2, duration: 0.6 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05, y: -10 }}
                        >
                          <div className="space-y-4">
                            <motion.div
                              className="h-36 sm:h-48 bg-gradient-to-br from-teal-300/80 to-sage-300/80 rounded-2xl shadow-lg overflow-hidden border-3 border-white/40"
                              whileHover={{ scale: 1.02 }}
                            >
                              <img
                                src={achievement.image}
                                alt={`${achievement.title} - ${achievement.subtitle}`}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  if (target.nextSibling) {
                                    (target.nextSibling as HTMLElement).style.display = 'flex';
                                  }
                                }}
                              />
                              <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-teal-300/80 to-sage-300/80">
                                <span className="text-white font-inter font-medium text-sm sm:text-base text-center px-2">{achievement.title}</span>
                              </div>
                            </motion.div>
                            
                            <div className="space-y-2">
                              <div className="text-2xl sm:text-3xl">{achievement.icon}</div>
                              <div className="font-marcellus text-base sm:text-lg text-gray-800">{achievement.title}</div>
                              <div className="text-xs sm:text-sm text-gray-600 font-inter">{achievement.subtitle}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Work Experience Section */}
          <section className="py-16 sm:py-20 px-4">
            <div className="max-w-5xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
              >
                <h2 className="font-marcellus text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-6">
                  Professional Experience
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 font-inter italic">
                  Where I've made impact and learned the most
                </p>
              </motion.div>

              <div className="space-y-6 sm:space-y-8">
                {/* Media x Women */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-sage-50/90 to-teal-50/90 border border-sage-200/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white p-2">
                      <img
                        src="/images/about/companies/media-x-women.png"
                        alt="Media x Women logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden text-sage-600 text-xs sm:text-sm font-bold">MxW</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-marcellus text-xl sm:text-2xl text-gray-800 mb-2">Digital Content Analyst</h3>
                      <div className="text-sage-600 font-medium mb-2 text-sm sm:text-base">Media x Women • NYC • June 2025 - Present</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-xs font-medium">
                          Media Analysis
                        </span>
                        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                          Women in Media
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Innovarex Media */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-teal-50/90 to-coral-50/90 border border-teal-200/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white p-2">
                      <img
                        src="/images/about/companies/innovarex-logo.png"
                        alt="Innovarex Media logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden text-teal-600 text-xs font-bold">IM</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-marcellus text-xl sm:text-2xl text-gray-800 mb-2">Digital Marketing Specialist</h3>
                      <div className="text-teal-600 font-medium mb-3 text-sm sm:text-base">Innovarex Media • Remote • May 2024 - Present</div>
                      <div className="flex flex-wrap gap-2">
                        {["Performance Marketing", "Paid Media", "Multi-Platform Campaigns", "$50K+ Monthly Budgets"].map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* The New School Roles */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-coral-50/90 to-peach-50/90 border border-coral-200/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white p-2">
                      <img
                        src="/images/about/companies/tns-logo.png"
                        alt="The New School logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden text-coral-600 text-sm font-bold">TNS</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-marcellus text-xl sm:text-2xl text-gray-800 mb-2">Content Manager & Family Engagement</h3>
                      <div className="text-coral-600 font-medium mb-3 text-sm sm:text-base">The New School • NYC • 2024-2025</div>
                      <div className="flex flex-wrap gap-2">
                        {["70K+ Families", "CampusESP Summit Speaker", "Team Leadership", "Content Strategy"].map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-coral-100 text-coral-800 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Imperial Overseas */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-emerald-200/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white p-2">
                      <img
                        src="/images/about/companies/imperial-logo.png"
                        alt="Imperial Overseas logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden text-emerald-600 text-xs font-bold">IOE</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-marcellus text-xl sm:text-2xl text-gray-800 mb-2">Counselor & Digital Media Strategist</h3>
                      <div className="text-emerald-600 font-medium mb-3 text-sm sm:text-base">Imperial Overseas Education Consultants • Mumbai • 2021-2023</div>
                      <div className="flex flex-wrap gap-2">
                        {["700+ Students Guided", "60% Lead Surge", "Digital Strategy", "Client Relations"].map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Education Journey */}
          <section className="py-16 sm:py-20 px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
              >
                <h2 className="font-marcellus text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-6">
                  Educational Background
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 font-inter italic">
                  The foundation of my strategic and creative thinking
                </p>
              </motion.div>

              <div className="space-y-6 sm:space-y-8">
                {/* Parsons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-coral-50/90 to-peach-50/90 border border-coral-200/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white p-2">
                      <img
                        src="/images/about/education/parsons-logo.png"
                        alt="Parsons School of Design logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden text-coral-600 text-sm font-bold">TNS</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-marcellus text-xl sm:text-2xl text-gray-800 mb-2">Master of Science in Media Management</h3>
                      <div className="text-coral-600 font-medium mb-3 text-sm sm:text-base">Parsons School of Design - The New School • NYC • 2023-2025 • GPA 3.97</div>
                      <div className="flex flex-wrap gap-2">
                        {[ "Minor: Transmedia & Digital Storytelling", "Founding Member: Show & Sell", "Member: Media x Women & Media Smart Citizens"].map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-coral-100 text-coral-800 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* NMIMS */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-teal-50/90 to-sage-50/90 border border-teal-200/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white p-2">
                      <img
                        src="/images/about/education/nmims-logo.png"
                        alt="NMIMS logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden text-teal-600 text-xs font-bold">NMIMS</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-marcellus text-xl sm:text-2xl text-gray-800 mb-2">Post Graduate Diploma in Marketing Management</h3>
                      <div className="text-teal-600 font-medium mb-3 text-sm sm:text-base">NMIMS CDOE • Mumbai • 2022-2023</div>
                      <div className="flex flex-wrap gap-2">
                        {["Performance Marketing Focus", "Consumer Behavior", "Information Systems", "Digital Strategy Fundamentals"].map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Undergrad */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-emerald-50/90 to-sage-50/90 border border-emerald-200/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white p-2">
                      <img
                        src="/images/about/education/upg-logo.png"
                        alt="Usha Pravin Gandhi College logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden text-emerald-600 text-xs font-bold">UPG</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-marcellus text-xl sm:text-2xl text-gray-800 mb-2">Bachelor of Arts in Mass Media</h3>
                      <div className="text-emerald-600 font-medium mb-3 text-sm sm:text-base">Usha Pravin Gandhi College • Mumbai • 2018-2021</div>
                      <div className="flex flex-wrap gap-2">
                        {["Advertising Major", "Brand Strategy Foundation", "Media Psychology"].map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Enhanced Skills Section */}
          <section className="py-16 sm:py-20 px-4">
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
              >
                <h2 className="font-marcellus text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-6">
                  What I'm Good At
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 font-inter italic">
                  The tools and techniques I've learned along the way
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {[
                  {
                    category: "Campaign & Media Strategy",
                    skills: ["Media Planning & Buying", "Programmatic Advertising", "Campaign Optimization", "Audience Targeting", "Brand Strategy", "Media Coordination"],
                    icon: "🎯",
                    color: "from-teal-100/80 to-coral-100/80"
                  },
                  {
                    category: "Performance & Analytics", 
                    skills: ["Google Ads & Analytics", "Meta Ads Manager", "Apple Search Ads", "LinkedIn Ads", "Performance Tracking", "Data Analysis", "ROI Optimization"],
                    icon: "📊",
                    color: "from-coral-100/80 to-peach-100/80"
                  },
                  {
                    category: "Development & Technical",
                    skills: ["HTML/CSS/JavaScript", "React", "Python", "SQL", "R", "P5.js", "GitHub", "Streamlit", "Vercel", "Sanity"],
                    icon: "💻",
                    color: "from-sage-100/80 to-teal-100/80"
                  },
                  {
                    category: "Data & Business Intelligence",
                    skills: ["Excel (Advanced)", "Power BI", "Tableau", "Google Analytics", "Microsoft Office Suite", "Data Visualization"],
                    icon: "📈",
                    color: "from-peach-100/80 to-coral-100/80"
                  },
                  {
                    category: "Design & Creative Tools",
                    skills: ["Adobe Creative Suite", "Canva", "Photoshop", "Illustrator", "Creative Direction", "Brand Design"],
                    icon: "🎨",
                    color: "from-teal-100/80 to-sage-100/80"
                  },
                  {
                    category: "Marketing Automation",
                    skills: ["Salesforce", "HubSpot", "Hootsuite", "Email Marketing", "CRM Management", "Marketing Analytics"],
                    icon: "🤖",
                    color: "from-sage-100/80 to-emerald-100/80"
                  },
                  {
                    category: "Content & Strategy",
                    skills: ["Content Strategy", "Brand Storytelling", "Social Media Strategy", "SEO/SEM", "Market Research", "Competitive Analysis"],
                    icon: "✨",
                    color: "from-emerald-100/80 to-teal-100/80"
                  },
                  {
                    category: "Collaboration & Management",
                    skills: ["Team Leadership", "Account Management", "Client Relations", "Slack", "Outlook", "Project Management"],
                    icon: "👥",
                    color: "from-coral-100/80 to-sage-100/80"
                  }
                ].map((skillGroup, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`glassmorphism rounded-2xl p-4 sm:p-6 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${skillGroup.color} hover:scale-105`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-3xl sm:text-4xl mb-3">{skillGroup.icon}</div>
                      <h3 className="font-marcellus text-base sm:text-lg text-gray-800 mb-4">{skillGroup.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {skillGroup.skills.map((skill, skillIndex) => (
                        <motion.span
                          key={skillIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                          className="inline-block px-2 sm:px-3 py-1 bg-white/70 text-gray-800 rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-all"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Beyond Work */}
          <section className="py-16 sm:py-20 px-4">
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
              >
                <h2 className="font-marcellus text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-6">
                  Beyond Work
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 font-inter italic">
                  What keeps me creative and grounded
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    emoji: "🏔️",
                    title: "Sahyadri Explorer",
                    description: "Covered major peaks across the Sahyadri range. Clear thinking comes from quiet trails."
                  },
                  {
                    emoji: "🏹", 
                    title: "Former State Champion",
                    description: "Archery taught me precision and performing under pressure, skills I use in campaigns daily."
                  },
                  {
                    emoji: "🏊",
                    title: "Swimming Enthusiast", 
                    description: "Water therapy for mental clarity. Helps me think through complex strategic challenges."
                  },
                  {
                    emoji: "🎵",
                    title: "Classical Music Enthusiast",
                    description: "Passionate about Hindustani classical, Carnatic music, and timeless Bollywood classics."
                  },
                  {
                    emoji: "📚",
                    title: "Fantasy Worldbuilder",
                    description: "Transmedia storytelling and complex fictional worlds. Worldbuilding teaches brand building."
                  },
                  {
                    emoji: "🎬",
                    title: "Film & Theater",
                    description: "From college drama to analyzing narrative structures in marketing campaigns and brand placements in films."
                  }
                ].map((interest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, rotate: Math.random() * 6 - 3 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -8,
                      rotate: Math.random() * 4 - 2,
                      scale: 1.02
                    }}
                    className="glassmorphism rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 text-center cursor-pointer"
                  >
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                      {interest.emoji}
                    </div>
                    <h3 className="font-marcellus text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">
                      {interest.title}
                    </h3>
                    <p className="text-gray-600 font-inter text-xs sm:text-sm leading-relaxed">
                      {interest.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Recommendations */}
          <section className="py-16 sm:py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
              >
                <h2 className="font-marcellus text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-6">
                 In Their Words
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 font-inter italic">
                  Feedback from those who worked closest with me
                </p>
              </motion.div>

              <div className="space-y-8 sm:space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-teal-50 to-coral-50 rounded-3xl p-6 sm:p-8 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4 sm:space-y-6">
                    <blockquote className="text-base sm:text-lg text-gray-800 font-inter leading-relaxed">
                      "Rishi stepped beyond what I expected to become a leader and mentor to other students. 
                      He's diplomatic, encouraging, brilliant, and flexible. He brought positive energy to our office and 
                      became someone I relied on to provide instruction and guidance."
                    </blockquote>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="text-gray-700">
                        <div className="font-semibold font-marcellus text-lg sm:text-xl text-gray-900">Sue Forte</div>
                        <div className="text-sm font-inter">Manager, The New School</div>
                      </div>
                      <motion.a
                        href="https://www.linkedin.com/in/rishi-bhanushali-838713230/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors inline-block text-center sm:text-left"
                      >
                        Read Full Recommendation →
                      </motion.a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-sage-50 to-peach-50 rounded-3xl p-6 sm:p-8 border border-sage-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4 sm:space-y-6">
                    <blockquote className="text-base sm:text-lg text-gray-800 font-inter leading-relaxed">
                      "His enthusiasm and confidence stood out immediately. Rishi is organized, driven, reliable, decisive, and has remarkable integrity. 
                      Our team's cohesion and morale are better because of Rishi."
                    </blockquote>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="text-gray-700">
                        <div className="font-semibold font-marcellus text-lg sm:text-xl text-gray-900">Elisabeth Arriero-Ferreira</div>
                        <div className="text-sm font-inter">Manager, The New School</div>
                      </div>
                      <motion.a
                        href="https://www.linkedin.com/in/rishi-bhanushali-838713230/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-sage-100 text-sage-800 rounded-full text-sm font-medium hover:bg-sage-200 transition-colors inline-block text-center sm:text-left"
                      >
                        Read Full Recommendation →
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What's Next */}
          <section className="py-16 sm:py-20 px-4">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="space-y-8 sm:space-y-12"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl sm:text-8xl mb-6 sm:mb-8"
                >
                  🚀
                </motion.div>

                <h2 className="font-marcellus text-3xl sm:text-4xl md:text-6xl text-gray-800 leading-tight">
                  What drives me forward?
                </h2>
                
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-teal-500 to-sage-600 rounded-full mx-auto"></div>
                
                <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 text-base sm:text-xl text-gray-700 font-inter leading-relaxed">
                  <p>
                    I'm passionate about opportunities where creativity and analytics intersect 
                    where data-driven insights amplify storytelling to create meaningful impact.
                  </p>
                  
                  <p>
                    As a full-stack marketer, I thrive at the intersection of strategy, technology, and creativity. 
                    Whether developing integrated campaigns, optimizing media performance, building technical solutions, 
                    or crafting brand narratives that resonate, I bring both analytical rigor and creative vision.
                  </p>
                  
                  <p className="text-xl sm:text-2xl font-medium">
                    Ready to contribute, learn, and build something remarkable together.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer CTA */}
          <footer className="py-16 sm:py-24 px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glassmorphism rounded-3xl p-8 sm:p-12 backdrop-blur-xl border border-white/30 shadow-xl relative overflow-hidden"
              >
                <div className="relative z-10">
                  <h3 className="font-marcellus text-2xl sm:text-3xl md:text-4xl text-gray-800 mb-4 sm:mb-6">
                    Let's build something meaningful together
                  </h3>
                  
                  <p className="text-base sm:text-lg text-gray-700 font-inter mb-6 sm:mb-8 leading-relaxed">
                    Looking for someone who bridges creativity and analytics? Let's connect.
                  </p>
                  
                  <div className="flex flex-col items-center gap-6 mb-8">
                    <ResumeViewButton />
                    
                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="glassmorphism rounded-2xl px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-teal-100/80 to-sage-100/80 backdrop-blur-xl border border-white/40 hover:border-sage-200 transition-all duration-300 group flex items-center justify-center gap-3 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
                      >
                        <Mail size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-gray-700 group-hover:text-sage-600 transition-colors text-sm sm:text-base">
                          Let's Connect
                        </span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </div>

                  <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
                    <motion.a
                      href="https://www.linkedin.com/in/rishi-bhanushali-838713230/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="glassmorphism rounded-full p-3 sm:p-4 hover:shadow-xl transition-all group backdrop-blur-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      aria-label="Connect on LinkedIn"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </motion.a>
                    
                    <motion.a
                      href="https://www.instagram.com/hrishi.bhanushali/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="glassmorphism rounded-full p-3 sm:p-4 hover:shadow-xl transition-all group backdrop-blur-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                      aria-label="Follow on Instagram"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </motion.a>
                  </div>
                  
                  <div className="space-y-4 text-gray-600 font-inter text-sm sm:text-base">
                    <p className="flex items-center justify-center space-x-2 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={16} />NYC • Jersey City • Boston</span>
                    </p>
                    <p className="text-xs sm:text-sm">Available for full-time, contract, and consulting opportunities • In-person, Hybrid & Remote • Open to relocation</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-teal-600" />
                        <a 
                          href="mailto:bhanr480@newschool.edu" 
                          className="hover:text-teal-600 transition-colors focus:outline-none focus:underline"
                        >
                          bhanr480@newschool.edu
                        </a>
                      </span>
                      <span className="hidden sm:inline text-gray-400">•</span>
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-sage-600" />
                        <a 
                          href="mailto:hrishi.bhanushali@gmail.com" 
                          className="hover:text-sage-600 transition-colors focus:outline-none focus:underline"
                        >
                          hrishi.bhanushali@gmail.com
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </footer>
        </main>

        <AnimatePresence>
          {isPDFViewerOpen && (
            <PDFViewer
              pdfUrl={currentPDFUrl}
              title={currentPDFTitle}
              isOpen={isPDFViewerOpen}
              onClose={() => setIsPDFViewerOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}