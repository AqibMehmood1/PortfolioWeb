import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminApiService, ProjectDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { ImagePickerComponent } from '../components/image-picker/image-picker.component';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagePickerComponent],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.css'
})
export class AdminProjectsComponent implements OnInit {
  projects: ProjectDto[] = [];
  loading: boolean = true;
  saving: boolean = false;
  showModal: boolean = false;
  isEdit: boolean = false;
  currentProject: ProjectDto = this.getEmptyProject();

  // Search & Filter
  searchTerm: string = '';
  selectedCategory: string = 'ALL';

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.adminApi.getProjects().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.projects = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showError('Failed to load projects from database.', 'Load Error');
        this.cdr.detectChanges();
      }
    });
  }

  getEmptyProject(): ProjectDto {
    return {
      title: '',
      slug: '',
      subtitle: '',
      category: 'Enterprise Backend & Web',
      description: '',
      longDescription: '',
      client: '',
      duration: '',
      role: '',
      thumbnailUrl: '/assets/projects/default.png',
      image: '/assets/projects/default.png',
      gif: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      isPublished: true,
      displayOrder: this.projects.length + 1,
      technologiesJson: '[]',
      challengesJson: '[]',
      solutionsJson: '[]',
      impactMetricsJson: '[]'
    };
  }

  get filteredProjects(): ProjectDto[] {
    return this.projects.filter(p => {
      const matchSearch = !this.searchTerm || 
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCat = this.selectedCategory === 'ALL' || p.category.toUpperCase().includes(this.selectedCategory);
      return matchSearch && matchCat;
    });
  }

  openCreate(): void {
    this.currentProject = this.getEmptyProject();
    this.isEdit = false;
    this.showModal = true;
  }

  openEdit(proj: ProjectDto): void {
    this.currentProject = { 
      ...proj, 
      thumbnailUrl: proj.thumbnailUrl || (proj as any).image || '',
      gif: proj.gif || ''
    };
    this.isEdit = true;
    this.showModal = true;
  }

  saveProject(): void {
    if (!this.currentProject.title.trim()) {
      this.portfolioService.showWarning('Project title is required before saving.', 'Validation Warning');
      return;
    }

    if (!this.currentProject.slug) {
      this.currentProject.slug = this.currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    this.currentProject.image = this.currentProject.thumbnailUrl;

    this.saving = true;
    this.cdr.detectChanges();

    if (this.isEdit && this.currentProject.id) {
      this.adminApi.updateProject(this.currentProject.id, this.currentProject)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          this.saving = false;
          if (res.success) {
            this.portfolioService.showSuccess(`Project "${this.currentProject.title}" updated successfully!`, 'Project Updated');
            this.showModal = false;
            this.loadProjects();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to update project.', 'Update Error');
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.saving = false;
          this.portfolioService.showError(err.error?.message || 'Failed to update project. Please try again.', 'Update Error');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.adminApi.createProject(this.currentProject)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          this.saving = false;
          if (res.success) {
            this.portfolioService.showSuccess(`Project "${this.currentProject.title}" published successfully!`, 'Project Created');
            this.showModal = false;
            this.loadProjects();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to create project.', 'Creation Error');
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.saving = false;
          this.portfolioService.showError(err.error?.message || 'Failed to create project. Please try again.', 'Creation Error');
          this.cdr.detectChanges();
        }
      });
    }
  }

  async deleteProject(proj: ProjectDto): Promise<void> {
    if (!proj.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Project Study',
      message: 'Are you sure you want to permanently delete project',
      itemHighlight: proj.title,
      confirmText: 'Delete Project',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-laptop-code'
    });

    if (confirmed) {
      this.adminApi.deleteProject(proj.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Project "${proj.title}" deleted successfully.`, 'Project Deleted');
            this.loadProjects();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete project.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete project. Please try again.', 'Delete Error')
      });
    }
  }
}
