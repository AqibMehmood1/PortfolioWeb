export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  filterCategory: 'all' | 'saas' | 'dotnet' | 'web' | 'health';
  image: string;
  gif: string;
  description: string;
  problem: string;
  architecture: string;
  tech: string[];
  liveUrl: string;
  highlights: string[];
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  engagementTopic: string;
}

export interface ExperienceItem {
  title: string;
  period: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
}

export interface EducationItem {
  degree: string;
  period: string;
  institution: string;
  description: string;
}

export interface CertificationItem {
  title: string;
  level: string;
  issuer: string;
  description: string;
}

export interface AccordionService {
  index: string;
  title: string;
  shortDesc: string;
  bullets: string[];
  image: string;
  route: string;
}

export interface IndustryItem {
  title: string;
  icon: string;
  desc: string;
  project: string;
  metric: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  tag: string;
}
