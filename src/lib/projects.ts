import projectsData from '../../data/projects.json'

export interface Project {
  id: number
  title: string
  subtitle?: string
  insight: string
  year: string
  category: string
  categoryTags: string[]
  tags: string[]
  projectType?: 'caseStudy' | 'creative' | 'shortfilm' | 'research'
  
  // Case Study fields
  challenge?: string
  strategy?: string
  process?: string[]
  results?: Array<{
    metric: string
    value: string
    description: string
  }>
  learnings?: string
  
  // Creative fields
  synopsis?: string
  role?: string
  toolsUsed?: string[]
  designRationale?: string
  
  // Short Film fields
  duration?: string
  embedVideo?: string
  festivals?: string[]
  behindTheScenes?: string
  
  // Research fields
  researchFocus?: string
  methodology?: string
  keyFindings?: string
  implications?: string
  
  // Common fields
  previewImage?: string
  heroImage: string
  heroType: 'image' | 'video'
  liveLink?: string
  pdfLink?: string
  assetLink?: string
  assetsDownload?: string
}

export function getAllProjects(): Project[] {
  return projectsData as Project[]
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'All') return projectsData as Project[]
  return projectsData.filter(project => 
    project.categoryTags.includes(category) || project.category === category
  ) as Project[]
}
