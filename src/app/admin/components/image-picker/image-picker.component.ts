import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, MediaFileDto } from '../../../services/admin-api.service';
import { PortfolioService } from '../../../services/portfolio.service';

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-picker.component.html',
  styleUrl: './image-picker.component.css'
})
export class ImagePickerComponent {
  @Input() label: string = 'Image';
  @Input() hint: string = '';
  @Input() placeholder: string = 'Enter image URL or asset path (e.g. assets/img/photo.png or https://...)';
  @Input() accept: string = 'image/*,.jfif,.ico,.avif,.webp,.svg,.png,.jpg,.jpeg';
  @Input() allowMediaLibrary: boolean = true;
  @Input() disabled: boolean = false;
  @Input() fullSpan: boolean = false;

  @Input() imageUrl: string = '';
  @Output() imageUrlChange = new EventEmitter<string>();

  uploading: boolean = false;
  imageError: boolean = false;
  showMediaModal: boolean = false;
  loadingMedia: boolean = false;
  mediaLibraryFiles: MediaFileDto[] = [];
  mediaSearchTerm: string = '';

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  onInputChange(val: string): void {
    this.imageUrl = val;
    this.imageError = false;
    this.imageUrlChange.emit(val);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploadFile(file);
    input.value = '';
  }

  uploadFile(file: File): void {
    this.uploading = true;
    this.adminApi.uploadMedia(file).subscribe({
      next: (res) => {
        this.uploading = false;
        if (res.success && res.data) {
          const chosenUrl = res.data.url || res.data.filePath || '';
          this.imageUrl = chosenUrl;
          this.imageError = false;
          this.imageUrlChange.emit(this.imageUrl);
          this.portfolioService.showToast(`Uploaded "${file.name}" successfully! ✨`);
        } else {
          this.portfolioService.showToast(res.message || 'Upload failed.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uploading = false;
        this.portfolioService.showToast(err.error?.message || 'Failed to upload image.');
        this.cdr.detectChanges();
      }
    });
  }

  clearImage(): void {
    this.imageUrl = '';
    this.imageError = false;
    this.imageUrlChange.emit('');
  }

  copyUrl(): void {
    if (!this.imageUrl) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.imageUrl).then(() => {
        this.portfolioService.showToast('Image URL copied to clipboard! 📋');
      });
    } else {
      this.portfolioService.showToast('Copied URL! 📋');
    }
  }

  onImgError(): void {
    this.imageError = true;
  }

  onImgLoad(): void {
    this.imageError = false;
  }

  openMediaLibrary(): void {
    this.showMediaModal = true;
    this.loadingMedia = true;
    this.adminApi.getMediaFiles(1, 100).subscribe({
      next: (res) => {
        this.loadingMedia = false;
        if (res.success && res.data) {
          this.mediaLibraryFiles = res.data.filter(m => !m.contentType || m.contentType.startsWith('image/') || m.fileName.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i));
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingMedia = false;
        this.portfolioService.showToast('Failed to load media library assets.');
        this.cdr.detectChanges();
      }
    });
  }

  get filteredMediaFiles(): MediaFileDto[] {
    if (!this.mediaSearchTerm) return this.mediaLibraryFiles;
    const q = this.mediaSearchTerm.toLowerCase();
    return this.mediaLibraryFiles.filter(m => 
      m.fileName.toLowerCase().includes(q) || 
      (m.originalFileName && m.originalFileName.toLowerCase().includes(q)) ||
      (m.altText && m.altText.toLowerCase().includes(q))
    );
  }

  selectMediaFile(file: MediaFileDto): void {
    const chosenUrl = file.url || file.filePath || '';
    this.imageUrl = chosenUrl;
    this.imageError = false;
    this.imageUrlChange.emit(this.imageUrl);
    this.showMediaModal = false;
    this.portfolioService.showToast(`Selected "${file.originalFileName || file.fileName}"! ✨`);
    this.cdr.detectChanges();
  }
}
