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
}
