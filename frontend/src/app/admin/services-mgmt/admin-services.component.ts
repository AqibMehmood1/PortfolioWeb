import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
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
  savingService: boolean = false;
  savingAccordion: boolean = false;
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
    this.adminApi.getServices().pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.services = res.data;
        }
      },
      error: () => {
        this.portfolioService.showError('Failed to load services from server.', 'Load Error');
      }
    });

    this.adminApi.getAccordionItems().pipe(
      timeout(15000)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.accordionItems = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.portfolioService.showError('Failed to load capability pillars.', 'Load Error');
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
      this.portfolioService.showWarning('Service title is required before saving.', 'Validation Warning');
      return;
    }

    if (!this.currentService.slug) {
      this.currentService.slug = this.currentService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    this.savingService = true;
    const req$ = (this.isEditService && this.currentService.id)
      ? this.adminApi.updateService(this.currentService.id, this.currentService)
      : this.adminApi.createService(this.currentService);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingService = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditService ? `Service "${this.currentService.title}" updated successfully!` : `Service "${this.currentService.title}" created successfully!`,
            this.isEditService ? 'Service Updated' : 'Service Created'
          );
          this.showServiceModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
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
      this.adminApi.deleteService(srv.id).pipe(
        timeout(15000)
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Service "${srv.title}" deleted successfully.`, 'Service Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete service.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete service. Please try again.', 'Delete Error')
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
      this.portfolioService.showWarning('Pillar title is required before saving.', 'Validation Warning');
      return;
    }

    this.savingAccordion = true;
    const req$ = (this.isEditAccordion && this.currentAccordion.id)
      ? this.adminApi.updateAccordionItem(this.currentAccordion.id, this.currentAccordion)
      : this.adminApi.createAccordionItem(this.currentAccordion);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingAccordion = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditAccordion ? `Capability pillar "${this.currentAccordion.title}" updated!` : `Capability pillar "${this.currentAccordion.title}" created!`,
            this.isEditAccordion ? 'Pillar Updated' : 'Pillar Created'
          );
          this.showAccordionModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
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
            this.portfolioService.showSuccess(`Pillar "${item.title}" deleted successfully.`, 'Pillar Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete pillar.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete pillar. Please try again.', 'Delete Error')
      });
    }
  }
}
