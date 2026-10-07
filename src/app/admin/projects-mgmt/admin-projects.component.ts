import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, ProjectDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.css'
})
export class AdminProjectsComponent implements OnInit {
  projects: ProjectDto[] = [];
  loading: boolean = true;
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
        this.portfolioService.showToast('Failed to load projects from database.');
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
    this.currentProject = { ...proj };
    this.isEdit = true;
    this.showModal = true;
  }

  saveProject(): void {
    if (!this.currentProject.title.trim()) {
      this.portfolioService.showToast('Project title is required.');
      return;
    }

    if (!this.currentProject.slug) {
      this.currentProject.slug = this.currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (this.isEdit && this.currentProject.id) {
      this.adminApi.updateProject(this.currentProject.id, this.currentProject).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Project updated successfully.');
            this.showModal = false;
            this.loadProjects();
            this.portfolioService.refreshData();
          }
        },
        error: (err) => this.portfolioService.showToast(err.error?.message || 'Update failed.')
      });
    } else {
      this.adminApi.createProject(this.currentProject).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Project created successfully.');
            this.showModal = false;
            this.loadProjects();
            this.portfolioService.refreshData();
          }
        },
        error: (err) => this.portfolioService.showToast(err.error?.message || 'Create failed.')
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
            this.portfolioService.showToast('Project deleted successfully.');
            this.loadProjects();
            this.portfolioService.refreshData();
          }
        },
        error: () => this.portfolioService.showToast('Failed to delete project.')
      });
    }
  }
}
