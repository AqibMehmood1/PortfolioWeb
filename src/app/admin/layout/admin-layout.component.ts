import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdminApiService, AdminUserDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen: boolean = true;
  isMobile: boolean = false;
  currentUser: AdminUserDto | null = null;

  navItems = [
    { label: 'Dashboard', icon: 'fas fa-chart-pie', route: '/admin/dashboard' },
    { label: 'Website Settings', icon: 'fas fa-sliders-h', route: '/admin/settings' },
    { label: 'Homepage Content', icon: 'fas fa-home', route: '/admin/home' },
    { label: 'About & Philosophy', icon: 'fas fa-user-tie', route: '/admin/about' },
    { label: 'Services & Pillars', icon: 'fas fa-cubes', route: '/admin/services' },
    { label: 'Projects & Studies', icon: 'fas fa-laptop-code', route: '/admin/projects' },
    { label: 'Tech Stacks & Radar', icon: 'fas fa-layer-group', route: '/admin/technologies' },
    { label: 'Experience & Career', icon: 'fas fa-briefcase', route: '/admin/experience' },
    { label: 'Testimonials & Proof', icon: 'fas fa-star', route: '/admin/testimonials' },
    { label: 'Inquiries & Leads', icon: 'fas fa-envelope-open-text', route: '/admin/inquiries' },
    { label: 'Media Library', icon: 'fas fa-images', route: '/admin/media' },
    { label: 'SEO Metadata', icon: 'fas fa-search', route: '/admin/seo' },
    { label: 'Admin Users', icon: 'fas fa-users-cog', route: '/admin/users' },
    { label: 'Audit Logs', icon: 'fas fa-clipboard-list', route: '/admin/audit-logs' }
  ];

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.adminApi.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Auto-close drawer on route navigation on mobile screens
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile) {
        this.sidebarOpen = false;
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 992;
      if (mobile !== this.isMobile) {
        this.isMobile = mobile;
        this.sidebarOpen = !mobile;
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  logout(): void {
    this.adminApi.logout().subscribe({
      next: () => {
        this.portfolioService.showToast('Logged out successfully.');
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.adminApi.clearSession();
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
