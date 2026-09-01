import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.css'
})
export class ExpertiseComponent {
  activeTrackTab: 'experience' | 'education' | 'certifications' = 'experience';

  constructor(public portfolioService: PortfolioService) {}

  setTrackTab(tab: 'experience' | 'education' | 'certifications'): void {
    this.activeTrackTab = tab;
  }
}
