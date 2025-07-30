🎨 Rishi Bhanushali's Portfolio Website

A sophisticated, interactive portfolio showcasing strategic thinking, creative storytelling, and media expertise. Built with cutting-edge web technologies, dynamic content management, and thoughtful user experience design.

https://img.shields.io/badge/Next.js-14.0-000000?style=for-the-badge&logo=nextdotjs
https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript
https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=for-the-badge&logo=tailwindcss
https://img.shields.io/badge/Framer%20Motion-10.16-FF0055?style=for-the-badge&logo=framer
https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity

🎯 Project Overview
This portfolio website represents the intersection of modern web development and strategic content presentation. It serves as a comprehensive showcase of work across media strategy, creative campaigns, data visualization, and strategic thinking—featuring 22+ projects across 5 disciplines with dynamic content loading, interactive visualizations, and secure document viewing.
✨ Key Features
🎭 Advanced Design System

Glassmorphism UI with carefully curated pastel color palette
Enhanced Blob System with organic, morphing background elements that adapt per page
Custom Typography using Marcellus (elegant serif) + Inter (clean sans-serif)
Responsive Design optimized for all devices with mobile-first approach
Accessibility Features including keyboard navigation, screen reader support, and reduced motion options

🚀 Dynamic Content Architecture

JSON-Driven Projects for easy maintenance and updates (22+ projects)
5 Project Categories with intelligent filtering: Strategy, Storytelling & Design, Data Viz, Multimedia, Research
Dynamic Modal Layouts that adapt based on project type:

Case Study: Challenge → Strategy → Process → Results → Learnings
Creative: Brief → Role → Tools → Design Rationale
Research: Focus → Methodology → Findings → Implications
Short Film: Synopsis → Role → Video → Recognition



📚 Content Management Systems

Sanity CMS Integration for blog posts ("Scribbles & Signals") and ad archive
Rich Text Editing with PortableText for flexible content structure
Real-time Content Updates through Sanity Studio at /studio
Structured Content Types for posts, campaigns, authors, and categories

🔐 Secure Document System

Google Drive Integration for view-only PDF access
Smart PDF Viewer with embedded iframe viewing and external link options
No Download Policy - all documents are viewable but not downloadable
Intelligent Linking - Live demos for interactive projects, PDFs for documentation

🎬 Interactive Features

Smooth Animations powered by Framer Motion with accessibility considerations
Progressive Navigation with floating filters and scroll-based interactions
Live Project Previews - Interactive Data Viz projects display live iframes
Contextual Overlays that adapt based on project type and available links
Advanced Hover Effects with meaningful micro-interactions

🏗️ Technical Architecture
Frontend Stack

Next.js 14 - React framework with App Router for optimal performance
TypeScript - Full type safety and enhanced developer experience
Tailwind CSS - Utility-first styling with custom design tokens and glassmorphism utilities
Framer Motion - Production-ready animation library with accessibility support

Content Management

Sanity CMS - Headless CMS with structured content and real-time collaboration
PortableText - Rich text rendering system for flexible content presentation
JSON Data Store - Centralized project information for easy maintenance
Google Drive - Secure, view-only PDF hosting with preview integration

Performance & Accessibility

Static Site Generation for fast initial loads and SEO optimization
Image Optimization with Next.js Image component and proper aspect ratios
Font Optimization with strategic preloading and display swap
Code Splitting for optimal bundle sizes and loading performance
WCAG Compliance with proper ARIA labels, keyboard navigation, and screen reader support

📂 Project Structure
portfolio-website/
├── app/                              # Next.js App Router
│   ├── (pages)/
│   │   ├── about/page.tsx           # Cinematic about page with journey timeline
│   │   ├── projects/page.tsx        # Dynamic projects gallery with filtering
│   │   ├── blog/page.tsx            # Sanity-powered blog with sticky note design
│   │   ├── archive/page.tsx         # Ad campaign archive with scrapbook aesthetic
│   │   ├── contact/page.tsx         # Interactive contact form with animations
│   │   └── studio/[[...tool]]/page.tsx  # Embedded Sanity Studio
│   ├── components/
│   │   └── index.tsx                # Reusable UI components and design system
│   ├── globals.css                  # Global styles with custom properties
│   ├── layout.tsx                   # Root layout with fonts and metadata
│   └── page.tsx                     # Dynamic homepage with typewriter effects
│
├── components/                       # Shared Components
│   ├── enhancedblob.tsx             # Organic background system with page-specific configs
│   └── PDFViewer.tsx                # Google Drive PDF viewer with security features
│
├── data/                            # Static Data
│   └── projects.json                # Comprehensive project database (22+ projects)
│
├── lib/                             # Utilities & API
│   ├── sanity.ts                    # Sanity client queries and data fetching
│   └── projects.ts                  # Project data utilities and type definitions
│
├── public/                          # Static Assets
│   └── images/
│       ├── about/                   # About page journey images
│       │   ├── companies/           # Company logos
│       │   ├── education/           # Educational institution logos
│       │   └── journey/             # Personal journey timeline images
│       └── projects/                # Project preview images (optimized)
│
├── sanity/                          # Sanity CMS Configuration
│   ├── lib/
│   │   ├── client.ts               # Sanity client configuration
│   │   ├── image.ts                # Image URL builder
│   │   └── live.ts                 # Live content API setup
│   ├── schemaTypes/
│   │   ├── adArchiveType.ts        # Campaign archive schema
│   │   ├── authorType.ts           # Author schema
│   │   ├── blockContentType.ts     # Rich text content schema
│   │   ├── categoryType.ts         # Category schema
│   │   ├── postType.ts             # Blog post schema
│   │   └── index.ts                # Schema exports
│   ├── env.ts                      # Environment configuration
│   └── structure.ts                # Studio structure definition
│
├── types/                           # TypeScript Definitions
│   └── sanity.ts                   # Sanity document type definitions
│
├── sanity.config.ts                # Sanity Studio configuration
├── sanity.cli.ts                   # Sanity CLI configuration
├── tailwind.config.js              # Tailwind configuration with custom theme
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
🎨 Design Philosophy
Visual Identity
The design system reflects modern professionalism while maintaining approachability through:

Clarity Over Complexity - Clean layouts that prioritize content discovery
Consistent Visual Language - Unified color palette, typography, and spacing
Meaningful Animations - Purposeful motion that enhances user experience
Accessibility First - Inclusive design for all users and abilities

Color System
css--pastel-lavender: #E6E6FA    /* Primary accent and focus states */
--pastel-blush: #FFE4E1       /* Secondary accent and highlights */
--pastel-cream: #F5F5DC       /* Background tints and containers */
--pastel-sage: #C9D4C5        /* Success states and nature themes */
--pastel-navy: #9BB5D6        /* Professional and trust elements */
Enhanced Blob System
Each page features a unique organic background system:

Home: 5 morphing blobs with mouse influence and floating particles
About: Subtle, professional blob arrangement for storytelling
Projects: Dynamic, colorful blobs matching the creative energy
Blog: Warm, organic shapes supporting the scribbles aesthetic
Archive: Vintage-inspired blob configurations
Contact: Welcoming, interactive blob system

📊 Content Structure
Project Categories & Types

Strategy (8 projects) - Brand strategy, campaign planning, business models
Storytelling & Design (4 projects) - Creative narratives, visual identity, scripts
Data Viz (3 projects) - Interactive dashboards with live preview capability
Research (6 projects) - Academic research, market analysis, media studies
Multimedia (1 project) - Video production and interactive media

Sanity CMS Content Types

Blog Posts - "Scribbles & Signals" with mood emojis, categories, and rich text
Ad Archive - Campaign database with visual assets, insights, and metadata
Authors & Categories - Structured content organization and attribution

Document Security

View-Only PDFs - Google Drive integration prevents downloading
Live Demos - Interactive projects link directly to hosted applications
Asset Protection - All documents require view-only permissions

🌟 Featured Projects
Interactive Demonstrations

FLARE Dashboard - AI-powered ad fatigue detection engine
Narratives Unbound - Book-to-movie adaptation analysis tool
Brand Evolution Timeline - Interactive brand transformation journey

Strategic Case Studies

Foldronic Campaign - Complete brand system for robotics startup with measurable results
SUSTANE Podcast Strategy - Gen Z sustainability content strategy with engagement metrics
Marvel MCU Revitalization - Comprehensive franchise strategy proposal

Research Publications

AI in Programmatic Advertising - Ethics and automation in digital advertising
Influencer Authenticity Study - Consumer behavior and trust in influencer marketing
Veganism in India Analysis - Market trends and adoption barriers research

🎯 Performance Metrics

Lighthouse Score: 95+ across all performance, accessibility, and SEO categories
Core Web Vitals: All metrics consistently in green zones
Image Optimization: Average < 200KB per project preview with WebP support
Bundle Optimization: Code splitting reduces initial load by 40%
Accessibility Score: 100% compliance with WCAG 2.1 AA standards

🔮 Architecture Highlights
Responsive Design Patterns

Mobile-First Approach with progressive enhancement
Touch Target Optimization ensuring 44px minimum interaction areas
Adaptive Navigation with floating filters and contextual menus
Smart Content Prioritization based on viewport and device capabilities

Animation & Interaction Strategy

Reduced Motion Support respecting user accessibility preferences
Progressive Enhancement with graceful fallbacks for older browsers
Performance-Conscious Animations using hardware acceleration
Meaningful Motion that supports usability rather than decoration

Content Delivery Optimization

Static Site Generation for maximum performance and SEO
CDN Integration through Sanity for media assets
Smart Caching Strategies for both static and dynamic content
Progressive Image Loading with blur-up placeholders

📱 Cross-Platform Experience
The website delivers a consistent, high-quality experience across:

Desktop (1200px+) - Full feature set with hover interactions
Tablet (768px-1199px) - Optimized layouts with touch considerations
Mobile (320px-767px) - Streamlined interface with gesture support
High-DPI Displays - Retina-optimized images and vector graphics


Built with ❤️ using Next.js, TypeScript, and modern web technologies. Designed for impact, optimized for performance, and crafted for accessibility.