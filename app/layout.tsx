import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from './components'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rishi Bhanushali - Strategist & Storyteller',
  description: 'Where strategy meets story, and campaigns meet meaning. Portfolio of Rishi Bhanushali - Media strategist, storyteller, and ad nerd.',
  keywords: ['strategy', 'storytelling', 'advertising', 'media', 'creative', 'campaigns'],
  authors: [{ name: 'Rishi Bhanushali' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E6E6FA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}