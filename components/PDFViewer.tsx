// components/PDFViewer.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'

interface PDFViewerProps {
  pdfUrl: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export default function PDFViewer({ pdfUrl, title, isOpen, onClose }: PDFViewerProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                <ExternalLink size={14} />
                Open in New Tab
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

          {/* PDF Viewer */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={`${title} - PDF Viewer`}
              allow="fullscreen"
              style={{ background: '#f5f5f5' }}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              This document is hosted securely on Google Drive and cannot be downloaded
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}