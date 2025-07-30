'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Linkedin, Send, ArrowRight, X, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mood: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('https://formspree.io/f/meozzjjv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mood: formData.mood,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setShowSuccessModal(true)
        setFormData({ name: '', email: '', mood: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getFieldLabel = (field: string) => {
    if (focusedField === field) {
      switch (field) {
        case 'name':
          return "Don't worry, I'll remember it."
        case 'email':
          return "I won't spam. Promise."
        case 'message':
          return "No pressure. Type away."
        default:
          return ''
      }
    }
    return ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-cream via-pastel-blush to-pastel-lavender relative overflow-hidden">
      
      {/* Subtle paper texture */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:25px_25px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16 relative"
        >
          <motion.h1 
            className="font-marcellus text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-800 mb-6 sm:mb-8"
            animate={{
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Get In Touch
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-600 font-inter font-light italic max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Have a project in mind? Want to discuss strategy, creative campaigns, or data-driven solutions? I'd love to hear from you.
          </motion.p>

          {/* Squiggly border accent */}
          <motion.svg
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-24 sm:w-32 h-4 text-pastel-lavender"
            viewBox="0 0 128 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M4 8 Q32 4, 64 8 T124 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 backdrop-blur-xl border border-white/40 shadow-xl relative"
        >
          {/* Form header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-marcellus text-xl sm:text-2xl md:text-3xl text-gray-800 mb-2">
              Send a Message
            </h2>
            <p className="text-gray-600 font-inter text-sm sm:text-base">
              I typically respond within 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Your Name
                </label>
                <motion.input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  whileFocus={{ scale: 1.02 }}
                  className="w-full px-4 py-3 sm:py-4 rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-pastel-lavender bg-white/60 backdrop-blur-sm font-inter transition-all duration-300 text-sm sm:text-base"
                  placeholder="Your full name"
                  style={{ minHeight: '44px' }}
                />
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: focusedField === 'name' ? 1 : 0, y: 0 }}
                  className="absolute -bottom-5 left-0 text-xs text-gray-500 font-inter italic bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/60"
                >
                  {getFieldLabel('name')}
                </motion.p>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Email Address
                </label>
                <motion.input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  whileFocus={{ scale: 1.02 }}
                  className="w-full px-4 py-3 sm:py-4 rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-pastel-lavender bg-white/60 backdrop-blur-sm font-inter transition-all duration-300 text-sm sm:text-base"
                  placeholder="your@email.com"
                  style={{ minHeight: '44px' }}
                />
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: focusedField === 'email' ? 1 : 0, y: 0 }}
                  className="absolute -bottom-5 left-0 text-xs text-gray-500 font-inter italic bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/60"
                >
                  {getFieldLabel('email')}
                </motion.p>
              </div>
            </div>
            
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                What's this about?
              </label>
              <motion.select
                value={formData.mood}
                onChange={(e) => handleInputChange('mood', e.target.value)}
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-3 sm:py-4 rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-pastel-lavender bg-white/60 backdrop-blur-sm font-inter transition-all duration-300 text-sm sm:text-base"
                style={{ minHeight: '44px' }}
              >
                <option value="">Select a topic...</option>
                <option value="professional">Professional Opportunity</option>
                <option value="collaboration">Project Collaboration</option>
                <option value="consulting">Strategy Consulting</option>
                <option value="feedback">Portfolio Feedback</option>
                <option value="networking">Networking & Connection</option>
                <option value="other">Something Else</option>
              </motion.select>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Your Message
              </label>
              <motion.textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField('')}
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-3 sm:py-4 rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-pastel-lavender bg-white/60 backdrop-blur-sm resize-none font-inter transition-all duration-300 text-sm sm:text-base"
                placeholder="Tell me about your project, idea, or how I can help..."
              />
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: focusedField === 'message' ? 1 : 0, y: 0 }}
                className="absolute -bottom-5 left-0 text-xs text-gray-500 font-inter italic bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/60"
              >
                {getFieldLabel('message')}
              </motion.p>
            </div>
            
            <div className="mt-8">
              <motion.button
                type="submit"
                disabled={isSubmitted || isSubmitting}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-pastel-lavender to-pastel-blush text-gray-800 py-4 rounded-xl font-medium hover:shadow-xl transition-all flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                animate={!isSubmitting ? {
                  boxShadow: [
                    "0 4px 15px rgba(230, 230, 250, 0.3)",
                    "0 8px 25px rgba(230, 230, 250, 0.5)",
                    "0 4px 15px rgba(230, 230, 250, 0.3)"
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ minHeight: '44px' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    <span>Sending...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="glassmorphism rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/40 shadow-lg relative">
            
            {/* Torn paper effect */}
            <div className="absolute -top-2 -left-2 w-4 sm:w-6 h-4 sm:h-6 bg-yellow-200/80 rounded-sm rotate-12 shadow-sm"></div>
            <div className="absolute -top-1 -right-2 sm:-right-3 w-3 sm:w-4 h-3 sm:h-4 bg-pink-200/80 rounded-sm -rotate-12 shadow-sm"></div>
            
            <p className="text-gray-600 mb-6 font-inter text-base sm:text-lg leading-relaxed px-2">
              Ready to turn ideas into impact? Let's create something meaningful together.
            </p>
            
            <div className="flex justify-center space-x-4 sm:space-x-6 mb-6">
              <motion.a
                href="mailto:bhanr480@newschool.edu"
                whileHover={{ scale: 1.1, y: -3 }}
                className="glassmorphism rounded-full p-3 sm:p-4 hover:shadow-xl transition-all group backdrop-blur-xl border border-white/40"
                aria-label="Send email to bhanr480@newschool.edu"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Mail size={20} className="text-gray-600 group-hover:text-pastel-lavender transition-colors sm:w-6 sm:h-6" />
              </motion.a>
              
              <motion.a
                href="https://www.linkedin.com/in/rishi-bhanushali-838713230/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                className="glassmorphism rounded-full p-3 sm:p-4 hover:shadow-xl transition-all group backdrop-blur-xl border border-white/40"
                aria-label="Connect on LinkedIn"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Linkedin size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors sm:w-6 sm:h-6" />
              </motion.a>
            </div>
            
            <div className="text-gray-500 font-inter text-sm">
              <p>Based in NYC | Open to opportunities</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glassmorphism rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full backdrop-blur-xl border border-white/50 shadow-2xl relative"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close modal"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X size={18} className="text-gray-600" />
              </button>
              
              <div className="text-center">
                <motion.div
                  className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: 2
                  }}
                >
                  <CheckCircle size={24} className="text-green-600 sm:w-8 sm:h-8" />
                </motion.div>
                
                <h3 className="font-marcellus text-xl sm:text-2xl text-gray-900 mb-4">
                  Message Received!
                </h3>
                
                <p className="text-gray-700 font-inter leading-relaxed mb-6 text-sm sm:text-base px-2">
                  Thank you for reaching out. I've received your message and will get back to you within 24 hours.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    onClick={() => setShowSuccessModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-pastel-lavender to-pastel-blush text-gray-800 px-4 sm:px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                    style={{ minHeight: '44px' }}
                  >
                    Continue Exploring
                  </motion.button>
                  
                  <motion.a
                    href="/projects"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/80 text-gray-800 px-4 sm:px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    style={{ minHeight: '44px' }}
                  >
                    View My Work
                    <ArrowRight size={14} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}