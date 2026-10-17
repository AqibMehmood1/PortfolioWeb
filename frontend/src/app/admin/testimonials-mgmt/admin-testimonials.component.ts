import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AdminApiService, TestimonialDto, IndustryDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { ImagePickerComponent } from '../components/image-picker/image-picker.component';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagePickerComponent],
  templateUrl: './admin-testimonials.component.html',
  styleUrl: './admin-testimonials.component.css'
})
export class AdminTestimonialsComponent implements OnInit {
  testimonials: TestimonialDto[] = [];
  industries: IndustryDto[] = [];
  loading: boolean = true;
  savingTestimonial: boolean = false;
  savingIndustry: boolean = false;
  activeTab: 'testimonials' | 'industries' = 'testimonials';

  // Testimonial Modal
  showTestimonialModal: boolean = false;
  currentTestimonial: TestimonialDto = this.getEmptyTestimonial();
  isEditTestimonial: boolean = false;

  // Industry Modal
  showIndustryModal: boolean = false;
  currentIndustry: IndustryDto = this.getEmptyIndustry();
  isEditIndustry: boolean = false;

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
    this.adminApi.getTestimonials().pipe(
      timeout(15000)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.testimonials = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getIndustries().pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.industries = res.data;
        }
      },
      error: () => {
        this.portfolioService.showError('Failed to load testimonials and industries from server.', 'Load Error');
      }
    });
  }

  getEmptyTestimonial(): TestimonialDto {
    return {
      author: '',
      role: '',
      company: '',
      quote: '',
      projectDelivered: '',
      rating: 5,
      avatarUrl: '/assets/testimonials/avatar1.jpg',
      displayOrder: this.testimonials.length + 1,
      isActive: true,
      isFeatured: true
    };
  }

  getEmptyIndustry(): IndustryDto {
    return {
      name: '',
      description: '',
      icon: 'fas fa-chart-line',
      systemsCount: '4 Systems',
      displayOrder: this.industries.length + 1,
      isActive: true
    };
  }

  // Testimonial CRUD
  openCreateTestimonial(): void {
    this.currentTestimonial = this.getEmptyTestimonial();
    this.isEditTestimonial = false;
    this.showTestimonialModal = true;
  }

  openEditTestimonial(testi: TestimonialDto): void {
    this.currentTestimonial = { ...testi };
    this.isEditTestimonial = true;
    this.showTestimonialModal = true;
  }

  saveTestimonial(): void {
    if (!this.currentTestimonial.author.trim() || !this.currentTestimonial.quote.trim()) {
      this.portfolioService.showWarning('Author name and Testimonial quote are required before saving.', 'Validation Warning');
      return;
    }

    this.savingTestimonial = true;
    const req$ = (this.isEditTestimonial && this.currentTestimonial.id)
      ? this.adminApi.updateTestimonial(this.currentTestimonial.id, this.currentTestimonial)
      : this.adminApi.createTestimonial(this.currentTestimonial);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingTestimonial = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditTestimonial ? `Testimonial by "${this.currentTestimonial.author}" updated!` : `Testimonial by "${this.currentTestimonial.author}" created!`,
            this.isEditTestimonial ? 'Testimonial Updated' : 'Testimonial Created'
          );
          this.showTestimonialModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteTestimonial(testi: TestimonialDto): Promise<void> {
    if (!testi.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Client Testimonial',
      message: 'Are you sure you want to delete the testimonial endorsement from',
      itemHighlight: `${testi.author} (${testi.company})`,
      confirmText: 'Delete Testimonial',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-star'
    });

    if (confirmed) {
      this.adminApi.deleteTestimonial(testi.id).pipe(
        timeout(15000)
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Testimonial by "${testi.author}" deleted successfully.`, 'Testimonial Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete testimonial.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete testimonial. Please try again.', 'Delete Error')
      });
    }
  }

  // Industry CRUD
  openCreateIndustry(): void {
    this.currentIndustry = this.getEmptyIndustry();
    this.isEditIndustry = false;
    this.showIndustryModal = true;
  }

  openEditIndustry(ind: IndustryDto): void {
    this.currentIndustry = { ...ind };
    this.isEditIndustry = true;
    this.showIndustryModal = true;
  }

  saveIndustry(): void {
    if (!this.currentIndustry.name.trim()) {
      this.portfolioService.showWarning('Industry name is required before saving.', 'Validation Warning');
      return;
    }

    this.savingIndustry = true;
    const req$ = (this.isEditIndustry && this.currentIndustry.id)
      ? this.adminApi.updateIndustry(this.currentIndustry.id, this.currentIndustry)
      : this.adminApi.createIndustry(this.currentIndustry);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingIndustry = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditIndustry ? `Industry sector "${this.currentIndustry.name}" updated!` : `Industry sector "${this.currentIndustry.name}" created!`,
            this.isEditIndustry ? 'Industry Updated' : 'Industry Created'
          );
          this.showIndustryModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteIndustry(ind: IndustryDto): Promise<void> {
    if (!ind.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Industry Focus',
      message: 'Are you sure you want to delete industry sector',
      itemHighlight: ind.name,
      confirmText: 'Delete Industry',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-building'
    });

    if (confirmed) {
      this.adminApi.deleteIndustry(ind.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Industry sector "${ind.name}" deleted successfully.`, 'Industry Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete industry.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete industry. Please try again.', 'Delete Error')
      });
    }
  }
}
