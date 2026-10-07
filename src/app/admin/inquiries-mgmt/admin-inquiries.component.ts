import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, ContactInquiryDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inquiries.component.html',
  styleUrl: './admin-inquiries.component.css'
})
export class AdminInquiriesComponent implements OnInit {
  inquiries: ContactInquiryDto[] = [];
  loading: boolean = true;
  selectedInquiry: ContactInquiryDto | null = null;
  statusFilter: string = 'ALL';
  searchTerm: string = '';

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries(): void {
    this.loading = true;
    this.adminApi.getInquiries().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.inquiries = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load inquiries.');
        this.cdr.detectChanges();
      }
    });
  }

  get filteredInquiries(): ContactInquiryDto[] {
    return this.inquiries.filter(i => {
      const matchStatus = this.statusFilter === 'ALL' || i.status.toUpperCase() === this.statusFilter.toUpperCase();
      const matchSearch = !this.searchTerm ||
        i.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        i.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (i.company && i.company.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (i.message && i.message.toLowerCase().includes(this.searchTerm.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }

  viewInquiry(inq: ContactInquiryDto): void {
    this.selectedInquiry = { ...inq };
    if (inq.status === 'New' && inq.id) {
      this.updateStatus(inq.id, 'Read');
      inq.status = 'Read';
    }
  }

  updateStatus(id: number, status: string): void {
    const notes = this.selectedInquiry ? this.selectedInquiry.adminNotes : undefined;
    this.adminApi.updateInquiryStatus(id, status, notes).subscribe({
      next: (res) => {
        if (res.success) {
          const item = this.inquiries.find(x => x.id === id);
          if (item) item.status = status;
          if (this.selectedInquiry && this.selectedInquiry.id === id) {
            this.selectedInquiry.status = status;
          }
          this.portfolioService.showToast(`Inquiry marked as ${status}`);
        }
      }
    });
  }

  saveNotes(): void {
    if (!this.selectedInquiry || !this.selectedInquiry.id) return;
    this.adminApi.updateInquiryStatus(
      this.selectedInquiry.id,
      this.selectedInquiry.status,
      this.selectedInquiry.adminNotes
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showToast('Admin notes saved.');
          const item = this.inquiries.find(x => x.id === this.selectedInquiry!.id);
          if (item) item.adminNotes = this.selectedInquiry!.adminNotes;
        }
      }
    });
  }

  deleteInquiry(inq: ContactInquiryDto): void {
    if (!inq.id) return;
    if (confirm(`Delete message from ${inq.name}?`)) {
      this.adminApi.deleteInquiry(inq.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Inquiry deleted.');
            if (this.selectedInquiry?.id === inq.id) this.selectedInquiry = null;
            this.loadInquiries();
          }
        }
      });
    }
  }
}
