import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, ExperienceDto, EducationDto, CertificationDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.adminApi.getExperiences().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.experiences = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getEducations().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.educations = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getCertifications().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.certifications = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load career data.');
        this.cdr.detectChanges();
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
      this.portfolioService.showToast('Role and Company are required.');
      return;
    }

    if (this.isEditExp && this.currentExp.id) {
      this.adminApi.updateExperience(this.currentExp.id, this.currentExp).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Experience updated.');
            this.showExpModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createExperience(this.currentExp).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Experience created.');
            this.showExpModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }

  deleteExp(exp: ExperienceDto): void {
    if (!exp.id) return;
    if (confirm(`Delete experience at ${exp.company}?`)) {
      this.adminApi.deleteExperience(exp.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Experience deleted.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
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
      this.portfolioService.showToast('Degree is required.');
      return;
    }

    if (this.isEditEdu && this.currentEdu.id) {
      this.adminApi.updateEducation(this.currentEdu.id, this.currentEdu).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Education updated.');
            this.showEduModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createEducation(this.currentEdu).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Education created.');
            this.showEduModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }

  deleteEdu(edu: EducationDto): void {
    if (!edu.id) return;
    if (confirm(`Delete education "${edu.degree}"?`)) {
      this.adminApi.deleteEducation(edu.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Education deleted.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
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
      this.portfolioService.showToast('Certification title is required.');
      return;
    }

    if (this.isEditCert && this.currentCert.id) {
      this.adminApi.updateCertification(this.currentCert.id, this.currentCert).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Certification updated.');
            this.showCertModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createCertification(this.currentCert).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Certification created.');
            this.showCertModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }

  deleteCert(cert: CertificationDto): void {
    if (!cert.id) return;
    if (confirm(`Delete certification "${cert.title}"?`)) {
      this.adminApi.deleteCertification(cert.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Certification deleted.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
  }
}
