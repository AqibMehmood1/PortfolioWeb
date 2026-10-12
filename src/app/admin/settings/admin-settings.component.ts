import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminApiService, WebsiteSettingDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ImagePickerComponent } from '../components/image-picker/image-picker.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagePickerComponent],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsComponent implements OnInit {
  settings: WebsiteSettingDto[] = [];
  settingsMap: { [key: string]: WebsiteSettingDto } = {};
  loading: boolean = true;
  saving: boolean = false;
  activeTab: string = 'general';

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.adminApi.getSettings().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.settings = res.data;
          this.settingsMap = {};
          this.settings.forEach(s => this.settingsMap[s.key] = { ...s });
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showError('Failed to load website settings from server.', 'Load Error');
        this.cdr.detectChanges();
      }
    });
  }

  saveAll(): void {
    this.saving = true;
    this.cdr.detectChanges();
    const updateList = Object.values(this.settingsMap);

    this.adminApi.updateSettings(updateList)
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
          this.portfolioService.showSuccess('Website settings saved successfully!', 'Settings Saved');
          this.portfolioService.refreshData();
          const newFav = this.getVal('Favicon');
          if (newFav) {
            this.portfolioService.updateFavicon(newFav);
          }
        } else {
          this.portfolioService.showError(res.message || 'Failed to update settings.', 'Save Error');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        const msg = err.error?.message || 'Error saving settings to database.';
        this.portfolioService.showError(msg, 'Save Error');
        this.cdr.detectChanges();
      }
    });
  }

  getVal(key: string, defaultVal: string = ''): string {
    return this.settingsMap[key]?.value || defaultVal;
  }

  setVal(key: string, val: string, group: string = 'General', desc: string = ''): void {
    if (!this.settingsMap[key]) {
      this.settingsMap[key] = {
        key: key,
        value: val,
        group: group,
        description: desc
      };
    } else {
      this.settingsMap[key].value = val;
    }
    if (key === 'Favicon') {
      this.portfolioService.updateFavicon(val);
    }
  }
}
