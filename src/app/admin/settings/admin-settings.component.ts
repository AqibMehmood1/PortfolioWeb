import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, WebsiteSettingDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        this.portfolioService.showToast('Failed to load website settings.');
        this.cdr.detectChanges();
      }
    });
  }

  saveAll(): void {
    this.saving = true;
    const updateList = Object.values(this.settingsMap);

    this.adminApi.updateSettings(updateList).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.portfolioService.showToast('Website settings saved successfully!');
          this.portfolioService.refreshData();
        } else {
          this.portfolioService.showToast(res.message || 'Failed to update settings.');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.saving = false;
        this.portfolioService.showToast('Error saving settings to database.');
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
  }
}
