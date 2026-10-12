import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AdminApiService, AboutContentDto, StepItemDto, ValueCardDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-about.component.html',
  styleUrl: './admin-about.component.css'
})
export class AdminAboutComponent implements OnInit {
  aboutContent: AboutContentDto = {
    headline: '',
    subtitle: '',
    visionHeadline: '',
    visionLead: '',
    visionDescription: '',
    focusAreas: [],
    executionSteps: [],
    valueCards: [],
    threeStepProcess: []
  };

  newFocusArea: string = '';
  loading: boolean = true;
  saving: boolean = false;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAboutContent();
  }

  loadAboutContent(): void {
    this.loading = true;
    this.adminApi.getAboutContent().pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.aboutContent = {
            headline: res.data.headline || '',
            subtitle: res.data.subtitle || '',
            visionHeadline: res.data.visionHeadline || '',
            visionLead: res.data.visionLead || '',
            visionDescription: res.data.visionDescription || '',
            focusAreas: res.data.focusAreas || [],
            executionSteps: res.data.executionSteps || [],
            valueCards: res.data.valueCards || [],
            threeStepProcess: res.data.threeStepProcess || []
          };
        }
      },
      error: () => {
        this.portfolioService.showToast('Failed to load About content.');
      }
    });
  }

  saveAbout(): void {
    this.saving = true;
    this.adminApi.updateAboutContent(this.aboutContent).pipe(
      timeout(15000),
      finalize(() => {
        this.saving = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showToast('About & Strategy content updated successfully!');
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showToast(res.message || 'Failed to update About content.');
        }
      },
      error: () => {
        this.portfolioService.showToast('Error saving About content to database.');
      }
    });
  }

  // Focus Areas helpers
  addFocusArea(): void {
    if (this.newFocusArea.trim()) {
      this.aboutContent.focusAreas.push(this.newFocusArea.trim());
      this.newFocusArea = '';
    }
  }

  removeFocusArea(index: number): void {
    this.aboutContent.focusAreas.splice(index, 1);
  }

  // Execution Steps helpers
  addExecutionStep(): void {
    const num = `0${this.aboutContent.executionSteps.length + 1}`;
    this.aboutContent.executionSteps.push({
      step: num,
      title: 'New Step',
      description: 'Step description'
    });
  }

  removeExecutionStep(index: number): void {
    this.aboutContent.executionSteps.splice(index, 1);
  }

  // Value Cards helpers
  addValueCard(): void {
    this.aboutContent.valueCards.push({
      title: 'Value Metric',
      description: 'Description of business impact'
    });
  }

  removeValueCard(index: number): void {
    this.aboutContent.valueCards.splice(index, 1);
  }

  // 3-Step Process helpers
  addThreeStep(): void {
    const num = `0${this.aboutContent.threeStepProcess.length + 1}`;
    this.aboutContent.threeStepProcess.push({
      step: num,
      title: 'Onboarding Phase',
      description: 'Phase overview'
    });
  }

  removeThreeStep(index: number): void {
    this.aboutContent.threeStepProcess.splice(index, 1);
  }
}
