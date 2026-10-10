import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styles: [`
    .not-found-wrapper {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 120px 20px 80px;
      background: radial-gradient(circle at 50% 20%, rgba(184, 245, 0, 0.08) 0%, #0d1612 70%);
      color: #ffffff;
      text-align: center;
    }
    .not-found-card {
      max-width: 600px;
      padding: 48px;
      border-radius: 20px;
      background: rgba(19, 31, 26, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
    }
    .not-found-code {
      font-size: 6rem;
      font-weight: 900;
      letter-spacing: -2px;
      color: #b8f500;
      line-height: 1;
      margin-bottom: 12px;
      text-shadow: 0 0 30px rgba(184, 245, 0, 0.3);
    }
    .not-found-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .not-found-desc {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.05rem;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .quick-links-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .quick-link-btn {
      padding: 12px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .quick-link-btn:hover {
      background: rgba(184, 245, 0, 0.15);
      border-color: #b8f500;
      color: #b8f500;
      transform: translateY(-2px);
    }
    .home-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #b8f500;
      color: #0d1612;
      padding: 14px 28px;
      border-radius: 999px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .home-cta-btn:hover {
      background: #d4ff4d;
      color: #0d1612;
      box-shadow: 0 0 20px rgba(184, 245, 0, 0.4);
    }
  `]
})
export class NotFoundComponent {}
