import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, ServiceDto, AccordionItemDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent implements OnInit {
  services: ServiceDto[] = [];
  accordionItems: AccordionItemDto[] = [];
  loading: boolean = true;
  activeTab: 'services' | 'accordion' = 'services';

  // Modal / Form state
  showServiceModal: boolean = false;
  currentService: ServiceDto = this.getEmptyService();
  isEditService: boolean = false;

  showAccordionModal: boolean = false;
  currentAccordion: AccordionItemDto = this.getEmptyAccordion();
  isEditAccordion: boolean = false;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.adminApi.getServices().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.services = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load services.');
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getAccordionItems().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.accordionItems = res.data;
        }
        this.cdr.detectChanges();
      }
    });
  }

  getEmptyService(): ServiceDto {
    return {
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      icon: 'fas fa-server',
      featuresJson: '[]',
      technologiesJson: '[]',
      deliverablesJson: '[]',
      displayOrder: this.services.length + 1,
      isActive: true,
      isFeatured: false
    };
  }

  getEmptyAccordion(): AccordionItemDto {
    return {
      num: `0${this.accordionItems.length + 1}`,
      title: '',
      category: 'ARCHITECTURE',
      description: '',
      detailsJson: '[]',
      tagsJson: '[]',
      displayOrder: this.accordionItems.length + 1,
      isActive: true
    };
  }

  // Service CRUD
  openCreateService(): void {
    this.currentService = this.getEmptyService();
    this.isEditService = false;
    this.showServiceModal = true;
  }

  openEditService(srv: ServiceDto): void {
    this.currentService = { ...srv };
    this.isEditService = true;
    this.showServiceModal = true;
  }

  saveService(): void {
    if (!this.currentService.title.trim()) {
      this.portfolioService.showToast('Service title is required.');
      return;
    }

    if (!this.currentService.slug) {
      this.currentService.slug = this.currentService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (this.isEditService && this.currentService.id) {
      this.adminApi.updateService(this.currentService.id, this.currentService).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Service updated successfully.');
            this.showServiceModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        },
        error: (err) => this.portfolioService.showToast(err.error?.message || 'Update failed.')
      });
    } else {
      this.adminApi.createService(this.currentService).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Service created successfully.');
            this.showServiceModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        },
        error: (err) => this.portfolioService.showToast(err.error?.message || 'Create failed.')
      });
    }
  }

  async deleteService(srv: ServiceDto): Promise<void> {
    if (!srv.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Architecture Service',
      message: 'Are you sure you want to permanently delete service',
      itemHighlight: srv.title,
      confirmText: 'Delete Service',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-cubes'
    });

    if (confirmed) {
      this.adminApi.deleteService(srv.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Service deleted successfully.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        },
        error: () => this.portfolioService.showToast('Failed to delete service.')
      });
    }
  }

  // Accordion CRUD
  openCreateAccordion(): void {
    this.currentAccordion = this.getEmptyAccordion();
    this.isEditAccordion = false;
    this.showAccordionModal = true;
  }

  openEditAccordion(item: AccordionItemDto): void {
    this.currentAccordion = { ...item };
    this.isEditAccordion = true;
    this.showAccordionModal = true;
  }

  saveAccordion(): void {
    if (!this.currentAccordion.title.trim()) {
      this.portfolioService.showToast('Pillar title is required.');
      return;
    }

    if (this.isEditAccordion && this.currentAccordion.id) {
      this.adminApi.updateAccordionItem(this.currentAccordion.id, this.currentAccordion).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Accordion pillar updated.');
            this.showAccordionModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createAccordionItem(this.currentAccordion).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Accordion pillar created.');
            this.showAccordionModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }

  async deleteAccordion(item: AccordionItemDto): Promise<void> {
    if (!item.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Solution Pillar',
      message: 'Are you sure you want to delete capability pillar',
      itemHighlight: item.title,
      confirmText: 'Delete Pillar',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-layer-group'
    });

    if (confirmed) {
      this.adminApi.deleteAccordionItem(item.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Pillar deleted successfully.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        },
        error: () => this.portfolioService.showToast('Failed to delete pillar.')
      });
    }
  }
}
