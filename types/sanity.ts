export interface SanityPost {
    _id: string
    title: string
    slug: {
      current: string
    }
    publishedAt: string
    tags: string[]
    mood: string
    hook: string
    mainImage: string
    categories: string[]
    body: any[] // PortableText blocks
    readTime: string
    author: string
  }
  
  export interface SanityCampaign {
    _id: string
    campaignName: string
    brand: string
    agency: string
    year: number
    mediaType: string
    badges: string[]
    visual: string
    personalInsight: string
    fullInsight: string
    tags: string[]
    videoUrl?: string
    size: 'small' | 'medium' | 'large'
  }
  
  export interface PortableTextBlock {
    _key: string
    _type: string
    children: Array<{
      _key: string
      _type: string
      marks: string[]
      text: string
    }>
    markDefs: Array<{
      _key: string
      _type: string
      href?: string
    }>
    style: string
  }