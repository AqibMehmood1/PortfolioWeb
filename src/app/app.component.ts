import { Component, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PortfolioService } from './services/portfolio.service';
import { SitePageDto } from './services/portfolio-api.service';
import { ProjectItem } from './models/portfolio.model';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  mobileMenuOpen: boolean = false;
  activeMegaMenu: 'hire' | 'services' | 'industries' | 'company' | null = null;
  selectedProject: ProjectItem | null = null;
  toastMessage: string | null = null;
  isAdminRoute: boolean = false;
  private hoverTimeout: any = null;

  getNavPageLink(page: SitePageDto): any[] {
    if (!page.slug || page.slug === 'home') return ['/'];
    if (page.isSystem) return ['/' + page.slug];
    return ['/p', page.slug];
  }

  getPageIcon(slug: string): string {
    switch ((slug || '').toLowerCase()) {
      case '':
      case 'home':
        return 'fas fa-home';
      case 'services':
        return 'fas fa-cubes';
      case 'expertise':
        return 'fas fa-layer-group';
      case 'projects':
        return 'fas fa-laptop-code';
      case 'about':
        return 'fas fa-user-shield';
      case 'contact':
        return 'fas fa-envelope';
      default:
        return 'fas fa-file-alt';
    }
  }

  navPages: SitePageDto[] = [];

  constructor(
    public portfolioService: PortfolioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.navPages = this.portfolioService.navPages;

    this.portfolioService.pages$.subscribe(pages => {
      this.navPages = pages.filter(p => p.isVisible && p.showInNav);
      this.cdr.markForCheck();
    });

    this.portfolioService.selectedProject$.subscribe(project => {
      this.selectedProject = project;
      this.cdr.markForCheck();
    });

    this.portfolioService.toast$.subscribe(msg => {
      this.toastMessage = msg;
      this.cdr.markForCheck();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.closeMobileMenu();
      this.closeMegaMenu();
      this.isAdminRoute = event.urlAfterRedirects ? event.urlAfterRedirects.startsWith('/admin') : event.url.startsWith('/admin');
      this.cdr.markForCheck();
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
