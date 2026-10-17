import { Component, Input, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize, timeout, catchError, of } from 'rxjs';
import { PortfolioApiService } from '../../services/portfolio-api.service';
import { PortfolioService } from '../../services/portfolio.service';

export interface CountryItem {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-modern-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './modern-contact-form.component.html',
  styleUrl: './modern-contact-form.component.css'
})
export class ModernContactFormComponent {
  @Input() formTitle: string = "Let's Discuss Your Needs";
  @Input() formSubtitle: string = "Tell Us About Your Project. We'll Take It From There";
  @Input() showHeader: boolean = true;
  @Input() defaultSubject: string = 'General Consultation & Architecture Inquiry';

  @ViewChild('techInput') techInputElement?: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInputElement?: ElementRef<HTMLInputElement>;
  @ViewChild('techSelectWrapper') techSelectWrapper?: ElementRef<HTMLElement>;
  @ViewChild('countrySelectorWrapper') countrySelectorWrapper?: ElementRef<HTMLElement>;
  @ViewChild('countryDropdownMenu') countryDropdownMenu?: ElementRef<HTMLElement>;

  // Form Model
  fullName: string = '';
  email: string = '';
  phoneNumber: string = '';
  message: string = '';
  agreedToTerms: boolean = false;

  // Country Dialing Codes
  readonly countries: CountryItem[] = [
    { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
    { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'Cyprus', code: '+357', flag: '🇨🇾' },
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
    { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
    { name: 'Ireland', code: '+353', flag: '🇮🇪' },
    { name: 'Norway', code: '+47', flag: '🇳🇴' },
    { name: 'Sweden', code: '+46', flag: '🇸🇪' },
    { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
    { name: 'Spain', code: '+34', flag: '🇪🇸' },
    { name: 'Italy', code: '+39', flag: '🇮🇹' },
    { name: 'South Africa', code: '+27', flag: '🇿🇦' },
    { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
    { name: 'Turkey', code: '+90', flag: '🇹🇷' },
    { name: 'Qatar', code: '+974', flag: '🇶🇦' }
  ];

  selectedCountry: CountryItem = this.countries[0]; // Default Pakistan (+92)
  isCountryDropdownOpen: boolean = false;
  countrySearchQuery: string = '';

  // Tech Stacks Catalog & Autocomplete
  readonly defaultTechCatalog: string[] = [
    'Flutter',
    'Frontend',
    'Backend',
    '.NET 9 / C#',
    'Angular',
    'React.js',
    'TypeScript',
    'Node.js',
    'Python',
    'Next.js',
    'AI Agents & LLMs',
    'Azure Cloud',
    'AWS Cloud',
    'Docker & Kubernetes',
    'Microservices',
    'SQL Server',
    'PostgreSQL',
    'Redis Caching',
    'Vue.js',
    'Mobile (iOS / Android)',
    'React Native',
    'GraphQL',
    'Tailwind CSS',
    'LangChain / RAG'
  ];

  selectedTechStacks: string[] = [];
  techSearchQuery: string = '';
  isTechDropdownOpen: boolean = false;

  // File Upload State
  selectedFile: File | null = null;
  uploadedFileUrl: string | null = null;
  isDragging: boolean = false;
  isUploadingFile: boolean = false;

  // Submission State
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private api: PortfolioApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  // ==================== TECH STACK METHODS ====================
  get filteredTechStacks(): string[] {
    const q = this.techSearchQuery.trim().toLowerCase();
    if (!q) {
      return this.defaultTechCatalog.filter(t => !this.selectedTechStacks.includes(t));
    }
    return this.defaultTechCatalog.filter(
      t => t.toLowerCase().includes(q) && !this.selectedTechStacks.includes(t)
    );
  }

  get canCreateCustomTech(): boolean {
    const q = this.techSearchQuery.trim();
    if (!q) return false;
    const existsInCatalog = this.defaultTechCatalog.some(t => t.toLowerCase() === q.toLowerCase());
    const alreadySelected = this.selectedTechStacks.some(t => t.toLowerCase() === q.toLowerCase());
    return !existsInCatalog && !alreadySelected;
  }

  toggleTechDropdown(event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('.iz-tech-tag-remove') || target.closest('.iz-tech-dropdown')) {
        return;
      }
    }
    this.isTechDropdownOpen = !this.isTechDropdownOpen;
    if (this.isTechDropdownOpen) {
      this.isCountryDropdownOpen = false;
      setTimeout(() => this.techInputElement?.nativeElement.focus(), 0);
    }
  }

  openTechDropdown(): void {
    this.isTechDropdownOpen = true;
    this.isCountryDropdownOpen = false;
  }

  closeTechDropdown(): void {
    this.isTechDropdownOpen = false;
  }

  closeAllDropdowns(): void {
    this.isTechDropdownOpen = false;
    this.isCountryDropdownOpen = false;
  }

  onPillClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.iz-tech-tag-remove') || target.closest('.iz-tech-dropdown')) {
      return;
    }
    // If clicking directly on the input element, just open and keep open
    if (target === this.techInputElement?.nativeElement) {
      this.openTechDropdown();
      return;
    }
    // Clicking on pill container outside input toggles it
    if (this.isTechDropdownOpen) {
      this.closeTechDropdown();
    } else {
      this.openTechDropdown();
      this.techInputElement?.nativeElement.focus();
    }
  }

  selectTech(tech: string): void {
    if (!this.selectedTechStacks.includes(tech)) {
      this.selectedTechStacks.push(tech);
    }
    this.techSearchQuery = '';
    this.isTechDropdownOpen = false;
  }

  createCustomTech(): void {
    const custom = this.techSearchQuery.trim();
    if (custom && !this.selectedTechStacks.some(t => t.toLowerCase() === custom.toLowerCase())) {
      this.selectedTechStacks.push(custom);
    }
    this.techSearchQuery = '';
    this.isTechDropdownOpen = false;
  }

  removeTechStack(tech: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedTechStacks = this.selectedTechStacks.filter(t => t !== tech);
  }

  onTechKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.canCreateCustomTech) {
        this.createCustomTech();
      } else if (this.filteredTechStacks.length > 0) {
        this.selectTech(this.filteredTechStacks[0]);
      }
    } else if (event.key === 'Escape') {
      this.closeAllDropdowns();
    } else if (event.key === 'Backspace' && !this.techSearchQuery && this.selectedTechStacks.length > 0) {
      this.selectedTechStacks.pop();
    }
  }

  // ==================== COUNTRY CODE METHODS ====================
  toggleCountryDropdown(event: Event): void {
    event.stopPropagation();
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
    this.isTechDropdownOpen = false;
  }

  get filteredCountries(): CountryItem[] {
    const q = this.countrySearchQuery.trim().toLowerCase();
    if (!q) return this.countries;
    return this.countries.filter(
      c => c.name.toLowerCase().includes(q) || c.code.includes(q)
    );
  }

  selectCountry(country: CountryItem): void {
    this.selectedCountry = country;
    this.isCountryDropdownOpen = false;
    this.countrySearchQuery = '';
  }

  // ==================== FILE UPLOAD METHODS ====================
  triggerFileInput(): void {
    this.fileInputElement?.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private processFile(file: File): void {
    const maxBytes = 25 * 1024 * 1024; // 25MB
    if (file.size > maxBytes) {
      this.errorMessage = 'File exceeds maximum 25MB limit.';
      this.cdr.detectChanges();
      return;
    }
    this.errorMessage = '';
    this.selectedFile = file;
    this.cdr.detectChanges();
  }

  removeFile(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFile = null;
    this.uploadedFileUrl = null;
    if (this.fileInputElement) {
      this.fileInputElement.nativeElement.value = '';
    }
    this.cdr.detectChanges();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // ==================== CLICK OUTSIDE & ESCAPE LISTENERS ====================
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (!target) return;

    // Close Tech Stack dropdown if click is outside techSelectWrapper
    if (this.isTechDropdownOpen) {
      if (this.techSelectWrapper && !this.techSelectWrapper.nativeElement.contains(target)) {
        this.isTechDropdownOpen = false;
      }
    }

    // Close Country dropdown if click is outside country selector & dropdown menu
    if (this.isCountryDropdownOpen) {
      const isInsideCountry = 
        (this.countrySelectorWrapper && this.countrySelectorWrapper.nativeElement.contains(target)) ||
        (this.countryDropdownMenu && this.countryDropdownMenu.nativeElement.contains(target));

      if (!isInsideCountry) {
        this.isCountryDropdownOpen = false;
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeAllDropdowns();
  }

  // ==================== SUBMISSION ====================
  submitForm(): void {
    if (this.isSubmitting) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.fullName.trim()) {
      this.errorMessage = 'Please provide your Full Name.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.email.trim() || !this.email.includes('@')) {
      this.errorMessage = 'Please provide a valid Work Email Address.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.message.trim()) {
      this.errorMessage = 'Please help us understand what you require assistance with.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.agreedToTerms) {
      this.errorMessage = 'Please agree to the terms & conditions to submit.';
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    // Check if an attachment file needs to be uploaded first
    if (this.selectedFile) {
      this.isUploadingFile = true;
      this.api.uploadContactAttachment(this.selectedFile)
        .pipe(
          timeout(25000),
          catchError(err => {
            console.warn('File upload timed out or encountered an issue. Proceeding with inquiry:', err);
            return of({ success: false, data: null, message: 'Upload fallback' });
          })
        )
        .subscribe({
          next: uploadRes => {
            this.isUploadingFile = false;
            const fileInfo = uploadRes.success && uploadRes.data?.fileUrl
              ? `\n\n[Attached File: ${uploadRes.data.fileName} - ${uploadRes.data.fileUrl}]`
              : `\n\n[Attached File Mention: ${this.selectedFile?.name} (${this.formatFileSize(this.selectedFile?.size || 0)})]`;
            this.sendInquiry(fileInfo);
          }
        });
    } else {
      this.sendInquiry();
    }
  }

  private sendInquiry(attachmentNote: string = ''): void {
    const fullPhone = this.phoneNumber.trim()
      ? `${this.selectedCountry.code} ${this.phoneNumber.trim()}`
      : '';

    const techStackStr = this.selectedTechStacks.length > 0
      ? this.selectedTechStacks.join(', ')
      : 'General Tech Architecture';

    const finalMessage = this.message.trim() + attachmentNote;

    this.api.submitContactInquiry({
      name: this.fullName.trim(),
      email: this.email.trim(),
      phone: fullPhone,
      company: '',
      subject: `Inquiry: ${techStackStr}`,
      techStack: techStackStr,
      message: finalMessage
    })
    .pipe(
      timeout(15000),
      finalize(() => {
        this.isSubmitting = false;
        this.isUploadingFile = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: res => {
        const sender = this.fullName.trim();
        this.successMessage = res.message || `Thank you, ${sender}! Your project details have been received. We'll be in touch within 24 hours. 🚀`;
        this.portfolioService.showSuccess(this.successMessage, 'Inquiry Sent');
        this.resetForm();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 7000);
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Unable to submit your inquiry at this moment. Please email info@nexvoys.com directly.';
        this.portfolioService.showError(this.errorMessage, 'Submission Failed');
        this.cdr.detectChanges();
      }
    });
  }

  private resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.phoneNumber = '';
    this.message = '';
    this.selectedTechStacks = [];
    this.techSearchQuery = '';
    this.selectedFile = null;
    this.uploadedFileUrl = null;
    this.agreedToTerms = false;
    if (this.fileInputElement) {
      this.fileInputElement.nativeElement.value = '';
    }
    this.cdr.detectChanges();
  }
}
