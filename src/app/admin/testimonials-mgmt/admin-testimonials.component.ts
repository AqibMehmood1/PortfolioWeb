import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, TestimonialDto, IndustryDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-testimonials.component.html',
  styleUrl: './admin-testimonials.component.css'
})
export class AdminTestimonialsComponent implements OnInit {
  testimonials: TestimonialDto[] = [];
  industries: IndustryDto[] = [];
  loading: boolean = true;
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.adminApi.getTestimonials().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.testimonials = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getIndustries().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.industries = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load testimonials/industries.');
        this.cdr.detectChanges();
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
      this.portfolioService.showToast('Author name and Testimonial quote are required.');
      return;
    }

    if (this.isEditTestimonial && this.currentTestimonial.id) {
      this.adminApi.updateTestimonial(this.currentTestimonial.id, this.currentTestimonial).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Testimonial updated.');
            this.showTestimonialModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createTestimonial(this.currentTestimonial).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Testimonial created.');
            this.showTestimonialModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }

  deleteTestimonial(testi: TestimonialDto): void {
    if (!testi.id) return;
    if (confirm(`Delete testimonial from ${testi.author}?`)) {
      this.adminApi.deleteTestimonial(testi.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Testimonial deleted.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
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
      this.portfolioService.showToast('Industry name is required.');
      return;
    }

    if (this.isEditIndustry && this.currentIndustry.id) {
      this.adminApi.updateIndustry(this.currentIndustry.id, this.currentIndustry).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Industry updated.');
            this.showIndustryModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createIndustry(this.currentIndustry).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Industry created.');
            this.showIndustryModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }

  deleteIndustry(ind: IndustryDto): void {
    if (!ind.id) return;
    if (confirm(`Delete industry "${ind.name}"?`)) {
      this.adminApi.deleteIndustry(ind.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Industry deleted.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }
}
