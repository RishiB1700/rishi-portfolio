'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Search, Trophy, Ban, Zap, Heart, Eye, Linkedin, Mail } from 'lucide-react'
import { getAllCampaigns } from '@/lib/sanity'
import { SanityCampaign } from '@/types/sanity'

export default function AdArchive() {
  const [campaigns, setCampaigns] = useState<SanityCampaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<SanityCampaign | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('All')
  const [sortBy, setSortBy] = useState('Most Impactful')
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)

  const tabs = ['All', 'TV', 'Print', 'OOH', 'Digital', 'Experimental', 'Award-Winning', 'Controversial']

  // Fetch campaigns from Sanity
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const fetchedCampaigns = await getAllCampaigns()
        setCampaigns(fetchedCampaigns)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesTab = activeTab === 'All' || 
      campaign.mediaType === activeTab || 
      campaign.badges.includes(activeTab)
    
    const matchesSearch = searchTerm === '' || 
      campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'Most Recent':
        return b.year - a.year
      case 'Oldest':
        return a.year - b.year
      case 'Alphabetical':
        return a.campaignName.localeCompare(b.campaignName)
      default: // Most Impactful
        return a._id.localeCompare(b._id)
    }
  })

  const openModal = (campaign: SanityCampaign) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedCampaign(null), 300)
  }

  const navigateCampaign = (direction: 'prev' | 'next') => {
    if (!selectedCampaign) return
    
    const currentIndex = sortedCampaigns.findIndex(c => c._id === selectedCampaign._id)
    let newIndex
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : sortedCampaigns.length - 1
    } else {
      newIndex = currentIndex < sortedCampaigns.length - 1 ? currentIndex + 1 : 0
    }
    
    setSelectedCampaign(sortedCampaigns[newIndex])
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      
      if (e.key === 'Escape') {
        closeModal()
      } else if (e.key === 'ArrowLeft') {
        navigateCampaign('prev')
      } else if (e.key === 'ArrowRight') {
        navigateCampaign('next')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, selectedCampaign, sortedCampaigns])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Award-Winning':
        return <Trophy size={16} className="text-yellow-600" />
      case 'Banned':
        return <Ban size={16} className="text-red-600" />
      case 'Viral':
        return <Zap size={16} className="text-purple-600" />
      default:
        return null
    }
  }

  const getCardStyles = (campaign: SanityCampaign, index: number) => {
    const rotation = ((index * 17) % 7) - 3
    
    const sizeClasses = {
      small: 'col-span-1',
      medium: 'col-span-1 md:col-span-2',
      large: 'col-span-1 md:col-span-2 lg:col-span-3'
    }
    
    return {
      gridColumn: sizeClasses[campaign.size],
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center'
    }
  }

  const getCardHeight = (size: string) => {
    switch (size) {
      case 'small':
        return 'h-64'
      case 'large':
        return 'h-80'
      default:
        return 'h-72'
    }
  }

  const getTapeElement = (index: number) => {
    const tapeTypes = [
      'corner-tape',
      'side-tape',
      'washi-tape',
      'double-tape',
      'paperclip'
    ]
    
    const tapeType = tapeTypes[index % tapeTypes.length]
    
    switch (tapeType) {
      case 'corner-tape':
        return (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-600/60 rounded-sm rotate-45 shadow-sm border border-yellow-700/40"></div>
        )
      case 'side-tape':
        return (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-amber-600/50 rounded-sm shadow-sm border border-amber-700/40"></div>
        )
      case 'washi-tape':
        return (
          <div className="absolute -top-1 -left-1 w-6 h-16 bg-gradient-to-b from-yellow-600/50 to-amber-600/50 rounded-sm shadow-sm border border-yellow-700/40"></div>
        )
      case 'double-tape':
        return (
          <>
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-amber-600/50 rounded-sm rotate-12 shadow-sm border border-amber-700/40"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-600/50 rounded-sm -rotate-12 shadow-sm border border-yellow-700/40"></div>
          </>
        )
      case 'paperclip':
        return (
          <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-amber-700 rounded-full bg-amber-200 shadow-sm">
            <div className="w-2 h-2 bg-amber-700 rounded-full mx-auto mt-1"></div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-inter">Loading campaigns...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      
      {/* Vintage paper texture with brown tones */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(146,64,14,0.12)_1px,transparent_1px)] bg-[length:15px_15px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(146,64,14,0.06)_25%,rgba(146,64,14,0.06)_26%,transparent_27%,transparent_74%,rgba(146,64,14,0.06)_75%,rgba(146,64,14,0.06)_76%,transparent_77%,transparent)] bg-[length:30px_30px]"></div>
      </div>

      {/* Sepia overlay for vintage feel */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-900/5 via-transparent to-yellow-900/4 pointer-events-none"></div>

      {/* Floating campaign fragments with brown vintage tones */}
      <div className="fixed inset-0 pointer-events-none opacity-15">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-amber-300/40 rounded-lg shadow-sm border border-amber-400/30"
            style={{
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 20 + 15}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="font-marcellus text-5xl md:text-7xl text-gray-900 mb-6"
          >
            Campaign Vault
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 font-inter font-light italic max-w-4xl mx-auto"
          >
            A curated scrapbook of campaigns that moved me, changed industries, or simply stuck with me.
          </motion.p>
        </div>
      </section>

      {/* Category Tabs & Controls with vintage brown styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="sticky top-24 z-40 px-4 mb-16"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-amber-50/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-amber-200/60">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      activeTab === tab
                        ? 'bg-amber-400/70 text-gray-900 shadow-md backdrop-blur-sm border border-amber-500/60'
                        : 'bg-yellow-100/60 text-gray-800 hover:bg-amber-200/70 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48 pl-9 pr-4 py-2 rounded-full border border-amber-200/60 bg-yellow-50/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/95 font-inter text-sm text-gray-900 placeholder-gray-600"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-full border border-amber-200/60 bg-yellow-50/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/95 font-inter text-sm text-gray-900"
                >
                  <option value="Most Impactful">Most Impactful</option>
                  <option value="Most Recent">Most Recent</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Campaign Scrapbook Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-max">
          {sortedCampaigns.map((campaign, index) => {
            const cardStyles = getCardStyles(campaign, index)
            
            return (
              <motion.div
                key={campaign._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1
                }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  rotate: 0,
                  zIndex: 50,
                  boxShadow: "0 12px 30px rgba(146,64,14,0.15)"
                }}
                className={`
                  ${cardStyles.gridColumn} ${getCardHeight(campaign.size)} cursor-pointer group
                  bg-yellow-50/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200/70
                  hover:bg-white transition-all duration-300 relative overflow-hidden
                  ${isMobile ? 'col-span-1' : ''}
                `}
                style={{
                  transform: cardStyles.transform,
                  transformOrigin: cardStyles.transformOrigin
                }}
                onClick={() => openModal(campaign)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openModal(campaign)
                  }
                }}
                aria-label={`View ${campaign.campaignName} campaign details`}
              >
                
                {getTapeElement(index)}
                
                {campaign.badges.length > 0 && (
                  <div className="absolute top-2 left-2 z-20 bg-yellow-100/95 rounded-full p-2 shadow-md">
                    {getBadgeIcon(campaign.badges[0])}
                  </div>
                )}

                <div className="relative h-32 md:h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-100">
                  <img
                    src={campaign.visual}
                    alt={`${campaign.campaignName} campaign`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-amber-400/70 text-gray-900 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                      {campaign.mediaType}
                    </span>
                    <span className="text-xs text-gray-700 font-inter font-medium">
                      {campaign.year}
                    </span>
                  </div>
                  
                  <h3 className="font-marcellus text-lg md:text-xl text-gray-900 leading-tight">
                    {campaign.campaignName}
                  </h3>
                  
                  <p className="text-sm text-gray-700 font-inter font-semibold">
                    {campaign.brand}
                  </p>
                  
                  {!isMobile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/98 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-amber-200/70"
                    >
                      <p className="text-sm text-gray-900 font-inter italic font-medium">
                        "{campaign.personalInsight}"
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {sortedCampaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto bg-yellow-50/90 backdrop-blur-xl rounded-3xl p-12 shadow-lg border border-amber-200/60">
              <div className="text-6xl mb-6">📱</div>
              <h3 className="font-marcellus text-2xl text-gray-900 mb-4">
                No campaigns found
              </h3>
              <p className="text-gray-600 font-inter">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.9 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-yellow-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/60 ${
                isMobile 
                  ? 'w-full h-full max-h-[90vh] overflow-y-auto' 
                  : 'max-w-4xl max-h-[90vh] overflow-y-auto'
              }`}
              role="dialog"
              aria-modal="true"
            >
              <div className="p-8 md:p-12">
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-400/70 text-gray-900 rounded-full text-sm font-medium uppercase tracking-wide">
                        {selectedCampaign.mediaType}
                      </span>
                      {selectedCampaign.badges.length > 0 && (
                        <div className="bg-yellow-100/90 rounded-full p-2 shadow-md">
                          {getBadgeIcon(selectedCampaign.badges[0])}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => navigateCampaign('prev')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-amber-100 transition-colors"
                      aria-label="Previous campaign"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </motion.button>
                    <motion.button
                      onClick={() => navigateCampaign('next')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-amber-100 transition-colors"
                      aria-label="Next campaign"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </motion.button>
                    <motion.button
                      onClick={closeModal}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-amber-100 transition-colors"
                      aria-label="Close modal"
                    >
                      <X size={24} className="text-gray-700" />
                    </motion.button>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-100 shadow-lg">
                    <img
                      src={selectedCampaign.visual}
                      alt={`${selectedCampaign.campaignName} campaign`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h1 className="font-marcellus text-3xl md:text-4xl text-gray-900 mb-2">
                      {selectedCampaign.campaignName}
                    </h1>
                    <p className="text-lg text-gray-600 font-inter">
                      {selectedCampaign.brand} • {selectedCampaign.agency} • {selectedCampaign.year}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-gray-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-amber-100/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/60">
                    <h3 className="font-marcellus text-xl text-gray-900 mb-4">
                      Why This Campaign Matters
                    </h3>
                    <p className="text-gray-700 font-inter leading-relaxed text-lg">
                      {selectedCampaign.fullInsight}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-amber-200/50">
                  <motion.button
                    onClick={closeModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-200 to-yellow-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Back to Vault
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}