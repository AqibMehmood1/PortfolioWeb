import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  ProjectItem, 
  ServiceItem, 
  ExperienceItem, 
  EducationItem, 
  CertificationItem, 
  AccordionService, 
  IndustryItem, 
  TestimonialItem 
} from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  readonly profile = {
    name: 'NEXVOYS',
    tagline: 'Enterprise Technology Partner',
    role: 'Enterprise Technology Partner & Solutions Architecture',
    email: 'contact@nexvoys.com',
    phone: '+923456466188',
    displayPhone: '+92 345 6466188',
    location: 'Lahore, Pakistan · Global Remote',
    linkedinUrl: 'https://www.linkedin.com/company/nexvoys/',
    upworkUrl: 'https://www.upwork.com/freelancers/~01cf247ced49045c1f?viewMode=1',
    fiverrUrl: 'https://www.fiverr.com/bilalsoftengr',
    cvPath: 'assets/Bilal_CV.pdf'
  };

  private toastSubject = new BehaviorSubject<string | null>(null);
  toast$: Observable<string | null> = this.toastSubject.asObservable();
  private toastTimeout: any = null;

  // Selected project for modal preview
  private selectedProjectSubject = new BehaviorSubject<ProjectItem | null>(null);
  selectedProject$: Observable<ProjectItem | null> = this.selectedProjectSubject.asObservable();

  readonly projects: ProjectItem[] = [
    {
      id: 'scrole',
      title: 'Scrole Web Platform',
      category: 'Interactive Web Platform',
      filterCategory: 'web',
      image: 'assets/img/scrole.png',
      gif: 'assets/img/Scrole.gif',
      description: 'High-performance interactive web application built for seamless engagement, dynamic rendering, and responsive real-time data sync.',
      problem: 'The client needed a responsive, dynamic web portal capable of smooth animation flows and rapid interaction without compromising page load speeds.',
      architecture: 'Engineered with Angular and clean TypeScript components, utilizing reactive state management and CDN edge caching to ensure ultra-fast response times.',
      tech: ['Angular', 'TypeScript', 'Node.js', 'REST APIs', 'Cloud CDN'],
      liveUrl: 'https://scrole.com',
      highlights: ['Sub-second latency', 'Modern UX Architecture', 'Responsive Multi-Device Support']
    },
    {
      id: 'odtool',
      title: 'ODTool Quotation Engine',
      category: 'Enterprise CPQ & Calculation System',
      filterCategory: 'dotnet',
      image: 'assets/img/ODTool.png',
      gif: 'assets/img/OdooTools.gif',
      description: 'Custom quotation engine and dynamic cost estimation platform engineered for Odyssey Design San Antonio client workflows.',
      problem: 'Sales teams spent over 3 hours daily on manual spreadsheet quotation calculations, resulting in calculation inconsistencies and deal latency.',
      architecture: 'Developed an automated calculation engine powered by .NET Core, C#, SQL Server, and an Angular frontend with granular role-based permissions.',
      tech: ['.NET Core', 'C#', 'SQL Server', 'Angular', 'Azure App Services'],
      liveUrl: 'https://quote.odysseydesignco.com/home',
      highlights: ['Automated 3hr daily manual quoting', 'Real-time price calculation', 'Enterprise Role Permissions']
    },
    {
      id: 'eurobank',
      title: 'Eurobank Banking Portal',
      category: 'Fintech & Secure Banking Platform',
      filterCategory: 'dotnet',
      image: 'assets/img/Eurobank.png',
      gif: 'assets/img/EUROBank.gif',
      description: 'Secure, high-availability banking portal engineered with enterprise authentication, strict compliance, and reliable account workflows.',
      problem: 'Required a bulletproof, compliant digital banking customer portal with high concurrency handling and strict zero-trust security standards.',
      architecture: 'Built on ASP.NET Core with microservices backend, Entity Framework Core, SQL Server clustering, and encrypted OAuth2/JWT security barriers.',
      tech: ['ASP.NET Core', 'C#', 'Security / RBAC', 'SQL Server', 'Microservices'],
      liveUrl: 'https://ssp.eurobank.com.cy/account/login',
      highlights: ['Enterprise Security Architecture', 'High Concurrency', 'Zero-Downtime Resilience']
    },
    {
      id: 'cloudoor',
      title: 'Cloudoor Cloud SaaS',
      category: 'Cloud SaaS & Multi-Tenant Infrastructure',
      filterCategory: 'saas',
      image: 'assets/img/Cloudoor.png',
      gif: 'assets/img/CloudoorG.gif',
      description: 'Scalable multi-tenant cloud automation platform supporting US-based clients with resource monitoring and automated cloud orchestration.',
      problem: 'Rising cloud overhead and lack of unified multi-tenant automation across Azure resources for fast-growing US technology clients.',
      architecture: 'Architected containerized microservices in Docker on Azure, integrating automated resource rightsizing rules and automated billing pipelines.',
      tech: ['Azure Cloud', '.NET Core', 'Docker', 'Angular', 'Microservices'],
      liveUrl: 'https://cloudoor.com',
      highlights: ['25% Cloud Cost Reduction', 'Multi-Tenant Isolation', 'Automated CI/CD Pipelines']
    },
    {
      id: 'medikea',
      title: 'Medikea Healthcare Platform',
      category: 'HealthTech & Telemedicine System',
      filterCategory: 'health',
      image: 'assets/img/Medikea.png',
      gif: 'assets/img/Medikea.gif',
      description: 'Comprehensive telemedicine and health portal streamlining patient appointments, consultations, and digital health records.',
      problem: 'Healthcare providers lacked a unified digital portal to manage patient appointments, video consultations, and real-time electronic records.',
      architecture: 'Engineered a secure React and Node.js platform with PostgreSQL and WebSockets for encrypted doctor-patient interactions and appointment queues.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure', 'WebSockets'],
      liveUrl: 'https://www.medikea.co.tz',
      highlights: ['HIPAA-compliant principles', 'Real-time messaging', 'High scalability']
    },
    {
      id: 'linkcenter',
      title: 'LinksCenter Portal',
      category: 'High-Traffic Web & Directory System',
      filterCategory: 'web',
      image: 'assets/img/linkcenter2.png',
      gif: 'assets/img/LinksWeb.gif',
      description: 'High-volume link curation and discovery portal optimized for sub-second query speeds, SEO indexing, and high concurrent user loads.',
      problem: 'High concurrency traffic spikes caused slow database queries, impacting SEO rankings and user retention metrics.',
      architecture: 'Refactored backend data access in .NET Core with Redis distributed caching layer and Cloudflare edge CDN, lowering page loads by 40%.',
      tech: ['.NET Core', 'SQL Server', 'Redis Caching', 'Bootstrap 5', 'Cloudflare'],
      liveUrl: 'http://www.links.center',
      highlights: ['40% Page Load Improvement', 'Redis Distributed Caching', 'High Concurrency Throughput']
    }
  ];

  readonly services: ServiceItem[] = [
    {
      id: 'saas',
      icon: 'fas fa-cubes',
      title: 'SaaS Architecture & Multi-Tenancy',
      shortDesc: 'Design and build scalable multi-tenant SaaS foundations with clean tenant isolation, subscription billing, and 99.9% uptime.',
      fullDesc: 'Architecting end-to-end SaaS solutions that scale efficiently from prototype to millions of users. I design robust data isolation models, automated provisioning, subscription tiers, and elastic cloud scaling.',
      deliverables: [
        'Multi-tenant database schema partitioning',
        'Stripe / Subscription billing automation',
        'Zero-downtime auto-scaling infrastructure',
        'Granular RBAC security & audit logging'
      ],
      engagementTopic: 'SaaS Architecture & Scale'
    },
    {
      id: 'ai',
      icon: 'fas fa-robot',
      title: 'Autonomous AI Agents & GenAI',
      shortDesc: 'Integrate practical AI agents, LangChain/Semantic Kernel pipelines, and intelligent workflow automations.',
      fullDesc: 'Empower your software with generative AI capabilities and autonomous agents. We build production-ready RAG architectures, custom LLM tool-calling agents, and intelligent automated workflows.',
      deliverables: [
        'Autonomous task & reasoning agents',
        'Enterprise RAG pipelines with vector databases',
        'Document parsing & AI data extraction',
        'Custom LangChain & Semantic Kernel integration'
      ],
      engagementTopic: 'AI Agents & Workflow Automation'
    },
    {
      id: 'cloud',
      icon: 'fas fa-cloud',
      title: 'Cloud Migration & Cost Optimization',
      shortDesc: 'Architect zero-downtime Azure and AWS migrations, serverless workflows, and infrastructure tuning that cut costs up to 25%.',
      fullDesc: 'Eliminate bloated cloud bills and fragile infrastructure. I audit your Azure/AWS setups, rightsize compute/storage, implement distributed caching, and automate CI/CD release pipelines.',
      deliverables: [
        'Zero-downtime database & app migration',
        'Cloud infrastructure audit & 25% cost reduction',
        'Kubernetes / Docker container orchestration',
        'Automated CI/CD deployment pipelines'
      ],
      engagementTopic: 'Cloud Migration & Cost Optimization'
    },
    {
      id: 'legacy',
      icon: 'fas fa-sync-alt',
      title: 'Legacy .NET & Web Modernization',
      shortDesc: 'Refactor monolithic, sluggish legacy .NET applications into high-performance .NET 9 microservices and reactive SPAs.',
      fullDesc: 'Transform legacy technical debt into high-performance assets. We upgrade legacy ASP.NET WebForms/MVC to .NET 9 Core, decouple monolithic codebases into microservices, and build modern Angular/React user experiences.',
      deliverables: [
        'Monolith to microservices architectural roadmap',
        'Upgrading legacy .NET Framework to .NET 9',
        '40%+ page load & API throughput optimization',
        'RESTful & gRPC high-speed API design'
      ],
      engagementTopic: 'Legacy .NET & Web Modernization'
    },
    {
      id: 'advisory',
      icon: 'fas fa-user-tie',
      title: 'Fractional CTO & Architecture Advisory',
      shortDesc: 'Senior technical leadership on a fractional basis for startups preparing to raise capital, hire developers, or scale.',
      fullDesc: 'Get executive-level technical leadership without the overhead of a full-time executive. I assist founders with technical due diligence, tech stack selection, code reviews, and agile engineering leadership.',
      deliverables: [
        'Technical due diligence & architecture roadmap',
        'Engineering team hiring & code review standards',
        'Vendor evaluation & tech stack selection',
        'Executive & board technical advisory'
      ],
      engagementTopic: 'Fractional Solutions Architect'
    }
  ];

  readonly experiences: ExperienceItem[] = [
    {
      title: 'Founder & Principal Solutions Architect',
      period: 'Feb 2024 - Present · 2 yrs+',
      company: 'SoftEngr Labs',
      location: 'Remote Advisory & Engineering',
      description: 'Partnering directly with startups and SMB founders across the US, Canada, and Europe to architect multi-tenant SaaS products, AI Agents, and distributed cloud applications that scale seamlessly.',
      tags: ['Solutions Architecture', 'AI Agents', 'Multi-Tenant SaaS', 'Azure', '.NET 9']
    },
    {
      title: 'Solutions Architect (Contract)',
      period: 'Jan 2024 - Present · 2 yrs+',
      company: 'Pulstech',
      location: 'Paris, France · Remote',
      description: 'Directing cloud architecture design, LLM/GenAI workflow automation integrations, and scalable infrastructure for a premier French technology enterprise.',
      tags: ['AI/GenAI Workflow', 'Cloud Architecture', 'Scalable SaaS', 'API Gateway']
    },
    {
      title: 'Solutions Architect (Contract)',
      period: 'Jan 2021 - Dec 2023 · 3 yrs',
      company: 'Odyssey Design San Antonio',
      location: 'San Antonio, TX, USA · Remote',
      description: 'Led architecture and full-stack development of dynamic quotation engines (ODTool), complex pricing algorithms, and cloud infrastructure for US clients.',
      tags: ['.NET Core', 'C#', 'Calculation Engines', 'Cloud Deployment', 'Angular']
    },
    {
      title: 'Senior Full Stack Developer (.NET & Angular)',
      period: 'Apr 2018 - Dec 2020 · 2 yrs 9 mos',
      company: 'Cloudoor',
      location: 'San Francisco, CA, USA · Remote',
      description: 'Engineered scalable cloud resource management platforms, high-performance REST microservices, and reactive SPAs for enterprise US clients.',
      tags: ['.NET Core', 'Angular', 'SQL Server', 'Microservices', 'Azure Cloud']
    },
    {
      title: '.NET Full Stack Developer',
      period: 'Jan 2017 - Mar 2018 · 1 yr 3 mos',
      company: 'System Nexgen',
      location: 'Lahore, Pakistan',
      description: 'Developed enterprise web applications, backend APIs, relational database schemas, and unit test suites for client projects.',
      tags: ['C#', 'ASP.NET MVC', 'Microsoft SQL Server', 'OOP Patterns']
    }
  ];

  readonly educations: EducationItem[] = [
    {
      degree: 'Bachelor of Science in Computer Software Engineering',
      period: '2014 - 2018',
      institution: 'Superior University / Superior College · Lahore, Pakistan',
      description: 'Comprehensive curriculum covering Distributed Computing, Software Architecture, Advanced Data Structures, Relational Database Systems, Object-Oriented Design, and Software Quality Assurance.'
    },
    {
      degree: 'Higher Secondary Intermediate (FSc Pre-Engineering)',
      period: '2012 - 2014',
      institution: 'Nibs College',
      description: 'Concentrations in Mathematics, Physics, Logic, and Analytical Reasoning.'
    }
  ];

  readonly certifications: CertificationItem[] = [
    {
      title: 'Solutions Architecture & AI/GenAI Integration',
      level: 'Executive Level Competency',
      issuer: 'SaaS & Cloud Platforms',
      description: 'Architectural competency in multi-tenant SaaS engineering, LLM orchestration, autonomous agent design, and distributed cloud computing.'
    },
    {
      title: 'Enterprise C# & .NET Core Architecture',
      level: 'Professional Mastery',
      issuer: 'Microsoft Technology Stack',
      description: 'Deep mastery in modern C# asynchronous patterns, memory optimization, Dependency Injection, and microservices architecture.'
    },
    {
      title: 'ASP.NET Core WebAPI & Entity Framework Core',
      level: 'Enterprise Specialization',
      issuer: 'Enterprise Web & Backend Systems',
      description: 'RESTful API design, database connection pooling, query optimization, and RBAC authentication security.'
    },
    {
      title: 'Scrum & Agile Business Delivery',
      level: 'SDLC Leadership',
      issuer: 'Agile Software Development',
      description: 'Sprint management, technical backlog governance, architectural roadmapping, and continuous integration delivery.'
    }
  ];

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

  readonly industries: IndustryItem[] = [
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

  readonly testimonials: TestimonialItem[] = [
    {
      quote: 'The NEXVOYS team architected our dynamic CPQ calculation engine from the ground up. Their architectural leadership cut our quotation turnaround time from 3 hours to under 30 seconds. Extraordinary technical mastery.',
      author: 'Odyssey Design Leadership',
      role: 'San Antonio, TX, USA',
      tag: 'Enterprise .NET & CPQ'
    },
    {
      quote: 'NEXVOYS has an exceptional ability to integrate complex GenAI agent workflows while ensuring cloud infrastructure remains cost-optimized. An invaluable technology partner.',
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

  showToast(message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastSubject.next(message);
    this.toastTimeout = setTimeout(() => {
      this.toastSubject.next(null);
    }, 3500);
  }

  copyText(text: string, label: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(`${label} copied to clipboard! ✨`);
      }).catch(() => {
        this.fallbackCopy(text, label);
      });
    } else {
      this.fallbackCopy(text, label);
    }
  }

  private fallbackCopy(text: string, label: string): void {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.showToast(`${label} copied to clipboard! ✨`);
  }

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = this.profile.cvPath;
    link.download = 'NEXVOYS_Enterprise_Capabilities.pdf';
    link.click();
    this.showToast('Downloading NEXVOYS Company Profile... 📄');
  }

  openWhatsApp(): void {
    const msg = encodeURIComponent(`Hi NEXVOYS team, I reviewed your enterprise solutions architecture services and would like to discuss a project roadmap.`);
    window.open(`https://wa.me/${this.profile.phone}?text=${msg}`, '_blank');
  }

  openProjectModal(project: ProjectItem): void {
    this.selectedProjectSubject.next(project);
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal(): void {
    this.selectedProjectSubject.next(null);
    document.body.style.overflow = '';
  }
}
