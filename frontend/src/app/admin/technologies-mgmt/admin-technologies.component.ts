import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AdminApiService, TechnologyCategoryDto, TechnologyDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-admin-technologies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-technologies.component.html',
  styleUrl: './admin-technologies.component.css'
})
export class AdminTechnologiesComponent implements OnInit {
  categories: TechnologyCategoryDto[] = [];
  technologies: TechnologyDto[] = [];
  loading: boolean = true;
  savingTech: boolean = false;
  savingCat: boolean = false;
  activeTab: 'tech' | 'categories' = 'tech';

  // Technology Modal
  showTechModal: boolean = false;
  currentTech: TechnologyDto = this.getEmptyTech();
  isEditTech: boolean = false;

  // Category Modal
  showCatModal: boolean = false;
  currentCat: TechnologyCategoryDto = this.getEmptyCat();
  isEditCat: boolean = false;

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
    this.adminApi.getTechCategories().pipe(
      timeout(15000)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getTechnologies().pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.technologies = res.data;
        }
      },
      error: () => {
        this.portfolioService.showError('Failed to load technologies from server.', 'Load Error');
      }
    });
  }

  getEmptyTech(): TechnologyDto {
    return {
      name: '',
      slug: '',
      icon: 'fab fa-angular',
      level: 'Proficient',
      proficiencyPercentage: 90,
      description: '',
      categoryName: 'Frontend Architecture',
      displayOrder: this.technologies.length + 1,
      isActive: true,
      tagsJson: '[]'
    };
  }

  getEmptyCat(): TechnologyCategoryDto {
    return {
      name: '',
      slug: '',
      subtitle: '',
      icon: 'fas fa-layer-group',
      displayOrder: this.categories.length + 1,
      isActive: true
    };
  }

  getCategoryName(catId?: number): string {
    if (!catId) return 'Uncategorized';
    const c = this.categories.find(x => x.id === catId);
    return c ? c.name : 'Uncategorized';
  }

  // Tech CRUD
  openCreateTech(): void {
    this.currentTech = this.getEmptyTech();
    if (this.categories.length > 0) {
      this.currentTech.categoryId = this.categories[0].id;
      this.currentTech.categoryName = this.categories[0].name;
    }
    this.isEditTech = false;
    this.showTechModal = true;
  }

  openEditTech(tech: TechnologyDto): void {
    this.currentTech = { ...tech };
    this.isEditTech = true;
    this.showTechModal = true;
  }

  saveTech(): void {
    if (!this.currentTech.name.trim()) {
      this.portfolioService.showWarning('Technology name is required before saving.', 'Validation Warning');
      return;
    }

    if (!this.currentTech.slug) {
      this.currentTech.slug = this.currentTech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    this.savingTech = true;
    const req$ = (this.isEditTech && this.currentTech.id)
      ? this.adminApi.updateTechnology(this.currentTech.id, this.currentTech)
      : this.adminApi.createTechnology(this.currentTech);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingTech = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditTech ? `Technology "${this.currentTech.name}" updated successfully!` : `Technology "${this.currentTech.name}" created successfully!`,
            this.isEditTech ? 'Technology Updated' : 'Technology Created'
          );
          this.showTechModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteTech(tech: TechnologyDto): Promise<void> {
    if (!tech.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Technology Entry',
      message: 'Are you sure you want to delete technology stack item',
      itemHighlight: tech.name,
      confirmText: 'Delete Tech',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-layer-group'
    });

    if (confirmed) {
      this.adminApi.deleteTechnology(tech.id).pipe(
        timeout(15000)
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Technology "${tech.name}" deleted successfully.`, 'Technology Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete technology.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete technology. Please try again.', 'Delete Error')
      });
    }
  }

  // Category CRUD
  openCreateCat(): void {
    this.currentCat = this.getEmptyCat();
    this.isEditCat = false;
    this.showCatModal = true;
  }

  openEditCat(cat: TechnologyCategoryDto): void {
    this.currentCat = { ...cat };
    this.isEditCat = true;
    this.showCatModal = true;
  }

  saveCat(): void {
    if (!this.currentCat.name.trim()) {
      this.portfolioService.showWarning('Category name is required before saving.', 'Validation Warning');
      return;
    }

    if (!this.currentCat.slug) {
      this.currentCat.slug = this.currentCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    this.savingCat = true;
    const req$ = (this.isEditCat && this.currentCat.id)
      ? this.adminApi.updateTechCategory(this.currentCat.id, this.currentCat)
      : this.adminApi.createTechCategory(this.currentCat);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.savingCat = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEditCat ? `Category "${this.currentCat.name}" updated successfully!` : `Category "${this.currentCat.name}" created successfully!`,
            this.isEditCat ? 'Category Updated' : 'Category Created'
          );
          this.showCatModal = false;
          this.loadData();
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteCat(cat: TechnologyCategoryDto): Promise<void> {
    if (!cat.id) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Tech Category',
      message: 'Are you sure you want to delete technology radar category',
      itemHighlight: cat.name,
      confirmText: 'Delete Category',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-tags'
    });

    if (confirmed) {
      this.adminApi.deleteTechCategory(cat.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Category "${cat.name}" deleted successfully.`, 'Category Deleted');
            this.loadData();
            this.portfolioService.refreshData();
          } else {
            this.portfolioService.showError(res.message || 'Failed to delete category.', 'Delete Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to delete category. Please try again.', 'Delete Error')
      });
    }
  }
}
