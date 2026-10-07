import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AuditLogDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-admin-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-audit-logs.component.html',
  styleUrl: './admin-audit-logs.component.css'
})
export class AdminAuditLogsComponent implements OnInit {
  logs: AuditLogDto[] = [];
  loading: boolean = true;
  page: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;
  totalPages: number = 1;
  searchTerm: string = '';
  selectedLog: AuditLogDto | null = null;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.adminApi.getAuditLogs(this.page, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.logs = res.data.items;
          this.page = res.data.page;
          this.pageSize = res.data.pageSize;
          this.totalItems = res.data.totalItems;
          this.totalPages = res.data.totalPages;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load audit logs.');
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadLogs();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadLogs();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadLogs();
    }
  }
}
