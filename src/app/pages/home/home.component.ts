import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Typed from 'typed.js';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioApiService } from '../../services/portfolio-api.service';
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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  featuredProjects: ProjectItem[] = [];
  allServices: ServiceItem[] = [];
  selectedHeroFocus: string = 'SaaS Architecture & Scale';
  activeArchTab: 'saas' | 'ai' | 'cloud' = 'saas';
  private typedInstance: Typed | null = null;
  isSubmittingInquiry: boolean = false;
  heroSuccessMsg: string | null = null;
  heroErrorMsg: string | null = null;
  private heroMsgTimeout: any = null;
  homeStats: any[] = [];

  // Bottom Contact Hub Form State
  bottomContactForm = {
    fullName: '',
    email: '',
    subject: '',
    message: ''
  };
  isSubmittingBottom: boolean = false;
  bottomSuccessMsg: string | null = null;
  bottomErrorMsg: string | null = null;
  private bottomMsgTimeout: any = null;

  get industries() {
    return this.portfolioService.industries;
  }

  get testimonials() {
    return this.portfolioService.testimonials;
  }

  // Hero Data
  heroData = {
    headline: 'Senior architecture for SaaS and AI products that need to scale.',
    subtitle: 'Nexvoys is an elite architecture and engineering partner for startups, scale-ups, and enterprises worldwide. You collaborate directly with principal architects with 9+ years shipping .NET, Azure and AI systems — from first blueprint to production.',
    typedStrings: [
      'Senior Solutions Architecture',
      'Scalable SaaS & Multi-Tenancy',
      'Autonomous AI Agents & GenAI',
      'Azure & AWS Cloud Cost Tuning',
      '.NET 9 & Microservices Modernization',
      'Fractional Principal Architect'
    ]
  };

  // InvoZone Hero Inquiry Form State
  inquiryForm = {
    fullName: '',
    email: '',
    phone: '',
    techStack: 'Multi-Tenant SaaS Architecture',
    message: '',
    agreed: false
  };

  // InvoZone Services Accordion State
  activeServiceIndex: number = 0;
  servicesAccordion: AccordionService[] = [];

  // InvoZone Tech Stacks Matrix State
  activeStackCategory: string = 'ai';
  stackSearchQuery: string = '';

  stackCategories: Record<string, TechTile[]> = {
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

  constructor(
    public portfolioService: PortfolioService,
    private api: PortfolioApiService,
    private router: Router
  ) {}

  isSectionVisible(sectionKey: string): boolean {
    return this.portfolioService.isSectionVisible('', sectionKey);
  }

  getSection(sectionKey: string) {
    return this.portfolioService.getSection('', sectionKey);
  }

  getSectionCards(sectionKey: string) {
    return this.portfolioService.getSectionCards('', sectionKey);
  }

  get customSections() {
    return this.portfolioService.getCustomSections('');
  }

  get proofCards() {
    const cards = this.getSectionCards('proof-strip');
    if (cards && cards.length > 0) return cards;
    return [
      { badge: '9+ Years', title: 'Shipping Production Systems', description: 'Shipping Production Systems' },
      { badge: '4 Key Markets', title: 'Clients in US, CA, SG & CY', description: 'Clients in US, CA, SG & CY' },
      { badge: '< 30 Seconds', title: 'CPQ Turnaround (from 3 hrs)', description: 'CPQ Turnaround (from 3 hrs)' },
      { badge: 'Up to 25%', title: 'Cloud Cost Optimization', description: 'Cloud Cost Optimization' }
    ];
  }

  get problemCards() {
    const cards = this.getSectionCards('problems');
    if (cards && cards.length > 0) return cards;
    return [
      { title: 'Cloud Costs Outpacing Revenue', description: 'Unoptimized Azure and AWS compute eating into margins. We identify waste, right-size infrastructure, and cut cloud spend by up to 25% without sacrificing throughput.', badge: 'amber', icon: 'fas fa-chart-line' },
      { title: 'Monolithic Bottlenecks', description: 'Legacy .NET codebases holding back release velocity. We re-architect incrementally to clean .NET 9 and event-driven microservices with zero customer downtime.', badge: 'red', icon: 'fas fa-cubes' },
      { title: 'AI Pipelines Failing in Production', description: 'Prototypes that hit latency and hallucination walls. We build enterprise RAG pipelines with deterministic guardrails and scalable vector search.', badge: 'blue', icon: 'fas fa-robot' },
      { title: 'Missing Senior Tech Lead', description: 'Startups needing strategic architectural governance without the $250k+ full-time CTO overhead. We serve as fractional principal architects guiding your engineers.', badge: 'green', icon: 'fas fa-user-shield' }
    ];
  }

  get auditCards() {
    const cards = this.getSectionCards('diagnostic-audit');
    if (cards && cards.length > 0) return cards;
    return [
      { title: 'Fixed fee', description: 'from $2,500', icon: 'fas fa-check-circle' },
      { title: 'Delivery', description: '10 business days', icon: 'fas fa-check-circle' },
      { title: 'Deliverables', description: 'FinOps savings breakdown + 90-day prioritized remediation roadmap', icon: 'fas fa-check-circle' }
    ];
  }

  getProblemIconStyle(badge?: string): { [key: string]: string } {
    const b = (badge || '').toLowerCase().trim();
    if (b === 'amber' || b === 'yellow' || b === 'warning') {
      return { 'background': 'rgba(234, 179, 8, 0.12)', 'color': '#d97706' };
    }
    if (b === 'red' || b === 'coral' || b === 'danger') {
      return { 'background': 'rgba(239, 68, 68, 0.12)', 'color': '#dc2626' };
    }
    if (b === 'blue' || b === 'info') {
      return { 'background': 'rgba(59, 130, 246, 0.12)', 'color': '#2563eb' };
    }
    if (b === 'green' || b === 'emerald' || b === 'success') {
      return { 'background': 'rgba(34, 197, 94, 0.12)', 'color': '#16a34a' };
    }
    return { 'background': 'rgba(16, 185, 129, 0.12)', 'color': '#059669' };
  }

  ngOnInit(): void {
    // Subscribe to dynamic portfolio service data
    this.portfolioService.projects$.subscribe(projects => {
      this.featuredProjects = projects;
    });

    this.portfolioService.services$.subscribe(services => {
      this.allServices = services;
    });

    this.portfolioService.accordionServices$.subscribe(accServices => {
      this.servicesAccordion = accServices;
    });

    // Load dynamic home hero content from API
    this.api.getHomeContent().subscribe({
      next: res => {
        if (res.success && res.data) {
          if (res.data.headline) this.heroData.headline = res.data.headline;
          if (res.data.subtitle) this.heroData.subtitle = res.data.subtitle;
          if (res.data.typedStrings && res.data.typedStrings.length > 0) {
            this.heroData.typedStrings = res.data.typedStrings;
            this.reinitTyped();
          }
          if (res.data.stats && res.data.stats.length > 0) {
            this.homeStats = res.data.stats;
          }
        }
      },
      error: () => {}
    });

    // Load dynamic technologies from API
    this.api.getTechnologiesGrouped().subscribe({
      next: res => {
        if (res.success && res.data && Object.keys(res.data).length > 0) {
          this.stackCategories = res.data;
        }
      },
      error: () => {}
    });
  }

  ngAfterViewInit(): void {
    this.reinitTyped();
  }

  private reinitTyped(): void {
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }
    const el = document.querySelector('.typed-text');
    if (el) {
      this.typedInstance = new Typed('.typed-text', {
        strings: this.heroData.typedStrings,
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
    if (this.heroMsgTimeout) {
      clearTimeout(this.heroMsgTimeout);
    }
    if (this.bottomMsgTimeout) {
      clearTimeout(this.bottomMsgTimeout);
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
    if (this.heroMsgTimeout) clearTimeout(this.heroMsgTimeout);
    this.heroSuccessMsg = null;
    this.heroErrorMsg = null;

    if (!this.inquiryForm.fullName.trim() || !this.inquiryForm.email.trim() || !this.inquiryForm.message.trim()) {
      this.heroErrorMsg = 'Please complete all required fields (Name, Work Email, and Message).';
      this.heroMsgTimeout = setTimeout(() => {
        this.heroErrorMsg = null;
      }, 5000);
      return;
    }

    if (!this.inquiryForm.agreed) {
      this.heroErrorMsg = 'Please agree to the privacy policy to proceed.';
      this.heroMsgTimeout = setTimeout(() => {
        this.heroErrorMsg = null;
      }, 5000);
      return;
    }

    this.isSubmittingInquiry = true;
    this.api.submitContactInquiry({
      name: this.inquiryForm.fullName.trim(),
      email: this.inquiryForm.email.trim(),
      phone: this.inquiryForm.phone.trim(),
      company: '',
      subject: `Inquiry: ${this.inquiryForm.techStack}`,
      techStack: this.inquiryForm.techStack,
      message: this.inquiryForm.message.trim()
    }).subscribe({
      next: (res) => {
        this.isSubmittingInquiry = false;
        const sender = this.inquiryForm.fullName;
        this.heroSuccessMsg = res.message || `Thank you, ${sender}! Your inquiry has been sent successfully. We will follow up shortly.`;
        this.portfolioService.showToast(`Thank you, ${sender}! Inquiry submitted successfully. 🚀`);
        
        // Clear the form fields on success
        this.inquiryForm = {
          fullName: '',
          email: '',
          phone: '',
          techStack: 'Multi-Tenant SaaS Architecture',
          message: '',
          agreed: false
        };

        // Auto-dismiss message after 5 seconds
        this.heroMsgTimeout = setTimeout(() => {
          this.heroSuccessMsg = null;
        }, 5000);
      },
      error: () => {
        this.isSubmittingInquiry = false;
        this.heroErrorMsg = 'Unable to submit your inquiry at this moment. Please check your connection or contact directly via Email / WhatsApp.';
        this.heroMsgTimeout = setTimeout(() => {
          this.heroErrorMsg = null;
        }, 5000);
      }
    });
  }

  submitBottomContact(): void {
    if (this.bottomMsgTimeout) clearTimeout(this.bottomMsgTimeout);
    this.bottomSuccessMsg = null;
    this.bottomErrorMsg = null;

    if (!this.bottomContactForm.fullName.trim() || !this.bottomContactForm.email.trim() || !this.bottomContactForm.message.trim()) {
      this.bottomErrorMsg = 'Please complete all required fields (Full Name, Work Email, and Message).';
      this.bottomMsgTimeout = setTimeout(() => {
        this.bottomErrorMsg = null;
      }, 5000);
      return;
    }

    this.isSubmittingBottom = true;
    this.api.submitContactInquiry({
      name: this.bottomContactForm.fullName.trim(),
      email: this.bottomContactForm.email.trim(),
      subject: this.bottomContactForm.subject.trim() || 'General Consultation & Architecture Inquiry',
      message: this.bottomContactForm.message.trim()
    }).subscribe({
      next: (res) => {
        this.isSubmittingBottom = false;
        const sender = this.bottomContactForm.fullName;
        this.bottomSuccessMsg = res.message || `Thank you, ${sender}! Your consultation request has been received. We will respond within 24 hours.`;
        this.portfolioService.showToast(`Thank you, ${sender}! Consultation request submitted. 🚀`);

        // Clear bottom form fields on success
        this.bottomContactForm = {
          fullName: '',
          email: '',
          subject: '',
          message: ''
        };

        // Auto-dismiss message after 5 seconds
        this.bottomMsgTimeout = setTimeout(() => {
          this.bottomSuccessMsg = null;
        }, 5000);
      },
      error: () => {
        this.isSubmittingBottom = false;
        this.bottomErrorMsg = 'Failed to submit consultation request. Please try again or reach out directly via Email / WhatsApp.';
        this.bottomMsgTimeout = setTimeout(() => {
          this.bottomErrorMsg = null;
        }, 5000);
      }
    });
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
