import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';

export type StackCategory = 'ai' | 'frontend' | 'backend' | 'lownocode' | 'database' | 'devops' | 'mobile';

export interface TechTile {
  name: string;
  category: StackCategory;
  icon: string;
  color: string;
}

export interface ArchitectureDomain {
  id: number;
  title: string;
  category: string;
  icon: string;
  iconColor: string;
  desc: string;
  chips: string[];
}

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.css'
})
export class ExpertiseComponent {
  activeTrackTab: 'experience' | 'education' | 'certifications' = 'experience';
  activeDomainIndex: number = 0;

  readonly architectureDomains: ArchitectureDomain[] = [
    {
      id: 1,
      title: 'Cloud & Distributed Systems',
      category: 'Cloud',
      icon: 'fas fa-cloud',
      iconColor: '#0089d6',
      desc: 'Architecting resilient multi-region architectures, microservices, containerization, and zero-downtime deployment pipelines.',
      chips: ['Microsoft Azure', 'AWS Cloud', 'Kubernetes', 'Docker', 'Serverless', 'Microservices', 'API Gateway']
    },
    {
      id: 2,
      title: 'AI Agents & GenAI Engineering',
      category: 'AI & GenAI',
      icon: 'fas fa-robot',
      iconColor: '#10b981',
      desc: 'Integrating autonomous reasoning agents, retrieval-augmented generation (RAG), and enterprise LLM workflow automations.',
      chips: ['AI Agents', 'LangChain', 'Semantic Kernel', 'RAG Pipelines', 'OpenAI / Claude', 'Pinecone Vector DB']
    },
    {
      id: 3,
      title: 'Enterprise .NET & Backend',
      category: '.NET Core',
      icon: 'fas fa-bolt',
      iconColor: '#512bd4',
      desc: 'High-throughput backend architectures using modern C#, ASP.NET WebAPI, asynchronous event buses, and domain-driven design.',
      chips: ['.NET 9 / .NET Core', 'C# (Async/Await)', 'ASP.NET WebAPI', 'Entity Framework Core', 'Clean Architecture']
    },
    {
      id: 4,
      title: 'Modern Frontend & Web Systems',
      category: 'Frontend',
      icon: 'fas fa-laptop-code',
      iconColor: '#0ea5e9',
      desc: 'Building responsive, lightning-fast Single Page Applications and portals with strict type safety and rich user experience.',
      chips: ['Angular 17+', 'React', 'TypeScript', 'RxJS', 'Bootstrap 5', 'Responsive Web']
    },
    {
      id: 5,
      title: 'Data, Caching & Performance',
      category: 'Data',
      icon: 'fas fa-database',
      iconColor: '#cc292b',
      desc: 'Optimizing transactional databases, high-speed distributed cache layers, database indexing, and query execution plans.',
      chips: ['SQL Server', 'PostgreSQL', 'Redis Caching', 'MongoDB', 'Index Tuning']
    },
    {
      id: 6,
      title: 'Architecture Advisory & Governance',
      category: 'Leadership',
      icon: 'fas fa-user-shield',
      iconColor: '#f59e0b',
      desc: 'Guiding engineering teams with technical roadmaps, architectural reviews, agile sprint governance, and security audits.',
      chips: ['Fractional CTO', 'Scrum Leadership', 'Zero-Trust Security', 'Cost Optimization', 'System Audits']
    }
  ];

  processViewMode: 'lifecycle' | 'domains' = 'lifecycle';

  readonly lifecyclePhases: ArchitectureDomain[] = [
    {
      id: 1,
      title: 'Planning',
      category: 'Phase 01',
      icon: 'fas fa-lightbulb',
      iconColor: '#ef4444',
      desc: 'Our first step is to thoroughly research and organize your strengths and weaknesses. We start with understanding how you want to position your website and offer technical assistance.',
      chips: ['Discovery Workshop', 'Gap Analysis', 'Feasibility Review', 'Roadmap Blueprint']
    },
    {
      id: 2,
      title: 'Design',
      category: 'Phase 02',
      icon: 'fas fa-mobile-alt',
      iconColor: '#0284c7',
      desc: 'The next stage is where we start with designing the website, checking the sitemap, optimizing user experience, and making sure the website is responsive across all digital fronts.',
      chips: ['User Experience (UX)', 'Sitemap & Flows', 'Responsive UI', 'System Architecture']
    },
    {
      id: 3,
      title: 'Development',
      category: 'Phase 03',
      icon: 'fas fa-laptop-code',
      iconColor: '#10b981',
      desc: 'We create initial mockups of the web design from scratch. Our team ensures optimizing the design and adding content that is fully optimized to rank on different search engines.',
      chips: ['.NET 9 Web API', 'Angular SPAs', 'Docker CI/CD', 'SEO Optimization']
    },
    {
      id: 4,
      title: 'Deployment',
      category: 'Phase 04',
      icon: 'fas fa-rocket',
      iconColor: '#8b5cf6',
      desc: 'The launch phase is where (once the customer feels satisfied), we send the website live. We ensure the original design works smoothly and gain feedback on improvements.',
      chips: ['Zero-Downtime Release', 'Azure Telemetry', 'Production Handover', 'Feedback Loop']
    }
  ];

  get currentItems(): ArchitectureDomain[] {
    return this.processViewMode === 'lifecycle' ? this.lifecyclePhases : this.architectureDomains;
  }

  selectDomain(index: number): void {
    this.activeDomainIndex = index;
  }

  getStepCoords(index: number, total: number): { x: number; y: number } {
    if (total === 4) {
      const coords4 = [
        { x: 456, y: 75 },
        { x: 548, y: 232 },
        { x: 548, y: 428 },
        { x: 456, y: 585 }
      ];
      return coords4[index] || { x: 500, y: 300 };
    }
    const coords6 = [
      { x: 429, y: 122 },
      { x: 511, y: 215 },
      { x: 555, y: 331 },
      { x: 555, y: 449 },
      { x: 511, y: 565 },
      { x: 429, y: 658 }
    ];
    return coords6[index] || { x: 500, y: 300 };
  }

  getStepMarginLeft(index: number, total: number): string {
    return `${this.getStepCoords(index, total).x}px`;
  }

  // Tech Stacks Matrix State (Screenshot 5)
  activeStackCategory: StackCategory = 'ai';
  stackSearchQuery: string = '';

  readonly stackCategories: { key: StackCategory; label: string }[] = [
    { key: 'ai', label: 'AI & ML' },
    { key: 'frontend', label: 'Front-End' },
    { key: 'backend', label: 'Back-End' },
    { key: 'lownocode', label: 'Low/No Code' },
    { key: 'database', label: 'Database' },
    { key: 'devops', label: 'DevOps & Cloud' },
    { key: 'mobile', label: 'Mobile' }
  ];

  readonly techTiles: TechTile[] = [
    // AI & ML
    { name: 'LangChain', category: 'ai', icon: 'fas fa-link', color: '#10b981' },
    { name: 'Semantic Kernel', category: 'ai', icon: 'fas fa-brain', color: '#8b5cf6' },
    { name: 'OpenAI GPT-4o', category: 'ai', icon: 'fas fa-robot', color: '#10b981' },
    { name: 'Claude 3.5', category: 'ai', icon: 'fas fa-microchip', color: '#f59e0b' },
    { name: 'Pinecone Vector', category: 'ai', icon: 'fas fa-database', color: '#3b82f6' },
    { name: 'RAG Pipelines', category: 'ai', icon: 'fas fa-network-wired', color: '#6366f1' },

    // Front-End
    { name: 'Angular 17+', category: 'frontend', icon: 'fab fa-angular', color: '#dd0031' },
    { name: 'React.js', category: 'frontend', icon: 'fab fa-react', color: '#61dafb' },
    { name: 'TypeScript', category: 'frontend', icon: 'fab fa-js-square', color: '#3178c6' },
    { name: 'Vue.js', category: 'frontend', icon: 'fab fa-vuejs', color: '#42b883' },
    { name: 'Next.js', category: 'frontend', icon: 'fas fa-globe', color: '#000000' },
    { name: 'Tailwind & CSS', category: 'frontend', icon: 'fab fa-css3-alt', color: '#38bdf8' },

    // Back-End
    { name: '.NET 9 / C#', category: 'backend', icon: 'fab fa-windows', color: '#512bd4' },
    { name: 'ASP.NET Core', category: 'backend', icon: 'fas fa-server', color: '#512bd4' },
    { name: 'Node.js', category: 'backend', icon: 'fab fa-node-js', color: '#68a063' },
    { name: 'Python FastAPI', category: 'backend', icon: 'fab fa-python', color: '#3776ab' },
    { name: 'Entity Framework', category: 'backend', icon: 'fas fa-layer-group', color: '#68217a' },
    { name: 'Microservices', category: 'backend', icon: 'fas fa-cubes', color: '#0ea5e9' },

    // Low/No Code
    { name: 'Power Automate', category: 'lownocode', icon: 'fas fa-bolt', color: '#0066ff' },
    { name: 'Zapier Webhooks', category: 'lownocode', icon: 'fas fa-plug', color: '#ff4a00' },
    { name: 'Make.com', category: 'lownocode', icon: 'fas fa-diagram-project', color: '#6f2cf4' },
    { name: 'n8n Workflows', category: 'lownocode', icon: 'fas fa-code-branch', color: '#ea4b71' },
    { name: 'Retool Admin', category: 'lownocode', icon: 'fas fa-table-columns', color: '#3b82f6' },
    { name: 'Bubble.io', category: 'lownocode', icon: 'fas fa-shapes', color: '#2b2d42' },

    // Database
    { name: 'SQL Server', category: 'database', icon: 'fas fa-database', color: '#cc292b' },
    { name: 'PostgreSQL', category: 'database', icon: 'fas fa-server', color: '#336791' },
    { name: 'Redis Cache', category: 'database', icon: 'fas fa-memory', color: '#dc382d' },
    { name: 'MongoDB', category: 'database', icon: 'fas fa-leaf', color: '#47a248' },
    { name: 'ElasticSearch', category: 'database', icon: 'fas fa-search', color: '#005571' },
    { name: 'Cosmos DB', category: 'database', icon: 'fas fa-cloud', color: '#0078d4' },

    // DevOps & Cloud
    { name: 'Microsoft Azure', category: 'devops', icon: 'fab fa-microsoft', color: '#0089d6' },
    { name: 'AWS Cloud', category: 'devops', icon: 'fab fa-aws', color: '#ff9900' },
    { name: 'Docker', category: 'devops', icon: 'fab fa-docker', color: '#2496ed' },
    { name: 'Kubernetes', category: 'devops', icon: 'fas fa-dharmachakra', color: '#326ce5' },
    { name: 'GitHub Actions', category: 'devops', icon: 'fab fa-github', color: '#24292e' },
    { name: 'Terraform IaC', category: 'devops', icon: 'fas fa-cubes-stacked', color: '#844fba' },

    // Mobile
    { name: 'Flutter', category: 'mobile', icon: 'fas fa-mobile-alt', color: '#02569b' },
    { name: 'React Native', category: 'mobile', icon: 'fab fa-react', color: '#61dafb' },
    { name: 'iOS Swift', category: 'mobile', icon: 'fab fa-apple', color: '#f05138' },
    { name: 'Android Kotlin', category: 'mobile', icon: 'fab fa-android', color: '#3ddc84' },
    { name: 'Capacitor / Ionic', category: 'mobile', icon: 'fas fa-tablet-screen-button', color: '#3880ff' },
    { name: 'Mobile REST APIs', category: 'mobile', icon: 'fas fa-network-wired', color: '#10b981' }
  ];

  readonly industries = [
    {
      title: 'Fintech & Digital Banking',
      icon: 'fas fa-university',
      metric: '0.00% Tolerance',
      desc: 'Architecting PCI-DSS compliant transactional ledgers, fraud detection, and instant payment settlement gateways.',
      project: 'Eurobank Core & Wallets'
    },
    {
      title: 'Multi-Tenant B2B SaaS',
      icon: 'fas fa-layer-group',
      metric: '99.99% Uptime',
      desc: 'Designing isolated tenant schemas, dynamic subdomain routing, and automated Stripe billing integrations.',
      project: 'Cloudoor & ODTool SaaS'
    },
    {
      title: 'HealthTech & Telemedicine',
      icon: 'fas fa-heartbeat',
      metric: 'HIPAA Compliant',
      desc: 'End-to-end encrypted medical consults, doctor-patient scheduling, EHR data pipelines, and HIPAA compliance.',
      project: 'Medikea Health Platform'
    },
    {
      title: 'Supply Chain & Dynamic CPQ',
      icon: 'fas fa-calculator',
      metric: '10x Faster Quotes',
      desc: 'Complex dynamic pricing formulas, automated PDF specification generators, and ERP synchronized workflows.',
      project: 'ODTool CPQ Engine'
    },
    {
      title: 'Real Estate & Property Portals',
      icon: 'fas fa-building',
      metric: '100K+ Listings',
      desc: 'High-speed Elasticsearch faceted search, interactive property GIS mapping, and automated agent lead routing.',
      project: 'Scrole Enterprise Portal'
    },
    {
      title: 'High-Volume E-Commerce',
      icon: 'fas fa-shopping-bag',
      metric: '10K Req / Sec',
      desc: 'Optimized Redis caching, checkout concurrency safeguards, inventory locks, and distributed cart architectures.',
      project: 'LinksCenter Market Engine'
    }
  ];

  constructor(public portfolioService: PortfolioService) {}

  isSectionVisible(sectionKey: string): boolean {
    return this.portfolioService.isSectionVisible('expertise', sectionKey);
  }

  getSection(sectionKey: string) {
    return this.portfolioService.getSection('expertise', sectionKey);
  }

  get customSections() {
    return this.portfolioService.getCustomSections('expertise');
  }

  get displayedTechTiles(): TechTile[] {
    let list = this.techTiles.filter(t => t.category === this.activeStackCategory);
    if (this.stackSearchQuery.trim()) {
      const q = this.stackSearchQuery.toLowerCase();
      list = this.techTiles.filter(t => t.name.toLowerCase().includes(q));
    }
    return list;
  }

  setStackCategory(cat: StackCategory): void {
    this.activeStackCategory = cat;
    this.stackSearchQuery = '';
  }

  setTrackTab(tab: 'experience' | 'education' | 'certifications'): void {
    this.activeTrackTab = tab;
  }
}
