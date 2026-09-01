import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PortfolioService } from './services/portfolio.service';
import { ProjectItem } from './models/portfolio.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  mobileMenuOpen: boolean = false;
  selectedProject: ProjectItem | null = null;
  toastMessage: string | null = null;

  constructor(public portfolioService: PortfolioService, private router: Router) {
    this.portfolioService.selectedProject$.subscribe(project => {
      this.selectedProject = project;
    });

    this.portfolioService.toast$.subscribe(msg => {
      this.toastMessage = msg;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  ngAfterViewInit(): void {
    this.initBackToTop();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  closeProjectModal(): void {
    this.portfolioService.closeProjectModal();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private initBackToTop(): void {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }
}
