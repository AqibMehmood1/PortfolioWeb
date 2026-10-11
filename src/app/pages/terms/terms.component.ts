import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terms.component.html',
  styles: [`
    .legal-content-section {
      padding: clamp(40px, 6vw, 70px) 0 clamp(60px, 8vw, 100px);
      background: #f8fafc;
      color: #1e293b;
    }
    .legal-card {
      background: #ffffff;
      border-radius: 20px;
      padding: clamp(28px, 4vw, 48px);
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04);
      border: 1px solid #e2e8f0;
      line-height: 1.75;
    }
    .legal-card h2 {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      margin-top: 36px;
      margin-bottom: 14px;
      letter-spacing: -0.02em;
    }
    .legal-card h2:first-of-type {
      margin-top: 0;
    }
    .legal-card p, .legal-card ul {
      color: #475569;
      font-size: 0.95rem;
      margin-bottom: 16px;
    }
    .legal-card ul {
      padding-left: 20px;
    }
    .legal-card li {
      margin-bottom: 8px;
    }
  `]
})
export class TermsComponent {
  constructor(public portfolioService: PortfolioService) {}
}
