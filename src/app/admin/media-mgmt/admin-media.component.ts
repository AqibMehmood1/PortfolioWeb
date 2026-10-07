import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, MediaFileDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading = true;
    this.adminApi.getMediaFiles().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.mediaFiles = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load media files.');
        this.cdr.detectChanges();
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
    this.adminApi.uploadMedia(file).subscribe({
      next: (res) => {
        this.uploading = false;
        if (res.success) {
          this.portfolioService.showToast('File uploaded successfully!');
          this.loadMedia();
        } else {
          this.portfolioService.showToast(res.message || 'Upload failed.');
        }
      },
      error: (err) => {
        this.uploading = false;
        this.portfolioService.showToast(err.error?.message || 'File upload error.');
      }
    });
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.portfolioService.showToast('URL copied to clipboard!');
    });
  }

  deleteMedia(file: MediaFileDto): void {
    if (!file.id) return;
    if (confirm(`Delete file "${file.fileName}"?`)) {
      this.adminApi.deleteMedia(file.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('File deleted.');
            if (this.selectedFile?.id === file.id) this.selectedFile = null;
            this.loadMedia();
          }
        }
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
