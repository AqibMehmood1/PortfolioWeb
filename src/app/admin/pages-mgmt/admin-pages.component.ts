import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  AdminApiService, 
  SitePageDto, 
  SiteSectionDto, 
  CreateSitePageDto, 
  UpdateSitePageDto,
  CreateSiteSectionDto, 
  UpdateSiteSectionDto 
} from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

export interface SectionCardItem {
  title: string;
  description: string;
  badge?: string;
  icon?: string;
}

@Component({
  selector: 'app-admin-pages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pages.component.html',
  styleUrl: './admin-pages.component.css'
})
export class AdminPagesComponent implements OnInit {
  pages: SitePageDto[] = [];
  loading: boolean = true;
  selectedPageForSections: SitePageDto | null = null;

  // Search & Filter
  searchQuery: string = '';

  // Page Modal State
  showPageModal: boolean = false;
  isEditPage: boolean = false;
  currentPageId: number | null = null;
  pageForm: CreateSitePageDto = this.getEmptyPageForm();

  // Section Modal State
  showSectionModal: boolean = false;
  isEditSection: boolean = false;
  currentSectionId: number | null = null;
  sectionForm: CreateSiteSectionDto = this.getEmptySectionForm();
  sectionCards: SectionCardItem[] = [];

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(refreshPortfolio: boolean = true): void {
    this.loading = true;
    this.adminApi.getAllPages().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.pages = res.data.sort((a, b) => a.displayOrder - b.displayOrder);
          // If we had a selected page, update its reference
          if (this.selectedPageForSections) {
            const found = this.pages.find(p => p.id === this.selectedPageForSections!.id);
            if (found) {
              this.selectedPageForSections = found;
            }
          }
        }
        if (refreshPortfolio) {
          this.portfolioService.refreshPages();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredPages(): SitePageDto[] {
    if (!this.searchQuery.trim()) return this.pages;
    const q = this.searchQuery.toLowerCase();
    return this.pages.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.slug.toLowerCase().includes(q) ||
      (p.navTitle && p.navTitle.toLowerCase().includes(q))
    );
  }

  get totalSectionsCount(): number {
    return this.pages.reduce((acc, p) => acc + (p.sections ? p.sections.length : 0), 0);
  }

  get visiblePagesCount(): number {
    return this.pages.filter(p => p.isVisible).length;
  }

  // --- Page Toggles & Actions ---

  togglePageVisibility(page: SitePageDto, event?: Event): void {
    if (event) event.stopPropagation();
    this.adminApi.togglePageVisibility(page.id).subscribe({
      next: (res) => {
        if (res.success) {
          page.isVisible = !page.isVisible;
          this.portfolioService.showToast(`Page "${page.title}" visibility toggled ${page.isVisible ? 'ON' : 'OFF'}.`);
          this.portfolioService.refreshPages();
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.portfolioService.showToast('Failed to update page visibility.');
      }
    });
  }

  togglePageNav(page: SitePageDto, event?: Event): void {
    if (event) event.stopPropagation();
    this.adminApi.togglePageNav(page.id).subscribe({
      next: (res) => {
        if (res.success) {
          page.showInNav = !page.showInNav;
          this.portfolioService.showToast(`Navbar display for "${page.title}" updated.`);
          this.portfolioService.refreshPages();
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.portfolioService.showToast('Failed to update navbar display setting.');
      }
    });
  }

  togglePageFooter(page: SitePageDto, event?: Event): void {
    if (event) event.stopPropagation();
    const updateDto: UpdateSitePageDto = {
      slug: page.slug,
      title: page.title,
      navTitle: page.navTitle,
      isVisible: page.isVisible,
      showInNav: page.showInNav,
      showInFooter: !page.showInFooter,
      displayOrder: page.displayOrder,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription
    };

    this.adminApi.updatePage(page.id, updateDto).subscribe({
      next: (res) => {
        if (res.success) {
          page.showInFooter = !page.showInFooter;
          this.portfolioService.showToast(`Footer display for "${page.title}" updated.`);
          this.portfolioService.refreshPages();
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.portfolioService.showToast('Failed to update footer display setting.');
      }
    });
  }

  openCreatePage(): void {
    this.isEditPage = false;
    this.currentPageId = null;
    this.pageForm = this.getEmptyPageForm();
    this.pageForm.displayOrder = this.pages.length + 1;
    this.showPageModal = true;
    this.cdr.detectChanges();
  }

  openEditPage(page: SitePageDto, event?: Event): void {
    if (event) event.stopPropagation();
    this.isEditPage = true;
    this.currentPageId = page.id;
    this.pageForm = {
      slug: page.slug,
      title: page.title,
      navTitle: page.navTitle,
      isVisible: page.isVisible,
      showInNav: page.showInNav,
      showInFooter: page.showInFooter,
      displayOrder: page.displayOrder,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription
    };
    this.showPageModal = true;
    this.cdr.detectChanges();
  }

  savePage(): void {
    if (!this.pageForm.title.trim()) {
      this.portfolioService.showToast('Please provide a page title.');
      return;
    }

    if (this.isEditPage && this.currentPageId) {
      this.adminApi.updatePage(this.currentPageId, this.pageForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Page updated successfully.');
            this.showPageModal = false;
            this.loadPages();
          } else {
            this.portfolioService.showToast(res.message || 'Failed to update page.');
          }
        },
        error: (err) => {
          this.portfolioService.showToast(err.error?.message || 'Error updating page.');
        }
      });
    } else {
      this.adminApi.createPage(this.pageForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('New page added successfully.');
            this.showPageModal = false;
            this.loadPages();
          } else {
            this.portfolioService.showToast(res.message || 'Failed to create page.');
          }
        },
        error: (err) => {
          this.portfolioService.showToast(err.error?.message || 'Error creating page.');
        }
      });
    }
  }

  deletePage(page: SitePageDto, event?: Event): void {
    if (event) event.stopPropagation();
    if (page.isSystem) {
      this.portfolioService.showToast('System pages cannot be deleted, but you can toggle their visibility OFF to hide them completely.');
      return;
    }

    this.confirmDialog.confirm({
      title: 'Delete Page',
      message: `Are you sure you want to permanently delete the page "${page.title}" and all its sections? This action cannot be undone.`,
      confirmText: 'Yes, Delete Page',
      type: 'danger'
    }).then(confirmed => {
      if (confirmed) {
        this.adminApi.deletePage(page.id).subscribe({
          next: (res) => {
            if (res.success) {
              this.portfolioService.showToast(`Page "${page.title}" deleted successfully.`);
              if (this.selectedPageForSections?.id === page.id) {
                this.selectedPageForSections = null;
              }
              this.loadPages();
            } else {
              this.portfolioService.showToast(res.message || 'Failed to delete page.');
            }
          },
          error: (err) => {
            this.portfolioService.showToast(err.error?.message || 'Error deleting page.');
          }
        });
      }
    });
  }

  // --- Sections Management ---

  openSectionsDrawer(page: SitePageDto): void {
    this.selectedPageForSections = page;
    this.cdr.detectChanges();
  }

  closeSectionsDrawer(): void {
    this.selectedPageForSections = null;
    this.cdr.detectChanges();
  }

  toggleSectionVisibility(section: SiteSectionDto): void {
    this.adminApi.toggleSectionVisibility(section.id).subscribe({
      next: (res) => {
        if (res.success) {
          section.isVisible = !section.isVisible;
          this.portfolioService.showToast(`Section "${section.title}" visibility toggled ${section.isVisible ? 'ON' : 'OFF'}.`);
          this.portfolioService.refreshPages();
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.portfolioService.showToast('Failed to update section visibility.');
      }
    });
  }

  openCreateSection(): void {
    if (!this.selectedPageForSections) return;
    this.isEditSection = false;
    this.currentSectionId = null;
    this.sectionCards = [];
    this.sectionForm = this.getEmptySectionForm();
    this.sectionForm.pageId = this.selectedPageForSections.id;
    this.sectionForm.displayOrder = (this.selectedPageForSections.sections?.length || 0) + 1;
    this.showSectionModal = true;
    this.cdr.detectChanges();
  }

  openEditSection(section: SiteSectionDto): void {
    this.isEditSection = true;
    this.currentSectionId = section.id;
    this.sectionCards = [];

    if (section.contentJson) {
      try {
        const parsed = JSON.parse(section.contentJson);
        if (Array.isArray(parsed)) {
          this.sectionCards = parsed.map(c => ({
            title: c.title || '',
            description: c.description || '',
            badge: c.badge || '',
            icon: c.icon || ''
          }));
        } else if (parsed && parsed.items && Array.isArray(parsed.items)) {
          this.sectionCards = parsed.items.map((c: any) => ({
            title: c.title || '',
            description: c.description || '',
            badge: c.badge || '',
            icon: c.icon || ''
          }));
        }
      } catch (e) {
        this.sectionCards = [];
      }
    }

    // Default card fallbacks if no cards exist yet
    if (this.sectionCards.length === 0 && (section.sectionKey === 'value' || section.sectionKey === 'execution' || section.sectionKey === 'engagement')) {
      this.sectionCards = [
        { title: 'Task Automation', description: 'DevOps and backend architecture screened for proven technical capability, eliminating repetitive manual operations.' },
        { title: 'Agentic Workflows', description: 'Speeds up execution by connecting systems and streamlining processes across different tools and multi-agent LLM pipelines.' },
        { title: 'Cost Efficiency', description: 'Lowers operational costs by minimizing manual effort and optimizing compute, caching, and serverless resource utilization.' },
        { title: 'Resource Efficiency', description: 'Optimizes the use of people, time, and systems by ensuring architecture tasks are handled intelligently with minimal waste.' }
      ];
    } else if (this.sectionCards.length === 0 && section.sectionKey === 'milestones') {
      this.sectionCards = [
        { title: 'Launch of Specialized .NET & Cloud Architecture Studio', description: 'Founded Nexvoys as an elite engineering practice specializing in distributed .NET architecture, high-concurrency cloud systems, and multi-tenant database partitioning for North American and European clients.', badge: '2021 · Foundation', icon: 'fas fa-rocket' },
        { title: 'Sub-Second CPQ & High-Throughput Engines', description: 'Engineered enterprise CPQ (Configure, Price, Quote) engines and payment processing pipelines, slashing calculation latency from 3 hours to under 30 seconds across high-volume transactions.', badge: '2022 · Scale', icon: 'fas fa-bolt' },
        { title: 'Global Multi-Market Delivery', description: 'Expanded direct client delivery footprint across international markets worldwide. Shipped production platforms maintaining an audited 99.99% uptime SLA with zero-downtime deployment pipelines.', badge: '2023 · Expansion', icon: 'fas fa-globe' },
        { title: 'Autonomous AI Agents & .NET 9 Cloud Modernization', description: 'Pioneering deterministic enterprise GenAI agent pipelines, vector search platforms, and cloud modernization to .NET 9 for next-generation enterprise SaaS systems.', badge: '2024–Present · Next-Gen', icon: 'fas fa-brain' }
      ];
    } else if (this.sectionCards.length === 0 && section.sectionKey === 'credentials' && this.selectedPageForSections?.slug === 'about') {
      this.sectionCards = [
        { title: 'Total Client IP & Repository Ownership', description: 'Every line of source code, deployment script, infrastructure-as-code template, and architecture document belongs exclusively to you from day one. Zero proprietary vendor lock-in.', badge: '01 · Legal & IP', icon: 'fas fa-code-branch' },
        { title: 'Direct Principal Engineering Oversight', description: 'Engagements are steered and authored by senior principal architects. We do not use account managers or hand off your core architecture to junior, unvetted subcontractors.', badge: '02 · Quality', icon: 'fas fa-user-shield' },
        { title: 'Multi-Timezone Synchronized Delivery', description: 'Dedicated overlapping working hours across US Eastern/Pacific, European CET, and APAC time zones for rapid code reviews, sprint alignment, and seamless real-time collaboration.', badge: '03 · Velocity', icon: 'fas fa-clock' },
        { title: 'Enterprise Security & SOC2/OWASP Compliance', description: 'Production code is built against OWASP Top 10 standards, automated static analysis (SAST), strict secret management, and full NDA confidentiality protocols.', badge: '04 · Security', icon: 'fas fa-shield-alt' }
      ];
    } else if (this.sectionCards.length === 0 && (section.sectionKey === 'process' || section.sectionKey === 'credentials')) {
      this.sectionCards = [
        { title: 'Discovery Call', description: 'A 30-minute technical session to understand your architecture bottlenecks, timeline, and growth goals.', badge: '01' },
        { title: 'Blueprint or Fixed-Fee Audit', description: 'A concrete system blueprint, data isolation schema, or 2-week architecture audit with prioritized roadmap.', badge: '02' },
        { title: 'Senior Build & Modernize', description: 'Principal-led engineering with .NET 9, Azure, Angular/React, and AI agents with rigorous code quality.', badge: '03' },
        { title: 'Handover & Enablement', description: 'Written architecture documentation, test coverage, and complete team handover with zero lock-in.', badge: '04' }
      ];
    } else if (this.sectionCards.length === 0 && section.sectionKey === 'problems') {
      this.sectionCards = [
        { title: 'Cloud Costs Outpacing Revenue', description: 'Unoptimized Azure and AWS compute eating into margins. We identify waste, right-size infrastructure, and cut cloud spend by up to 25% without sacrificing throughput.', badge: 'amber', icon: 'fas fa-chart-line' },
        { title: 'Monolithic Bottlenecks', description: 'Legacy .NET codebases holding back release velocity. We re-architect incrementally to clean .NET 9 and event-driven microservices with zero customer downtime.', badge: 'red', icon: 'fas fa-cubes' },
        { title: 'AI Pipelines Failing in Production', description: 'Prototypes that hit latency and hallucination walls. We build enterprise RAG pipelines with deterministic guardrails and scalable vector search.', badge: 'blue', icon: 'fas fa-robot' },
        { title: 'Missing Senior Tech Lead', description: 'Startups needing strategic architectural governance without the $250k+ full-time CTO overhead. We serve as fractional principal architects guiding your engineers.', badge: 'green', icon: 'fas fa-user-shield' }
      ];
    } else if (this.sectionCards.length === 0 && section.sectionKey === 'proof-strip') {
      this.sectionCards = [
        { title: 'Shipping Production Systems', description: 'Audited enterprise platforms', badge: '9+ Years', icon: 'fas fa-history' },
        { title: 'Global Client Footprint', description: 'Worldwide client delivery footprint', badge: 'Worldwide', icon: 'fas fa-globe' },
        { title: 'CPQ Turnaround (from 3 hrs)', description: 'Automated pricing calculation', badge: '< 30 Seconds', icon: 'fas fa-bolt' },
        { title: 'Cloud Cost Optimization', description: 'FinOps Azure & AWS reduction', badge: 'Up to 25%', icon: 'fas fa-chart-line' }
      ];
    } else if (this.sectionCards.length === 0 && section.sectionKey === 'diagnostic-audit') {
      this.sectionCards = [
        { title: 'Fixed fee', description: 'from $2,500 with zero surprise overages', badge: 'Fixed Fee', icon: 'fas fa-check-circle' },
        { title: 'Delivery', description: '10 business days direct turnaround', badge: '10 Days', icon: 'fas fa-clock' },
        { title: 'Deliverables', description: 'FinOps savings breakdown + 90-day prioritized remediation roadmap', badge: 'Deliverables', icon: 'fas fa-file-contract' }
      ];
    }

    this.sectionForm = {
      pageId: section.pageId,
      sectionKey: section.sectionKey,
      title: section.title,
      subtitle: section.subtitle || '',
      description: section.description || '',
      sectionType: section.sectionType || 'custom-html',
      isVisible: section.isVisible,
      displayOrder: section.displayOrder,
      contentJson: section.contentJson || '',
      customHtml: section.customHtml || ''
    };
    this.showSectionModal = true;
    this.cdr.detectChanges();
  }

  addSectionCard(): void {
    this.sectionCards.push({
      title: '',
      description: '',
      badge: ''
    });
    this.cdr.detectChanges();
  }

  removeSectionCard(index: number): void {
    this.sectionCards.splice(index, 1);
    this.cdr.detectChanges();
  }

  saveSection(): void {
    if (!this.sectionForm.title.trim() || !this.sectionForm.sectionKey.trim()) {
      this.portfolioService.showToast('Please provide both Section Key and Title.');
      return;
    }

    // Serialize valid section cards into ContentJson
    const validCards = this.sectionCards.filter(c => c.title.trim() || c.description.trim());
    this.sectionForm.contentJson = validCards.length > 0 ? JSON.stringify(validCards) : '';

    if (this.isEditSection && this.currentSectionId) {
      const updateDto: UpdateSiteSectionDto = {
        sectionKey: this.sectionForm.sectionKey,
        title: this.sectionForm.title,
        subtitle: this.sectionForm.subtitle,
        description: this.sectionForm.description,
        sectionType: this.sectionForm.sectionType,
        isVisible: this.sectionForm.isVisible,
        displayOrder: this.sectionForm.displayOrder,
        contentJson: this.sectionForm.contentJson,
        customHtml: this.sectionForm.customHtml
      };

      this.adminApi.updateSection(this.currentSectionId, updateDto).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Section updated successfully.');
            this.showSectionModal = false;
            this.loadPages();
          } else {
            this.portfolioService.showToast(res.message || 'Failed to update section.');
          }
        },
        error: (err) => {
          this.portfolioService.showToast(err.error?.message || 'Error updating section.');
        }
      });
    } else {
      if (!this.selectedPageForSections) return;
      this.adminApi.createSection(this.selectedPageForSections.id, this.sectionForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('New section created successfully.');
            this.showSectionModal = false;
            this.loadPages();
          } else {
            this.portfolioService.showToast(res.message || 'Failed to create section.');
          }
        },
        error: (err) => {
          this.portfolioService.showToast(err.error?.message || 'Error creating section.');
        }
      });
    }
  }

  deleteSection(section: SiteSectionDto): void {
    this.confirmDialog.confirm({
      title: 'Delete Section',
      message: `Are you sure you want to delete the section "${section.title}" (${section.sectionKey})?`,
      confirmText: 'Yes, Delete Section',
      type: 'danger'
    }).then(confirmed => {
      if (confirmed) {
        this.adminApi.deleteSection(section.id).subscribe({
          next: (res) => {
            if (res.success) {
              this.portfolioService.showToast(`Section "${section.title}" deleted.`);
              this.loadPages();
            } else {
              this.portfolioService.showToast(res.message || 'Failed to delete section.');
            }
          },
          error: (err) => {
            this.portfolioService.showToast(err.error?.message || 'Error deleting section.');
          }
        });
      }
    });
  }

  moveSection(index: number, direction: 'up' | 'down'): void {
    if (!this.selectedPageForSections || !this.selectedPageForSections.sections) return;
    const list = [...this.selectedPageForSections.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap displayOrder
    const current = list[index];
    const target = list[targetIndex];
    const tempOrder = current.displayOrder;
    current.displayOrder = target.displayOrder;
    target.displayOrder = tempOrder;

    const payload = [
      { id: current.id, displayOrder: current.displayOrder },
      { id: target.id, displayOrder: target.displayOrder }
    ];

    this.adminApi.reorderSections(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadPages();
        }
      }
    });
  }

  private getEmptyPageForm(): CreateSitePageDto {
    return {
      slug: '',
      title: '',
      navTitle: '',
      isVisible: true,
      showInNav: true,
      showInFooter: true,
      displayOrder: 1,
      metaTitle: '',
      metaDescription: ''
    };
  }

  private getEmptySectionForm(): CreateSiteSectionDto {
    return {
      pageId: 0,
      sectionKey: '',
      title: '',
      subtitle: '',
      description: '',
      sectionType: 'custom-html',
      isVisible: true,
      displayOrder: 1,
      contentJson: '',
      customHtml: '<div class="text-center py-4">\n  <h3 class="fw-bold mb-3">Custom Section Content</h3>\n  <p class="text-muted">Edit this HTML code in Admin CMS to render any custom banner, card or component.</p>\n</div>'
    };
  }
}
