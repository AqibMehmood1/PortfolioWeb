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
    } else if (this.sectionCards.length === 0 && (section.sectionKey === 'process' || section.sectionKey === 'credentials')) {
      this.sectionCards = [
        { title: 'Tell Us What You Need', description: 'One quick conversation. Tell us about your team, tech stack, and goals.', badge: '01' },
        { title: 'Build Your Match Within 24 Hours', description: 'We match AI developers to your stack and workflow. You review them.', badge: '02' },
        { title: 'Start Shipping Immediately', description: 'Your engineer is embedded, onboarded and contributing.', badge: '03' }
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
