// components/enhancedblob.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BlobConfig {
  size: number
  x: number
  y: number
  color: string
  duration: number
  morphing: 'subtle' | 'medium' | 'intense'
  mouseInfluence?: boolean
}

interface PageConfig {
  blobs: BlobConfig[]
  particles: number
}

interface EnhancedBlobSystemProps {
  page?: 'home' | 'about' | 'projects' | 'blog' | 'archive' | 'contact'
  intensity?: 'low' | 'medium' | 'high'
}

const OrganicBlob: React.FC<{
  size: number
  initialX: number
  initialY: number
  color: string
  animationDuration: number
  mouseInfluence?: boolean
  morphingIntensity: 'subtle' | 'medium' | 'intense'
  zIndex: number
}> = ({ size, initialX, initialY, color, animationDuration, mouseInfluence = false, morphingIntensity, zIndex }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (!mouseInfluence) return
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseInfluence])

  const getMorphingPath = (intensity: 'subtle' | 'medium' | 'intense') => {
    const paths = {
      subtle: [
        "M100,200 C150,100 250,150 300,200 C250,300 150,250 100,200",
        "M120,180 C170,120 230,170 280,220 C230,280 170,230 120,180",
        "M110,210 C160,110 240,160 290,210 C240,290 160,240 110,210"
      ],
      medium: [
        "M100,200 C150,80 280,120 320,200 C280,320 150,280 100,200",
        "M80,220 C180,100 300,140 340,220 C300,340 180,300 80,220",
        "M120,180 C170,90 290,130 330,200 C290,310 170,270 120,180"
      ],
      intense: [
        "M100,200 C200,50 350,100 400,200 C350,350 200,300 100,200",
        "M60,240 C220,80 380,120 420,240 C380,400 220,360 60,240",
        "M140,160 C180,70 320,110 380,180 C320,330 180,290 140,160"
      ]
    }
    return paths[intensity]
  }

  const morphPaths = getMorphingPath(morphingIntensity)

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        zIndex
      }}
      animate={{
        x: mouseInfluence ? 
          [(mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth/2 : 0)) * 0.02, 0] : 
          [0, 30, -20, 0],
        y: mouseInfluence ? 
          [(mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight/2 : 0)) * 0.02, 0] : 
          [0, -40, 25, 0],
        scale: [1, 1.1, 0.9, 1],
        rotate: [0, 5, -3, 0]
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        style={{
          transform: 'translate(-50%, -50%)',
          filter: 'blur(1px)',
          opacity: 0.7
        }}
      >
        <defs>
          <linearGradient id={`blobGradient-${initialX}-${initialY}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor={color.replace(/[\d.]+\)$/, '0.25)')} />
            <stop offset="100%" stopColor={color.replace(/[\d.]+\)$/, '0.1)')} />
          </linearGradient>
        </defs>
        <motion.path
          fill={`url(#blobGradient-${initialX}-${initialY})`}
          animate={{ d: morphPaths }}
          transition={{
            duration: animationDuration * 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  )
}

const FloatingParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{
        backgroundColor: color,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, 30, -20, 0],
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{
        duration: Math.random() * 10 + 15,
        repeat: Infinity,
        delay: delay,
        ease: "easeOut"
      }}
    />
  )
}

export const EnhancedBlobSystem: React.FC<EnhancedBlobSystemProps> = ({ 
  page = 'home', 
  intensity = 'medium' 
}) => {
  const pageConfigs: Record<string, PageConfig> = {
    home: {
      blobs: [
        { size: 400, x: 10, y: 15, color: 'rgba(230, 230, 250, 0.12)', duration: 25, morphing: 'medium' },
        { size: 350, x: 85, y: 25, color: 'rgba(255, 228, 225, 0.15)', duration: 30, morphing: 'subtle' },
        { size: 300, x: 20, y: 70, color: 'rgba(245, 245, 220, 0.1)', duration: 35, morphing: 'medium' },
        { size: 450, x: 70, y: 80, color: 'rgba(201, 212, 197, 0.08)', duration: 28, morphing: 'intense' },
        { size: 250, x: 50, y: 45, color: 'rgba(155, 181, 214, 0.1)', duration: 22, morphing: 'subtle', mouseInfluence: true }
      ],
      particles: 12
    },
    about: {
      blobs: [
        { size: 350, x: 15, y: 20, color: 'rgba(230, 230, 250, 0.1)', duration: 32, morphing: 'subtle' },
        { size: 300, x: 80, y: 60, color: 'rgba(255, 228, 225, 0.12)', duration: 28, morphing: 'medium' },
        { size: 280, x: 25, y: 75, color: 'rgba(201, 212, 197, 0.08)', duration: 25, morphing: 'subtle' },
        { size: 200, x: 60, y: 30, color: 'rgba(155, 181, 214, 0.06)', duration: 30, morphing: 'medium', mouseInfluence: true }
      ],
      particles: 8
    },
    projects: {
      blobs: [
        { size: 380, x: 5, y: 10, color: 'rgba(236, 72, 153, 0.08)', duration: 30, morphing: 'medium' },
        { size: 320, x: 75, y: 30, color: 'rgba(59, 130, 246, 0.1)', duration: 35, morphing: 'intense' },
        { size: 280, x: 40, y: 85, color: 'rgba(147, 51, 234, 0.06)', duration: 25, morphing: 'subtle' },
        { size: 250, x: 15, y: 60, color: 'rgba(251, 113, 133, 0.08)', duration: 28, morphing: 'medium' }
      ],
      particles: 15
    },
    blog: {
      blobs: [
        { size: 300, x: 20, y: 25, color: 'rgba(251, 146, 60, 0.1)', duration: 28, morphing: 'subtle' },
        { size: 250, x: 70, y: 15, color: 'rgba(245, 158, 11, 0.08)', duration: 32, morphing: 'medium' },
        { size: 200, x: 10, y: 80, color: 'rgba(217, 119, 8, 0.06)', duration: 26, morphing: 'subtle' },
        { size: 180, x: 85, y: 70, color: 'rgba(255, 228, 225, 0.09)', duration: 24, morphing: 'medium' }
      ],
      particles: 6
    },
    archive: {
      blobs: [
        { size: 350, x: 12, y: 18, color: 'rgba(236, 72, 153, 0.08)', duration: 26, morphing: 'subtle' },
        { size: 280, x: 78, y: 45, color: 'rgba(59, 130, 246, 0.09)', duration: 32, morphing: 'medium' },
        { size: 200, x: 35, y: 80, color: 'rgba(245, 158, 11, 0.07)', duration: 28, morphing: 'subtle' }
      ],
      particles: 10
    },
    contact: {
      blobs: [
        { size: 350, x: 25, y: 30, color: 'rgba(230, 230, 250, 0.15)', duration: 30, morphing: 'medium' },
        { size: 280, x: 65, y: 70, color: 'rgba(255, 228, 225, 0.12)', duration: 25, morphing: 'subtle' },
        { size: 220, x: 10, y: 15, color: 'rgba(245, 245, 220, 0.1)', duration: 35, morphing: 'medium', mouseInfluence: true }
      ],
      particles: 10
    }
  }

  const config = pageConfigs[page] || pageConfigs.home

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Base gradient - keeps your existing pastel system */}
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-cream via-pastel-blush to-pastel-lavender opacity-60" />
      
      {/* Organic blobs */}
      {config.blobs.map((blob, index) => (
        <OrganicBlob
          key={`blob-${index}`}
          size={blob.size}
          initialX={blob.x}
          initialY={blob.y}
          color={blob.color}
          animationDuration={blob.duration}
          morphingIntensity={blob.morphing}
          mouseInfluence={blob.mouseInfluence}
          zIndex={index + 1}
        />
      ))}
      
      {/* Floating particles */}
      {[...Array(config.particles)].map((_, i) => (
        <FloatingParticle 
          key={`particle-${i}`}
          delay={i * 0.5}
          color={i % 3 === 0 ? 'rgba(230, 230, 250, 0.6)' : 
                i % 3 === 1 ? 'rgba(255, 228, 225, 0.5)' : 
                'rgba(245, 245, 220, 0.4)'}
        />
      ))}
      
      {/* Subtle mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(230, 230, 250, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 228, 225, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(201, 212, 197, 0.2) 0%, transparent 50%)
          `
        }}
      />
    </div>
  )
}