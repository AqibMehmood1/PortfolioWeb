import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AdminApiService, ExperienceDto, EducationDto, CertificationDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-experience.component.html',
  styleUrl: './admin-experience.component.css'
})
export class AdminExperienceComponent implements OnInit {
  experiences: ExperienceDto[] = [];
  educations: EducationDto[] = [];
  certifications: CertificationDto[] = [];
  loading: boolean = true;
  savingExp: boolean = false;
  savingEdu: boolean = false;
  savingCert: boolean = false;
  activeTab: 'exp' | 'edu' | 'cert' = 'exp';

  // Experience Modal
  showExpModal: boolean = false;
  currentExp: ExperienceDto = this.getEmptyExp();
  isEditExp: boolean = false;

  // Education Modal
  showEduModal: boolean = false;
  currentEdu: EducationDto = this.getEmptyEdu();
  isEditEdu: boolean = false;

  // Cert Modal
  showCertModal: boolean = false;
  currentCert: CertificationDto = this.getEmptyCert();
  isEditCert: boolean = false;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.adminApi.getExperiences().pipe(
      timeout(15000)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.experiences = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getEducations().pipe(
      timeout(15000)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.educations = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getCertifications().pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.certifications = res.data;
        }
      },
      error: () => {
        this.portfolioService.showError('Failed to load career data from server.', 'Load Error');
      }
    });
  }

  getEmptyExp(): ExperienceDto {
    return {
      role: '',
      company: '',
      location: 'Remote',
      type: 'Full-time',
      period: '2024 — Present',
      description: '',
      responsibilitiesJson: '[]',
      technologiesJson: '[]',
      isCurrent: true,
      displayOrder: this.experiences.length + 1,
      isActive: true
    };
  }

  getEmptyEdu(): EducationDto {
    return {
      degree: '',
      institution: '',
      fieldOfStudy: 'Computer Science',
      period: '2019 — 2023',
      gradeOrHonor: 'First Class Honors',
      displayOrder: this.educations.length + 1,
      isActive: true
    };
  }

  getEmptyCert(): CertificationDto {
    return {
      title: '',
      issuingOrganization: 'Microsoft',
      issueDate: '2024',
      credentialUrl: '',
      badgeIcon: 'fas fa-certificate',
      displayOrder: this.certifications.length + 1,
      isActive: true
    };
  }

  // Experience CRUD
  openCreateExp(): void {
    this.currentExp = this.getEmptyExp();
    this.isEditExp = false;
    this.showExpModal = true;
  }

  openEditExp(exp: ExperienceDto): void {
    this.currentExp = { ...exp };
    this.isEditExp = true;
    this.showExpModal = true;
  }

  saveExp(): void {
    if (!this.currentExp.role.trim() || !this.currentExp.company.trim()) {
      this.portfolioService.showWarning('Role and Company are required before saving.', 'Validation Warning');
      return;
    }

    this.savingExp = true;
    const req$ = (this.isEditExp && this.currentExp.id)
      ? this.adminApi.updateExperience(this.currentExp.id, this.currentExp)
      : this.adminApi.createExperience(this.currentExp);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingExp = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditExp ? `Experience position "${this.currentExp.role}" updated!` : `Experience position "${this.currentExp.role}" created!`,
            this.isEditExp ? 'Experience Updated' : 'Experience Created'
          );
          this.showExpModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteExp(exp: ExperienceDto): Promise<void> {
    if (!exp.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Career Experience',
      message: 'Are you sure you want to delete experience position at',
      itemHighlight: `${exp.role} @ ${exp.company}`,
      confirmText: 'Delete Experience',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-briefcase'
    });

    if (confirmed) {
      this.adminApi.deleteExperience(exp.id).pipe(
        timeout(15000)
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Experience at "${exp.company}" deleted successfully.`, 'Experience Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete experience.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete experience. Please try again.', 'Delete Error')
      });
    }
  }

  // Education CRUD
  openCreateEdu(): void {
    this.currentEdu = this.getEmptyEdu();
    this.isEditEdu = false;
    this.showEduModal = true;
  }

  openEditEdu(edu: EducationDto): void {
    this.currentEdu = { ...edu };
    this.isEditEdu = true;
    this.showEduModal = true;
  }

  saveEdu(): void {
    if (!this.currentEdu.degree.trim()) {
      this.portfolioService.showWarning('Degree is required before saving.', 'Validation Warning');
      return;
    }

    this.savingEdu = true;
    const req$ = (this.isEditEdu && this.currentEdu.id)
      ? this.adminApi.updateEducation(this.currentEdu.id, this.currentEdu)
      : this.adminApi.createEducation(this.currentEdu);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingEdu = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditEdu ? `Education "${this.currentEdu.degree}" updated!` : `Education "${this.currentEdu.degree}" added!`,
            this.isEditEdu ? 'Education Updated' : 'Education Added'
          );
          this.showEduModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteEdu(edu: EducationDto): Promise<void> {
    if (!edu.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Academic Degree',
      message: 'Are you sure you want to delete education credential',
      itemHighlight: `${edu.degree} (${edu.institution})`,
      confirmText: 'Delete Education',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-graduation-cap'
    });

    if (confirmed) {
      this.adminApi.deleteEducation(edu.id).pipe(
        timeout(15000)
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Education credential "${edu.degree}" deleted.`, 'Education Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete education.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete education. Please try again.', 'Delete Error')
      });
    }
  }

  // Certifications CRUD
  openCreateCert(): void {
    this.currentCert = this.getEmptyCert();
    this.isEditCert = false;
    this.showCertModal = true;
  }

  openEditCert(cert: CertificationDto): void {
    this.currentCert = { ...cert };
    this.isEditCert = true;
    this.showCertModal = true;
  }

  saveCert(): void {
    if (!this.currentCert.title.trim()) {
      this.portfolioService.showWarning('Certification title is required before saving.', 'Validation Warning');
      return;
    }

    this.savingCert = true;
    const req$ = (this.isEditCert && this.currentCert.id)
      ? this.adminApi.updateCertification(this.currentCert.id, this.currentCert)
      : this.adminApi.createCertification(this.currentCert);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingCert = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditCert ? `Certification "${this.currentCert.title}" updated!` : `Certification "${this.currentCert.title}" added!`,
            this.isEditCert ? 'Certification Updated' : 'Certification Added'
          );
          this.showCertModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteCert(cert: CertificationDto): Promise<void> {
    if (!cert.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Certification',
      message: 'Are you sure you want to delete verified credential',
      itemHighlight: `${cert.title} (${cert.issuingOrganization})`,
      confirmText: 'Delete Certificate',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-certificate'
    });

    if (confirmed) {
      this.adminApi.deleteCertification(cert.id).pipe(
        timeout(15000)
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Certification "${cert.title}" deleted successfully.`, 'Certification Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete certification.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete certification. Please try again.', 'Delete Error')
      });
    }
  }
}
