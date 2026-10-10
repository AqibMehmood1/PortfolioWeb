import { Injectable, NgZone } from '@angular/core';
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
import { PortfolioApiService, WebsiteSettingsData, SitePageDto, SiteSectionDto } from './portfolio-api.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  profile = {
    name: 'NEXVOYS',
    tagline: 'Enterprise Technology Partner',
    role: 'Enterprise Technology Partner & Solutions Architecture',
    email: 'nexvoys@gmail.com',
    phone: '+923456466188',
    displayPhone: '+92 345 6466188',
    location: 'Lahore, Pakistan · Global Remote',
    linkedinUrl: 'https://www.linkedin.com/company/nex-voys/posts/?feedView=all',
    cvPath: 'assets/Bilal_CV.pdf',
    logoDark: 'assets/nexvoys/black-logo.png',
    logoLight: 'assets/nexvoys/white-logo.png',
    favicon: 'assets/nexvoys/nex-fav.png',
    footerBio: 'NEXVOYS helps Startups, SMBs, and Enterprises architect and scale multi-tenant SaaS platforms, autonomous AI agent pipelines, and high-performance cloud infrastructure with 9+ years of proven delivery.',
    copyrightText: '© 2026 NEXVOYS. All rights reserved. Enterprise Software Architecture & Advisory.',
    tickerTexts: [
      '• We\'re available for Q2/Q3 Architectural Advisory & Scale! Come connect with us!',
      '• 9+ Years Enterprise Solutions Architecture & Cloud Engineering',
      '• Multi-Tenant SaaS, Autonomous AI Agents & High-Concurrency Systems',
      '• Trusted by Tech Leaders across US, Canada, Europe & Worldwide'
    ]
  };

  private settingsSubject = new BehaviorSubject<WebsiteSettingsData | null>(null);
  settings$: Observable<WebsiteSettingsData | null> = this.settingsSubject.asObservable();

  private toastSubject = new BehaviorSubject<string | null>(null);
  toast$: Observable<string | null> = this.toastSubject.asObservable();
  private toastTimeout: any = null;

  // Selected project for modal preview
  private selectedProjectSubject = new BehaviorSubject<ProjectItem | null>(null);
  selectedProject$: Observable<ProjectItem | null> = this.selectedProjectSubject.asObservable();

  // Dynamic Content Subjects
  private projectsSubject = new BehaviorSubject<ProjectItem[]>([]);
  projects$: Observable<ProjectItem[]> = this.projectsSubject.asObservable();
  get projects(): ProjectItem[] { return this.projectsSubject.value; }

  private servicesSubject = new BehaviorSubject<ServiceItem[]>([]);
  services$: Observable<ServiceItem[]> = this.servicesSubject.asObservable();
  get services(): ServiceItem[] { return this.servicesSubject.value; }

  private accordionServicesSubject = new BehaviorSubject<AccordionService[]>([]);
  accordionServices$: Observable<AccordionService[]> = this.accordionServicesSubject.asObservable();
  get servicesAccordion(): AccordionService[] { return this.accordionServicesSubject.value; }

  private experiencesSubject = new BehaviorSubject<ExperienceItem[]>([]);
  experiences$: Observable<ExperienceItem[]> = this.experiencesSubject.asObservable();
  get experiences(): ExperienceItem[] { return this.experiencesSubject.value; }

  private educationsSubject = new BehaviorSubject<EducationItem[]>([]);
  educations$: Observable<EducationItem[]> = this.educationsSubject.asObservable();
  get educations(): EducationItem[] { return this.educationsSubject.value; }

  private certificationsSubject = new BehaviorSubject<CertificationItem[]>([]);
  certifications$: Observable<CertificationItem[]> = this.certificationsSubject.asObservable();
  get certifications(): CertificationItem[] { return this.certificationsSubject.value; }

  private industriesSubject = new BehaviorSubject<IndustryItem[]>([]);
  industries$: Observable<IndustryItem[]> = this.industriesSubject.asObservable();
  get industries(): IndustryItem[] { return this.industriesSubject.value; }

  private testimonialsSubject = new BehaviorSubject<TestimonialItem[]>([]);
  testimonials$: Observable<TestimonialItem[]> = this.testimonialsSubject.asObservable();
  get testimonials(): TestimonialItem[] { return this.testimonialsSubject.value; }

  private pagesSubject = new BehaviorSubject<SitePageDto[]>([]);
  pages$: Observable<SitePageDto[]> = this.pagesSubject.asObservable();
  get pages(): SitePageDto[] { return this.pagesSubject.value; }

  get navPages(): SitePageDto[] {
    return this.pages.filter(p => p.isVisible && p.showInNav);
  }

  get footerPages(): SitePageDto[] {
    return this.pages.filter(p => p.isVisible && p.showInFooter);
  }

  isPageVisible(slug: string): boolean {
    const cleanSlug = (slug || '').trim().toLowerCase();
    const page = this.pages.find(p => p.slug.toLowerCase() === cleanSlug || (cleanSlug === 'home' && p.slug === ''));
    return page ? page.isVisible : true;
  }

  isSectionVisible(pageSlug: string, sectionKey: string): boolean {
    const cleanPage = (pageSlug || '').trim().toLowerCase();
    const cleanKey = (sectionKey || '').trim().toLowerCase();
    const page = this.pages.find(p => p.slug.toLowerCase() === cleanPage || (cleanPage === 'home' && p.slug === ''));
    if (!page || !page.sections || page.sections.length === 0) {
      return true;
    }
    if (!page.isVisible) return false;
    const section = page.sections.find(s => s.sectionKey.toLowerCase() === cleanKey);
    return section ? section.isVisible : true;
  }

  getSection(pageSlug: string, sectionKey: string): SiteSectionDto | undefined {
    const cleanPage = (pageSlug || '').trim().toLowerCase();
    const cleanKey = (sectionKey || '').trim().toLowerCase();
    const page = this.pages.find(p => p.slug.toLowerCase() === cleanPage || (cleanPage === 'home' && p.slug === ''));
    if (!page || !page.sections) return undefined;
    return page.sections.find(s => s.sectionKey.toLowerCase() === cleanKey);
  }

  getPageSections(pageSlug: string): SiteSectionDto[] {
    const cleanPage = (pageSlug || '').trim().toLowerCase();
    const page = this.pages.find(p => p.slug.toLowerCase() === cleanPage || (cleanPage === 'home' && p.slug === ''));
    return page && page.sections ? page.sections.filter(s => s.isVisible) : [];
  }

  getCustomSections(pageSlug: string): SiteSectionDto[] {
    const cleanPage = (pageSlug || '').trim().toLowerCase();
    const page = this.pages.find(p => p.slug.toLowerCase() === cleanPage || (cleanPage === 'home' && p.slug === ''));
    return page && page.sections ? page.sections.filter(s => s.isVisible && !s.isSystem) : [];
  }

  getSectionCards(pageSlug: string, sectionKey: string): { title: string; description: string; badge?: string; icon?: string }[] {
    const sec = this.getSection(pageSlug, sectionKey);
    if (sec && sec.contentJson) {
      try {
        const parsed = JSON.parse(sec.contentJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        } else if (parsed && parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
          return parsed.items;
        }
      } catch (e) {}
    }
    // Fallback defaults for value / execution
    if (sectionKey === 'value' || sectionKey === 'execution' || sectionKey === 'engagement') {
      return [
        { title: 'Task Automation', description: 'DevOps and backend architecture screened for proven technical capability, eliminating repetitive manual operations.' },
        { title: 'Agentic Workflows', description: 'Speeds up execution by connecting systems and streamlining processes across different tools and multi-agent LLM pipelines.' },
        { title: 'Cost Efficiency', description: 'Lowers operational costs by minimizing manual effort and optimizing compute, caching, and serverless resource utilization.' },
        { title: 'Resource Efficiency', description: 'Optimizes the use of people, time, and systems by ensuring architecture tasks are handled intelligently with minimal waste.' }
      ];
    }
    // Fallback defaults for process / credentials
    if (sectionKey === 'process' || sectionKey === 'credentials') {
      return [
        { title: 'Tell Us What You Need', description: 'One quick conversation. Tell us about your team, tech stack, and goals.', badge: '01' },
        { title: 'Build Your Match Within 24 Hours', description: 'We match AI developers to your stack and workflow. You review them.', badge: '02' },
        { title: 'Start Shipping Immediately', description: 'Your engineer is embedded, onboarded and contributing.', badge: '03' }
      ];
    }
    return [];
  }

  refreshPages(): void {
    this.api.getPages().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.ngZone.run(() => {
            this.pagesSubject.next(res.data);
          });
        }
      },
      error: () => {}
    });
  }

  constructor(
    private api: PortfolioApiService,
    private ngZone: NgZone
  ) {
    this.initDefaultData();
    this.loadDynamicData();
    this.refreshPages();
    if (this.profile.favicon) {
      this.updateFavicon(this.profile.favicon);
    }
  }

  private initDefaultData(): void {
    // Initial fallback pages matching seeded data
    this.pagesSubject.next([
      {
        id: 1,
        slug: '',
        title: 'Home',
        navTitle: 'Home',
        isVisible: true,
        showInNav: true,
        showInFooter: true,
        isSystem: true,
        displayOrder: 1,
        sectionCount: 9,
        sections: []
      },
      {
        id: 3,
        slug: 'services',
        title: 'Services & Pillars',
        navTitle: 'Services',
        isVisible: true,
        showInNav: true,
        showInFooter: true,
        isSystem: true,
        displayOrder: 2,
        sectionCount: 5,
        sections: []
      },
      {
        id: 4,
        slug: 'expertise',
        title: 'Technical Radar & Stacks',
        navTitle: 'Expertise',
        isVisible: true,
        showInNav: true,
        showInFooter: true,
        isSystem: true,
        displayOrder: 3,
        sectionCount: 4,
        sections: []
      },
      {
        id: 5,
        slug: 'projects',
        title: 'Portfolio & Case Studies',
        navTitle: 'Portfolio',
        isVisible: true,
        showInNav: true,
        showInFooter: true,
        isSystem: true,
        displayOrder: 4,
        sectionCount: 4,
        sections: []
      },
      {
        id: 2,
        slug: 'about',
        title: 'About NEXVOYS',
        navTitle: 'About',
        isVisible: true,
        showInNav: true,
        showInFooter: true,
        isSystem: true,
        displayOrder: 5,
        sectionCount: 6,
        sections: []
      },
      {
        id: 6,
        slug: 'contact',
        title: 'Consultation & Contact',
        navTitle: 'Contact Us',
        isVisible: true,
        showInNav: true,
        showInFooter: true,
        isSystem: true,
        displayOrder: 6,
        sectionCount: 3,
        sections: []
      }
    ]);

    // Initial fallback data matching seeded static data
    this.projectsSubject.next([
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
    ]);

    this.servicesSubject.next([
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
    ]);

    this.accordionServicesSubject.next([
      {
        index: '//01',
        title: 'AI & Data Innovation',
        shortDesc: 'Build Intelligent Products Using AI, Machine Learning, And Advanced Data Engineering.',
        bullets: ['Agent As a Service', 'AI Product Development', 'Autonomous Agentic AI', 'Enterprise RAG & Vector DBs'],
        image: 'assets/img/project-3.jpg',
        route: '/expertise'
      },
      {
        index: '//02',
        title: 'Custom Software Development',
        shortDesc: 'End-to-End Scalable Architectures Tailored for Startup MVPs & High-Growth SaaS Platforms.',
        bullets: ['Multi-Tenant SaaS Platforms', 'Automated Stripe Billing', 'Dynamic Subdomain Routers', 'Clean RBAC Data Isolation'],
        image: 'assets/img/project-1.jpg',
        route: '/services'
      },
      {
        index: '//03',
        title: 'Enterprise .NET & CPQ Engines',
        shortDesc: 'Modern High-Throughput C# / .NET 9 WebAPIs, Microservices, and Dynamic Pricing Systems.',
        bullets: ['.NET 9 & ASP.NET WebAPI', 'Dynamic CPQ Price Calculation', 'Asynchronous Event-Bus', 'Monolith to Microservices Modernization'],
        image: 'assets/img/project-2.jpg',
        route: '/services'
      },
      {
        index: '//04',
        title: 'Cloud Scaling & Cost Optimization',
        shortDesc: 'Resilient Azure & AWS Cloud Infrastructure Engineered to Cut Operating Bills by up to 25%.',
        bullets: ['25% Cloud Cost Reduction', 'Kubernetes & Docker Clusters', 'Zero-Downtime Blue/Green CI/CD', 'Distributed In-Memory Redis Caching'],
        image: 'assets/img/project-4.jpg',
        route: '/expertise'
      }
    ]);

    this.experiencesSubject.next([
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
    ]);

    this.educationsSubject.next([
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
    ]);

    this.certificationsSubject.next([
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
    ]);

    this.industriesSubject.next([
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
    ]);

    this.testimonialsSubject.next([
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
    ]);
  }

  loadDynamicData(): void {
    // 1. Settings
    this.api.getSettings().subscribe({
      next: res => {
        if (res.success && res.data) {
          const d = res.data;
          this.profile.name = d.companyName || this.profile.name;
          this.profile.tagline = d.tagline || this.profile.tagline;
          this.profile.role = d.role || this.profile.role;
          this.profile.email = d.email || this.profile.email;
          this.profile.phone = d.phone || this.profile.phone;
          this.profile.displayPhone = d.displayPhone || this.profile.displayPhone;
          this.profile.location = d.location || this.profile.location;
          this.profile.linkedinUrl = d.linkedinUrl || this.profile.linkedinUrl;
          this.profile.cvPath = d.cvPath || this.profile.cvPath;
          this.profile.logoDark = d.logoDark || this.profile.logoDark;
          this.profile.logoLight = d.logoLight || this.profile.logoLight;
          this.profile.favicon = d.favicon || this.profile.favicon;
          if (this.profile.favicon) {
            this.updateFavicon(this.profile.favicon);
          }
          this.profile.footerBio = d.footerBio || this.profile.footerBio;
          this.profile.copyrightText = d.copyrightText || this.profile.copyrightText;
          if (d.tickerTexts && d.tickerTexts.length > 0) {
            this.profile.tickerTexts = d.tickerTexts;
          }
          this.settingsSubject.next(d);
        }
      },
      error: () => {}
    });

    // 2. Projects
    this.api.getProjects().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.projectsSubject.next(res.data);
        }
      },
      error: () => {}
    });

    // 3. Services
    this.api.getServices().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.servicesSubject.next(res.data);
        }
      },
      error: () => {}
    });

    // 4. Accordion Services
    this.api.getAccordionServices().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.accordionServicesSubject.next(res.data);
        }
      },
      error: () => {}
    });

    // 5. Experiences
    this.api.getExperiences().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.experiencesSubject.next(res.data);
        }
      },
      error: () => {}
    });

    // 6. Educations
    this.api.getEducations().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.educationsSubject.next(res.data);
        }
      },
      error: () => {}
    });

    // 7. Certifications
    this.api.getCertifications().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.certificationsSubject.next(res.data);
        }
      },
      error: () => {}
    });

    // 8. Testimonials
    this.api.getTestimonials().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.testimonialsSubject.next(res.data);
        }
      },
      error: () => {}
    });

    // 9. Industries
    this.api.getIndustries().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.industriesSubject.next(res.data);
        }
      },
      error: () => {}
    });
  }

  refreshData(): void {
    this.loadDynamicData();
  }

  showToast(message: string, durationMs: number = 3000): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.ngZone.run(() => {
      this.toastSubject.next(message);
    });
    this.toastTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.toastSubject.next(null);
      });
      this.toastTimeout = null;
    }, durationMs);
  }

  clearToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.ngZone.run(() => {
      this.toastSubject.next(null);
    });
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

  updateFavicon(iconUrl: string): void {
    if (!iconUrl || typeof document === 'undefined') return;
    try {
      const lower = iconUrl.toLowerCase();
      let mimeType = 'image/png';
      if (lower.endsWith('.ico')) {
        mimeType = 'image/x-icon';
      } else if (lower.endsWith('.svg')) {
        mimeType = 'image/svg+xml';
      } else if (lower.endsWith('.gif')) {
        mimeType = 'image/gif';
      } else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.jfif')) {
        mimeType = 'image/jpeg';
      }

      const cleanUrl = iconUrl.trim();
      const cacheBustUrl = cleanUrl.includes('?') ? `${cleanUrl}&v=${Date.now()}` : `${cleanUrl}?v=${Date.now()}`;

      // Remove all existing icon links
      const existingIcons = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      existingIcons.forEach(el => el.remove());

      // Create new dynamic icon link
      const newIcon = document.createElement('link');
      newIcon.id = 'app-dynamic-favicon';
      newIcon.rel = 'icon';
      newIcon.type = mimeType;
      newIcon.href = cacheBustUrl;
      document.head.appendChild(newIcon);

      // Create shortcut icon link
      const shortcut = document.createElement('link');
      shortcut.id = 'app-dynamic-favicon-shortcut';
      shortcut.rel = 'shortcut icon';
      shortcut.href = cacheBustUrl;
      document.head.appendChild(shortcut);

      // Create apple touch icon link
      const appleIcon = document.createElement('link');
      appleIcon.id = 'app-dynamic-favicon-apple';
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.href = cacheBustUrl;
      document.head.appendChild(appleIcon);
    } catch (e) {
      console.warn('Could not update browser favicon dynamically:', e);
    }
  }
}
