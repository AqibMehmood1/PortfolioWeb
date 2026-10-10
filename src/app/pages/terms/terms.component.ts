import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terms.component.html',
  styles: [`
    .legal-page-header {
      padding: 140px 0 60px;
      background: #0d1612;
      color: #ffffff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .legal-content-section {
      padding: 70px 0 100px;
      background: #f8faf9;
      color: #1e293b;
    }
    .legal-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
      line-height: 1.75;
    }
    .legal-card h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0d1612;
      margin-top: 36px;
      margin-bottom: 16px;
    }
    .legal-card h2:first-of-type {
      margin-top: 0;
    }
    .legal-card p, .legal-card ul {
      color: #475569;
      font-size: 1rem;
      margin-bottom: 16px;
    }
    .legal-card ul {
      padding-left: 24px;
    }
    .legal-card li {
      margin-bottom: 8px;
    }
    .legal-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(184, 245, 0, 0.15);
      color: #b8f500;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 16px;
    }
    @media (max-width: 768px) {
      .legal-card {
        padding: 24px;
      }
    }
  `]
})
export class TermsComponent {}
