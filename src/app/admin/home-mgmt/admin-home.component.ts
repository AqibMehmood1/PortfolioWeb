import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, HomePageContentDto, StatItemDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
  homeContent: HomePageContentDto = {
    headline: '',
    subtitle: '',
    typedStrings: [],
    stats: []
  };

  newTypedString: string = '';
  loading: boolean = true;
  saving: boolean = false;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHomeContent();
  }

  loadHomeContent(): void {
    this.loading = true;
    this.adminApi.getHomeContent().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.homeContent = {
            headline: res.data.headline || '',
            subtitle: res.data.subtitle || '',
            typedStrings: res.data.typedStrings || [],
            stats: res.data.stats || []
          };
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load homepage content from database.');
        this.cdr.detectChanges();
      }
    });
  }

  saveHome(): void {
    this.saving = true;
    this.adminApi.updateHomeContent(this.homeContent).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.portfolioService.showToast('Homepage content updated successfully!');
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showToast(res.message || 'Failed to save homepage content.');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.saving = false;
        this.portfolioService.showToast('Error saving homepage content.');
        this.cdr.detectChanges();
      }
    });
  }

  addTypedString(): void {
    if (this.newTypedString.trim()) {
      this.homeContent.typedStrings.push(this.newTypedString.trim());
      this.newTypedString = '';
    }
  }

  removeTypedString(index: number): void {
    this.homeContent.typedStrings.splice(index, 1);
  }

  addStat(): void {
    this.homeContent.stats.push({
      value: '10+',
      label: 'New Metric',
      icon: 'fas fa-chart-line'
    });
  }

  removeStat(index: number): void {
    this.homeContent.stats.splice(index, 1);
  }
}
