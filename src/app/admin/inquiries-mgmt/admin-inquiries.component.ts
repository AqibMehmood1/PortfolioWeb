import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminApiService, ContactInquiryDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

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
  savingNotes: boolean = false;
  selectedInquiry: ContactInquiryDto | null = null;
  statusFilter: string = 'ALL';
  searchTerm: string = '';

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private confirmDialog: ConfirmDialogService,
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
        this.portfolioService.showError('Failed to load inquiries from server.', 'Load Error');
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
          this.portfolioService.showSuccess(`Inquiry status updated to "${status}".`, 'Status Updated');
        } else {
          this.portfolioService.showError(res.message || 'Failed to update status.', 'Update Error');
        }
      },
      error: () => {
        this.portfolioService.showError('Failed to update inquiry status.', 'Update Error');
      }
    });
  }

  saveNotes(): void {
    if (!this.selectedInquiry || !this.selectedInquiry.id) return;
    this.savingNotes = true;
    this.cdr.detectChanges();
    this.adminApi.updateInquiryStatus(
      this.selectedInquiry.id,
      this.selectedInquiry.status,
      this.selectedInquiry.adminNotes
    )
    .pipe(
      finalize(() => {
        this.savingNotes = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (res) => {
        this.savingNotes = false;
        if (res.success) {
          this.portfolioService.showSuccess('Inquiry notes saved successfully.', 'Notes Saved');
          const item = this.inquiries.find(x => x.id === this.selectedInquiry!.id);
          if (item) item.adminNotes = this.selectedInquiry!.adminNotes;
        } else {
          this.portfolioService.showError(res.message || 'Failed to save notes.', 'Save Error');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.savingNotes = false;
        this.portfolioService.showError('Failed to save inquiry notes.', 'Save Error');
        this.cdr.detectChanges();
      }
    });
  }

  async deleteInquiry(inq: ContactInquiryDto): Promise<void> {
    if (!inq.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to delete the message from',
      itemHighlight: inq.name,
      confirmText: 'Delete Message',
      cancelText: 'Keep Message',
      type: 'danger',
      icon: 'fas fa-trash-alt'
    });

    if (confirmed) {
      this.adminApi.deleteInquiry(inq.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Inquiry from "${inq.name}" deleted successfully.`, 'Inquiry Deleted');
            if (this.selectedInquiry?.id === inq.id) this.selectedInquiry = null;
            this.loadInquiries();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete inquiry.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete inquiry. Please try again.', 'Delete Error')
      });
    }
  }
}
