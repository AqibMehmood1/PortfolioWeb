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
    tagline: 'Founder-led Architecture Partner for Startups & SMBs',
    role: 'Principal Solutions Architect & Founder',
    email: 'hello@nexvoys.com',
    phone: '+923456466188',
    displayPhone: '+92 345 6466188',
    location: 'Lahore HQ · Serving Clients Worldwide',
    linkedinUrl: 'https://www.linkedin.com/company/nex-voys/posts/?feedView=all',
    cvPath: 'assets/Bilal_CV.pdf',
    logoDark: 'assets/nexvoys/black-logo.png',
    logoLight: 'assets/nexvoys/white-logo.png',
    favicon: 'assets/nexvoys/nex-fav.png',
    footerBio: 'Nexvoys is a founder-led architecture and engineering partner for startups and SMBs building SaaS and AI products. Senior-only execution with zero junior handoffs.',
    copyrightText: '© 2026 NEXVOYS Ltd. All rights reserved. Senior Architecture & Advisory.',
    tickerTexts: [] as string[]
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
      } catch (e) { }
    }
    // Fallback defaults for value / execution
    if (sectionKey === 'value' || sectionKey === 'execution' || sectionKey === 'engagement') {
      return [
        { title: 'Direct Architect Access', description: 'You work directly with a principal architect with 9+ years shipping production software — no account managers, no junior hand-offs.' },
        { title: '100% Code & IP Ownership', description: 'You own every line of code, deployment script, and architecture diagram. Zero proprietary vendor lock-in.' },
        { title: 'Cloud Cost Discipline', description: 'We design cloud systems to be lean by default, rightsizing compute resources and cutting wasteful infrastructure overhead.' },
        { title: 'Time-Zone Alignment', description: 'Dedicated working overlap for Americas, EMEA, and APAC time zones ensuring seamless daily collaboration.' }
      ];
    }
    // Fallback defaults for about page milestones
    if (sectionKey === 'milestones') {
      return [
        { title: 'Launch of Specialized .NET & Cloud Architecture Studio', description: 'Founded Nexvoys as an elite engineering practice specializing in distributed .NET architecture, high-concurrency cloud systems, and multi-tenant database partitioning for North American and European clients.', badge: '2021 · Foundation', icon: 'fas fa-rocket' },
        { title: 'Sub-Second CPQ & High-Throughput Engines', description: 'Engineered enterprise CPQ (Configure, Price, Quote) engines and payment processing pipelines, slashing calculation latency from 3 hours to under 30 seconds across high-volume transactions.', badge: '2022 · Scale', icon: 'fas fa-bolt' },
        { title: 'Global Multi-Market Delivery', description: 'Expanded direct client delivery footprint across international markets worldwide. Shipped production platforms maintaining an audited 99.99% uptime SLA with zero-downtime deployment pipelines.', badge: '2023 · Expansion', icon: 'fas fa-globe' },
        { title: 'Autonomous AI Agents & .NET 9 Cloud Modernization', description: 'Pioneering deterministic enterprise GenAI agent pipelines, vector search platforms, and cloud modernization to .NET 9 for next-generation enterprise SaaS systems.', badge: '2024–Present · Next-Gen', icon: 'fas fa-brain' }
      ];
    }
    // Fallback defaults for about page credentials (company standards)
    if (pageSlug === 'about' && sectionKey === 'credentials') {
      return [
        { title: 'Total Client IP & Repository Ownership', description: 'Every line of source code, deployment script, infrastructure-as-code template, and architecture document belongs exclusively to you from day one. Zero proprietary vendor lock-in.', badge: '01 · Legal & IP', icon: 'fas fa-code-branch' },
        { title: 'Direct Principal Engineering Oversight', description: 'Engagements are steered and authored by senior principal architects. We do not use account managers or hand off your core architecture to junior, unvetted subcontractors.', badge: '02 · Quality', icon: 'fas fa-user-shield' },
        { title: 'Multi-Timezone Synchronized Delivery', description: 'Dedicated overlapping working hours across US Eastern/Pacific, European CET, and APAC time zones for rapid code reviews, sprint alignment, and seamless real-time collaboration.', badge: '03 · Velocity', icon: 'fas fa-clock' },
        { title: 'Enterprise Security & SOC2/OWASP Compliance', description: 'Production code is built against OWASP Top 10 standards, automated static analysis (SAST), strict secret management, and full NDA confidentiality protocols.', badge: '04 · Security', icon: 'fas fa-shield-alt' }
      ];
    }
    // Fallback defaults for process / credentials
    if (sectionKey === 'process' || sectionKey === 'credentials') {
      return [
        { title: 'Discovery Call', description: 'A 30-minute technical session to understand your architecture bottlenecks, timeline, and growth goals.', badge: '01' },
        { title: 'Blueprint or Fixed-Fee Audit', description: 'A concrete system blueprint, data isolation schema, or 2-week architecture audit with prioritized roadmap.', badge: '02' },
        { title: 'Senior Build & Modernize', description: 'Principal-led engineering with .NET 9, Azure, Angular/React, and AI agents with rigorous code quality.', badge: '03' },
        { title: 'Handover & Enablement', description: 'Written architecture documentation, test coverage, and complete team handover with zero lock-in.', badge: '04' }
      ];
    }
    // Fallback defaults for problems
    if (sectionKey === 'problems') {
      return [
        { title: 'Cloud Costs Outpacing Revenue', description: 'Unoptimized Azure and AWS compute eating into margins. We identify waste, right-size infrastructure, and cut cloud spend by up to 25% without sacrificing throughput.', badge: 'amber', icon: 'fas fa-chart-line' },
        { title: 'Monolithic Bottlenecks', description: 'Legacy .NET codebases holding back release velocity. We re-architect incrementally to clean .NET 9 and event-driven microservices with zero customer downtime.', badge: 'red', icon: 'fas fa-cubes' },
        { title: 'AI Pipelines Failing in Production', description: 'Prototypes that hit latency and hallucination walls. We build enterprise RAG pipelines with deterministic guardrails and scalable vector search.', badge: 'blue', icon: 'fas fa-robot' },
        { title: 'Missing Senior Tech Lead', description: 'Startups needing strategic architectural governance without the $250k+ full-time CTO overhead. We serve as fractional principal architects guiding your engineers.', badge: 'green', icon: 'fas fa-user-shield' }
      ];
    }
    // Fallback defaults for proof-strip
    if (sectionKey === 'proof-strip') {
      return [
        { title: 'Shipping Production Systems', description: 'Audited enterprise platforms', badge: '9+ Years', icon: 'fas fa-history' },
        { title: 'Global Client Footprint', description: 'Worldwide client delivery footprint', badge: 'Worldwide', icon: 'fas fa-globe' },
        { title: 'CPQ Turnaround (from 3 hrs)', description: 'Automated pricing calculation', badge: '< 30 Seconds', icon: 'fas fa-bolt' },
        { title: 'Cloud Cost Optimization', description: 'FinOps Azure & AWS reduction', badge: 'Up to 25%', icon: 'fas fa-chart-line' }
      ];
    }
    // Fallback defaults for diagnostic-audit
    if (sectionKey === 'diagnostic-audit') {
      return [
        { title: 'Fixed fee', description: 'from $2,500 with zero surprise overages', badge: 'Fixed Fee', icon: 'fas fa-check-circle' },
        { title: 'Delivery', description: '10 business days direct turnaround', badge: '10 Days', icon: 'fas fa-clock' },
        { title: 'Deliverables', description: 'FinOps savings breakdown + 90-day prioritized remediation roadmap', badge: 'Deliverables', icon: 'fas fa-file-contract' }
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
      error: () => { }
    });
  }

  constructor(
    private api: PortfolioApiService,
    private ngZone: NgZone
  ) {
    this.initDefaultData();
    this.loadDynamicData();
    this.refreshPages();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = localStorage.getItem('cached_site_favicon');
        if (cached) {
          this.profile.favicon = cached;
        }
      }
    } catch { }
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
        liveUrl: '',
        highlights: ['Sub-second response time', 'Modern reactive TypeScript state', 'Global CDN edge caching']
      },
      {
        id: 'odtool',
        title: 'ODTool Quotation Engine',
        category: 'Enterprise CPQ & Calculation System',
        filterCategory: 'dotnet',
        image: 'assets/img/ODTool.png',
        gif: 'assets/img/OdooTools.gif',
        description: 'Custom quotation calculation engine replacing spreadsheet pricing workflows with an automated system delivering quotes in under 30 seconds.',
        problem: 'Sales and estimation teams spent over 3 hours daily calculating complex custom equipment quotes in spreadsheets with calculation drift and quote turnaround delays.',
        architecture: 'Developed an automated calculation engine powered by .NET Core, C#, SQL Server, and an Angular frontend with granular role-based permissions.',
        tech: ['.NET Core', 'C#', 'SQL Server', 'Angular', 'Azure App Services'],
        liveUrl: '',
        highlights: ['Turnaround: 3 hrs to under 30 seconds', 'Automated pricing formula engine', 'Granular RBAC & audit logging']
      },
      {
        id: 'eurobank',
        title: 'Eurobank Banking Portal',
        category: 'Secure Banking & Customer Portal',
        filterCategory: 'dotnet',
        image: 'assets/img/Eurobank.png',
        gif: 'assets/img/EUROBank.gif',
        description: 'High-security banking customer portal engineered with enterprise authentication, role-based authorization, and resilient account workflows.',
        problem: 'Required a secure digital banking customer portal with high concurrency handling, OAuth2/JWT security boundaries, and reliable audit records.',
        architecture: 'Built on ASP.NET Core with microservices backend, Entity Framework Core, SQL Server clustering, and encrypted OAuth2/JWT security barriers.',
        tech: ['ASP.NET Core', 'C#', 'Security / RBAC', 'SQL Server', 'Microservices'],
        liveUrl: '',
        highlights: ['Enterprise OAuth2/JWT Security', 'High Concurrency Resilience', 'Role-Based Access Control']
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
        liveUrl: '',
        highlights: ['25% Cloud Cost Reduction', 'Multi-Tenant Data Isolation', 'Automated CI/CD Pipelines']
      },
      {
        id: 'medikea',
        title: 'Medikea Healthcare Platform',
        category: 'HealthTech & Telemedicine System',
        filterCategory: 'health',
        image: 'assets/img/Medikea.png',
        gif: 'assets/img/Medikea.gif',
        description: 'Telemedicine and health portal streamlining patient appointments, remote consultations, and digital health records.',
        problem: 'Healthcare providers lacked a unified digital portal to manage patient appointments, video consultations, and real-time electronic records.',
        architecture: 'Engineered a secure React and Node.js platform with PostgreSQL and WebSockets for encrypted doctor-patient interactions and appointment queues.',
        tech: ['React', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure', 'WebSockets'],
        liveUrl: '',
        highlights: ['Health-grade technical safeguards', 'Encrypted doctor-patient messaging', 'WebSockets consultation queues']
      },
      {
        id: 'linkcenter',
        title: 'LinksCenter Portal',
        category: 'High-Traffic Web & Directory System',
        filterCategory: 'web',
        image: 'assets/img/linkcenter2.png',
        gif: 'assets/img/LinksWeb.gif',
        description: 'High-volume link curation and discovery portal optimized with .NET Core and distributed Redis caching to sustain high concurrency traffic spikes.',
        problem: 'High concurrency traffic spikes caused slow database queries, impacting SEO rankings and user retention metrics.',
        architecture: 'Refactored backend data access in .NET Core with Redis distributed caching layer and Cloudflare edge CDN, lowering page loads by 40%.',
        tech: ['.NET Core', 'SQL Server', 'Redis Caching', 'Bootstrap 5', 'Cloudflare'],
        liveUrl: '',
        highlights: ['Distributed Redis caching layer', 'High-concurrency query optimization', '40% response time improvement']
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
        title: 'SaaS Product Architecture',
        shortDesc: 'Multi-tenant foundations, tenant data isolation, subscription billing, and elastic cloud scaling.',
        bullets: ['Multi-Tenant Database Schema Partitioning', 'Stripe & Subscription Billing Workflows', 'Elastic Cloud Auto-Scaling & CDN Edge', 'Granular RBAC Security & Audit Logs'],
        image: 'assets/img/Cloudoor.png',
        route: '/services'
      },
      {
        index: '//02',
        title: 'AI Agents & Automation',
        shortDesc: 'Autonomous LLM tool-calling agents, enterprise RAG vector retrieval, and intelligent workflow pipelines.',
        bullets: ['Autonomous Task & Reasoning Agents', 'Enterprise RAG with Vector Databases', 'LangChain & Semantic Kernel Pipelines', 'Document Parsing & Automated Data Workflows'],
        image: 'assets/img/ODTool.png',
        route: '/services'
      },
      {
        index: '//03',
        title: 'Cloud Cost Optimization',
        shortDesc: 'Infrastructure audits, containerization, and workload rightsizing that cut operating costs by up to 25%.',
        bullets: ['Up to 25% Cloud Cost Reduction', 'Azure & AWS Compute Rightsizing', 'Docker Containerization & Kubernetes', 'Distributed In-Memory Redis Caching'],
        image: 'assets/img/Cloudoor.png',
        route: '/services'
      },
      {
        index: '//04',
        title: '.NET Modernization',
        shortDesc: 'Upgrading monolithic legacy .NET Framework applications into high-throughput .NET 9 microservices and reactive SPAs.',
        bullets: ['Monolith to Microservices Roadmap', 'Legacy .NET Framework to .NET 9 Upgrade', 'Sub-Second Response Time Optimization', 'High-Throughput WebAPI & gRPC Contracts'],
        image: 'assets/img/Eurobank.png',
        route: '/services'
      }
    ]);

    this.experiencesSubject.next([
      {
        title: 'Founder & Principal Solutions Architect',
        period: 'Feb 2024 - Present · 2 yrs+',
        company: 'NEXVOYS',
        location: 'Lahore HQ · Global Remote & Worldwide Delivery',
        description: 'Partnering directly with startups, SMBs, and enterprise leaders worldwide to architect multi-tenant SaaS products, AI Agents, and distributed cloud applications that scale seamlessly.',
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
        institution: 'Superior University · Lahore, Pakistan',
        description: 'Comprehensive curriculum covering Distributed Computing, Software Architecture, Advanced Data Structures, Relational Database Systems, Object-Oriented Design, and Software Quality Assurance.'
      }
    ]);

    this.certificationsSubject.next([
      {
        title: 'Microsoft Azure Solutions Architecture',
        level: 'Cloud Architecture',
        issuer: 'Microsoft Azure Stack',
        description: 'Architecture of scalable multi-tenant cloud systems, microservices isolation, containerized workloads, and Azure PaaS services.'
      },
      {
        title: 'Enterprise C# & .NET 9 Core Architecture',
        level: 'Backend Systems',
        issuer: 'Microsoft Technology Stack',
        description: 'Deep mastery in modern C# asynchronous patterns, memory optimization, Dependency Injection, and microservices architecture.'
      },
      {
        title: 'ASP.NET Core WebAPI & Distributed Systems',
        level: 'High-Throughput APIs',
        issuer: 'Distributed Web Systems',
        description: 'RESTful API design, database connection pooling, distributed caching with Redis, and OAuth2/JWT security.'
      },
      {
        title: 'Agile Architecture & Systems Governance',
        level: 'Systems Leadership',
        issuer: 'Agile Software Development',
        description: 'Architecture roadmapping, technical debt governance, continuous integration delivery, and secure code review standards.'
      }
    ]);

    this.industriesSubject.next([
      {
        title: 'Fintech & Digital Banking',
        icon: 'fas fa-shield-alt',
        desc: 'Secure, high-availability customer portals, strict RBAC authorization, and resilient account workflows.',
        project: 'Eurobank Banking Portal',
        metric: 'High Concurrency Resilience'
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
        desc: 'Encrypted patient consultation pipelines, WebSockets live messaging, and health-grade technical safeguards.',
        project: 'Medikea Health Platform',
        metric: 'WebSockets Queues'
      },
      {
        title: 'Enterprise CPQ & Pricing Engines',
        icon: 'fas fa-calculator',
        desc: 'Dynamic formula calculation engines that replace error-prone manual spreadsheets with automated workflows.',
        project: 'ODTool Quotation Engine',
        metric: '3 Hours to Under 30s'
      },
      {
        title: 'High-Traffic Web Portals & SPAs',
        icon: 'fas fa-bolt',
        desc: 'Distributed Redis caching, non-blocking asynchronous APIs, and CDN edge optimization for instant render.',
        project: 'Scrole & LinksCenter',
        metric: 'Sub-Second Response'
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
        quote: 'Bilal architected our dynamic CPQ calculation engine from the ground up. His architectural leadership cut our quotation turnaround from 3 hours to under 30 seconds.',
        author: 'Odyssey Design Leadership',
        role: 'San Antonio, TX · Contract Engagement',
        tag: 'Enterprise .NET & CPQ'
      },
      {
        quote: 'Nexvoys provided principal-level architecture for our AI agent workflows and cloud infrastructure in Paris. Deep technical discipline with zero overhead.',
        author: 'Pulstech Engineering Leadership',
        role: 'Paris, France · Contract Engagement',
        tag: 'Cloud & AI Architecture'
      },
      {
        quote: 'Architected our multi-tenant SaaS infrastructure on Azure with clean data isolation and reduced our monthly cloud bill by 25%.',
        author: 'Cloudoor Technology Team',
        role: 'San Francisco, CA · Contract Engagement',
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
      error: () => { }
    });

    // 2. Projects
    this.api.getProjects().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.projectsSubject.next(res.data);
        }
      },
      error: () => { }
    });

    // 3. Services
    this.api.getServices().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.servicesSubject.next(res.data);
        }
      },
      error: () => { }
    });

    // 4. Accordion Services
    this.api.getAccordionServices().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.accordionServicesSubject.next(res.data);
        }
      },
      error: () => { }
    });

    // 5. Experiences
    this.api.getExperiences().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.experiencesSubject.next(res.data);
        }
      },
      error: () => { }
    });

    // 6. Educations
    this.api.getEducations().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.educationsSubject.next(res.data);
        }
      },
      error: () => { }
    });

    // 7. Certifications
    this.api.getCertifications().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.certificationsSubject.next(res.data);
        }
      },
      error: () => { }
    });

    // 8. Testimonials
    this.api.getTestimonials().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.testimonialsSubject.next(res.data);
        }
      },
      error: () => { }
    });

    // 9. Industries
    this.api.getIndustries().subscribe({
      next: res => {
        if (res.success && res.data && res.data.length > 0) {
          this.industriesSubject.next(res.data);
        }
      },
      error: () => { }
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
    if (typeof document === 'undefined') return;
    try {
      const cleanUrl = (iconUrl || 'assets/nexvoys/nex-fav.png').trim();
      if (!iconUrl) {
        try { localStorage.removeItem('cached_site_favicon'); } catch { }
      }

      const cacheBustUrl = cleanUrl.includes('?')
        ? `${cleanUrl}&v=${Date.now()}`
        : `${cleanUrl}?v=${Date.now()}`;

      // In-place link updater to prevent Chromium from dropping tab favicon association
      const applyFaviconTags = (href: string, type: string = 'image/png') => {
        const updateLink = (id: string, rel: string) => {
          let link = document.getElementById(id) as HTMLLinkElement | null;
          if (!link) {
            link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
          }
          if (!link) {
            link = document.createElement('link');
            link.id = id;
            link.rel = rel;
            document.head.appendChild(link);
          }
          link.type = type;
          link.href = href;
        };

        updateLink('app-dynamic-favicon', 'icon');
        updateLink('app-dynamic-favicon-shortcut', 'shortcut icon');
        updateLink('app-dynamic-favicon-apple', 'apple-touch-icon');
      };

      // 1. Immediately apply direct cache-busted URL
      const lower = cleanUrl.toLowerCase();
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

      applyFaviconTags(cacheBustUrl, mimeType);

      // 2. Offscreen Canvas conversion to pure PNG data URI:
      // Chrome/Edge/Firefox tab strips require true PNG or ICO and often fail or ignore JPEG/JFIF.
      // Generating a PNG Data URL guarantees universal display and updates the tab strip immediately.
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, 64, 64);
            const pngDataUrl = canvas.toDataURL('image/png');
            applyFaviconTags(pngDataUrl, 'image/png');

            try {
              localStorage.setItem('cached_site_favicon', pngDataUrl);
            } catch { }
          }
        } catch {
          // If canvas conversion is blocked, direct URL remains active
        }
      };
      img.onerror = () => {
        // Direct link remains active as fallback
      };
      img.src = cacheBustUrl;
    } catch (e) {
      console.warn('Could not update browser favicon dynamically:', e);
    }
  }
}
