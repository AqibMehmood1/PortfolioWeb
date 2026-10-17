import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService, DashboardStatsDto } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStatsDto | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  private errorTimeout: any = null;

  constructor(
    private adminApi: AdminApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.loading = true;
    this.errorMessage = '';

    this.adminApi.getDashboardStats().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.stats = res.data;
        } else {
          this.errorMessage = res.message || 'Failed to load dashboard statistics.';
          this.errorTimeout = setTimeout(() => {
            this.errorMessage = '';
            this.cdr.detectChanges();
          }, 4000);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Server error loading dashboard stats.';
        this.errorTimeout = setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 4000);
        this.cdr.detectChanges();
      }
    });
  }
}
