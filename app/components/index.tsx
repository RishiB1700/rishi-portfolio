'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Download, Mail, ArrowRight } from 'lucide-react'

// ====== NAVBAR COMPONENT ======
export function Navbar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Ad Archive', href: '/archive' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glassmorphism rounded-full px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-marcellus text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
              Rishi
            </Link>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all hover:text-purple-600 hover:scale-105 ${
                    pathname === item.href ? 'text-purple-600 font-semibold' : 'text-gray-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="md:hidden">
              <button className="text-gray-600 hover:text-purple-600 transition-colors">
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

// ====== TYPEWRITER COMPONENT ======
interface TypeWriterProps {
  text: string
  delay?: number
  className?: string
}

export function TypeWriter({ text, delay = 100, className = '' }: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  return <span className={className}>{displayText}</span>
}

// ====== PORTAL TILE COMPONENT ======
interface PortalTileProps {
  emoji: string
  label: string
  href: string
  description: string
  index: number
}

export function PortalTile({ emoji, label, href, description, index }: PortalTileProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ 
          delay: index * 0.2,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{ 
          scale: 1.08,
          y: -12,
          rotateX: 5,
          rotateY: 5
        }}
        whileTap={{ scale: 0.95 }}
        className="relative group cursor-pointer perspective-1000"
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 opacity-0 group-hover:opacity-100 blur-xl"
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Main tile */}
        <div className="relative glassmorphism rounded-3xl p-8 md:p-10 min-h-[180px] flex flex-col items-center justify-center text-center backdrop-blur-xl border border-white/30 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform-gpu">
          
          {/* Floating emoji */}
          <motion.div
            className="text-5xl md:text-6xl mb-4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ 
              scale: 1.2,
              rotate: [0, -15, 15, 0],
              transition: { duration: 0.6 }
            }}
          >
            {emoji}
          </motion.div>
          
          {/* Label */}
          <h3 className="font-marcellus text-xl md:text-2xl text-gray-800 mb-3 font-bold">
            {label}
          </h3>
          
          {/* Description */}
          <p className="text-sm md:text-base text-gray-600 font-inter opacity-80 group-hover:opacity-100 transition-opacity leading-relaxed">
            {description}
          </p>
          
          {/* Magic sparkle effect */}
          <motion.div
            className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}

// ====== MANIFESTO SECTION COMPONENT ======
interface ManifestoSectionProps {
  title: string
  content: string
  icon: string
  index: number
}

export function ManifestoSection({ title, content, icon, index }: ManifestoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      viewport={{ once: true }}
      className="relative mb-16"
    >
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: index * 0.2 + 0.3 }}
        className="absolute -left-8 top-8 w-4 h-4 bg-gradient-to-r from-pastel-lavender to-pastel-blush rounded-full shadow-lg z-10"
      />
      
      {/* Content card */}
      <div className="glassmorphism rounded-3xl p-8 md:p-10 ml-8 group hover:shadow-xl transition-all duration-500">
        <div className="flex items-start space-x-6">
          <motion.div
            className="text-4xl md:text-5xl"
            whileHover={{ 
              rotate: [0, -10, 10, 0],
              scale: 1.1
            }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-marcellus text-2xl md:text-3xl text-gray-800 mb-4 group-hover:text-purple-700 transition-colors">
              {title}
            </h3>
            <p className="text-gray-700 leading-relaxed font-inter text-lg">
              {content}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ====== INSIGHT TILE COMPONENT ======
interface InsightTileProps {
  project: {
    id: number
    title: string
    subtitle: string
    category: string
    icon: string
    color: string
  }
  onClick: () => void
  index: number
}

export function InsightTile({ project, onClick, index }: InsightTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -15,
        rotateX: 10,
        rotateY: 5,
        scale: 1.02
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative cursor-pointer group transform-gpu"
      style={{
        transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`
      }}
    >
      {/* Magical aura */}
      <motion.div
        className={`absolute -inset-4 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-30 blur-2xl rounded-3xl`}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Main tile */}
      <div className="relative glassmorphism rounded-3xl p-8 backdrop-blur-xl border border-white/30 shadow-xl group-hover:shadow-2xl transition-all duration-500 min-h-[220px] flex flex-col">
        
        {/* Category badge */}
        <div className="absolute -top-3 -right-3">
          <span className={`inline-block px-4 py-2 bg-gradient-to-r ${project.color} rounded-full text-sm font-semibold shadow-lg`}>
            {project.category}
          </span>
        </div>

        {/* Icon */}
        <motion.div
          className="text-6xl mb-6 text-center"
          whileHover={{ 
            scale: 1.2,
            rotate: [0, -10, 10, 0]
          }}
          transition={{ duration: 0.6 }}
        >
          {project.icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center text-center">
          <h3 className="font-marcellus text-xl md:text-2xl text-gray-800 mb-3 group-hover:text-purple-700 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-600 text-sm md:text-base leading-relaxed font-inter">
            {project.subtitle}
          </p>
        </div>

        {/* Hover hint */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ x: 3 }}
        >
          <span className="text-xs text-purple-600 font-semibold">Explore →</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ====== SCRIBBLE CARD COMPONENT ======
interface ScribbleCardProps {
  post: {
    id: number
    title: string
    excerpt: string
    date: string
    tags: string[]
    mood: string
    readTime?: string
  }
  index: number
}

export function ScribbleCard({ post, index }: ScribbleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glassmorphism rounded-3xl p-8 hover:shadow-xl transition-all duration-500 cursor-pointer group"
    >
      <div className="flex items-start space-x-6">
        <motion.div 
          className="text-5xl"
          whileHover={{ rotate: [0, -15, 15, 0] }}
          transition={{ duration: 0.5 }}
        >
          {post.mood}
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-gray-500 font-mono">{post.date}</span>
            {post.readTime && (
              <span className="text-xs text-gray-400 font-mono">{post.readTime}</span>
            )}
            <div className="flex space-x-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gradient-to-r from-pastel-lavender/50 to-pastel-blush/50 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <h2 className="font-marcellus text-2xl md:text-3xl text-gray-800 mb-4 group-hover:text-purple-700 transition-colors leading-tight">
            {post.title}
          </h2>
          
          <p className="text-gray-600 leading-relaxed font-inter">
            {post.excerpt}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

// ====== RETRO PICK COMPONENT ======
interface RetroPickProps {
  ad: {
    id: number
    title: string
    brand: string
    year: string
    mood: string
    vibe: string
  }
  onClick: () => void
  index: number
}

export function RetroPick({ ad, onClick, index }: RetroPickProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateZ: 10 }}
      animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 120
      }}
      whileHover={{ 
        scale: 1.05,
        rotateZ: -2,
        y: -10
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Retro glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 to-pink-200/40 opacity-0 group-hover:opacity-100 blur-xl rounded-2xl"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ticket-style card */}
      <div className="relative glassmorphism rounded-2xl p-6 backdrop-blur-xl border-2 border-dashed border-white/40 group-hover:border-white/60 transition-all duration-300 transform rotate-1 group-hover:rotate-0">
        
        {/* Corner punch holes */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/30 rounded-full"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/30 rounded-full"></div>
        
        {/* Content */}
        <div className="text-center">
          <div className="text-4xl mb-3">{ad.mood}</div>
          <div className="text-xs text-gray-500 mb-2 font-mono">{ad.brand} • {ad.year}</div>
          <h3 className="font-marcellus text-lg text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
            {ad.title}
          </h3>
          <div className="text-xs text-gray-600 italic">{ad.vibe}</div>
        </div>
        
        {/* Vintage stamp */}
        <div className="absolute bottom-2 right-2 text-xs text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity">
          ★ PICK
        </div>
      </div>
    </motion.div>
  )
}

// ====== MODAL COMPONENT ======
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glassmorphism rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl border border-white/30 shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors z-10 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <div className="p-8">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}