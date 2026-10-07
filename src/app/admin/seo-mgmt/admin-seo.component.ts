import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, SeoMetadataDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ImagePickerComponent } from '../components/image-picker/image-picker.component';

@Component({
  selector: 'app-admin-seo',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagePickerComponent],
  templateUrl: './admin-seo.component.html',
  styleUrl: './admin-seo.component.css'
})
export class AdminSeoComponent implements OnInit {
  seoList: SeoMetadataDto[] = [];
  loading: boolean = true;
  selectedSeo: SeoMetadataDto | null = null;
  saving: boolean = false;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSeo();
  }

  loadSeo(): void {
    this.loading = true;
    this.adminApi.getSeoList().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.seoList = (res.data || []).map(s => ({
            ...s,
            metaTitle: s.metaTitle || (s as any).title || '',
            metaDescription: s.metaDescription || (s as any).description || '',
            metaKeywords: s.metaKeywords || (s as any).keywords || '',
            ogImageUrl: s.ogImageUrl || (s as any).ogImage || ''
          }));
          if (this.seoList.length > 0) {
            this.selectedSeo = { ...this.seoList[0] };
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load SEO metadata.');
        this.cdr.detectChanges();
      }
    });
  }

  selectRoute(seo: SeoMetadataDto): void {
    this.selectedSeo = { ...seo };
    this.cdr.detectChanges();
  }

  saveCurrent(): void {
    if (!this.selectedSeo || !this.selectedSeo.id) return;

    this.saving = true;
    this.adminApi.updateSeo(this.selectedSeo.id, this.selectedSeo).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.portfolioService.showToast(`SEO for route "${this.selectedSeo?.pageRoute}" updated.`);
          const idx = this.seoList.findIndex(x => x.id === this.selectedSeo?.id);
          if (idx !== -1) {
            this.seoList[idx] = { ...this.selectedSeo! };
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.saving = false;
        this.portfolioService.showToast('Failed to save SEO metadata.');
        this.cdr.detectChanges();
      }
    });
  }
}
