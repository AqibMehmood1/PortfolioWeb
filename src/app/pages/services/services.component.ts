import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { ServiceItem } from '../../models/portfolio.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  constructor(public portfolioService: PortfolioService, private router: Router) {}

  selectService(service: ServiceItem): void {
    this.router.navigate(['/contact'], { queryParams: { topic: service.engagementTopic } });
  }
}
