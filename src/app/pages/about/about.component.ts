import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor(public portfolioService: PortfolioService) {}

  isSectionVisible(sectionKey: string): boolean {
    return this.portfolioService.isSectionVisible('about', sectionKey);
  }

  getSection(sectionKey: string) {
    return this.portfolioService.getSection('about', sectionKey);
  }

  get customSections() {
    return this.portfolioService.getCustomSections('about');
  }

  getSectionCards(sectionKey: string) {
    return this.portfolioService.getSectionCards('about', sectionKey);
  }

  activeMilestoneIdx: number = 0;

  get companyMilestones() {
    return this.getSectionCards('milestones');
  }

  get companyStandards() {
    return this.getSectionCards('credentials');
  }

  getYear(badge?: string): string {
    if (!badge) return '';
    return badge.split('·')[0].trim();
  }

  getEra(badge?: string): string {
    if (!badge) return '';
    const parts = badge.split('·');
    return parts.length > 1 ? parts[1].trim() : '';
  }

  getKpi(index: number): { metric: string; label: string } {
    const kpis = [
      { metric: '0 ➔ 1 Studio Launch', label: 'Architecture Practice Founded' },
      { metric: '< 30s CPQ Turnaround', label: 'Slashing 3-Hour Latency' },
      { metric: '99.99% Audited SLA', label: 'Multi-Market Global Delivery' },
      { metric: 'GenAI & .NET 9', label: 'Autonomous Agents Deployed' }
    ];
    return kpis[index] || { metric: 'Verified Delivery', label: 'Milestone Execution' };
  }

  getHighlights(index: number): string[] {
    const highlights = [
      ['Distributed .NET Architecture', 'Multi-Tenant Data Isolation', 'North American & European Delivery'],
      ['Enterprise CPQ Pricing Engines', 'Sub-Second Calculation Pipelines', 'High-Throughput Redis Caching'],
      ['4 International Delivery Markets', 'Zero-Downtime Blue/Green CI/CD', 'Real-Time Telemetry & Monitoring'],
      ['Deterministic GenAI Pipelines', 'Pinecone Vector Search & RAG', '.NET 9 Cloud Modernization']
    ];
    return highlights[index] || ['Verified Production Delivery', 'Enterprise Grade Architecture'];
  }

  scrollToMilestone(index: number): void {
    this.activeMilestoneIdx = index;
    const el = document.getElementById('milestone-' + index);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

