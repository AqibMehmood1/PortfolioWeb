import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PortfolioApiService, SitePageDto, SiteSectionDto } from '../../services/portfolio-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dynamic-page-wrap" *ngIf="page; else loadingOrNotFound">
      <!-- Dynamic Page Hero -->
      <section class="iz-page-hero">
        <div class="container text-center max-w-860 mx-auto">
          <div class="iz-breadcrumb d-flex justify-content-center mb-3">
            <a routerLink="/">Home</a>
            <span class="sep">»</span>
            <span class="text-dark fw-bold">{{ page.navTitle || page.title }}</span>
          </div>
          <div class="iz-tag"><i class="fas fa-layer-group"></i> {{ page.navTitle || 'NEXVOYS Platform' }}</div>
          <h1 class="iz-hero-headline">{{ page.title }}</h1>
          <p class="iz-hero-sub mx-auto" *ngIf="page.metaDescription">
            {{ page.metaDescription }}
          </p>
        </div>
      </section>

      <!-- Dynamic Sections Rendering -->
      <div class="dynamic-sections-container" *ngIf="visibleSections.length > 0; else emptySections">
        <section 
          *ngFor="let sec of visibleSections; let idx = index" 
          [id]="sec.sectionKey" 
          class="iz-section"
          [ngClass]="idx % 2 === 1 ? 'iz-section-offwhite' : ''">
          <div class="container">
            <!-- Header if title or subtitle present -->
            <div class="iz-section-header" *ngIf="sec.title || sec.subtitle">
              <div class="iz-tag" *ngIf="sec.subtitle"><i class="fas fa-cube"></i> {{ sec.subtitle }}</div>
              <h2 class="iz-title" *ngIf="sec.title">{{ sec.title }}</h2>
              <p class="iz-subtitle" *ngIf="sec.description">{{ sec.description }}</p>
            </div>

            <!-- Custom HTML / Rich Content -->
            <div class="iz-custom-section-body" *ngIf="sec.customHtml" [innerHTML]="sec.customHtml"></div>
          </div>
        </section>
      </div>

      <ng-template #emptySections>
        <section class="iz-section text-center py-5">
          <div class="container py-4">
            <div class="iz-stat-card max-w-600 mx-auto p-5 text-center">
              <i class="fas fa-file-code fa-3x text-green mb-3"></i>
              <h3 class="fw-bold mb-2">No Sections Published Yet</h3>
              <p class="text-muted mb-4">This custom page is currently empty or sections are hidden in the Admin CMS.</p>
              <a routerLink="/" class="iz-btn-green px-4 py-2">Return Home</a>
            </div>
          </div>
        </section>
      </ng-template>

      <!-- Bottom Consultation CTA -->
      <section class="iz-section iz-section-sage text-center">
        <div class="container">
          <div class="iz-stat-card p-5 max-w-700 mx-auto" style="background: var(--iz-dark-hero); color: #ffffff;">
            <div class="iz-tag iz-tag-dark mb-3"><i class="fas fa-handshake"></i> Let's Collaborate</div>
            <h2 class="text-white fw-bold mb-3">Ready to Discuss Your Architecture?</h2>
            <p class="text-muted mx-auto mb-4" style="color: #cbd5e1 !important;">
              Connect directly with our Enterprise Solutions team to review specifications, system blueprints, and roadmaps.
            </p>
            <a routerLink="/contact" class="iz-btn-green py-3 px-4">
              Schedule Consultation <i class="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </section>
    </div>

    <ng-template #loadingOrNotFound>
      <section class="iz-page-hero text-center py-5" *ngIf="!isLoading">
        <div class="container py-5">
          <div class="iz-stat-card max-w-600 mx-auto p-5 text-center">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h2 class="fw-bold mb-2">Page Not Found or Inactive</h2>
            <p class="text-muted mb-4">The requested page is either unpublished, hidden, or does not exist.</p>
            <a routerLink="/" class="iz-btn-green px-4 py-2">Return to Home</a>
          </div>
        </div>
      </section>
      <div class="py-5 text-center" *ngIf="isLoading">
        <i class="fas fa-spinner fa-spin fa-2x text-green"></i>
        <p class="mt-2 text-muted">Loading page content...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .dynamic-page-wrap {
      min-height: 80vh;
    }
    .iz-custom-section-body {
      font-size: 1.05rem;
      line-height: 1.7;
      color: #334155;
    }
  `]
})
export class DynamicPageComponent implements OnInit {
  page: SitePageDto | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private api: PortfolioApiService,
    public portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadPage(slug);
      }
    });
  }

  get visibleSections(): SiteSectionDto[] {
    return this.page && this.page.sections 
      ? this.page.sections.filter(s => s.isVisible) 
      : [];
  }

  loadPage(slug: string): void {
    this.isLoading = true;
    this.api.getPageBySlug(slug).subscribe({
      next: res => {
        this.isLoading = false;
        if (res.success && res.data && res.data.isVisible) {
          this.page = res.data;
        } else {
          this.page = null;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.page = null;
        this.cdr.detectChanges();
      }
    });
  }
}
