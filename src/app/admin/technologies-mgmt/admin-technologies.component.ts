import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    this.adminApi.getTechCategories().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
        this.cdr.detectChanges();
      }
    });

    this.adminApi.getTechnologies().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.technologies = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load technologies.');
        this.cdr.detectChanges();
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
      this.portfolioService.showToast('Technology name is required.');
      return;
    }

    if (!this.currentTech.slug) {
      this.currentTech.slug = this.currentTech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (this.isEditTech && this.currentTech.id) {
      this.adminApi.updateTechnology(this.currentTech.id, this.currentTech).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Technology updated.');
            this.showTechModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createTechnology(this.currentTech).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Technology created.');
            this.showTechModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
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
      this.adminApi.deleteTechnology(tech.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Technology deleted successfully.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        },
        error: () => this.portfolioService.showToast('Failed to delete technology.')
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
      this.portfolioService.showToast('Category name is required.');
      return;
    }

    if (!this.currentCat.slug) {
      this.currentCat.slug = this.currentCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (this.isEditCat && this.currentCat.id) {
      this.adminApi.updateTechCategory(this.currentCat.id, this.currentCat).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Category updated.');
            this.showCatModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    } else {
      this.adminApi.createTechCategory(this.currentCat).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('Category created.');
            this.showCatModal = false;
            this.loadData();
            this.portfolioService.refreshData();
          }
        }
      });
    }
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
            this.portfolioService.showToast('Category deleted successfully.');
            this.loadData();
            this.portfolioService.refreshData();
          }
        },
        error: () => this.portfolioService.showToast('Failed to delete category.')
      });
    }
  }
}
