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
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(120px, 15vw, 160px) 20px 80px;
      background: radial-gradient(circle at 50% 30%, rgba(184, 245, 0, 0.08) 0%, #0d1612 70%);
      color: #ffffff;
      text-align: center;
    }
    .not-found-card {
      max-width: 620px;
      width: 100%;
      padding: clamp(28px, 5vw, 52px);
      border-radius: 24px;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
    }
    .not-found-code {
      font-family: var(--font-heading);
      font-size: clamp(4.5rem, 12vw, 6.5rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      color: #b8f500;
      line-height: 1;
      margin-bottom: 12px;
      text-shadow: 0 0 35px rgba(184, 245, 0, 0.35);
    }
    .not-found-title {
      font-family: var(--font-heading);
      font-size: clamp(1.5rem, 3.5vw, 2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
      color: #ffffff;
    }
    .not-found-desc {
      color: rgba(226, 232, 240, 0.8);
      font-size: 1rem;
      margin-bottom: 32px;
      line-height: 1.65;
    }
    .quick-links-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    @media (max-width: 480px) {
      .quick-links-grid {
        grid-template-columns: 1fr;
      }
    }
    .quick-link-btn {
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
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
      gap: 10px;
      background: #b8f500;
      color: #0f172a;
      padding: 14px 30px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px rgba(184, 245, 0, 0.25);
    }
    .home-cta-btn:hover {
      background: #cbf92b;
      color: #0f172a;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(184, 245, 0, 0.4);
    }
  `]
})
export class NotFoundComponent {}
