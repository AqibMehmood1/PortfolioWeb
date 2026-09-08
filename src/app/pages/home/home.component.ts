import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Typed from 'typed.js';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectItem, ServiceItem } from '../../models/portfolio.model';

interface TechTile {
  name: string;
  icon: string;
  color?: string;
  isSvg?: boolean;
}

interface AccordionService {
  index: string;
  title: string;
  shortDesc: string;
  bullets: string[];
  image: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  featuredProjects: ProjectItem[] = [];
  allServices: ServiceItem[] = [];
  selectedHeroFocus: string = 'SaaS Architecture & Scale';
  activeArchTab: 'saas' | 'ai' | 'cloud' = 'saas';
  private typedInstance: Typed | null = null;

  // InvoZone Hero Inquiry Form State (Screenshot 2)
  inquiryForm = {
    fullName: '',
    email: '',
    phone: '',
    techStack: 'Multi-Tenant SaaS Architecture',
    message: '',
    agreed: true
  };

  // InvoZone Services Accordion State (Screenshot 4)
  activeServiceIndex: number = 0;
  readonly servicesAccordion: AccordionService[] = [
    {
      index: '//01',
      title: 'AI & Data Innovation',
      shortDesc: 'Build Intelligent Products Using AI, Machine Learning, And Advanced Data Engineering.',
      bullets: [
        'Agent As a Service',
        'AI Product Development',
        'Autonomous Agentic AI',
        'Enterprise RAG & Vector DBs'
      ],
      image: 'assets/img/project-3.jpg',
      route: '/expertise'
    },
    {
      index: '//02',
      title: 'Custom Software Development',
      shortDesc: 'End-to-End Scalable Architectures Tailored for Startup MVPs & High-Growth SaaS Platforms.',
      bullets: [
        'Multi-Tenant SaaS Platforms',
        'Automated Stripe Billing',
        'Dynamic Subdomain Routers',
        'Clean RBAC Data Isolation'
      ],
      image: 'assets/img/project-1.jpg',
      route: '/services'
    },
    {
      index: '//03',
      title: 'Enterprise .NET & CPQ Engines',
      shortDesc: 'Modern High-Throughput C# / .NET 9 WebAPIs, Microservices, and Dynamic Pricing Systems.',
      bullets: [
        '.NET 9 & ASP.NET WebAPI',
        'Dynamic CPQ Price Calculation',
        'Asynchronous Event-Bus',
        'Monolith to Microservices Modernization'
      ],
      image: 'assets/img/project-2.jpg',
      route: '/services'
    },
    {
      index: '//04',
      title: 'Cloud Scaling & Cost Optimization',
      shortDesc: 'Resilient Azure & AWS Cloud Infrastructure Engineered to Cut Operating Bills by up to 25%.',
      bullets: [
        '25% Cloud Cost Reduction',
        'Kubernetes & Docker Clusters',
        'Zero-Downtime Blue/Green CI/CD',
        'Distributed In-Memory Redis Caching'
      ],
      image: 'assets/img/project-4.jpg',
      route: '/expertise'
    }
  ];

  // InvoZone Tech Stacks Matrix State (Screenshot 5)
  activeStackCategory: string = 'ai';
  stackSearchQuery: string = '';

  readonly stackCategories: Record<string, TechTile[]> = {
    ai: [
      { name: 'Tensorflow', icon: 'fas fa-brain', color: '#ff6f00' },
      { name: 'Keras', icon: 'fas fa-cube', color: '#d00000' },
      { name: 'Pytorch', icon: 'fas fa-fire', color: '#ee4c2c' },
      { name: 'LangChain', icon: 'fas fa-link', color: '#2563eb' },
      { name: 'Semantic Kernel', icon: 'fas fa-microchip', color: '#7c3aed' },
      { name: 'Pinecone DB', icon: 'fas fa-database', color: '#059669' },
      { name: 'spaCy', icon: 'fas fa-spell-check', color: '#0284c7' },
      { name: 'OpenAI GPT-4o', icon: 'fas fa-robot', color: '#10a37f' },
      { name: 'Claude Sonnet', icon: 'fas fa-bolt', color: '#d97706' },
      { name: 'Hugging Face', icon: 'far fa-smile', color: '#f59e0b' },
      { name: 'NLTK', icon: 'fab fa-python', color: '#3b82f6' },
      { name: 'Lisp', icon: 'fas fa-code', color: '#ef4444' }
    ],
    frontend: [
      { name: 'Angular 17+', icon: 'fab fa-angular', color: '#dd0031' },
      { name: 'React.js', icon: 'fab fa-react', color: '#61dafb' },
      { name: 'TypeScript', icon: 'fab fa-js', color: '#3178c6' },
      { name: 'Next.js', icon: 'fas fa-forward', color: '#111915' },
      { name: 'Vue.js', icon: 'fab fa-vuejs', color: '#42b883' },
      { name: 'RxJS / NgRx', icon: 'fas fa-infinity', color: '#d81b60' },
      { name: 'Tailwind CSS', icon: 'fas fa-wind', color: '#06b6d4' },
      { name: 'Bootstrap 5', icon: 'fab fa-bootstrap', color: '#7952b3' },
      { name: 'Micro-Frontends', icon: 'fas fa-th-large', color: '#6366f1' },
      { name: 'Vite & Webpack', icon: 'fas fa-bolt', color: '#bd34fe' },
      { name: 'WebSockets', icon: 'fas fa-network-wired', color: '#10b981' },
      { name: 'Progressive Web', icon: 'fas fa-mobile-alt', color: '#ec4899' }
    ],
    backend: [
      { name: '.NET 9 / C#', icon: 'fab fa-windows', color: '#512bd4' },
      { name: 'ASP.NET Core', icon: 'fas fa-server', color: '#512bd4' },
      { name: 'Entity Framework', icon: 'fas fa-database', color: '#68217a' },
      { name: 'Node.js', icon: 'fab fa-node-js', color: '#68a063' },
      { name: 'Python APIs', icon: 'fab fa-python', color: '#3776ab' },
      { name: 'Microservices Bus', icon: 'fas fa-project-diagram', color: '#0284c7' },
      { name: 'REST & GraphQL', icon: 'fas fa-code-branch', color: '#e10098' },
      { name: 'Clean Architecture', icon: 'fas fa-layer-group', color: '#059669' },
      { name: 'SignalR Live Sync', icon: 'fas fa-broadcast-tower', color: '#d97706' },
      { name: 'RabbitMQ', icon: 'fas fa-exchange-alt', color: '#ff6600' },
      { name: 'gRPC High-Speed', icon: 'fas fa-bolt', color: '#244c5a' },
      { name: 'C++ Modern', icon: 'fas fa-file-code', color: '#00599c' }
    ],
    lownocode: [
      { name: 'Bubble.io', icon: 'fas fa-soap', color: '#0d6efd' },
      { name: 'Retool Admin', icon: 'fas fa-tools', color: '#0070f3' },
      { name: 'Make / Integromat', icon: 'fas fa-random', color: '#6f42c1' },
      { name: 'Zapier Automation', icon: 'fas fa-bolt', color: '#ff4a00' },
      { name: 'Webflow', icon: 'fas fa-paint-brush', color: '#4353ff' },
      { name: 'Power Automate', icon: 'fab fa-microsoft', color: '#0078d4' }
    ],
    database: [
      { name: 'SQL Server', icon: 'fas fa-database', color: '#cc292b' },
      { name: 'Redis Cache', icon: 'fas fa-bolt', color: '#dc382d' },
      { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791' },
      { name: 'MongoDB', icon: 'fas fa-leaf', color: '#47a248' },
      { name: 'Azure CosmosDB', icon: 'fas fa-globe', color: '#0089d6' },
      { name: 'Elasticsearch', icon: 'fas fa-search', color: '#005571' },
      { name: 'Sharded Schemas', icon: 'fas fa-columns', color: '#6366f1' },
      { name: 'AWS DynamoDB', icon: 'fab fa-aws', color: '#4053d6' }
    ],
    devops: [
      { name: 'Microsoft Azure', icon: 'fab fa-microsoft', color: '#0078d4' },
      { name: 'AWS Cloud', icon: 'fab fa-aws', color: '#ff9900' },
      { name: 'Docker Engine', icon: 'fab fa-docker', color: '#2496ed' },
      { name: 'Kubernetes (K8s)', icon: 'fas fa-dharmachakra', color: '#326ce5' },
      { name: 'GitHub Actions', icon: 'fab fa-github', color: '#181717' },
      { name: 'Cloudflare CDN', icon: 'fas fa-cloud', color: '#f38020' },
      { name: 'Terraform IaC', icon: 'fas fa-cubes', color: '#844fba' },
      { name: 'Cost Optimization', icon: 'fas fa-dollar-sign', color: '#10b981' }
    ],
    mobile: [
      { name: 'React Native', icon: 'fab fa-react', color: '#61dafb' },
      { name: 'Flutter / Dart', icon: 'fas fa-feather-alt', color: '#02569b' },
      { name: 'Ionic Framework', icon: 'fas fa-mobile-alt', color: '#3880ff' },
      { name: 'iOS Swift APIs', icon: 'fab fa-apple', color: '#000000' },
      { name: 'Android Kotlin', icon: 'fab fa-android', color: '#3ddc84' },
      { name: 'PWA Mobile', icon: 'fas fa-tablet-alt', color: '#10b981' }
    ]
  };

  readonly industries = [
    {
      title: 'Fintech & Digital Banking',
      icon: 'fas fa-shield-alt',
      desc: 'Secure, high-availability customer portals, strict RBAC authorization, and zero-trust transaction processing.',
      project: 'Eurobank Banking Portal',
      metric: 'Zero-Downtime Resilience'
    },
    {
      title: 'Multi-Tenant Cloud SaaS',
      icon: 'fas fa-cloud',
      desc: 'Elastic microservices, automated tenant partitioning, Stripe subscription billing, and automated CI/CD.',
      project: 'Cloudoor Cloud SaaS',
      metric: '25% Cloud Cost Optimization'
    },
    {
      title: 'HealthTech & Telemedicine',
      icon: 'fas fa-heartbeat',
      desc: 'Encrypted patient consultation pipelines, WebSockets live messaging, and HIPAA-aligned architecture.',
      project: 'Medikea Health Platform',
      metric: 'High Concurrency Queues'
    },
    {
      title: 'Enterprise CPQ & Pricing Engines',
      icon: 'fas fa-calculator',
      desc: 'Dynamic formula calculation engines that replace error-prone manual spreadsheets with automated workflows.',
      project: 'ODTool Quotation Engine',
      metric: '3 Hours/Day Saved'
    },
    {
      title: 'High-Traffic Web Portals & SPAs',
      icon: 'fas fa-bolt',
      desc: 'Distributed Redis caching, non-blocking asynchronous APIs, and CDN edge optimization for instant render.',
      project: 'Scrole & LinksCenter',
      metric: 'Sub-Second Latency'
    },
    {
      title: 'AI Agents & Intelligent Workflows',
      icon: 'fas fa-robot',
      desc: 'Autonomous LLM tool-calling agents, enterprise RAG vector retrieval, and automated document parsing.',
      project: 'Pulstech AI Integrations',
      metric: 'Enterprise LLM Pipelines'
    }
  ];

  readonly testimonials = [
    {
      quote: 'Bilal architected our dynamic CPQ calculation engine from the ground up. His architectural leadership cut our quotation turnaround time from 3 hours to under 30 seconds. Extraordinary technical mastery.',
      author: 'Odyssey Design Leadership',
      role: 'San Antonio, TX, USA',
      tag: 'Enterprise .NET & CPQ'
    },
    {
      quote: 'His ability to integrate complex GenAI agent workflows while ensuring our cloud infrastructure remains cost-optimized is unmatched. An invaluable technology partner.',
      author: 'Pulstech Engineering',
      role: 'Paris, France',
      tag: 'Cloud & AI Architecture'
    },
    {
      quote: 'Delivered our multi-tenant SaaS infrastructure on Azure with flawless execution. Zero-downtime deployments and reduced our monthly cloud bill by 25%.',
      author: 'Cloudoor Technology Team',
      role: 'San Francisco, CA, USA',
      tag: 'Multi-Tenant SaaS'
    }
  ];

  constructor(public portfolioService: PortfolioService, private router: Router) {
    this.featuredProjects = this.portfolioService.projects;
    this.allServices = this.portfolioService.services;
  }

  ngAfterViewInit(): void {
    const el = document.querySelector('.typed-text');
    if (el) {
      this.typedInstance = new Typed('.typed-text', {
        strings: [
          'Enterprise Solutions Architect',
          'Scalable SaaS & Multi-Tenancy',
          'Autonomous AI Agents & GenAI',
          'Cloud Cost Tuning (Azure & AWS)',
          '.NET 9 & Microservices Architecture',
          'Fractional CTO & Strategic Advisory'
        ],
        typeSpeed: 35,
        backSpeed: 25,
        backDelay: 1500,
        startDelay: 400,
        loop: true,
        showCursor: true
      });
    }
  }

  ngOnDestroy(): void {
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }
  }

  toggleServiceAccordion(index: number): void {
    if (this.activeServiceIndex === index) {
      this.activeServiceIndex = -1;
    } else {
      this.activeServiceIndex = index;
    }
  }

  setStackCategory(cat: string): void {
    this.activeStackCategory = cat;
  }

  get displayedTechTiles(): TechTile[] {
    const tiles = this.stackCategories[this.activeStackCategory] || [];
    if (!this.stackSearchQuery.trim()) {
      return tiles;
    }
    const q = this.stackSearchQuery.toLowerCase();
    return tiles.filter(t => t.name.toLowerCase().includes(q));
  }

  submitInquiry(): void {
    if (!this.inquiryForm.fullName || !this.inquiryForm.email || !this.inquiryForm.message) {
      this.portfolioService.showToast('Please complete all required fields.');
      return;
    }
    this.portfolioService.showToast(`Thank you, ${this.inquiryForm.fullName}! Inquiry submitted successfully.`);
    this.inquiryForm = {
      fullName: '',
      email: '',
      phone: '',
      techStack: 'Multi-Tenant SaaS Architecture',
      message: '',
      agreed: true
    };
  }

  setArchTab(tab: 'saas' | 'ai' | 'cloud'): void {
    this.activeArchTab = tab;
  }

  onHeroSelectChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedHeroFocus = val;
  }

  goToConsultationWithFocus(): void {
    this.router.navigate(['/contact'], { queryParams: { topic: this.selectedHeroFocus } });
  }

  openProjectModal(project: ProjectItem): void {
    this.portfolioService.openProjectModal(project);
  }

  copyProjectLink(project: ProjectItem): void {
    this.portfolioService.copyText(project.liveUrl, `${project.title} URL`);
  }

  copyEmail(): void {
    this.portfolioService.copyText(this.portfolioService.profile.email, 'Email address');
  }

  copyPhone(): void {
    this.portfolioService.copyText(this.portfolioService.profile.phone, 'Phone number');
  }
}
