import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AdminApiService, MediaFileDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-media.component.html',
  styleUrl: './admin-media.component.css'
})
export class AdminMediaComponent implements OnInit {
  mediaFiles: MediaFileDto[] = [];
  loading: boolean = true;
  uploading: boolean = false;
  searchTerm: string = '';
  selectedFile: MediaFileDto | null = null;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading = true;
    this.adminApi.getMediaFiles().pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.mediaFiles = res.data;
        }
      },
      error: () => {
        this.portfolioService.showError('Failed to load media files from server.', 'Load Error');
      }
    });
  }

  get filteredMedia(): MediaFileDto[] {
    return this.mediaFiles.filter(m => 
      !this.searchTerm || 
      m.fileName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (m.altText && m.altText.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  onFileInput(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.uploading = true;
    this.cdr.detectChanges();

    this.adminApi.uploadMedia(file).pipe(
      timeout(60000),
      finalize(() => {
        this.uploading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(`File "${file.name}" uploaded successfully!`, 'File Uploaded');
          this.loadMedia();
        } else {
          this.portfolioService.showError(res.message || 'Upload failed.', 'Upload Error');
        }
      },
      error: (err) => {
        this.portfolioService.showError(err.error?.message || 'File upload failed. Please try again.', 'Upload Error');
      }
    });
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.portfolioService.showInfo('Asset URL copied to clipboard! 📋', 'Copied');
    });
  }

  async deleteMedia(file: MediaFileDto): Promise<void> {
    if (!file.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Media Asset',
      message: 'Are you sure you want to permanently delete file asset',
      itemHighlight: file.fileName,
      confirmText: 'Delete File',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-photo-video'
    });

    if (confirmed) {
      this.adminApi.deleteMedia(file.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Media asset "${file.fileName}" deleted successfully.`, 'File Deleted');
            if (this.selectedFile?.id === file.id) this.selectedFile = null;
            this.loadMedia();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete file.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete media asset. Please try again.', 'Delete Error')
      });
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
