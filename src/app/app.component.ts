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
  activeMegaMenu: 'hire' | 'services' | 'industries' | 'company' | null = null;
  selectedProject: ProjectItem | null = null;
  toastMessage: string | null = null;
  private hoverTimeout: any = null;

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
      this.closeMegaMenu();
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

  onMouseEnterServices(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.activeMegaMenu = 'services';
  }

  onMouseEnterMegaMenu(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  onMouseLeaveDropdown(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoverTimeout = setTimeout(() => {
      this.activeMegaMenu = null;
    }, 220);
  }

  openMegaMenu(menu: 'hire' | 'services' | 'industries' | 'company'): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.activeMegaMenu = menu;
  }

  toggleMegaMenu(menu: 'hire' | 'services' | 'industries' | 'company'): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (this.activeMegaMenu === menu) {
      this.activeMegaMenu = null;
    } else {
      this.activeMegaMenu = menu;
    }
  }

  closeMegaMenu(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.activeMegaMenu = null;
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
